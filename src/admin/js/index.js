require('./libs/jquery.drops');
require('./libs/jquery.tooltipster.min');
require('./libs/select2.min');
import './modules/templates';
import '../scss/admin.scss';

var ajax_load_more = ajax_load_more || {};

jQuery(document).ready(function ($) {
	('use strict');
	ajax_load_more.options = {
		speed: 200,
	};

	/**
	 * Test REST API access
	 *
	 * @since 5.1.1
	 */
	if ($('.restapi-access').length) {
		$.ajax({
			type: 'GET',
			url: alm_admin_localize.restapi.url + alm_admin_localize.restapi.namespace + '/test/',
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					console.log('Ajax Load More successfully connected to the WordPress REST API.');
				}
			},
			error: function (status) {
				console.warn(status);
				$('.restapi-access').fadeIn();
			},
		});
	}

	/**
	 * Build the header admin menu based on the sidebar.
	 */
	function createAdminMenu() {
		const adminmenu = document.querySelector('#adminmenu .toplevel_page_ajax-load-more > ul');
		if (!adminmenu) {
			return;
		}

		const alm_header = document.querySelector('.ajax-load-more header.header-wrap');
		if (!alm_header) {
			return;
		}

		const menu = adminmenu.cloneNode(true);
		menu.setAttribute('class', '');

		const nav = document.createElement('nav');
		nav.appendChild(menu);
		alm_header.appendChild(nav);
	}
	createAdminMenu();

	/**
	 * Tabbed Navigation Elements
	 *
	 * @since 5.4
	 */
	const ACTIVE_TAB_CLASS = 'active';
	function openTabbedItem(button, almTabbedWrapper) {
		const activeBtn = document.querySelector('.alm-tabbed-wrapper--nav button.active'); // Get Currently Active Button.
		const id = button.dataset.id;

		// Remove currently active button.
		if (activeBtn) {
			activeBtn.classList.remove(ACTIVE_TAB_CLASS);
		}

		// Add Button Active Class.
		button.classList.add(ACTIVE_TAB_CLASS);

		// Activate Current Section
		if (almTabbedWrapper) {
			let currentActive = almTabbedWrapper.querySelector('.alm-tabbed-wrapper--section.' + ACTIVE_TAB_CLASS);
			let section = almTabbedWrapper.querySelector('.alm-tabbed-wrapper--section#' + id);
			if (currentActive && section) {
				currentActive.classList.remove(ACTIVE_TAB_CLASS);
				section.classList.add(ACTIVE_TAB_CLASS);
				section.focus({ preventScroll: true });
				$('html, body').animate(
					{
						scrollTop: $('.alm-tabbed-wrapper--sections').offset().top - 120,
					},
					400,
					function () {
						history.replaceState({}, '', '#' + id);
					}
				);
			}
		}
	}

	const almTabbedWrapper = document.querySelector('.alm-tabbed-wrapper');
	if (almTabbedWrapper) {
		const current = almTabbedWrapper.querySelector('.alm-tabbed-wrapper--section');
		if (current) {
			current.classList.add(ACTIVE_TAB_CLASS);
		}
		const tabbedNav = almTabbedWrapper.querySelectorAll('.alm-tabbed-wrapper--nav button');
		if (tabbedNav) {
			tabbedNav.forEach(function (item, index) {
				item.addEventListener('click', function () {
					openTabbedItem(this, almTabbedWrapper);
				});
			});
		}

		// Open section from hash.
		let hash = window.location.hash;
		if (hash) {
			hash = hash.replace('#', '');
			const targetBtn = document.querySelector('.alm-tabbed-wrapper--nav button[data-id="' + hash + '"]');
			if (targetBtn) {
				targetBtn.click();
			}
		} else {
			document.querySelector('.alm-tabbed-wrapper--nav button').classList.add(ACTIVE_TAB_CLASS);
		}
	}

	/**
	 * Save Repeater Templates with cmd + s and ctrl + s
	 *
	 * @since 5.1
	 */
	document.addEventListener(
		'keydown',
		function (e) {
			if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
				if (e.target.nodeName === 'TEXTAREA' && $(e.target).closest('.repeater-wrap')) {
					var btn = $(e.target).closest('.repeater-wrap').find('input.save-repeater');
					if (btn) {
						btn.click();
					}
				}

				e.preventDefault();
			}
		},
		false
	);

	/*
	 *  Set focus in code mirror editor
	 *  @since 5.1
	 */
	$('label.trigger-codemirror').on('click', function () {
		var el = $(this);
		var id = el.data('id');
		var cm = window['editor_' + id];
		if (cm) {
			cm.focus();
			cm.setCursor(cm.lineCount(), 0);
		}
	});

	/**
	 * Setting panel save actions.
	 *
	 * @since 3.2.0
	 */
	let almSettings = $('#alm_OptionsForm'),
		savingSettings = false,
		settingsForm = document.querySelector('#alm_OptionsForm'),
		settingsTarget = document.querySelector('.alm-settings-feedback');

	if (settingsForm) {
		document.body.appendChild(settingsTarget);
	}

	ajax_load_more.saveSettings = function () {
		if (savingSettings) {
			return false;
		}

		savingSettings = true;
		settingsForm.classList.add('--saving');
		settingsTarget.classList.add('--saving');
		settingsTarget.innerHTML = alm_admin_localize.settings_saving;

		almSettings.ajaxSubmit({
			// Success
			success: function () {
				// Delay for effect
				setTimeout(function () {
					settingsTarget.classList.remove('--saving');
					settingsTarget.classList.add('--saved');
					settingsTarget.innerHTML = alm_admin_localize.settings_saved;
					settingsForm.classList.remove('--saving');
					savingSettings = false;

					setTimeout(function () {
						settingsTarget.classList.remove('--saved');
					}, 2500);
				}, 500);
			},

			// Error
			error: function () {
				// Delay for effect
				setTimeout(function () {
					settingsTarget.classList.remove('--saving');
					settingsTarget.classList.add('--error');
					settingsTarget.innerHTML = alm_admin_localize.settings_error;
					settingsForm.classList.remove('--saving');
					console.warn(alm_admin_localize.ajax_load_more + ' - ' + alm_admin_localize.settings_error);
					savingSettings = false;

					setTimeout(function () {
						settingsTarget.classList.remove('--error');
					}, 2500);
				}, 500);
			},
		});
		return false;
	};

	// On Change, save the settings
	let settingsTimer;
	$(document).on('change', '#alm_OptionsForm input, #alm_OptionsForm textarea, #alm_OptionsForm select', function () {
		// Set a timer to avoid updating settings to frequently
		if (settingsTimer) clearTimeout(settingsTimer);
		settingsTimer = setTimeout(function () {
			ajax_load_more.saveSettings();
		}, 500);
	});

	/**
	 * Download Repeater Template
	 * Trigger the download of a repeater template from the admin
	 *
	 * @since 3.6
	 */
	$('.download-repeater').on('click', function () {
		this.closest('form').submit();
	});

	/**
	 * Tooltipster
	 *
	 * @see http://iamceege.github.io/tooltipster/
	 * @since 2.8.4
	 */
	$('.ajax-load-more-inner-wrapper').on('mouseenter', '.tooltip:not(.tooltipstered)', function () {
		$(this)
			.tooltipster({
				delay: 125,
				speed: 125,
				maxWidth: 325,
			})
			.tooltipster('show');
	});

	/**
	 * Button preview pane
	 * Found on Settings and Shortcode Builder.
	 *
	 * @since 2.8.4
	 */
	$('select#alm_settings_btn_color').on('change', function () {
		var color = jQuery(this).val();
		// Remove other colors
		var wrap = $('.ajax-load-more-wrap');
		wrap.attr('class', '');
		wrap.addClass('ajax-load-more-wrap');
		wrap.addClass(color);
		$('#test-alm-button', wrap).removeClass('loading');

		// Add loading class if Infinite loading style
		if (color.indexOf('infinite') >= 0) {
			$('#test-alm-button', wrap).addClass('loading');
		}
	});

	$('select#alm_settings_btn_color').click(function (e) {
		e.preventDefault();
	});

	$('.alm-template-listing li a').click(function (e) {
		e.preventDefault();
		var el = $(this),
			val = el.data('path');
		el.parent().parent().next('.template-selection').val(val);
	});

	$('.alm-template-section-nav li a').click(function (e) {
		e.preventDefault();
		var el = $(this),
			index = el.parent().index(),
			parent = el.parent().parent().parent('.repeater-wrap');

		if (!el.hasClass('active')) {
			el.parent().addClass('active').siblings().removeClass('active');
			$('.alm-template-toggle', parent).hide();
			$('.alm-template-toggle', parent).eq(index).show();
		}
	});

	// Copy to Clipboard
	$('.copy-to-clipboard').on('click', function () {
		var btn = $(this).get(0);
		var input = document.querySelector('#shortcode_output');

		if (input && btn) {
			var old_txt = btn.innerHTML;
			var copied_txt = btn.dataset.copied ? btn.dataset.copied : old_txt;

			input.select();
			document.execCommand('copy');
			input.disabled = true;
			btn.disabled = true;
			input.focus();

			// Set Text of Button
			btn.innerHTML = copied_txt;

			setTimeout(function () {
				btn.innerHTML = old_txt;
				input.disabled = false;
				btn.disabled = false;
			}, 2500);
		}
	});

	ajax_load_more.copyToClipboard = function (text) {
		window.prompt('Copy link to your clipboard: Press Ctrl + C then hit Enter to copy.', text);
	};

	/*
	 *  Expand/Collapse shortcode headings
	 *
	 *  @since 2.0.0
	 */

	$(document).on('click', 'h3.heading', function () {
		var el = $(this);
		if ($(el).hasClass('open')) {
			$(el)
				.next('.expand-wrap')
				.slideDown(ajax_load_more.options.speed, 'alm_easeInOutQuad', function () {
					$(el).removeClass('open');
				});
		} else {
			$(el)
				.next('.expand-wrap')
				.slideUp(ajax_load_more.options.speed, 'alm_easeInOutQuad', function () {
					$(el).addClass('open');
				});
		}
	});

	// Toggle Links.
	$(document).on('click', '.toggle-all', function () {
		var el = $(this);
		if (el.hasClass('closed')) {
			el.removeClass('closed');

			$('h3.heading, h2.shortcode-title').removeClass('open');
			$('.section-wrap').slideDown(ajax_load_more.options.speed, 'alm_easeInOutQuad');
			$('.expand-wrap').slideDown(ajax_load_more.options.speed, 'alm_easeInOutQuad');
		} else {
			el.addClass('closed');

			$('h3.heading, h2.shortcode-title').addClass('open');
			$('.section-wrap').slideUp(ajax_load_more.options.speed, 'alm_easeInOutQuad');
			$('.expand-wrap').slideUp(ajax_load_more.options.speed, 'alm_easeInOutQuad');
		}
	});

	// Trigger click events on enter/return
	$('h3.heading, h2.shortcode-title').on('keypress', function (e) {
		var key = e.which;
		if (key == 13) {
			// the enter key code
			$(this).click();
			return false;
		}
	});

	/**
	 * Activate License.
	 *
	 * @since 2.8.3
	 */
	var almActivating = false;
	$(document).on('click', '.license-btn', function (e) {
		e.preventDefault();
		if (!almActivating) {
			$('.license-btn-wrap .msg').remove();
			almActivating = true;

			var el = $(this),
				wrap = el.closest('.license-btn-wrap'),
				parent = el.closest('.license'),
				type = el.data('type'),
				item = wrap.data('name'),
				url = wrap.data('url'),
				upgrade = wrap.data('upgrade-url'),
				status = wrap.data('option-status'),
				key = wrap.data('option-key'),
				license = parent.find('input[type=text]').val();

			$('.loading', parent).fadeIn(300);

			// Get value from Ajax
			$.ajax({
				type: 'GET',
				url: alm_admin_localize.ajax_admin_url,
				dataType: 'json',

				data: {
					action: 'alm_license_activation',
					nonce: alm_admin_localize.alm_admin_nonce,
					type: type,
					item: item,
					status: status,
					url: url,
					upgrade: upgrade,
					key: key,
					license: license,
				},

				success: function (data) {
					if (data.msg) {
						$('.license-btn-wrap', parent).append('<div class="msg">' + data.msg + '</div>');
					}

					if (data.license === 'valid') {
						$('.license-key-field .status', parent).addClass('active').removeClass('inactive').text(alm_admin_localize.active);
						$('.license-title .status', parent).addClass('valid').removeClass('invalid');
						$('.activate.license-btn', parent).addClass('hide');
						$('.check-licence.license-btn', parent).addClass('hide');
						$('.deactivate.license-btn', parent).removeClass('hide');
						$('.renew-btn', parent).addClass('hide');
						$('.no-license', parent).slideUp(200);
					} else {
						$('.license-key-field .status', parent).removeClass('active').addClass('inactive').text(alm_admin_localize.inactive);
						$('.license-title .status', parent).removeClass('valid').addClass('invalid');
						$('.activate.license-btn', parent).removeClass('hide');
						$('.check-licence.license-btn', parent).addClass('hide');
						$('.deactivate.license-btn', parent).addClass('hide');
						$('.no-license', parent).slideDown(200);
					}

					$('.loading', parent).delay(250).fadeOut(300);
					almActivating = false;
				},

				error: function (status, error) {
					console.warn(status, error);
					$('.loading', parent).delay(250).fadeOut(300);
					almActivating = false;
				},
			});
		}
	});

	/**
	 * Get layout value via Ajax and inject into template.
	 *
	 * @since 2.8.7
	 */
	$(document).on('click', '.alm-layout-selection li .layout', function (e) {
		e.preventDefault();
		var el = $(this),
			type = el.data('type'),
			custom = el.hasClass('custom') ? 'true' : 'false',
			textarea = el.closest('.repeater-wrap').find('.CodeMirror'),
			layout_btn_text = el.html(),
			name = el.closest('.repeater-wrap').data('name');

		if (!el.hasClass('updating')) {
			el.addClass('updating');
			$('span', el).text(alm_admin_localize.applying_layout + '...');
			textarea.addClass('loading');

			// Get Codemirror Editor ID
			var eid = '';
			if (name === 'default') {
				// Default Template
				eid = window.editor_default;
			} else {
				// Repeater Templates
				eid = window['editor_' + name];
			}

			// Get value from Ajax
			$.ajax({
				type: 'GET',
				url: alm_admin_localize.ajax_admin_url,
				data: {
					action: 'alm_get_layout',
					type: type,
					custom: custom,
					nonce: alm_admin_localize.alm_admin_nonce,
				},
				dataType: 'JSON',
				success: function (data) {
					eid.setValue(data.value);

					// Clear button styles
					setTimeout(function () {
						$('span', el).text(alm_admin_localize.template_updated).blur();
						setTimeout(function () {
							el.removeClass('updating').html(layout_btn_text).blur(); // Close drop menu.
							el.closest('.alm-drop-btn').trigger('click');
							textarea.removeClass('loading');
						}, 400);
					}, 400);
				},
				error: function (status) {
					console.warn(status);
					textarea.removeClass('loading');
				},
			});
		}
	});

	/**
	 * Set Transient (Transient).
	 *
	 * @since 4.0
	 */
	$(document).on('click', '.alm-transient button.notice-dismiss', function (e) {
		e.preventDefault();
		var el = $(this),
			container = el.parent('.alm-transient'),
			transient_name = container.data('transient'),
			duration = container.data('duration');

		// Get value from Ajax
		$.ajax({
			type: 'POST',
			url: alm_admin_localize.ajax_admin_url,
			data: {
				action: 'alm_set_transient',
				nonce: alm_admin_localize.alm_admin_nonce,
				transient_name: transient_name,
				duration: duration,
			},
			success: function (data) {
				container.fadeOut();
			},
			error: function (xhr, status, error) {
				console.warn(status);
			},
		});
	});

	/**
	 * Scroll to setting section.
	 *
	 * @since 2.7.3
	 */
	$(document).on('change', '#alm-settings-nav', function (e) {
		e.preventDefault();
		var el = $(this),
			index = $('option:selected', el).index();
		if (index !== '#') {
			index = index - 1;
			$('html, body').animate(
				{
					scrollTop: $('#alm_OptionsForm h2').eq(index).offset().top - 40,
				},
				500
			);
		}
	});
});
