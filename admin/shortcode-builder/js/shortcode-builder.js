jQuery(document).ready(function ($) {
	('use strict');

	var _alm = {},
		output_div = $('.ajax-load-more.shortcode-builder #shortcode_output'),
		output = '[ajax_load_more]',
		previewBtn = document.querySelector('#shortcode-preview');

	// Init the shortcode output.
	output_div.text(output);

	/**
	 * Init Select2 select replacement
	 *
	 * @since 2.5.0
	 */
	_alm.select2 = function () {
		// Default Select2
		$('.row select, .cnkt-main select, select.jump-menu').not('.multiple, .meta-compare, .meta-type, .alm-filter-select').select2({});

		// Set placeholder
		$('.ajax-load-more select.multiple').select2({
			placeholder: '-- ' + alm_admin_localize.select + ' --',
		});
	};
	_alm.select2();

	// Reset all selects
	_alm.reset_select2 = function () {
		// Default Select2
		$('.row select, .cnkt-main select, select.jump-menu').not('.multiple').select2();

		// Multiple
		$('.ajax-load-more .categories select.multiple').select2();
		$('.ajax-load-more .tags select.multiple').select2();
		$('.ajax-load-more .authors select.multiple').select2();
		$('.ajax-load-more .term_query select.multiple').select2();
		$('.ajax-load-more .users select.multiple').select2();
	};

	// Taxonomy Query
	var total_tax_query = 0,
		max_tax_query = 2;
	$('#add-tax-query').on('click', function (e) {
		e.preventDefault();

		if (total_tax_query < 2) {
			total_tax_query++;
			$('#tax-query-relation').fadeIn(250);
			$('.ajax-load-more .taxonomy-wrap')
				.eq(total_tax_query - 1)
				.fadeIn(250);

			if (total_tax_query === 2) {
				// Hide "Add" button if 3 $('.taxonomy-wrap')
				$('#alm-taxonomy .controls button').addClass('disabled');
			}
		} else {
			alert(alm_admin_localize.shortcode_max);
			return false;
		}
	});

	/* Delete Tax Query */
	$(document).on('click', '.remove-tax-query', function (e) {
		var el = $(this),
			parent = el.parent('.taxonomy-wrap');

		$('select', parent).select2('val', '').trigger('change');
		total_tax_query--;
		parent.addClass('removing');
		parent.fadeOut(250, function () {
			_alm.buildShortcode();
			parent.removeClass('removing');
		});

		if (total_tax_query < 2) {
			// Show "Add" button if less than 3
			$('#alm-taxonomy .controls button').removeClass('disabled');
		}

		if (total_tax_query == 0) {
			$('#tax-query-relation').fadeOut(250);
		}
	});

	// Add additional meta_query
	var meta_query_obj = $('.meta-query-wrap').eq(0).clone();
	$('.meta-query-wrap .remove').remove();
	$('select.meta-compare, select.meta-type').select2();
	$('#add-meta-query').on('click', function (e) {
		e.preventDefault();

		if ($('.meta-query-wrap').length > 3) {
			alert('Sorry - maximum of 4 meta_query objects.');
			return false;
		}

		var target = $('#meta-query-extended');
		$('input, select', meta_query_obj).val('');
		var el = meta_query_obj.clone().hide();
		target.append(el);
		el.fadeIn(250);
		$('#meta-query-extended select').select2();

		if ($('.meta-query-wrap').length > 1) {
			$('#meta-query-relation').fadeIn(250);
		} else {
			$('#meta-query-relation').fadeOut(250);
		}

		$('select.meta-compare').select2();

		if ($('.meta-query-wrap').length > 3) {
			// Hide "Add" button if 4 $('.meta-query-wrap')
			$('#alm-meta-key .controls button').addClass('disabled');
		}
	});

	/* Delete Meta Query */
	$(document).on('click', '.remove-meta-query', function (e) {
		var el = $(this);
		el.parent('.meta-query-wrap').addClass('removing');
		el.parent('.meta-query-wrap').fadeOut(250, function () {
			el.parent('.meta-query-wrap').remove();
			_alm.buildShortcode();
		});
		if ($('.meta-query-wrap').length > 3) {
			// Show "Add" button if less than 4 $('.meta-query-wrap')
			$('#alm-meta-key .controls button').removeClass('disabled');
		}
	});

	/*
	 *  _alm.buildShortcode
	 *  Loop sections and build the shortcode
	 *
	 *  @since 1.0
	 */

	_alm.buildShortcode = function () {
		output = '[ajax_load_more';

		// ---------------------------
		// - ID
		// ---------------------------

		var unique_id = $('input#unique-id').val();
		if (unique_id) output += ' id="' + unique_id + '"';

		// ---------------------------
		// - Loading Style
		// ---------------------------

		var loading_style = $('select#loading-style').val();
		var loading_style_default = $('select#loading-style').data('default');
		var loading_style_target = $('select#loading-style').parent().find('.ajax-load-more-wrap');
		if (loading_style_target) {
			var loading_style_base = loading_style_target.data('base');
			loading_style_target.removeAttr('class');
			loading_style_target.attr('class', loading_style_base + loading_style);
			if (loading_style.indexOf('infinite') !== -1) {
				$('.ajax-load-more-wrap button').addClass('loading');
			} else {
				$('.ajax-load-more-wrap button').removeClass('loading');
			}
		}
		if (loading_style && loading_style !== loading_style_default) {
			output += ' loading_style="' + loading_style + '"';
		}

		// ---------------------------
		// - Container Type
		// ---------------------------

		var container_type = $('.container_type input[name=alm_container_type]:checked').val();
		if (container_type) output += ' container_type="' + container_type + '"';

		// ---------------------------
		// - Container Classes
		// ---------------------------

		var container_classes = $('.alm-instance-options input#container-classes').val();
		container_classes = $.trim(container_classes);
		if (container_classes !== '' && $('.alm-instance-options input#container-classes').hasClass('changed'))
			output += ' css_classes="' + container_classes + '"';

		// ---------------------------
		// - Advanced Custom Fields
		// ---------------------------

		var acf = $('#alm-acf input[name=acf]:checked').val();

		if (acf !== 'false' && acf !== undefined) {
			var acf_post_id = $('#acf_post_id').val(),
				acf_field_type = $('#acf_field_type').val(),
				acf_field_name = $('#acf_field_name').val(),
				acf_parent_field_name = $('#acf_parent_field_name').val();

			$('.acf-options').slideDown(250, 'alm_easeInOutQuad');

			if (acf_field_type !== '' && acf_field_name !== '') {
				output += ' acf="' + acf + '"';
				if (acf_post_id !== '') {
					output += ' acf_post_id="' + acf_post_id + '"';
				}
				output += ' acf_field_type="' + acf_field_type + '"';
				output += ' acf_field_name="' + acf_field_name + '"';

				if (acf_parent_field_name) {
					output += ' acf_parent_field_name="' + acf_parent_field_name + '"';
				}
			}
		} else {
			$('.acf-options').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Cache
		// ---------------------------

		var cache = $('#alm-cache input[name=cache]:checked').val();
		if (cache !== 'false' && cache !== undefined) {
			$('.cache_id').slideDown(250, 'alm_easeInOutQuad');
			output += ' cache="' + cache + '"';
			var cache_id = $('input#cache-id').val();
			if (cache_id) {
				output += ' cache_id="' + cache_id + '"';
			}
		} else {
			$('.cache_id').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Call to Actions
		// ---------------------------

		var cta_container = $('#alm-cta');
		var cta = $('input[name=cta]:checked', cta_container).val();
		var cta_position = $('input[name=cta-position]', cta_container).val();
		var cta_before_after = $('select[name=cta-before-after]', cta_container).val();
		var cta_template = $('select[name=cta-template-select]', cta_container).val();

		if (cta !== 'false' && cta !== undefined) {
			$('.cta_template_wrap').slideDown(250, 'alm_easeInOutQuad');
			// Get template.
			if (cta_template !== '' && cta_template !== undefined && cta_position !== '' && cta_position !== null) {
				output += ' cta="' + cta + '"';
				output += ' cta_position="' + cta_before_after + ':' + cta_position + '"';
				output += ' cta_template="' + cta_template + '"';
			}
			$('#sequence-update').text(cta_position);
			$('#sequence-update-before-after').text(cta_before_after);
		} else {
			$('.cta_template_wrap').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Comments
		// ---------------------------

		var comments = $('#alm-comments input[name=comments]:checked').val();
		if (comments === undefined) {
			comments = false;
		}

		if (comments === 'true') {
			var comments_post_id = $('#comments_post_id').val(),
				comments_per_page = $('#comments-per-page').val(),
				comments_type = $('#comments_type').val(),
				comments_template = $('#comments_template').val(),
				comments_callback = $('#comments_callback').val().trim(),
				comments_style = $('#alm-comments input[name=alm_comment_style]:checked').val();

			if (comments_callback !== '') {
				$('#comments_template').select2('val', 'none');
			}

			output += ' comments="' + comments + '"';
			if (comments_post_id) {
				output += ' comments_post_id="' + comments_post_id + '"';
			}

			if (comments_type !== 'comment') output += ' comments_type="' + comments_type + '"';

			if (comments_per_page !== '5') output += ' comments_per_page="' + comments_per_page + '"';

			if (comments_style !== 'ol') output += ' comments_style="' + comments_style + '"';

			if (comments_template !== 'none' && comments_template !== 'null') output += ' comments_template="' + comments_template + '"';

			if (comments_callback !== '') output += ' comments_callback="' + comments_callback + '"';

			$('.comments_extras').slideDown(250, 'alm_easeInOutQuad');
		} else {
			$('.comments_extras').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Filters
		// ---------------------------

		var filters = $('.filters input[name=filters]:checked').val();
		if (filters !== 'false' && filters !== undefined) {
			$('.filters_options').slideDown(250, 'alm_easeInOutQuad');

			var filters_id = $('#alm-filters select');
			if (filters_id.length) {
				if (filters_id.val() !== '') {
					output += ' target="' + filters_id.val().trim() + '"';
				}
			}

			output += ' filters="' + filters + '"';

			var filters_url = $('#alm-filters input[name=filters-url]:checked').val().trim();
			if (filters_url !== '' && filters_url !== 'true') {
				output += ' filters_url="' + filters_url + '"';
			}

			var filters_paging = $('#alm-filters input[name=filters-paging]:checked').val().trim();
			if (filters_paging !== '' && filters_paging !== 'true') {
				output += ' filters_paging="' + filters_paging + '"';
			}

			var filters_scroll = $('#alm-filters input[name=filters-scroll]:checked').val().trim();
			if (filters_scroll !== '' && filters_scroll !== 'false') {
				output += ' filters_scroll="' + filters_paging + '"';
			}

			if (filters_paging === 'true' || filters_scroll === 'true') {
				$('#filter-scrollTopOptions').slideDown(250, 'alm_easeInOutQuad');
				var filters_scrolltop = $('#alm-filters input[name=filters-scrolltop]').val();
				if (filters_scrolltop !== '30') output += ' filters_scrolltop="' + filters_scrolltop + '"';
			} else {
				$('#filter-scrollTopOptions').slideUp(250, 'alm_easeInOutQuad');
			}

			var filters_debug = $('#alm-filters input[name=filters-debug]:checked').val().trim();
			if (filters_debug !== '' && filters_debug !== 'false') output += ' filters_debug="' + filters_debug + '"';
		} else {
			$('.filters_options').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Layouts
		// ---------------------------

		var layouts = $('.layouts input[name=layouts]:checked').val();
		if (layouts !== 'false' && layouts !== undefined) {
			var layouts_columns = $('#layouts-columns').val();
			var layouts_gap = $('#layouts-gap').val();
			$('.layouts_options').slideDown(250, 'alm_easeInOutQuad');
			output += ' layouts="true"';
			output += layouts_columns !== '3' ? ' layouts_cols="' + layouts_columns + '"' : '';
			output += layouts_gap !== 'default' ? ' layouts_gap="' + layouts_gap + '"' : '';
		} else {
			$('.layouts_options').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Next Page
		// ---------------------------

		var nextpage = $('.next-page input[name=next-page]:checked').val();
		if (nextpage !== 'false' && nextpage !== undefined) {
			var nextpage_post_id = $('#next-page_post_id').val(),
				nextpage_type = $('.next-page input[name=next-page-type]:checked').val(),
				nextpage_url = $('input#next-page-url:checked').val(),
				nextpage_scroll = $('select#next-page-scroll').val(),
				nextpage_scrolltop = $('input#next-page-scroll-top').val(),
				nextpage_title_template = $('input#next-page-title-template').val();

			$('.next-page-content').slideDown(250, 'alm_easeInOutQuad');

			output += ' nextpage="' + nextpage + '"';
			output += nextpage_type !== 'paged' ? ' nextpage_type="' + nextpage_type + '"' : '';
			output += ' nextpage_post_id="' + nextpage_post_id + '"';

			if (nextpage_url !== 'true') {
				output += ' nextpage_urls="false"';
			}
			if (nextpage_title_template) {
				output += ' nextpage_title_template="' + nextpage_title_template + '"';
			}
			if (nextpage_scroll !== 'false' || nextpage_scrolltop !== '30') {
				output += ' nextpage_scroll="' + nextpage_scroll + ':' + nextpage_scrolltop + '"';
			}
		} else {
			$('.next-page-content').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Paging
		// ---------------------------

		var paging = $('#alm-paging input[name=paging]:checked').val();
		var paging_controls = $('#alm-paging input[name=paging-controls]:checked').val();
		var paging_show_at_most = $('#alm-paging input#show-at-most').val();
		var paging_classes = $('#alm-paging input#paging-classes').val();
		var paging_scroll = $('#alm-paging select#paging-scroll').val();
		var paging_scrolltop = $('#alm-paging input#paging-scrolltop').val();

		var paging_first_label = $('#alm-paging input#paging-first-label').val();
		var paging_last_label = $('#alm-paging input#paging-last-label').val();
		var paging_previous_label = $('#alm-paging input#paging-previous-label').val();
		var paging_next_label = $('#alm-paging input#paging-next-label').val();

		if (paging !== 'false' && paging !== undefined) {
			output += ' paging="' + paging + '"';

			if (paging_classes !== '') {
				output += ' paging_classes="' + paging_classes + '"';
			}
			if (paging_show_at_most !== '') {
				output += ' paging_show_at_most="' + paging_show_at_most + '"';
			}
			if (paging_scroll !== 'false') {
				$('.paging-scrolltop-wrap').show();
				paging_scrolltop = paging_scrolltop ? paging_scrolltop : 100;
				output += ' paging_scroll="true:' + paging_scrolltop + '"';
			} else {
				$('.paging-scrolltop-wrap').hide();
			}

			$('#nav-controls').slideDown(250, 'alm_easeInOutQuad');

			output += ' paging_controls="' + paging_controls + '"';

			if (paging_controls === 'true') {
				$('#paging-controls-nav').slideDown(250, 'alm_easeInOutQuad');
				output += paging_first_label !== '' ? ' paging_first_label="' + paging_first_label + '"' : '';
				output += paging_last_label !== '' ? ' paging_last_label="' + paging_last_label + '"' : '';
				output += paging_previous_label !== '' ? ' paging_previous_label="' + paging_previous_label + '"' : '';
				output += paging_next_label !== '' ? ' paging_next_label="' + paging_next_label + '"' : '';
			} else {
				$('#paging-controls-nav').slideUp(250, 'alm_easeInOutQuad');
			}
		} else {
			$('#nav-controls').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Preload
		// ---------------------------

		var seo = $('.seo input[name=seo]:checked').val();
		var preload = $('.preload input[name=preload]:checked').val();
		if (preload !== 'false' && preload !== undefined) {
			if (seo !== 'true') $('.preload_amount').slideDown(250, 'alm_easeInOutQuad');

			output += ' preloaded="' + preload + '"';
			var preload_amount = $('.preload input#preload-amount').val();
			if (preload_amount > 0 && preload_amount !== 5) output += ' preloaded_amount="' + preload_amount + '"';
		} else {
			$('.preload_amount').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - REST API
		// ---------------------------

		var rest = $('#alm-rest input[name=rest]:checked').val();
		if (rest !== 'false' && rest !== undefined) {
			$('.restapi_options').slideDown(250, 'alm_easeInOutQuad');
			output += ' restapi="' + rest + '"';

			var restapi_base = $('#alm-rest input#rest-base').val().trim(),
				restapi_namespace = $('#alm-rest input#rest-namespace').val().trim(),
				restapi_endpoint = $('#alm-rest input#rest-endpoint').val().trim(),
				restapi_template_id = $('#alm-rest input#rest-template-id').val().trim(),
				restapi_debug = $('#alm-rest input[name=rest-debug]:checked').val().trim();

			if (restapi_base !== '') output += ' restapi_base="' + restapi_base + '"';

			if (restapi_namespace !== '') output += ' restapi_namespace="' + restapi_namespace + '"';

			if (restapi_endpoint !== '') output += ' restapi_endpoint="' + restapi_endpoint + '"';

			if (restapi_template_id !== '') {
				restapi_template_id = restapi_template_id.replace('tmpl-', ''); // Remove tmpl- if present in value
				output += ' restapi_template_id="' + restapi_template_id + '"';
			}

			if (restapi_debug !== '' && restapi_debug !== 'false') output += ' restapi_debug="' + restapi_debug + '"';
		} else {
			$('.restapi_options').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - TERMS
		// ---------------------------

		var term_query = $('#alm-term_query input[name=term_query]:checked').val();
		if (term_query !== 'false' && term_query !== undefined) {
			$('.term_query-options').slideDown(250, 'alm_easeInOutQuad');

			var term_query_taxonomy = $('#alm-term_query select#term_query-taxonomy-select').val();
			var term_query_number = $('#alm-term_query #term_query-number').val();
			var term_query_hide_empty = $('#alm-term_query #term_query-hide-empty').val();
			if (term_query_taxonomy) {
				output += ' term_query="true"';
				output += ' term_query_taxonomy="' + term_query_taxonomy + '"';
				output += ' term_query_number="' + term_query_number + '"';
				output += ' term_query_hide_empty="' + term_query_hide_empty + '"';
			}
		} else {
			$('.term_query-options').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - SEO
		// ---------------------------

		if (seo !== 'false' && seo !== undefined) {
			if (preload === 'true') $('.preload_amount').slideUp(250, 'alm_easeInOutQuad');
			output += ' seo="' + seo + '"';
		}

		// ---------------------------
		// - Single Post
		// ---------------------------

		var previous = $('.previous-post input[name=prev-post]:checked').val();
		if (previous !== 'false' && previous !== undefined) {
			var pp_id = $('#pp_id').val(),
				pp_order = $('#pp-order').val(),
				pp_query_order = $('#pp-custom-query').val(),
				pp_post__in_order = $('#pp_post__in_input').val(),
				pp_taxonomy = $('#pp-taxonomy-select').val(),
				pp_excluded_terms = $('#pp-term-exclude').val(),
				pp_elementor = $('.previous-post input[name=elementor-single]:checked').val(),
				pp_progress_bar = $('.previous-post input[name=prev-post-progress]:checked').val(),
				pp_preview = $('.previous-post input[name=prev-post-preview]:checked').val(),
				pp_target = $('.previous-post input#pp-target').val();

			$('.prev_post_options').slideDown(250, 'alm_easeInOutQuad');

			$('#pp-taxonomy-select').attr('disabled', false);
			$('#pp-term-exclude').attr('disabled', false);

			output += ' single_post="' + previous + '"';
			if (pp_id) {
				output += ' single_post_id="' + pp_id + '"';
			}

			if (pp_order === '') {
				output += ' single_post_order="previous"';
				$('#pp_post__in').slideUp(250, 'alm_easeInOutQuad');
				$('#pp_extras').slideDown(250, 'alm_easeInOutQuad');
			} else {
				if (pp_order === 'post__in') {
					// Post IN
					pp_taxonomy = '';
					pp_excluded_terms = '';
					output += ' single_post_order="' + pp_post__in_order + '"';
					$('#pp-taxonomy-select').attr('disabled', true);
					$('#pp-term-exclude').attr('disabled', true);
					$('#pp_post__in').slideDown(250, 'alm_easeInOutQuad');
					$('#pp_extras').slideUp(250, 'alm_easeInOutQuad');
				} else if (pp_order === 'custom_query') {
					// Custom Query
					output += ' single_post_order="query"';
					output += ' single_post_query_order="' + pp_query_order + '"';
					$('#pp_post__in').slideUp(250, 'alm_easeInOutQuad');
					$('#pp_extras').slideUp(250, 'alm_easeInOutQuad');
					$('#pp_custom_query').slideDown(250, 'alm_easeInOutQuad');
				} else {
					// Normal
					output += ' single_post_order="' + pp_order + '"';
					output += pp_taxonomy !== '' ? ' single_post_taxonomy="' + pp_taxonomy + '"' : '';
					output += pp_excluded_terms !== '' ? ' single_post_excluded_terms="' + pp_excluded_terms + '"' : '';
					$('#pp_custom_query').slideUp(250, 'alm_easeInOutQuad');
					$('#pp_post__in').slideUp(250, 'alm_easeInOutQuad');
					$('#pp_extras').slideDown(250, 'alm_easeInOutQuad');
				}
			}

			output += pp_target !== '' ? ' single_post_target="' + pp_target + '"' : '';
			output += pp_elementor === 't' ? ' elementor="true"' : '';

			// Post Preview
			if (pp_preview === 'true') {
				$('#pp_preview_options').slideDown(250, 'alm_easeInOutQuad');
				var pp_preview_label = $('#pp-preview-label').val();
				var pp_preview_height = $('#pp-preview-height').val();
				var pp_preview_element = $('#pp-preview-element').val();
				pp_preview_element = !pp_preview_element || pp_preview_element === 'default' ? '' : ':' + pp_preview_element;
				output += ' single_post_preview="' + pp_preview_label + ':' + pp_preview_height + pp_preview_element + '"';
			} else {
				$('#pp_preview_options').slideUp(250, 'alm_easeInOutQuad');
			}

			// Reading Progress Bar
			if (pp_progress_bar === 'true') {
				$('#pp_progressbar_options').slideDown(250, 'alm_easeInOutQuad');

				var pp_progress_bar_position = $('#pp_progressbar_options input[name=prev-post-progress-position]:checked').val();
				var pp_progress_bar_height = $('#pp_progressbar_options input[name=prev-post-progress-height]').val();

				var pp_progress_bar_color = $('.prev-post-progress-front-color input').val();
				var pp_progress_indicator = $('.prev-post-progress-front-color .progress_bar_color_indicator');

				var pp_progress_bar_bkg_color = $('.prev-post-progress-back-color input').val();
				pp_progress_bar_bkg_color = pp_progress_bar_bkg_color.length === 6 ? pp_progress_bar_bkg_color : ''; // Minimum 6
				var pp_progress_indicator_bkg = $('.prev-post-progress-back-color .progress_bar_color_indicator');

				// Remove style atts from indicator
				pp_progress_indicator_bkg.removeAttr('style');
				pp_progress_indicator.removeAttr('style');

				// If all values are set
				if (pp_progress_bar_color.length === 6 && pp_progress_bar_height && pp_progress_bar_position) {
					pp_progress_indicator.css('background-color', '#' + pp_progress_bar_color);
					pp_progress_indicator_bkg.css('background-color', '#' + pp_progress_bar_bkg_color);
					pp_progress_bar_bkg_color = pp_progress_bar_bkg_color !== '' ? ':' + pp_progress_bar_bkg_color : '';
					output +=
						' single_post_progress_bar="' +
						pp_progress_bar_position +
						':' +
						pp_progress_bar_height +
						':' +
						pp_progress_bar_color +
						pp_progress_bar_bkg_color +
						'"';
				}
			} else {
				$('#pp_progressbar_options').slideUp(250, 'alm_easeInOutQuad');
			}
		} else {
			$('.prev_post_options').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Users
		// ---------------------------

		var users = $('#alm-users input[name=users]:checked').val();
		if (users === undefined) {
			users = false;
		}
		if (users !== false && users !== 'false' && users !== undefined) {
			var users_role = $('#alm-users select#users-role').val();
			var users_include = $('#alm-users input#users-include').val();
			var users_exclude = $('#alm-users input#users-exclude').val();
			var users_per_page = $('#alm-users input#users-per-page').val();
			var users_order = $('#alm-users select#users-order').val();
			var users_orderby = $('#alm-users select#users-orderby').val();

			// Deselect other roles if 'All Roles' is selected.
			var UsersList = document.querySelector('#alm-users select#users-role');
			var users_all_selected = false;
			// Loop all roles
			for (var i = 0; i < UsersList.length; i++) {
				if (UsersList.options[i].selected) {
					if (users_all_selected) {
						UsersList.options[i].selected = false;
					}
					if (UsersList.options[i].value === 'all') {
						users_all_selected = true;
					}
				}
			}
			$('#alm-users select#users-role').select2(); // Reset Select2
			users_role = $('#alm-users select#users-role').val(); // Get new users_role value

			$('#users-extended').slideDown(250, 'alm_easeInOutQuad');

			output += ' users="' + users + '"';

			if (users_role !== '' && users_role !== undefined) {
				output += ' users_role="' + users_role + '"';
			}
			if (users_include !== '') {
				output += ' users_include="' + users_include + '"';
			}
			if (users_exclude !== '') {
				output += ' users_exclude="' + users_exclude + '"';
			}
			if (users_per_page !== '5') {
				output += ' users_per_page="' + users_per_page + '"';
			}
			if (users_order !== 'ASC') {
				output += ' users_order="' + users_order + '"';
			}
			if (users_orderby !== 'login') {
				output += ' users_orderby="' + users_orderby + '"';
			}
		} else {
			$('#users-extended').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Repeater Templates
		// ---------------------------

		var template = $('#alm-template select[name=template-select]').val();
		if (template && template !== 'default') {
			output += ' template="' + template + '"';
		}

		// ---------------------------
		// - Post Types
		// ---------------------------

		if ((users === 'false' || users === undefined || !users) && (comments === 'false' || !comments || comments === undefined)) {
			// Hide post_types if comments is active

			var post_type_count = 0,
				selected_post_type = '';
			$('ul.alm-post-type-list input[type=checkbox]').each(function (e) {
				if ($(this).is(':checked')) {
					post_type_count++;
					if (post_type_count > 1) {
						output += ', ' + $(this).data('type');
					} else {
						if ($(this).hasClass('changed')) {
							output += ' post_type="' + $(this).data('type') + '';
						}
					}
					selected_post_type = $(this).data('type');
				}
			});
			if (post_type_count > 0) {
				output += '"';
			}
		}

		// ---------------------------
		// - Sticky Posts
		// ---------------------------

		if (selected_post_type !== 'post') {
			$('.sticky-wrap').slideUp(250, 'alm_easeInOutQuad');
			$('input[name=alm_sticky_posts]').prop('checked', false);
		} else {
			$('.sticky-wrap').slideDown(250, 'alm_easeInOutQuad');
		}

		var sticky_posts = $('input[name=alm_sticky_posts]:checked').val();
		if (sticky_posts && selected_post_type === 'post') output += ' sticky_posts="' + sticky_posts + '"';

		// ---------------------------
		// - Posts Per Page
		// ---------------------------

		var posts_per_page = $('.posts_per_page input').val();
		if (posts_per_page !== '5') {
			output += ' posts_per_page="' + posts_per_page + '"';
		}

		// ---------------------------
		// - Post Format
		// ---------------------------

		var post_format = $('.post_format select').val();
		if (post_format !== '' && post_format !== undefined) output += ' post_format="' + post_format + '"';

		// ---------------------------
		// - Categories
		// ---------------------------

		var category_type = $('.categories #category__and');
		var category_populate = $('.categories .alm-populate');
		var category_populate_eg = $('.categories .alm-populate-eg');
		// If checked
		if (category_type.length) {
			if (category_type.get(0).checked) {
				$('.category-toggle.category_name').hide();
				$('.category-toggle.category_name select').select2('val', '');
				$('.category-toggle.category__and').show();
				category_populate.text('ID');
				category_populate_eg.text('e.g. 2, 9, 7 etc...');
			} else {
				$('.category-toggle.category__and').hide();
				$('.category-toggle.category__and select').select2('val', '');
				$('.category-toggle.category_name').show();
				category_populate.text('slug');
				category_populate_eg.text('e.g. design, research etc...');
			}
		}

		// IN
		var cat = $('.categories #category-select').val();
		if (cat !== '' && cat !== undefined && cat !== null && cat.length > 0) {
			output += ' category="' + cat + '"';
		}

		// AND
		var cat__and = $('.categories #category--and-select').val();
		if (cat__and !== '' && cat__and !== undefined && cat__and !== null && cat__and.length > 0) {
			output += ' category__and="' + cat__and + '"';
		}

		// NOT_IN
		var cat_not_in = $('.categories #category-exclude-select').val();
		if (cat_not_in !== '' && cat_not_in !== undefined && cat_not_in !== null && cat_not_in.length > 0) output += ' category__not_in="' + cat_not_in + '"';

		// ---------------------------
		// - Tags
		// ---------------------------

		var tag_type = $('.tags #tag__and');
		var tag_populate = $('.tags .alm-populate');
		var tag_populate_eg = $('.tags .alm-populate-eg');

		// If checked
		if (tag_type.length) {
			if (tag_type.get(0).checked) {
				$('.tag-toggle.tag_normal').hide();
				$('.tag-toggle.tag_normal select').select2('val', '');
				$('.tag-toggle.tag__and').show();
				tag_populate.text('ID');
				tag_populate_eg.text('e.g. 3, 4, 6 etc...');
			} else {
				$('.tag-toggle.tag__and').hide();
				$('.tag-toggle.tag__and select').select2('val', '');
				$('.tag-toggle.tag_normal').show();
				tag_populate.text('slug');
				tag_populate_eg.text('e.g. toronto, canada etc...');
			}
		}

		// IN
		var tag = $('.tags #tag-select').val();
		if (tag !== '' && tag !== undefined && tag !== null && tag.length > 0) {
			output += ' tag="' + tag + '"';
		}

		// AND
		var tag__and = $('.tags #tag--and-select').val();
		if (tag__and !== '' && tag__and !== undefined && tag__and !== null && tag__and.length > 0) {
			output += ' tag__and="' + tag__and + '"';
		}

		// NOT_IN
		var tag_not_in = $('.tags #tag-exclude-select').val();
		if (tag_not_in !== '' && tag_not_in !== undefined && tag_not_in !== null && tag_not_in.length > 0) output += ' tag__not_in="' + tag_not_in + '"';

		// ---------------------------
		// - Taxonomy Query
		// ---------------------------

		var tax1 = $.trim($('select#taxonomy-select').val()),
			tax_operator1 = $.trim($('#tax-operator-select input[name=tax-operator]:checked').val()),
			tax2 = $.trim($('select#taxonomy-select2').val()),
			tax_operator2 = $.trim($('#tax-operator-select2 input[name=tax-operator2]:checked').val()),
			tax3 = $.trim($('select#taxonomy-select3').val()),
			tax_operator3 = $.trim($('#tax-operator-select3 input[name=tax-operator3]:checked').val()),
			tax_relation = $.trim($('#tax-query-relation select[name=tax-relation]').val());

		var parent1 = $('select#taxonomy-select').parent('.taxonomy'),
			parent2 = $('select#taxonomy-select2').parent('.taxonomy'),
			parent3 = $('select#taxonomy-select3').parent('.taxonomy');

		var has_tax1 = false,
			taxonomy1_terms = '';
		if (tax1 !== '' && tax1 !== undefined) {
			has_tax1 = true;
			if ($('select#taxonomy-select').hasClass('changed')) {
				$('select#taxonomy-select').parent();
				$('.taxonomy-extended', parent1).fadeIn(150, 'alm_easeInOutQuad');
				get_tax_terms(tax1, parent1, '1');
				$('select#taxonomy-select').removeClass('changed');
			}

			var tax_term_count1 = 0;
			$('#tax-terms-container1 input[type=checkbox]').each(function (e) {
				if ($(this).is(':checked')) {
					tax_term_count1++;
					if (tax_term_count1 > 1) {
						taxonomy1_terms += ', ' + $(this).data('type');
					} else {
						if ($('#tax-terms-container1 input').hasClass('changed')) taxonomy1_terms += $(this).data('type');
					}
				}
			});
		} else {
			$('.taxonomy-extended', parent1).fadeOut(150, 'alm_easeInOutQuad');
		}

		var has_tax2 = false,
			taxonomy2_terms = '';
		if (tax2 !== '' && tax2 !== undefined) {
			has_tax2 = true;
			if ($('select#taxonomy-select2').hasClass('changed')) {
				$('select#taxonomy-select2').parent();
				$('.taxonomy-extended', parent2).fadeIn(200, 'alm_easeInOutQuad');
				get_tax_terms(tax2, parent2, '2');
				$('select#taxonomy-select2').removeClass('changed');
			}

			var tax_term_count2 = 0;
			$('#tax-terms-container2 input[type=checkbox]').each(function (e) {
				if ($(this).is(':checked')) {
					tax_term_count2++;
					if (tax_term_count2 > 1) {
						taxonomy2_terms += ', ' + $(this).data('type');
					} else {
						if ($('#tax-terms-container2 input').hasClass('changed')) taxonomy2_terms += $(this).data('type');
					}
				}
			});
		} else {
			$('.taxonomy-extended', parent2).fadeOut(150, 'alm_easeInOutQuad');
		}

		var has_tax3,
			taxonomy3_terms = '';
		if (tax3 !== '' && tax3 !== undefined) {
			has_tax3 = true;
			if ($('select#taxonomy-select3').hasClass('changed')) {
				$('select#taxonomy-select3').parent();
				$('.taxonomy-extended', parent3).fadeIn(200, 'alm_easeInOutQuad');
				get_tax_terms(tax3, parent3, '3');
				$('select#taxonomy-select3').removeClass('changed');
			}

			var tax_term_count3 = 0;
			$('#tax-terms-container3 input[type=checkbox]').each(function (e) {
				if ($(this).is(':checked')) {
					tax_term_count3++;
					if (tax_term_count3 > 1) {
						taxonomy3_terms += ', ' + $(this).data('type');
					} else {
						if ($('#tax-terms-container3 input').hasClass('changed')) taxonomy3_terms += $(this).data('type');
					}
				}
			});
		} else {
			$('.taxonomy-extended', parent3).fadeOut(150, 'alm_easeInOutQuad');
		}

		if (has_tax1 && !has_tax2 && !has_tax3) {
			output += ' taxonomy="' + tax1 + '"';
			output += ' taxonomy_terms="' + taxonomy1_terms + '"';
			output += ' taxonomy_operator="' + tax_operator1 + '"';
		}
		if (has_tax1 && has_tax2 && !has_tax3) {
			output += ' taxonomy="' + tax1 + ':' + tax2 + '"';
			output += ' taxonomy_terms="' + taxonomy1_terms + ':' + taxonomy2_terms + '"';
			output += ' taxonomy_operator="' + tax_operator1 + ':' + tax_operator2 + '"';
			if (tax_relation !== 'AND') output += ' taxonomy_relation="' + tax_relation + '"';
		}
		if (has_tax1 && has_tax2 && has_tax3) {
			output += ' taxonomy="' + tax1 + ':' + tax2 + ':' + tax3 + '"';
			output += ' taxonomy_terms="' + taxonomy1_terms + ':' + taxonomy2_terms + ':' + taxonomy3_terms + '"';
			output += ' taxonomy_operator="' + tax_operator1 + ':' + tax_operator2 + ':' + tax_operator3 + '"';
			if (tax_relation !== 'AND') output += ' taxonomy_relation="' + tax_relation;
		}

		// ---------------------------
		// - Date
		// ---------------------------
		var currentTime = new Date(),
			currentYear = currentTime.getFullYear();

		var dateY = $('.date input#input-year').val(); // Year
		if (dateY !== '' && dateY !== undefined && dateY <= currentYear) output += ' year="' + dateY + '"';

		var dateM = $('.date input#input-month').val(); // Month
		if (dateM !== '' && dateM !== undefined && dateM < 13) output += ' month="' + dateM + '"';

		var dateD = $('.date input#input-day').val(); // Day
		if (dateD !== '' && dateD !== undefined && dateD < 32) output += ' day="' + dateD + '"';

		// ---------------------------
		// - Custom Fields Meta Query
		// ---------------------------
		var meta_key = $.trim($('.meta-query-wrap').eq(0).find('input.meta-key').val()),
			meta_value = $.trim($('.meta-query-wrap').eq(0).find('input.meta-value').val()),
			meta_compare = $('.meta-query-wrap').eq(0).find('select.meta-compare').val(),
			meta_type = $('.meta-query-wrap').eq(0).find('select.meta-type').val(),
			meta_relation = $('select.meta-relation').val(),
			meta_query_length = $('.meta-query-wrap').length;

		// Set meta_compare default value
		if (meta_compare === '' || meta_compare == undefined) meta_compare = '=';

		// Set meta_type default value
		if (meta_type === '' || meta_type == undefined) meta_type = 'CHAR';

		// Single Meta_Query()
		if (meta_query_length === 1) {
			if (meta_key !== '' && meta_key !== undefined) {
				output += ' meta_key="' + meta_key + '"';
				output += ' meta_value="' + meta_value + '"';

				if (meta_compare !== '=') {
					output += ' meta_compare="' + meta_compare + '"';
				}

				if (meta_type !== 'CHAR') {
					output += ' meta_type="' + meta_type + '"';
				}
			}
		}
		// Multiple Meta_Query()
		if (meta_query_length > 1) {
			meta_key = '';
			meta_value = '';
			meta_compare = '';
			meta_type = '';
			$('.meta-query-wrap').each(function (e) {
				var el = $(this),
					mk = $.trim(el.find('input.meta-key').val()),
					mv = $.trim(el.find('input.meta-value').val()),
					mc = $.trim(el.find('select.meta-compare').val()),
					mt = $.trim(el.find('select.meta-type').val());

				if (e === 0) {
					// first on first only
					meta_key += mk;
					meta_value += mv;
					meta_compare += mc;
					meta_type += mt;
				} else {
					if (mk.length > 0 && mv.length > 0) {
						meta_key += ':' + mk;
						meta_value += ':' + mv;
						meta_compare += ':' + mc;
						meta_type += ':' + mt;
					}
				}
			});
			output += ' meta_key="' + meta_key + '"';
			output += ' meta_value="' + meta_value + '"';
			output += ' meta_compare="' + meta_compare + '"';
			output += ' meta_type="' + meta_type + '"';

			var isRelation = $('#meta-query-relation').css('display');
			if (meta_relation !== '' && meta_relation !== undefined && isRelation === 'block') {
				output += ' meta_relation="' + meta_relation + '"';
			}
		} else {
			$('#meta-query-relation').fadeOut(150);
		}

		// ---------------------------
		// - Authors
		// ---------------------------

		var author = $('.authors #author-select').val();
		if (author !== '' && author !== undefined && author !== null && author.length > 0) output += ' author="' + author + '"';

		// ---------------------------
		// - Posts
		// ---------------------------

		var post__in = $('input#post__in').val();
		post__in = $.trim(post__in);
		if (post__in !== '') output += ' post__in="' + post__in + '"';

		// ---------------------------
		// - Exclude posts
		// ---------------------------

		var exclude = $('input#exclude-posts').val();
		exclude = $.trim(exclude);
		if (exclude !== '') {
			//Remove trailing comma, if present
			if (exclude.charAt(exclude.length - 1) == ',') {
				exclude = exclude.slice(0, -1);
			}
			output += ' post__not_in="' + exclude + '"';
		}

		// ---------------------------
		// - Search
		// ---------------------------

		var search = $('.search-term input').val();
		search = $.trim(search);
		if (search !== '') {
			output += ' search="' + search + '"';
		}

		// ---------------------------
		// - Ordering
		// ---------------------------
		var order = $('select#post-order').val(),
			orderby = $('select#post-orderby').val(),
			sort_key = $('#sort-key').val();
		if (order !== 'DESC') {
			output += ' order="' + order + '"';
		}
		if (orderby !== 'date') {
			output += ' orderby="' + orderby + '"';
		}
		// Sort key.
		if (orderby.search(/meta_value/) !== -1) {
			$('.sort-key-options').slideDown(250, 'alm_easeInOutQuad');
			if (sort_key) {
				output += ' sort_key="' + sort_key + '"';
			}
		} else {
			$('.sort-key-options').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Post Status
		// ---------------------------
		var post_status = $('select#post-status').val();
		if (post_status !== 'publish') {
			output += ' post_status="' + post_status + '"';
		}

		// ---------------------------
		// - Post Offset
		// ---------------------------

		var offset = $('.offset input').val();
		if (offset > 0) {
			output += ' offset="' + offset + '"';
		}

		// ---------------------------
		// - Custom Arguments
		// ---------------------------

		var custom_args = $('.custom-arguments input').val();
		custom_args = $.trim(custom_args);
		if (custom_args !== '') {
			output += ' custom_args="' + custom_args + '"';
		}

		// ---------------------------
		// - Pause
		// ---------------------------

		var pause_load = $('.pause_load input[name=pause]:checked').val();
		if (pause_load === 't') {
			output += ' pause="true"';
		}

		// ---------------------------
		// - Destroy After
		// ---------------------------

		var destroy_after = $('.alm-destroy-after input[name=destroy-after]').val();
		if (destroy_after !== '' && destroy_after !== undefined && destroy_after !== '0') output += ' destroy_after="' + destroy_after + '"';

		// ---------------------------
		// - Images loaded
		// ---------------------------

		var images_loaded = $('.alm-images-loaded input[name=images_loaded]:checked').val();
		if (images_loaded === 't') output += ' images_loaded="true"';

		// ---------------------------
		// - Placeholder
		// ---------------------------

		var placeholder = $('.alm-placeholder-wrap input[name=has_placeholder]:checked').val();
		var placeholder_target = $('.alm-placeholder-wrap .alm-placeholder-target');
		var placeholder_url = $('.alm-placeholder-wrap #placeholder');
		var placeholder_img = $('.alm-placeholder-wrap #placeholder-img');
		if (placeholder === 't') {
			placeholder_target.slideDown(250, 'alm_easeInOutQuad');

			// Set preview image
			if (placeholder_url.val() === '' || placeholder_url.val() === placeholder_url.data('empty')) {
				output += ' placeholder="true"';
				placeholder_img.attr('src', placeholder_url.data('empty'));
			} else {
				output += ' placeholder="' + placeholder_url.val() + '"';
				placeholder_img.attr('src', placeholder_url.val());
			}
		} else {
			placeholder_target.slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Scrolling
		// ---------------------------

		var scroll_load = $('.scroll_load input[name=scroll]:checked').val();
		if (scroll_load === 'f') {
			$('.scrolling-options').slideUp(250, 'alm_easeInOutQuad');
			if ($('.scroll_load input').hasClass('changed')) {
				output += ' scroll="false"';
			}
		} else {
			$('.scrolling-options').slideDown(250, 'alm_easeInOutQuad');

			var scroll_distance = $('.scroll_distance input').val();
			var scroll_distance_toggle_btns = $('.scroll_distance .builder-option-toggle--buttons');
			var scroll_distance_px = $('button.pixels', scroll_distance_toggle_btns);
			var scroll_distance_perc = $('button.perc', scroll_distance_toggle_btns);
			var scroll_distance_type = '';

			if (scroll_distance !== '100' || scroll_distance_perc.hasClass('active')) {
				if (scroll_distance_perc.hasClass('active')) {
					scroll_distance_type = '%';
				}
				output += ' scroll_distance="' + $('.scroll_distance input').val() + scroll_distance_type + '"';
			}

			var max_pages = $('.max_pages input').val();
			if (max_pages > 0) {
				output += ' max_pages="' + $('.max_pages input').val() + '"';
			}

			var pause_override = $('.pause_override input[name=pause_override]:checked').val();
			if (pause_override === 't' && pause_load === 't') {
				output += ' pause_override="true"';
			}
		}

		// ---------------------------
		// - Scroll Container
		// ---------------------------

		var scroll_container_option = $('.scroll_container_section input[name=scroll_container_toggle]:checked').val();
		if (scroll_container_option === 't') {
			var scroll_container = $('.scroll_container input').val();
			var scroll_direction = $('.scroll_direction input[name=scroll_direction]:checked').val();

			$('.scroll-container-options').slideDown(250, 'alm_easeInOutQuad');
			if (scroll_container !== '') {
				output += ' scroll_container="' + $('.scroll_container input').val() + '"';

				if (scroll_direction !== 'vertical') {
					output += ' scroll_direction="' + scroll_direction + '"';
				}
			}
		} else {
			$('.scroll-container-options').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - transition
		// ---------------------------

		var transition = $('.transition select[name=transition]').val();
		if (transition !== 'fade') output += ' transition="' + transition + '"';

		if (transition === 'masonry' || transition === 'none') {
			$('.transition-options').slideUp(250, 'alm_easeInOutQuad');
		} else {
			var transition_delay = $('.transition input[name=transition_delay]').val();
			output += transition_delay !== '0' ? ' transition_delay="' + transition_delay + '"' : '';
			$('.transition-options').slideDown(250, 'alm_easeInOutQuad');
		}

		if (transition === 'masonry') {
			$('.masonry-options').slideDown(250, 'alm_easeInOutQuad');
			$('.masonry-options-hide').slideUp(250, 'alm_easeInOutQuad');
			var masonry_selector = $('.transition input#masonry-item').val();
			var masonry_columnwidth = $('.transition input#masonry-columnwidth').val();
			var masonry_animation = $('input[name=masonry-animation]:checked').val();
			var masonry_horizontalorder = $('input[name=masonry-horizontalorder]:checked').val();
			if (masonry_selector !== '') {
				output += ' masonry_selector="' + masonry_selector + '"';
			}
			if (masonry_columnwidth !== '') {
				output += ' masonry_columnwidth="' + masonry_columnwidth + '"';
			}
			if (masonry_animation !== '' && masonry_animation !== 'default') {
				output += ' masonry_animation="' + masonry_animation + '"';
			}
			if (masonry_horizontalorder !== 't') {
				output += ' masonry_horizontalorder="false"';
			}
		} else {
			$('.masonry-options').slideUp(250, 'alm_easeInOutQuad');
			$('.masonry-options-hide').slideDown(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Progress Bar
		// ---------------------------

		var progress_bar = $('.alm-progress-bar input[name=progress_bar]:checked').val();
		if (progress_bar === 't') {
			var progress_bar_color = $('.alm-progress-bar input[name=progress_bar_color]').val();
			$('.progress-bar-options').slideDown(250, 'alm_easeInOutQuad');
			output += ' progress_bar="true"';
			$('.alm-progress-bar .progress_bar_color_indicator').removeAttr('style');
			if (progress_bar_color) {
				if (progress_bar_color.length === 6) {
					$('.alm-progress-bar .progress_bar_color_indicator').css('background-color', '#' + progress_bar_color);
				}
				output += ' progress_bar_color="' + progress_bar_color + '"';
			}
		} else {
			$('.progress-bar-options').slideUp(250, 'alm_easeInOutQuad');
		}

		// ---------------------------
		// - Button Label
		// ---------------------------

		var button_label = $('.btn-label input#button-label').val().trim(),
			button_loading_label = $('.btn-label input#button-loading-label').val().trim(),
			button_done_label = $('.btn-label input#button-done-label').val().trim();

		if (button_label !== '' && button_label !== 'Load More') {
			output += ' button_label="' + button_label + '"';
		}
		// Loading Label
		if (button_loading_label !== '') {
			output += ' button_loading_label="' + button_loading_label + '"';
		}
		// Done Label
		if (button_done_label !== '') {
			output += ' button_done_label="' + button_done_label + '"';
		}

		// ---------------------------
		// - Nested Instances
		// ---------------------------

		var nested = $('.alm-instance-options input[name=nested]:checked').val();
		if (nested === 't') {
			output += ' nested="true"';
		}

		// ---------------------------
		// - Integrations
		// ---------------------------

		var archive = $('.alm-archive input[name=archive]:checked').val();
		if (archive === 't') {
			output += ' archive="true"';
		}

		var woocommerce = $('.alm-woocommerce input[name=woocommerce]:checked').val();
		if (woocommerce === 't') {
			output += ' woocommerce="true"';
		}

		// ---------------------------
		// - No Results Text
		// ---------------------------

		var no_results = $('.alm-instance-options textarea#no_results_text').val();
		if (no_results !== '') {
			no_results = no_results.replace(/"/g, "'");
			output += ' no_results_text="' + no_results + '"';
		}

		output += ']'; //Close shortcode
		output_div.text(output);

		// Preview button.
		if (previous === 'true' || nextpage === 'true') {
			previewBtn.style.display = 'none';
		} else {
			previewBtn.removeAttribute('style');
		}

		var previewBaseUrl = previewBtn.dataset.homeUrl || '/';
		previewBtn.href = previewBaseUrl + '?alm_preview=' + encodeURIComponent(output);

		if (output !== '[ajax_load_more]') {
			$('.reset-shortcode-builder').show();
		} else {
			$('.reset-shortcode-builder').hide();
		}
	};

	/*
	 *  On change events
	 *
	 *  @since 2.0.0
	 */

	//Select 'post' by default
	$('.post_types input[type=checkbox]#chk-post').prop('checked', true).addClass('changed');

	//Select SEO 'false' by default
	$('.seo input[type=radio]#seo-false').prop('checked', true).addClass('changed');

	$(document).on('change keyup', '.alm_element', function () {
		var el = $(this);
		el.addClass('changed');

		// WooCommerce
		if (el.attr('name') === 'woocommerce') {
			var postTypeCheckboxes = $('ul.alm-post-type-list input[type=checkbox]');
			// Check 'product'
			$('ul.alm-post-type-list input[type=checkbox]#chk-product').prop('checked', true).addClass('changed');

			if (postTypeCheckboxes) {
				postTypeCheckboxes.each(function (index, item) {
					if (item.dataset.type !== 'product') {
						item.checked = false;
					}
				});
			}

			$('.alm-archive input#archive_f').prop('checked', true);
		}

		// Archives
		if (el.attr('name') === 'archive') {
			$('.alm-woocommerce input#woocommerce_f').prop('checked', true);
		}

		// Reset Repeater Templates
		if (el.attr('name') === 'repeater-select') {
			$('.select-theme-repeater select[name=theme-repeater-select]').select2('val', '');
		}
		if (el.attr('name') === 'theme-repeater-select') {
			if (
				$('.select-theme-repeater select[name=theme-repeater-select]').val() !== 'null' &&
				$('.select-theme-repeater select[name=theme-repeater-select]').val() !== ''
			) {
				$('.repeater select[name=repeater-select]').select2('val', 'default');
			}
		}

		// Comments
		if (el.attr('id') === 'comments_template') {
			$('#comments_callback').val('');
		}

		// If post type is not selected, select 'post'.
		if (!$('ul.alm-post-type-list input[type=checkbox]:checked').length > 0) {
			$('ul.alm-post-type-list input[type=checkbox]#chk-post').prop('checked', true);
		}

		// If Tax Term Operator is not selected, select 'IN'.
		if (!$('#tax-operator-select input[type=radio]:checked').length > 0) {
			$('#tax-operator-select input[type=radio]#tax-in-radio').prop('checked', true);
		}

		_alm.buildShortcode();
	});

	// Allow only alphanumeric and underscores only.
	$('input.id-only').keydown(function (e) {
		var keyCode = e.keyCode || e.which;
		var shiftKey = e.shiftKey;
		var keyCode = e.keyCode;

		if (shiftKey && keyCode !== 189) {
			// Bail if not shiftkey and underscore.
			return false;
		}

		if (
			keyCode === 8 ||
			keyCode === 9 ||
			keyCode === 46 ||
			keyCode === 95 ||
			keyCode === 189 ||
			(keyCode > 47 && keyCode < 58) ||
			(keyCode > 64 && keyCode < 91) ||
			(keyCode > 96 && keyCode < 123)
		) {
			return true;
		} else {
			return false;
		}
	});

	// Allow numbers only.
	$('input.numbers-only').keydown(function (e) {
		if (
			$.inArray(e.keyCode, [188, 46, 8, 9, 27, 13, 110, 190]) !== -1 ||
			// Allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) ||
			// Allow: home, end, left, right, down, up
			(e.keyCode >= 35 && e.keyCode <= 40)
		) {
			// let it happen, don't do anything
			return;
		}
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
			if (e.keyCode !== 188) {
				// If keycode is not a comma
				e.preventDefault();
			}
		}
	});

	/**
	 * Jump to section, Table of contents [Repeater Templates, Shortcode Builder]
	 *
	 * @since 2.0.0
	 * @updated v2.13.0
	 */
	var jumpMenuOptions = '';
	function almBuildJumpMenu(type) {
		if (type === 'repeaters') {
			$('.row').each(function () {
				if (!$(this).hasClass('no-brd')) {
					// Special case for back 2 top on shortcode builder landing
					var id = $(this).attr('id'),
						title = $(this).find('h3.heading').text();
					jumpMenuOptions += '<option value="' + id + '">' + title + '</option>';
				}
			});
		}

		if (type === 'shortcode') {
			$('.shortcode-parameter-wrap').each(function () {
				var el = $(this),
					opttitle = el.find('h2').text();
				jumpMenuOptions += '<optgroup label="' + opttitle + '">';
				$('.row', el).each(function () {
					if (!$(this).hasClass('no-brd')) {
						// Special case for back 2 top on shortcode builder landing
						var id = $(this).attr('id'),
							title = $(this).find('h3.heading').text();
						jumpMenuOptions += '<option value="' + id + '">' + title + '</option>';
					}
				});
				jumpMenuOptions += '</optgroup>';
			});
		}
	}
	if ($('.shortcode-builder .shortcode-parameter-wrap').length) {
		almBuildJumpMenu('shortcode'); // shortcode builder
	}
	if ($('#alm-repeaters .repeaters').length) {
		if ($('#unlmited-container').length) {
			$('#unlmited-container .row').each(function () {
				var el = $(this),
					id = el.find('.wrap').data('name');
				el.attr('id', 'alm_' + id);
			});
		}
		almBuildJumpMenu('repeaters'); // repeater templates
	}

	// Jump Menu.
	$('select.jump-menu').append(jumpMenuOptions);
	$('select.jump-menu').change(function () {
		var pos = $(this).val();
		if (pos !== 'null') {
			$('html,body').animate(
				{
					scrollTop: $('#' + pos).offset().top - ($('.intro').height() - 20),
				},
				200,
				'alm_easeInOutQuad'
			);
		}
	});

	/* Table of Contents */
	if ($('.table-of-contents').hasClass('repeaters-toc')) {
		$('.table-of-contents .toc').append('<option value="#">-- ' + alm_admin_localize.jump_to_template + ' --</option>');
	} else {
		$('.table-of-contents .toc').append('<option value="#">-- ' + alm_admin_localize.jump_to_option + ' --</option>');
	}
	$('.table-of-contents .toc').append(jumpMenuOptions).select2();
	$('.table-of-contents .toc').change(function () {
		var pos = $(this).val();
		if (pos !== 'null' && pos !== '#') {
			$('html,body').animate(
				{
					scrollTop: $('#' + pos).offset().top - 120,
				},
				500,
				'alm_easeInOutQuad'
			);
		}
	});

	/**
	 * Get taxonomy terms via ajax
	 *
	 * @since 2.1.0
	 */
	function get_tax_terms(tax, parent, index) {
		var placement = $('.tax-terms-container', parent);
		placement.html("<p class='loading'>Fetching Terms...</p>");

		$.ajax({
			type: 'GET',
			url: alm_admin_localize.ajax_admin_url,
			data: {
				action: 'alm_get_tax_terms',
				taxonomy: tax,
				index: index,
				nonce: alm_admin_localize.alm_admin_nonce,
			},
			dataType: 'html',
			success: function (data) {
				placement.html(data);
			},
			error: function (xhr, status, error) {
				responseText.html('<p>Error - Something went wrong and the terms could not be retrieved.');
			},
		});
	}

	// Ajax Load More easing.
	$.easing.alm_easeInOutQuad = function (x, t, b, c, d) {
		if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
		return (-c / 2) * (--t * (t - 2) - 1) + b;
	};

	// Reset shortcode builder.
	$(document).on('click', '.reset-shortcode-builder', function () {
		$('#alm-shortcode-builder-form').trigger('reset');
		_alm.reset_select2();
		_alm.buildShortcode();
	});

	// Generate Unique Cache ID.
	_alm.generateUniqueID = function (length, el) {
		var id = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
		$(el).val('alm_' + id);
		_alm.buildShortcode();
	};

	// Option toggle click events.
	$('.builder-option-toggle--buttons button').on('click', function () {
		$(this).siblings('button').removeClass('active');
		$(this).addClass('active');
		_alm.buildShortcode();
	});

	// Generate Unique/Cache ID.
	$(document).on('click', '.generate-id a', function () {
		var id = $(this).data('id'),
			el = $('#' + id);
		_alm.generateUniqueID(10, el);
	});

	// Button loader preview.
	$('.ajax-load-more-wrap button').on('click', function (e) {
		var button = $(this).get(0);
		var parent = button.parentNode;
		if (parent.classList.contains('infinite')) {
			$(this).addClass('loading');
		} else {
			$(this).toggleClass('loading');
		}
	});

	// Create anchor links for shortcode builder items.
	$('.shortcode-parameter-wrap.alm-tabbed-wrapper--section').each(function () {
		var section = this;
		var ul = section.querySelector('ul.section-anchor-nav');
		var headings = section.querySelectorAll('h3.heading');
		if (headings && headings.length > 2) {
			var list = '';
			$(headings).each(function () {
				var title = $(this).text();
				list += '<li><a role="button" href="javascript: void(0);">' + title + '</a></li>';
			});
			ul.innerHTML = list;

			var anchors = ul.querySelectorAll('a');
			if (anchors) {
				$(anchors).each(function () {
					$(this).on('click', function () {
						var element = this;
						var text = element.innerHTML;
						var target = $('h3.heading:contains(' + text + ')', section);
						if (target) {
							$('html, body').animate(
								{
									scrollTop: target.offset().top - 120,
								},
								350,
								function () {
									// Set focus on the element scrolled to.
									target.get(0).focus({ preventScroll: true });
								}
							);
						}
					});
				});
			}
		}
	});
});
