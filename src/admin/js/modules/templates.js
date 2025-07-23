/**
 * Repater Template admin functionality.
 */
jQuery(document).ready(function ($) {
	('use strict');

	/**
	 * Save Custom Repeater Value
	 *
	 * @since 2.0.0
	 */
	function saveRepeater(btn, editorId) {
		var container = btn.closest('.repeater-wrap'),
			el = $('textarea._alm_repeater', container),
			textarea = el.next('.CodeMirror'),
			btn = btn,
			value = '',
			repeater = container.data('name'), // Get templete name
			type = container.data('type'), // Get template type (default/repeater/unlimited)
			alias = $('input._alm_repeater_alias', container).length ? $('input._alm_repeater_alias', container).val() : '',
			responseText = $('.saved-response', container),
			warning = $('.missing-template', container);

		if (type === undefined) {
			type = 'undefined'; // Fix for custom repeaters v1
		}

		// Get value from CodeMirror textarea.
		var id = editorId.replace('template-', ''); // Editor ID

		if (id === 'default') {
			// Default Template
			value = editor_default.getValue();
		} else {
			// Repeater Templates
			var eid = window['editor_' + id]; // Get editor ID.
			value = eid.getValue();
		}

		// if value is null, then set repeater to non breaking space.
		if (value === '' || value === 'undefined') {
			value = '&nbsp;';
		}

		// If template is not already saving, then proceed.
		if (!btn.hasClass('saving')) {
			btn.addClass('saving');
			textarea.addClass('loading');
			responseText.addClass('loading').html(alm_admin_localize.saving_template);
			responseText.animate({ opacity: 1 });

			$.ajax({
				type: 'POST',
				url: alm_admin_localize.ajax_admin_url,
				data: {
					action: 'alm_save_repeater',
					value: value,
					repeater: repeater,
					type: type,
					alias: alias,
					nonce: alm_admin_localize.alm_admin_nonce,
				},
				success: function (response) {
					$('textarea#' + editorId).val(value); // Set the target textarea val to 'value'

					setTimeout(function () {
						responseText.delay(500).html(response).removeClass('loading');
						textarea.removeClass('loading');
						if (warning) {
							warning.remove();
						}
					}, 250);

					setTimeout(function () {
						responseText.animate({ opacity: 0 }, function () {
							responseText.html('&nbsp;');
							btn.removeClass('saving');
						});
					}, 3000);
				},
				error: function () {
					responseText.html(alm_admin_localize.something_went_wrong).removeClass('loading');
					btn.removeClass('saving');
					textarea.removeClass('loading');
				},
			});
		}
	}

	// Watch for alias input changes.
	$(document).on('keyup', 'input._alm_repeater_alias', function () {
		const value = $(this).val();
		const container = $(this).closest('.row.unlimited');
		if (container) {
			const heading = container.find('h3.heading');
			if (heading && heading.text !== value) {
				heading.text(value);
			}
		}
	});

	// Save Repeater on button click.
	$(document).on('click', 'input.save-repeater', function () {
		const btn = $(this);
		const editorId = btn.data('editor-id');
		saveRepeater(btn, editorId);
	});

	/**
	 * Update Repeater Value
	 *
	 *  @since 2.5
	 */
	function updateRepeater(btn, editorId) {
		var container = btn.closest('.repeater-wrap'),
			btn = btn,
			btn_text = btn.html(),
			editor = $('.CodeMirror', container),
			repeater = container.data('name'), // Get templete name
			type = container.data('type'); // Get template type (default/repeater/unlimited)

		//Get value from CodeMirror textarea
		var editorId = repeater,
			id = editorId.replace('template-', ''); // Editor ID

		//If template is not already saving, then proceed
		if (!btn.hasClass('updating')) {
			btn.addClass('updating');
			$('span', btn).text(alm_admin_localize.updating_template); // Update button text
			editor.addClass('loading');
			$.ajax({
				type: 'POST',
				url: alm_admin_localize.ajax_admin_url,
				data: {
					action: 'alm_update_repeater',
					repeater: repeater,
					type: type,
					nonce: alm_admin_localize.alm_admin_nonce,
				},
				success: function (response) {
					if (id === 'default') {
						// Default Template
						editor_default.setValue(response);
					} else {
						// Repeater Templates
						var eid = window['editor_' + id]; // Set editor ID
						eid.setValue(response);
					}

					// Clear button styles
					setTimeout(function () {
						$('span', btn).text(alm_admin_localize.template_updated).blur();
						setTimeout(function () {
							btn.closest('.alm-drop-btn').trigger('click'); // CLose drop menu
							btn.removeClass('updating').html(btn_text).blur();
							editor.removeClass('loading');
						}, 400);
					}, 400);
				},
				error: function () {
					btn.removeClass('updating').html(btn_text).blur();
					editor.removeClass('loading');
				},
			});
		}
	}

	$('button.option-update').click(function () {
		updateRepeater($(this));
	});
});

document.addEventListener('DOMContentLoaded', function () {
	/**
	 * Copy Repeater Templates value.
	 */
	const copyButtons = document.querySelectorAll('.alm-dropdown button.copy');
	if (copyButtons) {
		copyButtons.forEach(function (button) {
			button.addEventListener('click', function () {
				const container = this.closest('.repeater-wrap');
				const span = this.querySelector('span');
				const copied = this.dataset.copied;
				const copy = this.dataset.copy;

				let template = container.dataset.name; // Template name.
				if (template === 'default') {
					template = 'template-default';
				}

				const textarea = document.querySelector('#' + template); // Get textarea.
				if (!textarea) {
					return;
				}

				span.innerText = copied; // Update button text to 'Copied!'
				textarea.select();
				textarea.setSelectionRange(0, 99999);
				navigator.clipboard.writeText(textarea.value);

				setTimeout(() => {
					span.innerText = copy; // Reset button text after 2 seconds
				}, 2000);
			});
		});
	}
});
