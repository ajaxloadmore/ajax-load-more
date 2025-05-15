<?php
/**
 * Ajax Load More Shortcode.
 * Returns a parsed [ajax_load_more {params}] shortcode.
 *
 * @package  AjaxLoadMore
 * @since    2.10.1
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ALM_SHORTCODE' ) ) :

	/**
	 * Initiate the class.
	 */
	class ALM_SHORTCODE {

		/**
		 * Shortcode counter.
		 *
		 * @var $counter
		 */
		public static $counter = 0;

		/**
		 * Default container type.
		 *
		 * @var string
		 */
		public static $default_container_type = 'ul';

		/**
		 * Parse & render ALM shortcode.
		 *
		 * @param array $atts Shortcode attributes.
		 * @since 2.10.1
		 */
		public static function alm_render_shortcode( $atts ) {
			global $post; // Global $post obj.

			// Initial variables.
			++self::$counter; // ALM counter.
			$slug              = apply_filters( 'alm_page_slug', alm_get_page_slug( $post ) ); // Define page slug.
			$post_id           = apply_filters( 'alm_page_id', alm_get_page_id( $post ) ); // Define post ID.
			$wp_posts_per_page = get_option( 'posts_per_page' ); // Global Posts Per Page.

			// Get ALM options.
			$options = get_option( 'alm_settings' );

			/**
			 * Override default ALM Settings.
			 * ALM Core Filter Hook.
			 *
			 * @return array $options Options array.
			 */
			$options            = has_filter( 'alm_settings' ) ? apply_filters( 'alm_settings', $options ) : $options;
			$options            = ! $options ? [] : $options; // Set options to an array by default.
			$options['post_id'] = $post_id; // Add post ID to options array.
			$options['slug']    = $slug; // Add post slug to options array.

			// Custom CSS for Layouts - Only run this once.
			if ( has_action( 'alm_layouts_custom_css' ) ) {
				do_action( 'alm_layouts_custom_css', self::$counter );
			}

			/**
			 * Set default shortcode values that can be over written via shortcode atts
			 * ALM Core Filter Hook
			 *
			 * @return array
			 */
			$default_atts = apply_filters( 'alm_shortcode_defaults', [] );

			// Merge arrays. Allows for defaults to be overwritten by the shortcode.
			$atts = $default_atts ? array_merge( $default_atts, $atts ) : $atts;

			// Extact shortcode arrtibutes to variables.
			extract(
				shortcode_atts(
					[
						'nested'                       => false,
						'woo'                          => false,
						'woo_template'                 => '',
						'layouts'                      => false,
						'layouts_cols'                 => '3',
						'layouts_gap'                  => 'default',
						'filters'                      => false,
						'target'                       => '',
						'facets'                       => false,
						'filters_url'                  => 'true',
						'filters_paging'               => 'true',
						'filters_scroll'               => 'false',
						'filters_scrolltop'            => '30',
						'filters_debug'                => false,
						'filters_redirect'             => false,
						'term_query'                   => false,
						'term_query_taxonomy'          => '',
						'term_query_hide_empty'        => 'true',
						'term_query_number'            => '5',
						'acf'                          => false,
						'acf_post_id'                  => '',
						'acf_field_type'               => 'repeater',
						'acf_field_name'               => '',
						'acf_parent_field_name'        => '',
						'acf_row_index'                => 0,
						'restapi'                      => false,
						'restapi_base'                 => '/wp-json',
						'restapi_namespace'            => 'ajaxloadmore',
						'restapi_endpoint'             => 'posts',
						'restapi_template_id'          => '',
						'restapi_debug'                => false,
						'users'                        => false,
						'users_role'                   => '',
						'users_include'                => '',
						'users_exclude'                => '',
						'users_per_page'               => '5',
						'users_order'                  => 'ASC',
						'users_orderby'                => 'login',
						'comments'                     => false,
						'comments_per_page'            => '5',
						'comments_type'                => 'comment',
						'comments_style'               => 'ol',
						'comments_template'            => 'none',
						'comments_callback'            => '',
						'comments_post_id'             => '',
						'nextpage'                     => false,
						'nextpage_post_id'             => '',
						'nextpage_urls'                => 'true',
						'nextpage_scroll'              => 'false:30',
						'nextpage_title_template'      => '',
						'nextpage_type'                => 'paged',
						'nextpage_start'               => 1,
						'previous_post'                => false,
						'previous_post_id'             => '',
						'previous_post_order'          => 'previous',
						'previous_post_taxonomy'       => '',
						'previous_post_excluded_terms' => '',
						'single_post'                  => false,
						'single_post_id'               => '',
						'single_post_order'            => 'previous',
						'single_post_query_order'      => 'previous',
						'single_post_taxonomy'         => '',
						'single_post_excluded_terms'   => '',
						'single_post_progress_bar'     => '',
						'single_post_target'           => '',
						'single_post_preview'          => '',
						'cache'                        => 'false',
						'cache_id'                     => '',
						'paging'                       => 'false',
						'paging_controls'              => 'false',
						'paging_show_at_most'          => '7',
						'paging_scroll'                => false,
						'paging_classes'               => apply_filters( 'paging_classes', '' ),
						'paging_container_classes'     => apply_filters( 'alm_paging_container_classes', '' ),
						'paging_first_label'           => apply_filters( 'alm_paging_first_label', '' ),
						'paging_last_label'            => apply_filters( 'alm_paging_last_label', '' ),
						'paging_previous_label'        => apply_filters( 'alm_paging_previous_label', '&laquo;' ),
						'paging_next_label'            => apply_filters( 'alm_paging_next_label', '&raquo;' ),
						'preloaded'                    => 'false',
						'preloaded_amount'             => '5',
						'seo'                          => 'false',
						'seo_offset'                   => false,
						'template'                     => '',
						'repeater'                     => 'default', // Deprecated
						'theme_repeater'               => 'null', // Deprecated
						'cta'                          => false,
						'cta_position'                 => 'before:1',
						'cta_template'                 => '',
						'cta_repeater'                 => '', // Deprecated
						'cta_theme_repeater'           => '', // Deprecated
						'masonry'                      => '',
						'post_type'                    => 'post',
						'sticky_posts'                 => false,
						'post_format'                  => '',
						'category'                     => '',
						'category__and'                => '',
						'category__not_in'             => '',
						'tag'                          => '',
						'tag__and'                     => '',
						'tag__not_in'                  => '',
						'taxonomy'                     => '',
						'taxonomy_terms'               => '',
						'taxonomy_operator'            => '',
						'taxonomy_relation'            => '',
						'taxonomy_include_children'    => '',
						'sort_key'                     => '',
						'meta_key'                     => '',
						'meta_value'                   => '',
						'meta_compare'                 => '',
						'meta_relation'                => '',
						'meta_type'                    => '',
						'date_query'                   => '',
						'date_query_before'            => '',
						'date_query_after'             => '',
						'date_query_column'            => '',
						'date_query_compare'           => '',
						'date_query_inclusive'         => '',
						'date_query_relation'          => '',
						'year'                         => '',
						'month'                        => '',
						'day'                          => '',
						'author'                       => '',
						'search'                       => '',
						'custom_args'                  => '',
						'post_status'                  => '',
						'order'                        => 'DESC',
						'orderby'                      => 'date',
						'post__in'                     => '',
						'post__not_in'                 => '',
						'exclude'                      => '',
						'offset'                       => '0',
						'posts_per_page'               => '5',
						'scroll'                       => 'true',
						'scroll_distance'              => '100',
						'scroll_container'             => '',
						'scroll_direction'             => '',
						'max_pages'                    => '0',
						'pause_override'               => '',
						'pause'                        => 'false',
						'destroy_after'                => '',
						'transition'                   => 'fade',
						'transition_delay'             => '0',
						'transition_container_classes' => '',
						'masonry_selector'             => '',
						'masonry_columnwidth'          => '',
						'masonry_animation'            => '',
						'masonry_horizontalorder'      => '',
						'progress_bar'                 => 'false',
						'progress_bar_color'           => 'ed7070',
						'images_loaded'                => 'false',
						'button_label'                 => AjaxLoadMore::alm_default_button_label(),
						'button_loading_label'         => '',
						'button_done_label'            => '',
						'prev_button_label'            => AjaxLoadMore::alm_default_prev_button_label(),
						'prev_button_loading_label'    => '',
						'prev_button_done_label'       => '',
						'wrapper_classes'              => '',
						'css_classes'                  => '',
						'container_type'               => '',
						'container_classes'            => '',
						'loading_style'                => '',
						'id'                           => '',
						'vars'                         => '',
						'primary'                      => false,
						'no_results_text'              => '',
						'placeholder'                  => '',
						'lazy_images'                  => false,
						'urls'                         => 'true',
						'archive'                      => false,
						'woocommerce'                  => false,
						'elementor'                    => false,
						'elementor_target'             => '',
						'elementor_url'                => '',
						'elementor_link_label'         => '',
						'elementor_controls'           => '',
						'elementor_scrolltop'          => '',
						'elementor_paged'              => ! get_query_var( 'page' ) || get_query_var( 'page' ) === 0 ? 1 : (int) get_query_var( 'page' ),
						'elementor_woo_paged'          => ! isset( $_GET['product-page'] ) || $_GET['product-page'] === 1 ? 1 : (int) $_GET['product-page'],
					],
					$atts
				)
			);

			$id   = sanitize_key( $id );
			$vars = self::alm_strip_tags( $vars );

			// Parse the Repeater Template value.
			if ( $template ) {
				switch ( alm_get_template_by_type( $template ) ) {
					case 'theme_repeater':
						$theme_repeater = $template;
						break;
					default:
						$repeater = $template;
						break;
				}
			}

			// Elementor.
			$elementor = $elementor === 'true' ? 'single' : $elementor;
			if ( 'single' === $elementor ) { // Single Template.
				if ( ! is_singular( $post_type ) ) {
					// Exit if not singular template.
					return false;
				}
				$container_element = 'div';
				$offset            = '1';
			}

			if ( $elementor === 'posts' && ! empty( $elementor_target ) ) { // Posts Grid.
				$container_element = 'div';
				$pause             = 'true';
			}

			// WooCommerce.
			$woo         = $woo === 'true'; // Add-on.
			$woocommerce = $woocommerce === 'true'; // Standard ALM.

			// Archives.
			$archive = $archive === 'true';

			// Backwards compat.
			// If $previous_post_ is true, set the $single_post_{value} params.
			if ( $previous_post === 'true' ) {
				$single_post                = 'true';
				$single_post_id             = $previous_post_id;
				$single_post_order          = $previous_post_order;
				$single_post_taxonomy       = $previous_post_taxonomy;
				$single_post_excluded_terms = $previous_post_excluded_terms;
			}

			// Start Enqueue Scripts.

			// Inline Core CSS.
			$inline_css = '';
			if ( ! is_admin() && alm_do_inline_css( '_alm_inline_css' ) && ! alm_css_disabled( '_alm_disable_css' ) && self::$counter === 1 ) {
				$inline_css = ALM_ENQUEUE::alm_inline_css( ALM_SLUG, ALM_CSS_PATH, ALM_URL );
			}

			// Legacy Callback - ALM Setting.
			if ( isset( $options['_alm_legacy_callbacks'] ) && $options['_alm_legacy_callbacks'] === '1' ) { // Load if active.
				wp_enqueue_script( 'ajax-load-more-legacy-callbacks' );
			}

			// Core ALM.
			wp_enqueue_script( 'ajax-load-more' );

			// Layouts CSS.
			$inline_layouts_css = '';
			if ( has_action( 'alm_layouts_installed' ) && ! is_admin() && alm_do_inline_css( '_alm_inline_css' ) && self::$counter === 1 ) {
				if ( defined( 'ALM_LAYOUTS_PATH' ) && defined( 'ALM_LAYOUTS_URL' ) ) {
					$file               = ALM_LAYOUTS_PATH . '/core/css/ajax-load-more-layouts.min.css';
					$inline_layouts_css = ALM_ENQUEUE::alm_inline_css( 'ajax-load-more-layouts', $file, ALM_LAYOUTS_URL );
				}
			}

			// Masonry.
			if ( $transition === 'masonry' ) {
				wp_enqueue_script( 'ajax-load-more-masonry' ); // Enqueue before core ALM.
			}

			// Next Page.
			if ( has_action( 'alm_nextpage_installed' ) && $nextpage === 'true' ) {
				wp_enqueue_script( 'ajax-load-more-nextpage' );
			}

			// Paging.
			$has_paging        = has_action( 'alm_paging_installed' ) && $paging === 'true';
			$inline_paging_css = '';
			if ( $has_paging ) {
				wp_enqueue_script( 'ajax-load-more-paging' );
				wp_enqueue_script( 'ajax-load-more-images-loaded' ); // Required for Paging.

				// Inline paging CSS.
				if ( ! is_admin() && alm_do_inline_css( '_alm_inline_css' ) && ! alm_css_disabled( '_alm_paging_disable_css' ) ) {
					if ( defined( 'ALM_PAGING_PATH' ) && defined( 'ALM_PAGING_URL' ) ) {
						$file              = ALM_PAGING_PATH . '/core/css/ajax-load-more-paging.min.css';
						$inline_paging_css = ALM_ENQUEUE::alm_inline_css( 'ajax-load-more-paging', $file, ALM_PAGING_URL );
					}
				}
			}

			// Progress Bar.
			if ( $progress_bar === 'true' ) {
				wp_add_inline_script( 'ajax-load-more', 'window.paceOptions = {restartOnPushState: false};' );
				wp_enqueue_script( 'ajax-load-more-progress' );
			}

			// Single Post.
			$inline_single_posts_css = '';
			if ( has_action( 'alm_single_post_installed' ) && $single_post === 'true' ) {
				wp_enqueue_script( 'alm-single-posts' );

				// Preview CSS.
				if ( ! empty( $single_post_preview ) && $single_post_preview !== 'false' ) {
					if ( ! is_admin() ) {
						$file                    = ALM_PREV_POST_PATH . 'dist/css/ajax-load-more-single-posts.css';
						$inline_single_posts_css = ALM_ENQUEUE::alm_inline_css( 'ajax-load-more-single-posts', $file, ALM_PREV_POST_URL );
					}
				}
			}

			// SEO.
			if ( has_action( 'alm_seo_installed' ) && $seo === 'true' ) {
				wp_enqueue_script( 'ajax-load-more-seo' );
			}

			// WooCommerce.
			if ( has_action( 'alm_woocommerce_installed' ) && $woo ) {
				wp_enqueue_script( 'ajax-load-more-woocommerce' );
			}

			// Elementor.
			if ( has_action( 'alm_elementor_installed' ) && $elementor === 'posts' && $elementor_url === 'true' ) {
				// Only load external script if URLs are set to true.
				wp_enqueue_script( 'ajax-load-more-elementor' );
			}

			/**
			 * ALM Core Action.
			 * Load JavaScript located in external add-ons and extensions.
			 */
			do_action( 'alm_enqueue_external_scripts', $atts );

			// End Enqueue Scripts.

			// Filters - Set initial shortcode state.
			$filters = $filters === 'true' && class_exists( 'ALMFilters' );
			if ( $filters ) {
				$single_post = false;
				$seo         = false;
				$nextpage    = false;

				if ( defined( 'ALM_FILTERS_PATH' ) ) {
					include ALM_FILTERS_PATH . 'includes/initial-state-params.php';
				}
			}

			$single_post = $single_post === 'true';

			// REST API.
			if ( $restapi === 'true' ) {
				$restapi   = true;
				$preloaded = false;
			}

			// Get container elements (ul | div).
			$container_element = self::$default_container_type;
			if ( isset( $options ) && ( isset( $options['_alm_container_type'] ) && '2' === $options['_alm_container_type'] || $single_post ) ) {
				$container_element = 'div';
			}

			// Transition Container Classes.
			$tcc = ! empty( $transition_container_classes ) ? $transition_container_classes : '';

			// Wrapper/CSS Classes.
			$wrapper_classes = ! empty( $wrapper_classes ) ? ' ' . $wrapper_classes : '';
			$css_classes     = ! empty( $css_classes ) ? ' ' . $css_classes : '';

			// Append transition container classes.
			$css_classes = ! empty( $tcc ) ? $css_classes . ' ' . $tcc : $css_classes;

			// Add Layouts add-on classes.
			if ( $layouts === 'true' && has_filter( 'alm_get_layout_classes' ) ) {
				$css_classes = apply_filters( 'alm_get_layout_classes', $layouts_cols, $layouts_gap, $css_classes );
			}

			// Override shortcode param.
			$container_element = $container_type ? $container_type : $container_element;

			// Single Posts.
			if ( $single_post ) {
				$posts_per_page    = 1;
				$container_element = 'div';
				$seo               = false;
			}

			// Users.
			$users = $users === 'true';

			// Terms Query.
			$term_query = $term_query === 'true';

			// Comments.
			$container_element = $comments === 'true' ? $comments_style : $container_element;

			// Get added classnames.
			$classname = '';
			if ( isset( $options['_alm_classname'] ) ) {
				$classname = $options['_alm_classname'];
				$classname = empty( $classname ) ? '' : ' ' . $classname;
			}

			// Get loading style (color/style).
			$alm_loading_style = isset( $options['_alm_btn_color'] ) ? ' ' . $options['_alm_btn_color'] : ' default';
			$alm_loading_style = $loading_style !== '' ? ' ' . $loading_style : $alm_loading_style;

			// Get Paging color.
			$paging_color = isset( $options['_alm_paging_color'] ) && $has_paging ? ' alm-paging paging-' . $options['_alm_paging_color'] : '';

			// Layouts class.
			$alm_layouts = has_action( 'alm_layouts_installed' ) ? ' alm-layouts' : '';

			// Get btn classnames.
			$button_classname = isset( $options['_alm_btn_classname'] ) ? ' ' . $options['_alm_btn_classname'] : '';

			// Language support.

			/**
			 * Plugin: WPML.
			 *
			 * @see http://wpml.org
			 */
			$lang = defined( 'ICL_LANGUAGE_CODE' ) ? ICL_LANGUAGE_CODE : '';

			/**
			 * Plugin: Polylang.
			 *
			 * @see https://wordpress.org/plugins/polylang/
			 */
			if ( function_exists( 'pll_current_language' ) ) {
				$lang = pll_current_language();
			}

			/**
			 * Plugin: qTranslate.
			 *
			 * @see https://wordpress.org/plugins/qtranslate/
			 */
			if ( function_exists( 'qtrans_getLanguage' ) ) {
				$lang = qtrans_getLanguage();
			}

			// SEO: Posts Per Page.
			if ( $seo === 'true' && has_action( 'alm_seo_installed' ) && $wp_posts_per_page > $posts_per_page ) {
				$posts_per_page = apply_filters( 'alm_seo_posts_per_page', true ) ? $wp_posts_per_page : $posts_per_page;
			}

			// Paging.
			$paging_container_class = '';
			$paging_transition      = '';
			if ( $paging === 'true' ) {
				$paging_container_class = ' alm-paging-wrap';
				$paging_transition      = 'style="transition: height 0.2s linear;"';
				// If Preloaded & Paging, pause loading by default.
				if ( $preloaded === 'true' ) {
					$pause          = 'true';
					$pause_override = 'false';
				}
			}

			// Start ALM object.

			$ajaxloadmore  = '';
			$ajaxloadmore .= ALM_WOOCOMMERCE::hide_pagination( $woocommerce );
			$ajaxloadmore .= ALM_WOOCOMMERCE::hide_orderby( $woocommerce );

			// Elementor: Posts Widget Hook (Before).
			$ajaxloadmore .= has_action( 'alm_elementor_installed' ) && $elementor === 'posts' ? apply_filters( 'alm_elementor_hide_pagination', '' ) : '';

			/*
			* ALM Before Container.
			* ALM Core Filter Hook.
			*
			* @return html
			*/
			$ajaxloadmore .= apply_filters( 'alm_before_container', '' );

			// Generate ALM ID.
			$div_id = self::$counter > 1 ? 'ajax-load-more-' . self::$counter : 'ajax-load-more';

			// Localized ID - ID used for storing localized variables.
			$localize_id = empty( $id ) ? $div_id : 'ajax-load-more-' . $id;

			// Master ID - Manual or generated ALM ID.
			$master_id = empty( $id ) ? $div_id : $id;

			// Unique ALM ID.
			$unique_id = ! empty( $id ) ? 'data-id="' . $id . '"' : '';

			// Search atts - Used with SEO.
			$is_search = is_search() ? 'data-search="true"' : '';

			// Nested Instance.
			$is_nested = $nested === 'true' ? ' data-nested="true"' : '';

			// Build Canonical URL.
			$canonical_url = apply_filters( 'alm_canonical_url_' . $id, alm_get_canonical_url() );

			// ALM Wrapper Class.
			$alm_wrapper_class = $woocommerce ? 'ajax-load-more-wrap ' . ALM_WOOCOMMERCE::get_wrapper_class() : 'ajax-load-more-wrap';

			// ALM Direction.
			$alm_direction = $scroll_direction ? ' alm-' . esc_attr( $scroll_direction ) : '';

			// Start $ajaxloadmore element.
			$ajaxloadmore .= '<div id="' . esc_attr( $div_id ) . '" class="' . esc_attr( $alm_wrapper_class ) . esc_attr( $wrapper_classes ) . esc_attr( $alm_loading_style ) . esc_attr( $paging_color ) . esc_attr( $alm_layouts ) . esc_attr( $alm_direction ) . '" ' . $unique_id . ' data-alm-id="" data-canonical-url="' . esc_attr( $canonical_url ) . '" data-slug="' . esc_attr( $slug ) . '" data-post-id="' . esc_attr( $post_id ) . '" ' . wp_kses_post( $is_search ) . esc_attr( $is_nested ) . ' data-localized="' . alm_convert_dashes_to_underscore( $localize_id ) . '_vars" data-alm-object="' . alm_convert_dashes_to_underscore( $localize_id ) . '">';

			/**
			 * ALM Inline CSS.
			 */
			$ajaxloadmore .= $inline_css . $inline_layouts_css . $inline_paging_css . $inline_single_posts_css;

			// Horizontal Scroll CSS.
			if ( $scroll_direction === 'horizontal' && $scroll_container ) {
				// Add style for overflow style of the container.
				$ajaxloadmore .= '<style>' . esc_attr( $scroll_container ) . '{ height: auto; width: 100%; overflow: hidden; overflow-x: auto; -webkit-overflow-scrolling: touch; }</style>';
			}

			// Masonry Hook (Before).
			$ajaxloadmore .= apply_filters( 'alm_masonry_before', $transition );

			/**
			 * WooCommerce Config
			 * Set required WooCommerce config options
			 */
			if ( $woocommerce ) {
				$container_element = apply_filters( 'alm_woo_container_element', 'ul' );
				$post_type         = 'product';

				$woo_config = [
					'classes'  => apply_filters( 'alm_woo_classes', 'products stylefree' ),
					'columns'  => ALM_WOOCOMMERCE::get_loop_prop( 'columns', '4' ),
					'per_page' => ALM_WOOCOMMERCE::get_loop_prop( 'per_page', $posts_per_page ),
				];

				/**
				 * WooCommerce hook to filter columns, per_page, classes etc
				 *
				 * @return array
				 */
				$woo_config = apply_filters( 'alm_woo_config', $woo_config );

				$css_classes      = $css_classes . ' ' . $woo_config['classes'] . ' columns-' . $woo_config['columns'];
				$posts_per_page   = $woo_config['per_page'];
				$preloaded_amount = $woo_config['per_page'];

				if ( is_archive() ) {
					$obj = get_queried_object();
					if ( isset( $obj->taxonomy ) && isset( $obj->slug ) ) {
						$taxonomy          = $obj->taxonomy;
						$taxonomy_terms    = $obj->slug;
						$taxonomy_operator = 'IN';
					}
				}

				if ( ! $filters ) {
					// Do not run if ALM filters are active.
					$woo_orderby_value = ( function_exists( 'wc_clean' ) && isset( $_GET['orderby'] ) ) ? wc_clean( $_GET['orderby'] ) : apply_filters( 'woocommerce_default_catalog_orderby', get_option( 'woocommerce_default_catalog_orderby' ) ); // phpcs:ignore

					switch ( $woo_orderby_value ) {
						case 'popularity':
							$meta_key = 'total_sales';
							$orderby  = 'meta_value_num';
							$order    = 'DESC';
							break;

						case 'rating':
							$meta_key = '_wc_average_rating';
							$orderby  = 'meta_value_num';
							$order    = 'DESC';
							break;

						case 'price-desc':
							$meta_key = '_price';
							$orderby  = 'meta_value_num';
							$order    = 'DESC';
							break;

						case 'price':
							$meta_key = '_price';
							$orderby  = 'meta_value_num';
							$order    = 'ASC';
							break;

						default:
							$custom_options = apply_filters( 'alm_woo_orderby_options', '' );
							if ( ! empty( $custom_options ) ) {
								foreach ( $custom_options as $option ) {
									if ( isset( $option['name'] ) && $option['name'] === $woo_orderby_value ) {
										$meta_key = isset( $option['meta_key'] ) ? wc_clean( $option['meta_key'] ) : $meta_key;
										$orderby  = isset( $option['orderby'] ) ? wc_clean( $option['orderby'] ) : $orderby;
										$order    = isset( $option['order'] ) ? wc_clean( $option['order'] ) : $order;
									}
								}
							}
							break;
					}
				}
			}

			/**
			 * Archive Integration.
			 * Set required archive config options.
			 */
			if ( $archive ) {
				if ( is_archive() ) {
					if ( is_date() ) {
						$archive_year  = get_the_date( 'Y' );
						$archive_month = get_the_date( 'm' );
						$archive_day   = get_the_date( 'd' );
						if ( is_year() ) {
							$year = $archive_year;
						}
						if ( is_month() ) {
							$month = $archive_month;
							$year  = $archive_year;
						}
						if ( is_day() ) {
							$year  = $archive_year;
							$month = $archive_month;
							$day   = $archive_day;
						}
					}
					if ( is_author() ) {
						$author = get_the_author_meta( 'ID' );
					}
					if ( is_tax() || is_category() || is_tag() ) {
						$obj               = get_queried_object();
						$taxonomy          = $obj->taxonomy;
						$taxonomy_terms    = $obj->slug;
						$taxonomy_operator = 'IN';
					}
					if ( is_post_type_archive() ) {
						$obj = get_queried_object();
						if ( isset( $obj->name ) ) {
							$post_type = $obj->name;
						}
					}
				}
				if ( is_search() ) {
					$search = get_search_query();
				}
			}

				// WooCommerce Add-on || Elementor Add-on.
			if ( $woo || $elementor === 'posts' ) {
				$filters     = false;
				$single_post = false;
				$seo         = false;
				$paging      = false;
				$comments    = false;
				$nextpage    = false;
				$acf         = false;
				$users       = false;
				$preloaded   = false;
			}
			$woo = $elementor === 'posts' ? false : $woo;

			// Single Post Add-on.
			if ( $single_post ) {
				$preloaded = false;
				$seo       = false;
				$paging    = false;
				$comments  = false;
				$acf       = false;
			}

			// Comments Add-on.
			if ( $comments ) {
				$single_post    = false;
				$seo            = false;
				$filters        = false;
				$acf            = false;
				$posts_per_page = $comments_per_page;
				if ( $preloaded === 'true' ) {
					$preloaded_amount = $comments_per_page;
				}
			}

			// Users Add-on.
			if ( $users ) {
				$posts_per_page = $users_per_page;
			}

			// Term Query.
			if ( $term_query ) {
				$posts_per_page = $term_query_number;
			}

			// Nextpage Add-on.
			if ( $nextpage ) {
				$single_post = false;
				$seo         = false;
				$preloaded   = false;
				$comments    = false;
				$acf         = false;
				$pause       = 'true';
			}

			// If SEO, Filters or Paging - set preloaded_amount to posts_per_page.
			if ( $seo === 'true' || $filters ) {
				$preloaded_amount = $posts_per_page;
			}

			// $query_args array to store global ALM variables.
			$query_args = [
				'post_id'                   => $post_id,
				'preloaded'                 => $preloaded,
				'preloaded_amount'          => $preloaded_amount,
				'filters'                   => $filters,
				'facets'                    => $facets,
				'acf'                       => $acf,
				'acf_post_id'               => $acf_post_id,
				'acf_field_type'            => $acf_field_type,
				'acf_field_name'            => $acf_field_name,
				'acf_parent_field_name'     => $acf_parent_field_name,
				'acf_row_index'             => $acf_row_index,
				'term_query'                => [
					'taxonomy'   => $term_query_taxonomy,
					'hide_empty' => $term_query_hide_empty,
					'number'     => $term_query_number,
				],
				'nextpage'                  => $nextpage,
				'users'                     => $users,
				'users_role'                => $users_role,
				'users_include'             => $users_include,
				'users_exclude'             => $users_exclude,
				'users_per_page'            => $users_per_page,
				'users_order'               => $users_order,
				'users_orderby'             => $users_orderby,
				'comments'                  => $comments,
				'comments_per_page'         => $comments_per_page,
				'comments_type'             => $comments_type,
				'comments_style'            => $comments_style,
				'comments_template'         => $comments_template,
				'comments_callback'         => $comments_callback,
				'comments_post_id'          => $comments_post_id,
				'post_type'                 => $post_type,
				'sticky_posts'              => $sticky_posts,
				'post_format'               => $post_format,
				'category'                  => $category,
				'category__and'             => $category__and,
				'category__not_in'          => $category__not_in,
				'tag'                       => $tag,
				'tag__and'                  => $tag__and,
				'tag__not_in'               => $tag__not_in,
				'taxonomy'                  => $taxonomy,
				'taxonomy_terms'            => $taxonomy_terms,
				'taxonomy_operator'         => $taxonomy_operator,
				'taxonomy_include_children' => $taxonomy_include_children,
				'taxonomy_relation'         => $taxonomy_relation,
				'sort_key'                  => $sort_key,
				'meta_key'                  => $meta_key,
				'meta_value'                => $meta_value,
				'meta_compare'              => $meta_compare,
				'meta_relation'             => $meta_relation,
				'meta_type'                 => $meta_type,
				'year'                      => $year,
				'month'                     => $month,
				'day'                       => $day,
				'date_query'                => $date_query,
				'date_query_before'         => $date_query_before,
				'date_query_after'          => $date_query_after,
				'date_query_column'         => $date_query_column,
				'date_query_compare'        => $date_query_compare,
				'date_query_inclusive'      => $date_query_inclusive,
				'date_query_relation'       => $date_query_relation,
				'author'                    => $author,
				'post__in'                  => $post__in,
				'post__not_in'              => $post__not_in,
				'search'                    => $search,
				'custom_args'               => $custom_args,
				'post_status'               => $post_status,
				'order'                     => $order,
				'orderby'                   => $orderby,
				'exclude'                   => $exclude,
				'offset'                    => $offset,
				'posts_per_page'            => $posts_per_page,
				'lang'                      => $lang,
				'css_classes'               => $css_classes,
				'id'                        => $id,
				'vars'                      => $vars,
				'repeater'                  => $repeater,
				'theme_repeater'            => $theme_repeater,
				'paged'                     => get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1,
			];

			// Set `alm-listing` classname.
			$listing_class = $comments === 'true' ? 'commentlist alm-comments' : 'alm-listing'; // If Comments.

			// Confirm container element type is valid.
			$container_element_array = [ 'ul', 'ol', 'div', 'article', 'table', 'section', 'dl' ];
			$container_element       = in_array( $container_element, $container_element_array, true ) ? $container_element : 'ul';

			// Open #ajax-load-more.
			$ajaxloadmore .= '<' . esc_attr( $container_element ) . ' aria-live="polite" aria-atomic="true"';
			$ajaxloadmore .= ' class="' . esc_attr( $listing_class ) . ' alm-ajax' . esc_attr( $paging_container_class ) . esc_attr( $classname ) . esc_attr( $css_classes ) . '"';
			$ajaxloadmore .= $paging_transition;

			// Build container data atts.

			// Advanced Custom Fields Extension.
			if ( has_action( 'alm_acf_installed' ) && $acf === 'true' ) {
				$acf_return    = apply_filters(
					'alm_acf_shortcode',
					$acf,
					$acf_field_type,
					$acf_field_name,
					$acf_post_id,
					$post_id,
					$acf_parent_field_name,
					$acf_row_index
				);
				$ajaxloadmore .= wp_kses_post( $acf_return );
			}

			// Cache Add-on.
			if ( has_action( 'alm_cache_installed' ) && $cache === 'true' ) {
				// Confirm cache version is 2.0 or greater.
				$cache_version_check = defined( 'ALM_CACHE_VERSION' ) && version_compare( ALM_CACHE_VERSION, '2.0', '>=' );
				if ( $cache_version_check ) {
					$cache_return   = apply_filters(
						'alm_cache_shortcode',
						$cache,
						$cache_id,
						$options
					);
					$alm_auto_cache = isset( $_GET['alm_auto_cache'] );
					$paging         = $alm_auto_cache ? false : $paging;    // Disable paging if auto generate cache active.
					$ajaxloadmore  .= wp_kses_post( $cache_return );
				}
			}

			// CTA Add-on.
			if ( has_action( 'alm_cta_installed' ) && $cta === 'true' ) {
				if ( $cta_template ) {
					// Parse the CTA template.
					switch ( alm_get_template_by_type( $cta_template ) ) {
						case 'theme_repeater':
							$cta_theme_repeater = $cta_template;
							break;

						default:
							$cta_repeater = $cta_template;
							break;
					}
				}

				$cta_return    = apply_filters(
					'alm_cta_shortcode',
					$cta,
					$cta_position,
					$cta_repeater,
					$cta_theme_repeater,
					$cta_template
				);
				$ajaxloadmore .= wp_kses_post( $cta_return );
			}

			// Comments Add-on.
			if ( has_action( 'alm_comments_installed' ) && $comments === 'true' ) {
				$comments_return = apply_filters(
					'alm_comments_shortcode',
					$comments,
					$comments_per_page,
					$comments_type,
					$comments_style,
					$comments_template,
					$comments_callback,
					$comments_post_id
				);
				$ajaxloadmore   .= wp_kses_post( $comments_return );
			}

			// Filters Add-on.
			if ( has_action( 'alm_filters_installed' ) && $filters ) {
				$seo            = false;
				$filters_return = apply_filters(
					'alm_filters_shortcode_params',
					$filters,
					$target,
					$filters_url,
					$filters_paging,
					$filters_scroll,
					$filters_scrolltop,
					$filters_debug,
					$options
				);
				$ajaxloadmore  .= wp_kses_post( $filters_return );
				$facets         = function_exists( 'alm_filters_has_facets' ) && alm_filters_has_facets( $target );
			}

			// Nextpage Post Add-on.
			if ( has_action( 'alm_nextpage_installed' ) && $nextpage ) {
				// If post ID is null or equals the shortcode builder output convert to post ID.
				if ( ! $nextpage_post_id || $nextpage_post_id === '%post_id%' || $nextpage_post_id === "'.get_the_ID().'" ) {
					global $post;
					$nextpage_post_id = $post->ID;
				}

				// Build shortcode output.
				$nextpage_return = apply_filters(
					'alm_nextpage_shortcode',
					$nextpage_urls,
					$nextpage_post_id,
					$nextpage_scroll,
					$nextpage_title_template,
					$nextpage_type,
					$id
				);
				$ajaxloadmore   .= wp_kses_post( $nextpage_return );
			}

			// Paging Add-on.
			if ( $has_paging ) {
				$paging_return = apply_filters(
					'alm_paging_shortcode',
					$paging,
					$paging_controls,
					$paging_show_at_most,
					$paging_classes,
					$paging_first_label,
					$paging_last_label,
					$paging_previous_label,
					$paging_next_label,
					$paging_scroll
				);
				$ajaxloadmore .= wp_kses_post( $paging_return );
			}

			// Preloaded Add-on.
			if ( $preloaded === 'true' && has_action( 'alm_preload_installed' ) ) {
				// Set preloaded to false if SEO, not Paging and page is greater than 1.
				if ( $seo === 'true' && $paging !== 'true' && (int) $query_args['paged'] > 1 ) {
					$preloaded     = false;
					$ajaxloadmore .= ' data-is-preloaded="true"';
				}

				// Filters.
				if ( $filters && $_SERVER['QUERY_STRING'] ) {  // phpcs:ignore
					$filters_paged = isset( $_GET['pg'] ) ? (int) $_GET['pg'] : 1;
					if ( $filters_paged > 1 ) {
						// Set global $paged to querystring pg.
						$query_args['paged'] = $filters_paged;

						if ( $paging !== 'true' ) {
							$preloaded     = false;
							$ajaxloadmore .= ' data-is-preloaded="true"';
						}
					}
				}
				$ajaxloadmore .= ' data-preloaded="' . esc_attr( $preloaded ) . '"';
				$ajaxloadmore .= ' data-preloaded-amount="' . esc_attr( $preloaded_amount ) . '"';
			}

			// REST API Extension.
			if ( has_action( 'alm_rest_api_installed' ) && $restapi === true ) {
				$restapi_return = apply_filters(
					'alm_rest_api_shortcode',
					'true',
					$restapi_base,
					$restapi_namespace,
					$restapi_endpoint,
					$restapi_template_id,
					$restapi_debug
				);
				$ajaxloadmore  .= wp_kses_post( $restapi_return );
			}

			// SEO Add-on.
			if ( has_action( 'alm_seo_installed' ) && $seo === 'true' ) {
				$seo_return    = apply_filters(
					'alm_seo_shortcode',
					$seo,
					$preloaded,
					$options,
					$seo_offset
				);
				$ajaxloadmore .= wp_kses_post( $seo_return );
			}

			// Single Posts Add-on.
			if ( has_action( 'alm_single_post_installed' ) && $single_post ) {
				// Get post ID if null.
				if ( ! $single_post_id ) {
					global $post;
					$single_post_id = $post->ID;
				}
				// Check for target element.
				if ( $single_post_target ) {
					$offset = 1;
					$pause  = 'true';
				}
				// Build Shortcode.
				$single_post_return = apply_filters(
					'alm_single_post_shortcode',
					$single_post_id,
					$single_post_order,
					$single_post_taxonomy,
					$single_post_excluded_terms,
					$single_post_progress_bar,
					$options,
					$single_post_target,
					$single_post_query_order,
					$query_args,
					$single_post_preview
				);
				$ajaxloadmore      .= wp_kses_post( $single_post_return );
			}

			// Term Query Extension.
			if ( has_action( 'alm_terms_installed' ) && $term_query ) {
				$term_query_return = apply_filters(
					'alm_terms_shortcode',
					$term_query,
					$term_query_taxonomy,
					$term_query_hide_empty,
					$term_query_number
				);

				$ajaxloadmore .= wp_kses_post( $term_query_return );
			}

			// Users Extension.
			if ( has_action( 'alm_users_installed' ) && $users ) {
				$posts_per_page = $users_per_page; // Update $posts_per_page var to be $users_per_page.
				$users_return   = apply_filters(
					'alm_users_shortcode',
					$users_role,
					$users_include,
					$users_exclude,
					$posts_per_page,
					$users_order,
					$users_orderby,
					$options
				);
				$ajaxloadmore  .= wp_kses_post( $users_return );
			}

			// Woocommerce Add-on.
			// phpcs:ignore
			if ( $woo && has_action( 'alm_woocommerce_shortcode' ) && in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ), true ) ) {
				$woo_return    = apply_filters( 'alm_woocommerce_shortcode', $localize_id, $query_args );
				$ajaxloadmore .= wp_kses_post( $woo_return );
			}

			// phpcs:ignore
			if ( $elementor === 'posts' && $elementor_target && has_action( 'alm_elementor_params' ) && in_array( 'elementor-pro/elementor-pro.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {
				$elementor_params = [
					'target'     => $elementor_target,
					'url'        => $elementor_url,
					'paged'      => $elementor_woo_paged !== 1 ? $elementor_woo_paged : $elementor_paged,
					'controls'   => $elementor_controls,
					'scrolltop'  => $elementor_scrolltop,
					'prev_label' => $elementor_link_label,
				];

				$elementor_return = apply_filters( 'alm_elementor_params', $elementor_params );

				$ajaxloadmore .= ' data-elementor="posts"';
				$ajaxloadmore .= wp_kses_post( $elementor_return );
			}

			$ajaxloadmore .= ' data-container-type="' . esc_attr( $container_element ) . '"';
			$ajaxloadmore .= ' data-loading-style="' . esc_attr( ltrim( $alm_loading_style ) ) . '"';

			// Archive.
			$ajaxloadmore .= $archive ? ' data-archive="true"' : '';

			// Woocommerce.
			$ajaxloadmore .= $woocommerce ? ' data-woocommerce="true"' : '';

			// URL Updates.
			$ajaxloadmore .= $urls !== 'true' ? ' data-urls="false"' : '';

			// Repeaters.
			if ( ! $woo && $elementor !== 'posts' ) {
				$ajaxloadmore .= $theme_repeater === 'null' ? ' data-repeater="' . esc_attr( $repeater ) . '"' : '';
				$ajaxloadmore .= $theme_repeater !== 'null' ? ' data-theme-repeater="' . esc_attr( $theme_repeater ) . '"' : '';
			}

			// Post Type.
			$ajaxloadmore .= ' data-post-type="' . esc_attr( $post_type ) . '"';

			// Sticky posts.
			$ajaxloadmore .= $sticky_posts === 'true' ? ' data-sticky-posts="' . esc_attr( $sticky_posts ) . '"' : '';

			// Post Format.
			$ajaxloadmore .= $post_format ? ' data-post-format="' . esc_attr( $post_format ) . '"' : '';

			// Category.
			$ajaxloadmore .= $category ? ' data-category="' . esc_attr( $category ) . '"' : '';
			$ajaxloadmore .= $category__and ? ' data-category-and="' . esc_attr( $category__and ) . '"' : '';
			$ajaxloadmore .= $category__not_in ? ' data-category-not-in="' . esc_attr( $category__not_in ) . '"' : '';

			// Tag.
			$ajaxloadmore .= $tag ? ' data-tag="' . esc_attr( $tag ) . '"' : '';
			$ajaxloadmore .= $tag__and ? ' data-tag-and="' . esc_attr( $tag__and ) . '"' : '';
			$ajaxloadmore .= $tag__not_in ? ' data-tag-not-in="' . esc_attr( $tag__not_in ) . '"' : '';

			// Taxonomy.
			$ajaxloadmore .= $taxonomy ? ' data-taxonomy="' . esc_attr( $taxonomy ) . '"' : '';
			$ajaxloadmore .= $taxonomy_terms ? ' data-taxonomy-terms="' . esc_attr( $taxonomy_terms ) . '"' : '';
			$ajaxloadmore .= $taxonomy_operator ? ' data-taxonomy-operator="' . esc_attr( $taxonomy_operator ) . '"' : '';
			$ajaxloadmore .= $taxonomy_include_children ? ' data-taxonomy-include-children="' . esc_attr( $taxonomy_include_children ) . '"' : '';
			$ajaxloadmore .= $taxonomy_relation ? ' data-taxonomy-relation="' . esc_attr( $taxonomy_relation ) . '"' : '';

			// Meta Query.
			$ajaxloadmore .= $sort_key ? ' data-sort-key="' . esc_attr( $sort_key ) . '"' : '';
			$ajaxloadmore .= $meta_key ? ' data-meta-key="' . esc_attr( $meta_key ) . '"' : '';
			$ajaxloadmore .= $meta_value || $meta_value === '0' ? ' data-meta-value="' . esc_attr( $meta_value ) . '"' : '';
			$ajaxloadmore .= $meta_compare ? ' data-meta-compare="' . esc_attr( $meta_compare ) . '"' : '';
			$ajaxloadmore .= $meta_relation ? ' data-meta-relation="' . esc_attr( $meta_relation ) . '"' : '';
			$ajaxloadmore .= $meta_type ? ' data-meta-type="' . esc_attr( $meta_type ) . '"' : '';

			// Dates.
			$ajaxloadmore .= $year ? ' data-year="' . esc_attr( $year ) . '"' : '';
			$ajaxloadmore .= $month ? ' data-month="' . esc_attr( $month ) . '"' : '';
			$ajaxloadmore .= $day ? ' data-day="' . esc_attr( $day ) . '"' : '';

			// Date Query.
			$ajaxloadmore .= $date_query ? ' data-date-query="' . esc_attr( $date_query ) . '"' : '';
			$ajaxloadmore .= $date_query_after ? ' data-date-query-after="' . esc_attr( $date_query_after ) . '"' : '';
			$ajaxloadmore .= $date_query_before ? ' data-date-query-before="' . esc_attr( $date_query_before ) . '"' : '';
			$ajaxloadmore .= $date_query_inclusive ? ' data-date-query-inclusive="' . esc_attr( $date_query_inclusive ) . '"' : '';
			$ajaxloadmore .= $date_query_column ? ' data-date-query-column="' . esc_attr( $date_query_column ) . '"' : '';
			$ajaxloadmore .= $date_query_compare ? ' data-date-query-compare="' . esc_attr( $date_query_compare ) . '"' : '';
			$ajaxloadmore .= $date_query_relation ? ' data-date-query-relation="' . esc_attr( $date_query_relation ) . '"' : '';

			// Author.
			$ajaxloadmore .= $author ? ' data-author="' . esc_attr( $author ) . '"' : '';

			// Post Parameters.
			$ajaxloadmore .= $post__in ? ' data-post-in="' . esc_attr( $post__in ) . '"' : '';
			$ajaxloadmore .= $post__not_in ? ' data-post-not-in="' . esc_attr( $post__not_in ) . '"' : '';
			$ajaxloadmore .= $exclude ? ' data-exclude="' . esc_attr( $exclude ) . '"' : '';

			// Search.
			$ajaxloadmore .= $search ? ' data-search="' . esc_attr( $search ) . '"' : '';

			// Custom Args.
			$ajaxloadmore .= $custom_args ? ' data-custom-args="' . esc_attr( $custom_args ) . '"' : '';

			// Vars.
			$ajaxloadmore .= $vars ? ' data-vars="' . esc_attr( $vars ) . '"' : '';

			// Status.
			$ajaxloadmore .= $post_status ? ' data-post-status="' . esc_attr( $post_status ) . '"' : '';

			// Order.
			$ajaxloadmore .= ' data-order="' . esc_attr( $order ) . '"'; // Order.
			$ajaxloadmore .= ' data-orderby="' . esc_attr( $orderby ) . '"'; // Orderby.
			$ajaxloadmore .= ' data-offset="' . esc_attr( $offset ) . '"'; // Offset.
			$ajaxloadmore .= ' data-posts-per-page="' . esc_attr( $posts_per_page ) . '"'; // Posts Per Page.

			// Lang.
			$ajaxloadmore .= $lang ? ' data-lang="' . esc_attr( $lang ) . '"' : '';

			// Scroll.
			if ( $paging !== 'true' ) {
				$ajaxloadmore .= $scroll === 'false' ? ' data-scroll="false"' : '';
				if ( $scroll === 'true' ) {
					$ajaxloadmore .= $scroll_distance !== '100' ? ' data-scroll-distance="' . esc_attr( $scroll_distance ) . '"' : '';
					$ajaxloadmore .= $scroll_container ? ' data-scroll-container="' . esc_attr( $scroll_container ) . '"' : '';
					$ajaxloadmore .= $scroll_direction ? ' data-scroll-direction="' . esc_attr( $scroll_direction ) . '"' : '';
					$ajaxloadmore .= $max_pages && $max_pages !== '0' ? ' data-max-pages="' . esc_attr( $max_pages ) . '"' : '';
					$ajaxloadmore .= $pause_override ? ' data-pause-override="' . esc_attr( $pause_override ) . '"' : '';
				}
			}

			// Pause.
			$ajaxloadmore .= $pause === 'true' ? ' data-pause="true"' : '';

			// Button labels.
			$ajaxloadmore .= ' data-button-label="' . self::alm_strip_tags( $button_label ) . '"';
			$ajaxloadmore .= $button_loading_label ? ' data-button-loading-label="' . self::alm_strip_tags( $button_loading_label ) . '"' : '';
			$ajaxloadmore .= $button_done_label ? ' data-button-done-label="' . self::alm_strip_tags( $button_done_label ) . '"' : '';
			$ajaxloadmore .= ' data-prev-button-label="' . self::alm_strip_tags( $prev_button_label ) . '"';
			$ajaxloadmore .= $prev_button_loading_label ? ' data-prev-button-loading-label="' . self::alm_strip_tags( $prev_button_loading_label ) . '"' : '';
			$ajaxloadmore .= $prev_button_done_label ? ' data-prev-button-done-label="' . self::alm_strip_tags( $prev_button_done_label ) . '"' : '';

			// Destroy After.
			$ajaxloadmore .= $destroy_after ? ' data-destroy-after="' . esc_attr( $destroy_after ) . '"' : '';

			// Transition.
			$ajaxloadmore .= $transition !== 'fade' ? ' data-transition="' . esc_attr( $transition ) . '"' : '';
			$ajaxloadmore .= $transition_delay !== '0' && $transition === 'fade' ? ' data-transition-delay="' . esc_attr( $transition_delay ) . '"' : '';

			// Masonry.
			if ( 'masonry' === $transition ) {
				$masonry_config = [
					'selector'        => esc_attr( $masonry_selector ),
					'columnwidth'     => esc_attr( $masonry_columnwidth ),
					'animation'       => esc_attr( $masonry_animation ),
					'horizontalorder' => esc_attr( $masonry_horizontalorder ),
				];
				$ajaxloadmore  .= ' data-masonry-config="' . htmlspecialchars( wp_json_encode( $masonry_config ), ENT_QUOTES, 'UTF-8' ) . '"';
			}

			// Images Loaded.
			$ajaxloadmore .= $images_loaded !== 'false' ? ' data-images-loaded="' . esc_attr( $images_loaded ) . '"' : '';

			// Lazy Load Images.
			$ajaxloadmore .= $lazy_images !== false ? ' data-lazy-images="' . esc_attr( $lazy_images ) . '"' : '';

			// Primary.
			$ajaxloadmore .= $primary !== false ? ' data-primary="true"' : '';

			$ajaxloadmore .= '>';
			// End .alm-listing data.

			// Paging before.
			if ( $has_paging && $container_type !== 'table' ) {
				// Only add paging container if not table layout.
				$paging_container_classes = $paging_container_classes ? ' ' . esc_attr( $paging_container_classes ) : '';
				$ajaxloadmore            .= apply_filters( 'alm_paging_before', '<div class="alm-paging-content' . $paging_container_classes . '" style="opacity: 0; outline: none;">' );
			}

			// Preloaded.
			$noscript_pagingnav = '';
			if ( has_action( 'alm_preload_installed' ) && $preloaded === 'true' ) {
				include ALM_PATH . 'core/classes/includes/preloaded.php';
			}

			// Single Post.
			// Get first post and append to alm object.
			if ( has_action( 'alm_single_post_installed' ) && $single_post ) {
				$repeater_type = preg_split( '/(?=\d)/', $repeater, 2 ); // split $repeater at number to retrieve type.
				$repeater_type = $repeater_type[0]; // default / repeater / template_{x}.
				$repeater_type = $theme_repeater !== 'null' && has_filter( 'alm_get_theme_repeater' ) ? null : $repeater_type;

				// Get current permalink - (including querystring).
				$single_post_permanlink = get_permalink( $single_post_id );
				if ( $_SERVER['QUERY_STRING'] && apply_filters( 'alm_single_post_querystring', true ) ) {
					$single_post_permanlink = $single_post_permanlink . '?' . esc_attr( $_SERVER['QUERY_STRING'] );
				}

				// Get previous post include, build output from the next post filter.
				$single_post_output = '<div class="alm-single-post post-' . $single_post_id . '" data-url="' . $single_post_permanlink . '" data-title="' . wp_strip_all_tags( get_the_title( $single_post_id ) ) . '" data-id="' . $single_post_id . '" data-page="0">';

				/**
				 * Single Post Add-on hook
				 *
				 * @return $args;
				 */
				// Only render include if offset is zero.
				$single_post_output .= $offset < 1 ? apply_filters( 'alm_single_post_inc', $repeater, $repeater_type, $theme_repeater, $single_post_id, $post_type ) : '';

				$single_post_output .= '</div>';
				$ajaxloadmore       .= $single_post_output; // Append $single_post_output data to $ajaxloadmore.
			}

			// Next Page Add-on.
			if ( has_action( 'alm_nextpage_installed' ) && $nextpage ) {
				$nextpage_start    = alm_get_startpage(); // Located in `core/functions.php`.
				$nextpage_is_paged = apply_filters( 'alm_nextpage_paged', $nextpage_start > 1 );

				/**
				 * Next Page Add-on hook.
				 *
				 * @return html;
				 */
				$ajaxloadmore .= apply_filters( 'alm_init_nextpage', $nextpage_post_id, $nextpage_start, $nextpage_is_paged, $paging, $div_id, $id, $nextpage_type );
			}

			// Paging after.
			if ( $has_paging && $container_type !== 'table' ) {
				// Only close paging container if not table layout.
				$ajaxloadmore .= apply_filters( 'alm_paging_after', '</div>' );
				$ajaxloadmore .= apply_filters( 'alm_paging_loader', '<div class="alm-paging-loading"></div>' );
			}

			// Masonry Hook (After).
			$ajaxloadmore .= apply_filters( 'alm_masonry_after', $transition );

			// Close ALM container element.
			$ajaxloadmore .= '</' . esc_attr( $container_element ) . '>';

			// Create Placeholder.
			$ajaxloadmore .= self::alm_render_placeholder( $placeholder, $paging );

			/**
			 * Generates <noscript/> element of current query.
			 * ALM Core Filter Hook
			 *
			 * @return html
			 */
			if ( ( $seo === 'true' || $filters ) && $preloaded !== 'true' && ! $restapi ) {
				if ( ! apply_filters( 'alm_disable_noscript_' . $id, false ) ) {
					$ajaxloadmore .= apply_filters( 'alm_noscript', $query_args, $container_element, $css_classes, $canonical_url );
				}
			}

			// Render <noscript> pagination for SEO and Preloaded (./preloaded.php).
			$ajaxloadmore .= ! empty( $noscript_pagingnav ) ? $noscript_pagingnav : '';

			/**
			 * Before Button
			 * ALM Core Filter Hook
			 *
			 * @return html
			 */
			$ajaxloadmore .= apply_filters( 'alm_before_button', '' );

			// Create Load More button and button wrapper.
			$ajaxloadmore .= self::alm_render_button( $paging, $button_classname, $button_label, $div_id );

			/**
			 * After Button
			 * ALM Core Filter Hook
			 *
			 * @return html
			 */
			$ajaxloadmore .= apply_filters( 'alm_after_button', '' );

			// No results text.
			if ( $no_results_text !== '' && ! empty( $no_results_text ) ) {
				$ajaxloadmore .= '<div class="alm-no-results" style="display: none;">' . wp_kses_post( $no_results_text ) . '</div>';
			}

			// Render <noscript> pagination for Nextpage addon.
			if ( has_action( 'alm_nextpage_installed' ) && $nextpage && $nextpage_urls === 'true' ) {

				/**
				 * Nextpage Core Filer Hook
				 *
				 * @see ajax-load-more/next-page/functions.php
				 */
				$ajaxloadmore .= apply_filters( 'alm_nextpage_noscript_paging', $query_args['post_id'], $query_args['id'] );
			}

			$ajaxloadmore .= '</div>'; // Close #ajax-load-more output.

			/**
			 * After Container.
			 * ALM Core Filter Hook.
			 *
			 * @return string
			 */
			$ajaxloadmore .= apply_filters( 'alm_after_container', '' );

			/**
			 * ALM Core Filter Hook.
			 * Progress Bar CSS.
			 *
			 * @return string
			 */
			$ajaxloadmore .= apply_filters( 'alm_progress_css', self::$counter, $progress_bar, $progress_bar_color );

			/**
			 * Custom JavaScript.
			 * ALM core setting parameter.
			 */
			$ajaxloadmore .= isset( $options['_alm_custom_js'] ) && ! empty( $options['_alm_custom_js'] ) ? '<script>' . $options['_alm_custom_js'] . '</script>' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

			/**
			 * REST API Add-on
			 * Add <script/> template to page.
			 */
			if ( has_action( 'alm_rest_api_installed' ) && $restapi ) {
				if ( $theme_repeater !== 'null' && has_action( 'alm_get_rest_theme_repeater' ) ) {
					do_action( 'alm_get_rest_theme_repeater', $theme_repeater );
				} else {
					do_action( 'alm_get_rest_api_template', $repeater, alm_get_repeater_type( $repeater ) );
				}
			}

			/**
			 * Build localized script variables for each ALM instance.
			 */
			ALM_LOCALIZE::add_localized_var( 'id', $master_id, $localize_id );
			ALM_LOCALIZE::add_localized_var( 'script', alm_convert_dashes_to_underscore( $localize_id ) . '_vars', $localize_id );
			ALM_LOCALIZE::add_localized_var( 'defaults', $atts, $localize_id ); // Default shortcode atts.

			// Get the localized data.
			$localized_data = ALM_LOCALIZE::return_localized_data( $localize_id );

			/**
			 * Append the localized data `<script/>` using `wp_footer`.
			 *
			 * @see https://developer.wordpress.org/reference/functions/wp_add_inline_script/#comment-5828
			 */
			add_action(
				'wp_footer',
				function () use ( $localized_data, $localize_id ) {
					// phpcs:ignore
					printf( '<script type="text/javascript" id="' . $localized_data[ $localize_id ]['script'] . '">var ' . $localized_data[ $localize_id ]['script'] . ' = %s</script>', json_encode( $localized_data[ $localize_id ] ) );
				}
			);

			return $ajaxloadmore; // End $ajaxloadmore element.
		}

		/**
		 * Render the load more button.
		 *
		 * @param  string                                          $paging         Is this for the Paging add-on.
		 * @param  string                                          $classname      Custom classnames.
		 * @param  string label           The label for the button.
		 * @param  string                                          $id             ALM div ID.
		 * @return string                 The button html and wrapper.
		 * @since  3.3.2
		 */
		public static function alm_render_button( $paging, $classname, $label, $id ) {
			$classes = has_filter( 'alm_button_wrap_classes' ) ? ' ' . apply_filters( 'alm_button_wrap_classes', '' ) : '';
			$html    = '<div class="alm-btn-wrap' . $classes . '" style="visibility: hidden;" data-rel="' . esc_attr( $id ) . '">';

			if ( $paging !== 'true' ) {
				$html .= '<button class="alm-load-more-btn more' . esc_attr( $classname ) . '" rel="next" type="button">' . self::alm_strip_tags( $label ) . '</button>';
			}

			$html .= '</div>';
			return wp_kses_post( $html );
		}

		/**
		 * Strip tags from param.
		 *
		 * @param string $str String to sanitize.
		 * @return string    Stripped string.
		 */
		public static function alm_strip_tags( $str ) {
			$str = str_replace( [ '&lt;', '&gt;', '&#60;', '&#62;' ], '', $str ); // Remove < & > entity tags.
			return esc_html( strip_tags( $str, '<span><i><b><strong>' ) );
		}

		/**
		 * Render a placeholder loader.
		 *
		 * @param string $placeholder The value of the placeholder.
		 * @param string $paging      Is paging true.
		 * @return string             Raw HTML string.
		 * @since 5.1.7
		 */
		public static function alm_render_placeholder( $placeholder, $paging ) {
			if ( isset( $placeholder ) && ! empty( $placeholder ) && $paging !== 'true' ) {
				$placeholder_url = $placeholder === 'true' ? ALM_URL . '/build/frontend/img/placeholder.png' : $placeholder;
				if ( $placeholder_url ) {
					$html = '<div class="alm-placeholder"><img src="' . esc_url( $placeholder_url ) . '" alt=""></div>';
					return wp_kses_post( $html );
				}
			}
		}
	}

endif;
