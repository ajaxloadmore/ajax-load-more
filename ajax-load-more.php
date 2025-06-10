<?php
/**
 * Plugin Name: Ajax Load More
 * Plugin URI: https://connekthq.com/plugins/ajax-load-more
 * Description: The ultimate solution to add infinite scroll and load more functionality to your website.
 * Text Domain: ajax-load-more
 * Author: Darren Cooney
 * Twitter: @KaptonKaos
 * Author URI: https://connekthq.com
 * Version: 7.4.2
 * License: GPL
 * Copyright: Darren Cooney & Connekt Media
 *
 * @package AjaxLoadMore
 */

define( 'ALM_VERSION', '7.4.2' );
define( 'ALM_RELEASE', 'June 10, 2025' );
define( 'ALM_STORE_URL', 'https://connekthq.com' );

require_once plugin_dir_path( __FILE__ ) . 'core/functions/install.php';

/**
 * Activation hook - Create table & repeater.
 *
 * @param Boolean $network_wide Enable the plugin for all sites in the network or just the current site. Multisite only.
 * @since 2.0.0
 */
function alm_install( $network_wide ) {
	global $wpdb;
	if ( is_multisite() && $network_wide ) {
		// Get all blogs in the network and activate plugin on each one.
		$blog_ids = $wpdb->get_col( "SELECT blog_id FROM $wpdb->blogs" ); // phpcs:ignore
		foreach ( $blog_ids as $blog_id ) {
			switch_to_blog( $blog_id );
			alm_create_table();
			restore_current_blog();
		}
	} else {
		alm_create_table();
	}
}
register_activation_hook( __FILE__, 'alm_install' );
add_action( 'wpmu_new_blog', 'alm_install' );

if ( ! class_exists( 'AjaxLoadMore' ) ) :

	/**
	 * Initiate the core AjaxLoadMore class.
	 */
	class AjaxLoadMore {

		/**
		 * Shortcode attributes.
		 *
		 * @var array|null
		 */
		public static $shortcode_atts = null;

		/**
		 * Class Constructor.
		 */
		public function __construct() {
			$this->alm_define_constants();
			$this->alm_includes();

			add_action( 'wp_ajax_alm_get_posts', [ $this, 'alm_query_posts' ] );
			add_action( 'wp_ajax_nopriv_alm_get_posts', [ $this, 'alm_query_posts' ] );
			add_action( 'wp_enqueue_scripts', [ $this, 'alm_enqueue_scripts' ] );
			add_action( 'after_setup_theme', [ $this, 'alm_image_sizes' ] );
			add_action( 'init', [ $this, 'alm_load_text_domain' ] );

			add_filter( 'alm_noscript', [ $this, 'alm_noscript' ], 10, 6 );
			add_filter( 'alm_noscript_pagination', [ $this, 'alm_noscript_pagination' ], 10, 3 );
			add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), [ $this, 'alm_action_links' ] );
			add_filter( 'plugin_row_meta', [ $this, 'alm_plugin_meta_links' ], 10, 2 );
			add_filter( 'widget_text', 'do_shortcode' );

			add_shortcode( 'ajax_load_more', [ $this, 'alm_shortcode' ] );
		}

		/**
		 * Load the plugin text domain for translation.
		 *
		 * @return void
		 */
		public function alm_load_text_domain() {
			load_plugin_textdomain( 'ajax-load-more', false, dirname( plugin_basename( __FILE__ ) ) . '/lang' );
		}

		/**
		 * Load these files before the theme loads.
		 *
		 * @since 2.0.0
		 */
		public function alm_includes() {
			require_once ALM_PATH . 'core/functions.php'; // Load Core Functions.
			require_once ALM_PATH . 'core/classes/class-alm-blocks.php'; // Load Block Class.
			require_once ALM_PATH . 'core/classes/class-alm-preview.php'; // Load Preview Class.
			require_once ALM_PATH . 'core/classes/class-alm-shortcode.php'; // Load Shortcode Class.
			require_once ALM_PATH . 'core/classes/class-alm-woocommerce.php'; // Load Woocommerce Class.
			require_once ALM_PATH . 'core/classes/class-alm-enqueue.php'; // Load Enqueue Class.
			require_once ALM_PATH . 'core/classes/class-alm-queryargs.php'; // Load Query Args Class.
			require_once ALM_PATH . 'core/classes/class-alm-localize.php'; // Load Localize Class.
			require_once ALM_PATH . 'core/integration/elementor/elementor.php';

			if ( is_admin() ) {
				require_once 'admin/admin.php';
				require_once 'admin/admin-functions.php';
				require_once 'admin/vendor/connekt-plugin-installer/class-connekt-plugin-installer.php';
				if ( ! class_exists( 'EDD_SL_Plugin_Updater' ) ) {
					require_once __DIR__ . '/core/libs/EDD_SL_Plugin_Updater.php'; // Include EDD helper if other plugins have not.
				}
			}
		}

		/**
		 * Define plugin constants.
		 *
		 * @since 2.10.1
		 */
		public function alm_define_constants() {
			define( 'ALM_PATH', plugin_dir_path( __FILE__ ) );
			define( 'ALM_URL', plugins_url( '', __FILE__ ) );
			define( 'ALM_ADMIN_URL', plugins_url( 'admin/', __FILE__ ) );
			define( 'ALM_TITLE', 'Ajax Load More' );
			define( 'ALM_SLUG', 'ajax-load-more' );
			define( 'ALM_REST_NAMESPACE', 'ajaxloadmore' );
			define( 'ALM_SETTINGS', 'alm_settings' );

			// CSS constants.
			$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
			define( 'ALM_CSS_PATH', ALM_PATH . 'build/frontend/ajax-load-more' . $suffix . '.css' );
			define( 'ALM_CSS_URL', ALM_URL . '/build/frontend/ajax-load-more' . $suffix . '.css' );
			define( 'ALM_CORE_JS_URL', ALM_URL . '/build/frontend/ajax-load-more' . $suffix . '.js' );

			// Add-on constants.
			if ( ! defined( 'ALM_CACHE_ITEM_NAME' ) ) {
				define( 'ALM_CACHE_ITEM_NAME', '4878' );
			}
			if ( ! defined( 'ALM_CTA_ITEM_NAME' ) ) {
				define( 'ALM_CTA_ITEM_NAME', '14456' );
			}
			if ( ! defined( 'ALM_COMMENTS_ITEM_NAME' ) ) {
				define( 'ALM_COMMENTS_ITEM_NAME', '12172' );
			}
			if ( ! defined( 'ALM_UNLIMITED_ITEM_NAME' ) ) {
				define( 'ALM_UNLIMITED_ITEM_NAME', '3118' );
			}
			if ( ! defined( 'ALM_FILTERS_ITEM_NAME' ) ) {
				define( 'ALM_FILTERS_ITEM_NAME', '35992' );
			}
			if ( ! defined( 'ALM_LAYOUTS_ITEM_NAME' ) ) {
				define( 'ALM_LAYOUTS_ITEM_NAME', '11398' );
			}
			if ( ! defined( 'ALM_NEXTPAGE_ITEM_NAME' ) ) {
				define( 'ALM_NEXTPAGE_ITEM_NAME', '24540' );
			}
			if ( ! defined( 'ALM_PAGING_ITEM_NAME' ) ) {
				define( 'ALM_PAGING_ITEM_NAME', '6898' );
			}
			if ( ! defined( 'ALM_PRELOADED_ITEM_NAME' ) ) {
				define( 'ALM_PRELOADED_ITEM_NAME', '4293' );
			}
			if ( ! defined( 'ALM_PREV_POST_ITEM_NAME' ) ) {
				define( 'ALM_PREV_POST_ITEM_NAME', '9686' );
			}
			if ( ! defined( 'ALM_QUERY_LOOP_ITEM_NAME' ) ) {
				define( 'ALM_QUERY_LOOP_ITEM_NAME', '120900' );
			}
			if ( ! defined( 'ALM_SEO_ITEM_NAME' ) ) {
				define( 'ALM_SEO_ITEM_NAME', '3482' );
			}
			if ( ! defined( 'ALM_THEME_REPEATERS_ITEM_NAME' ) ) {
				define( 'ALM_THEME_REPEATERS_ITEM_NAME', '8860' );
			}
			if ( ! defined( 'ALM_USERS_ITEM_NAME' ) ) {
				define( 'ALM_USERS_ITEM_NAME', '32311' );
			}
			if ( ! defined( 'ALM_PRO_ITEM_NAME' ) ) {
				define( 'ALM_PRO_ITEM_NAME', '42166' );
			}
			if ( ! defined( 'ALM_WOO_ITEM_NAME' ) ) {
				define( 'ALM_WOO_ITEM_NAME', '62770' );
			}
			if ( ! defined( 'ALM_ELEMENTOR_ITEM_NAME' ) ) {
				define( 'ALM_ELEMENTOR_ITEM_NAME', '70951' );
			}
			if ( ! defined( 'ALM_RESTAPI_ITEM_NAME' ) ) {
				define( 'ALM_RESTAPI_ITEM_NAME', '17105' ); // Deprecated.
			}
		}

		/**
		 * This function will build query results including pagination for users without JS enabled.
		 *
		 * @param  array  $args               The alm_query args.
		 * @param  string $container_element  The container HTML element.
		 * @param  string $css_classes        ALM classes.
		 * @param  string $transition_classes Transition classes.
		 * @param  string $permalink          The current permalink.
		 * @return string                     The generated <noscript/> HTML.
		 * @since 3.7
		 */
		public function alm_noscript( $args = [], $container_element = 'ul', $css_classes = '', $transition_classes = '', $permalink = '' ) {
			if ( is_admin() || apply_filters( 'alm_disable_noscript', false ) ) {
				return;
			}
			include_once ALM_PATH . 'core/classes/class-alm-noscript.php'; // Load Noscript Class.
			$noscript = ALM_NOSCRIPT::alm_get_noscript( $args, $container_element, $css_classes, $transition_classes, $permalink );
			return $noscript;
		}

		/**
		 * This function will build pagination for users without JS enabled.
		 *
		 * @param  array   $query      The current query.
		 * @param  boolean $is_filters Is this a filters query.
		 * @return string              The generated <noscript/> HTML.
		 * @since 3.7
		 */
		public function alm_noscript_pagination( $query, $is_filters ) {
			if ( is_admin() || apply_filters( 'alm_disable_noscript', false ) ) {
				return;
			}
			include_once ALM_PATH . 'core/classes/class-alm-noscript.php'; // Load Noscript Class.
			$noscript = ALM_NOSCRIPT::build_noscript_paging( $query, $is_filters );
			return '<noscript>' . $noscript . '</noscript>';
		}

		/**
		 * Return the default Repeater Template.
		 *
		 * @return string The repeater php & html as a string.
		 * @since 5.5.4
		 */
		public static function alm_get_default_repeater_markup() {
			$content = '';
			$file    = ALM_PATH . 'admin/includes/layout/default.php';
			if ( file_exists( $file ) ) {
				// phpcs:ignore
				$content = file_get_contents( $file );
			}
			return $content;
		}

		/**
		 * Get absolute path to repeater directory base.
		 *
		 * @return string The directory path.
		 * @since 3.5
		 */
		public static function alm_get_repeater_path() {
			$upload_dir = wp_upload_dir();
			$path       = apply_filters( 'alm_repeater_path', $upload_dir['basedir'] . '/alm_templates' );
			return $path;
		}

		/**
		 * Get absolute path to theme repeater directory base.
		 *
		 * @return string The directory path.
		 * @since 5.5.4
		 */
		public static function alm_get_theme_repeater_path() {
			$options = get_option( 'alm_settings' );
			if ( ! isset( $options['_alm_theme_repeaters_dir'] ) ) {
				$options['_alm_theme_repeaters_dir'] = 'alm_templates';
			}

			// Get template location.
			if ( is_child_theme() ) {
				$path = get_stylesheet_directory() . '/' . $options['_alm_theme_repeaters_dir'];
			} else {
				$path = get_template_directory() . '/' . $options['_alm_theme_repeaters_dir'];
			}

			return $path;
		}

		/**
		 * Create repeater template directory
		 *
		 * @param string $dir Directory path.
		 * @since 3.5
		 */
		public static function alm_mkdir( $dir ) {
			// Does $dir exist?
			if ( ! is_dir( $dir ) ) {
				wp_mkdir_p( $dir );
				// Check again after creating it (permission checker).
				if ( ! is_dir( $dir ) ) {
					echo esc_html__( 'Error creating repeater template directory', 'ajax-load-more' ) . ' - ' . esc_attr( $dir );
				}
			}
		}

		/**
		 * Returns add-on data (admin/admin-functions.php).
		 *
		 * @since 2.0.0
		 * @return @addons
		 */
		public function alm_return_addons() {
			return alm_get_addons();
		}

		/**
		 * Add plugin action links to WP plugin screen.
		 *
		 * @param array $links The array of links.
		 * @return array
		 * @since 2.2.3
		 */
		public function alm_action_links( $links ) {
			$settings = '<a href="' . get_admin_url( null, 'admin.php?page=ajax-load-more' ) . '">' . __( 'Settings', 'ajax-load-more' ) . '</a>';
			array_unshift( $links, $settings );
			return $links;
		}

		/**
		 * Add plugin meta links to WP plugin screen.
		 *
		 * @param array  $links Current links.
		 * @param string $file The current file.
		 * @since 2.7.2.1
		 */
		public function alm_plugin_meta_links( $links, $file ) {
			if ( strpos( $file, 'ajax-load-more.php' ) !== false ) {
				$new_links = [
					'<a href="admin.php?page=ajax-load-more-shortcode-builder">Shortcode  Builder</a>',
					'<a href="admin.php?page=ajax-load-more-add-ons">Add-ons</a>',
				];
				$links     = array_merge( $links, $new_links );
			}
			return $links;
		}

		/**
		 * Add default image size.
		 *
		 * @since 2.8.3
		 */
		public function alm_image_sizes() {
			add_image_size( 'alm-thumbnail', 150, 150, true );
		}

		/**
		 * Enqueue scripts and create localized variables.
		 *
		 * @since 2.0.0
		 */
		public function alm_enqueue_scripts() {
			// Core ALM JS.
			$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
			wp_register_script( 'ajax-load-more', plugins_url( '/build/frontend/ajax-load-more' . $suffix . '.js', __FILE__ ), [], ALM_VERSION, true );

			// LiteSpeed Cache compatability.
			wp_script_add_data( 'ajax-load-more', 'data-no-optimize', '1' );

			// Progress Bar JS.
			wp_register_script( 'ajax-load-more-progress', plugins_url( '/core/libs/pace/pace.min.js', __FILE__ ), 'ajax-load-more', ALM_VERSION, true );

			// Masonry JS.
			wp_register_script( 'ajax-load-more-masonry', plugins_url( '/core/libs/masonry/masonry.pkgd.min.js', __FILE__ ), 'ajax-load-more', '4.2.1', true );

			// Callback Helpers.
			wp_register_script( 'ajax-load-more-legacy-callbacks', plugins_url( '/core/libs/alm/legacy-callbacks.js', __FILE__ ), 'jquery', ALM_VERSION, false );

			// Core CSS.
			if ( ! alm_do_inline_css( '_alm_inline_css' ) && ! alm_css_disabled( '_alm_disable_css' ) ) { // Not inline or disabled.
				ALM_ENQUEUE::alm_enqueue_css( ALM_SLUG, ALM_CSS_URL );
			}

			// Localized JS variables.
			wp_localize_script(
				'ajax-load-more',
				'alm_localize',
				$this->alm_get_localized_defaults()
			);
		}

		/**
		 * Localized JS variables.
		 *
		 * @return array
		 */
		public static function alm_get_localized_defaults() {
			return [
				'pluginurl'          => ALM_URL,
				'version'            => ALM_VERSION,
				'adminurl'           => get_admin_url(),
				'ajaxurl'            => apply_filters( 'alm_ajaxurl', admin_url( 'admin-ajax.php' ) ),
				'alm_nonce'          => wp_create_nonce( 'ajax_load_more_nonce' ),
				'rest_api_url'       => apply_filters( 'alm_restapi_url', '' ),
				'rest_api'           => esc_url_raw( rest_url() ),
				'rest_nonce'         => wp_create_nonce( 'wp_rest' ),
				'trailing_slash'     => substr( get_option( 'permalink_structure' ), -1 ) === '/' ? 'true' : 'false', // Trailing slash in permalink structure.
				'is_front_page'      => is_home() || is_front_page() ? 'true' : 'false',
				'retain_querystring' => apply_filters( 'alm_retain_querystring', true ),
				'speed'              => apply_filters( 'alm_speed', 250 ),
				'results_text'       => apply_filters( 'alm_display_results', __( 'Viewing {post_count} of {total_posts} results.', 'ajax-load-more' ) ),
				'no_results_text'    => apply_filters( 'alm_no_results_text', __( 'No results found.', 'ajax-load-more' ) ),
				'alm_debug'          => apply_filters( 'alm_debug', false ),
				'a11y_focus'         => apply_filters( 'alm_a11y_focus', true ),
				'site_title'         => get_bloginfo( 'name' ),
				'site_tagline'       => get_bloginfo( 'description' ),
				'button_label'       => self::alm_default_button_label(),
			];
		}

		/**
		 * Get default button label.
		 *
		 * @since 7.0.0
		 */
		public static function alm_default_button_label() {
			return apply_filters( 'alm_button_label', __( 'Load More', 'ajax-load-more' ) );
		}

		/**
		 * Get default previous button label.
		 *
		 * @since 7.0.0
		 */
		public static function alm_default_prev_button_label() {
			return apply_filters( 'alm_prev_button_label', __( 'Load Previous', 'ajax-load-more' ) );
		}

		/**
		 * The AjaxLoadMore shortcode.
		 *
		 * @param array $atts Shortcode attributes.
		 * @since 2.0.0
		 */
		public static function alm_shortcode( $atts ) {
			self::$shortcode_atts = $atts;
			return ALM_SHORTCODE::alm_render_shortcode( $atts );
		}

		/**
		 *  Return the ALM shortcode atts.
		 *
		 *  @since 3.2.0
		 */
		public static function alm_return_shortcode_atts() {
			return self::$shortcode_atts;
		}

		/**
		 * Core Ajax Load More Query.
		 *
		 * @since 2.0.0
		 */
		public function alm_query_posts() {
			$params = filter_input_array( INPUT_GET );

			// WPML fix for category/tag/taxonomy archives.
			if ( ( isset( $params['category'] ) && $params['category'] ) || ( isset( $params['taxonomy'] ) && $params['taxonomy'] ) || ( isset( $params['tag'] ) && $params['tag'] ) ) {
				unset( $_REQUEST['post_id'] );
			}

			$id            = isset( $params['id'] ) ? $params['id'] : '';
			$post_id       = isset( $params['post_id'] ) ? $params['post_id'] : '';
			$slug          = isset( $params['slug'] ) ? $params['slug'] : '';
			$canonical_url = isset( $params['canonical_url'] ) ? esc_attr( $params['canonical_url'] ) : esc_url( $_SERVER['HTTP_REFERER'] ); // phpcs:ignore

			// Ajax Query Type.
			$query_type = isset( $params['query_type'] ) ? $params['query_type'] : 'standard'; // 'standard' or 'totalposts' - totalposts returns $alm_found_posts.

			// Filters.
			$is_filters     = isset( $params['filters'] ) && has_action( 'alm_filters_installed' ) ? true : false;
			$filters_target = $is_filters && isset( $params['filters_target'] ) ? $params['filters_target'] : 0;
			$filters_facets = $is_filters && $filters_target && isset( $params['facets'] ) && $params['facets'] === 'true' ? true : false;

			// Cache.
			$cache_id        = isset( $params['cache_id'] ) && $params['cache_id'] ? $params['cache_id'] : false;
			$cache_slug      = isset( $params['cache_slug'] ) && $params['cache_slug'] ? $params['cache_slug'] : '';
			$cache_logged_in = isset( $params['cache_logged_in'] ) ? $params['cache_logged_in'] : false;
			$do_create_cache = $cache_logged_in === 'true' && is_user_logged_in() ? false : true;

			// Offset.
			$offset = isset( $params['offset'] ) ? $params['offset'] : 0;

			// Repeater Templates.
			$repeater       = isset( $params['repeater'] ) ? sanitize_file_name( $params['repeater'] ) : 'default';
			$theme_repeater = isset( $params['theme_repeater'] ) ? sanitize_file_name( $params['theme_repeater'] ) : 'null';

			// Post Parameters.
			$post_type      = isset( $params['post_type'] ) ? $params['post_type'] : 'post';
			$posts_per_page = isset( $params['posts_per_page'] ) ? $params['posts_per_page'] : 5;
			$page           = isset( $params['page'] ) ? $params['page'] : 0;

			// Paging Add-on.
			$paging = isset( $params['paging'] ) ? $params['paging'] : 'false';

			// Preload Add-on.
			$preloaded        = isset( $params['preloaded'] ) ? $params['preloaded'] : 'false';
			$preloaded_amount = isset( $params['preloaded_amount'] ) ? $params['preloaded_amount'] : '5';
			if ( has_action( 'alm_preload_installed' ) && $preloaded === 'true' ) {
				// If preloaded - offset the ajax posts by posts_per_page + preload_amount val.
				$old_offset = $preloaded_amount;
				$offset     = $offset + $preloaded_amount;
			}

			// CTA Add-on.
			$cta      = false;
			$cta_data = isset( $params['cta'] ) ? $params['cta'] : false;
			if ( $cta_data ) {
				$cta                = true;
				$cta_position       = isset( $cta_data['cta_position'] ) ? $cta_data['cta_position'] : 'before:1';
				$cta_position_array = explode( ':', $cta_position );
				$cta_pos            = (string) $cta_position_array[0];
				$cta_pos            = $cta_pos !== 'after' ? 'before' : $cta_pos;
				$cta_val            = (string) $cta_position_array[1];
				$cta_repeater       = isset( $cta_data['cta_repeater'] ) ? $cta_data['cta_repeater'] : '';
				$cta_theme_repeater = isset( $cta_data['cta_theme_repeater'] ) ? sanitize_file_name( $cta_data['cta_theme_repeater'] ) : '';
			}

			// Single Post Add-on.
			$single_post      = false;
			$single_post_data = isset( $params['single_post'] ) ? $params['single_post'] : false;
			if ( $single_post_data ) {
				$single_post    = true;
				$single_post_id = isset( $single_post_data['id'] ) ? $single_post_data['id'] : '';
			}

			// SEO Add-on.
			$seo_start_page = isset( $params['seo_start_page'] ) ? $params['seo_start_page'] : 1;

			// Set up initial WP_Query $args.
			$args = ALM_QUERY_ARGS::alm_build_queryargs( $params, true );

			$args['paged']  = get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1;
			$args['offset'] = $offset + ( $posts_per_page * $page );

			// Get current page number for determining item number.
			$alm_page_count = $page === 0 ? 1 : $page + 1;

			/**
			 * Single Post Add-on hook
			 * Hijack $args and and return single post query args.
			 *
			 * @return array
			 */
			$args = $single_post && has_action( 'alm_single_post_installed' ) ? apply_filters( 'alm_single_post_args', $single_post_id, $post_type ) : $args;

			/**
			 * ALM Core Query Filter Hook
			 *
			 * @return array
			 * @deprecated 2.10
			 */
			$args = apply_filters( 'alm_modify_query_args', $args, $slug );

			/**
			 * ALM Core Query Filter Hook.
			 *
			 * @see https://connekthq.com/plugins/ajax-load-more/docs/filter-hooks/#alm_query_args
			 * @return array
			 */
			$args = apply_filters( 'alm_query_args_' . $id, $args, $post_id );

			/**
			 * Custom `alm_query` parameter in the WP_Query
			 * Value is accessed elsewhere for filters & hooks etc.
			 */
			$args['alm_query'] = $single_post ? 'single_posts' : 'alm';

			// Dispatch WP_Query.
			$alm_query = new WP_Query( $args );

			/**
			 * ALM Core Filter Hook to modify the returned query
			 *
			 * @return $alm_query;
			 */
			$alm_query = apply_filters( 'alm_query_after_' . $id, $alm_query, $post_id );

			// If preloaded, update loop counter and total posts.
			if ( has_action( 'alm_preload_installed' ) && $preloaded === 'true' ) {
				$alm_total_posts = $alm_query->found_posts - $offset + $preloaded_amount;
				if ( $old_offset > 0 ) {
					$alm_loop_count = $old_offset;
				} else {
					$alm_loop_count = $offset;
				}
			} else {
				$alm_total_posts = $alm_query->found_posts - $offset;
				$alm_loop_count  = 0;
			}

			if ( $query_type === 'totalposts' ) {
				// Paging add-on.
				wp_send_json(
					[
						'totalposts' => $alm_total_posts,
					]
				);

			} else {

				/**
				 * ALM Core Filter Hook
				 *
				 * @see https://connekthq.com/plugins/ajax-load-more/docs/filter-hooks/#alm_debug
				 */
				$debug = apply_filters( 'alm_debug', false ) ? $args : false;

				if ( $alm_query->have_posts() ) {
					$alm_found_posts = $alm_total_posts;
					$alm_post_count  = $alm_query->post_count;
					$alm_current     = 0;

					// Build CTA Position Array.
					$cta_array = $cta && has_action( 'alm_cta_pos_array' ) ? $cta_array = apply_filters( 'alm_cta_pos_array', $seo_start_page, $page, $posts_per_page, $alm_post_count, $cta_val, $paging ) : [];

					ob_start();

					// Run the loop.
					while ( $alm_query->have_posts() ) :
						$alm_query->the_post();

						++$alm_loop_count;
						++$alm_current; // Current item in loop.
						$alm_page = $alm_page_count; // Get page number.
						$alm_item = ( $alm_page_count * $posts_per_page ) - $posts_per_page + $alm_loop_count;

						// Call to Action [Before].
						if ( $cta && has_action( 'alm_cta_inc' ) && $cta_pos === 'before' && in_array( $alm_current, $cta_array ) ) { // phpcs:ignore
							do_action( 'alm_cta_inc', $cta_repeater, $cta_theme_repeater, $alm_found_posts, $alm_page, $alm_item, $alm_current, false, $args );
						}

						// Load Repeater.
						alm_loop( $repeater, $theme_repeater, $alm_found_posts, $alm_page, $alm_item, $alm_current, $args, false );

						// Call to Action [After].
						if ( $cta && has_action( 'alm_cta_inc' ) && $cta_pos === 'after' && in_array( $alm_current, $cta_array ) ) { // phpcs:ignore
							do_action( 'alm_cta_inc', $cta_repeater, $cta_theme_repeater, $alm_found_posts, $alm_page, $alm_item, $alm_current, false, $args );
						}

					endwhile; wp_reset_query(); // phpcs:ignore
					// End Ajax Load More Loop.

					$data = ob_get_clean();

					$return = [
						'html' => $data,
						'meta' => [
							'postcount'  => $alm_post_count,
							'totalposts' => $alm_found_posts,
							'debug'      => $debug,
						],
					];

					// Get filter facet options.
					$facets = [];
					if ( $is_filters && $filters_target && $filters_facets && function_exists( 'alm_filters_get_facets' ) ) {
						$facets           = alm_filters_get_facets( $args, $filters_target );
						$return['facets'] = $facets;
					}

					/**
					 * Cache Add-on.
					 * Create the cache file.
					 */
					if ( $cache_id && method_exists( 'ALMCache', 'create_cache_file' ) && $do_create_cache ) {
						ALMCache::create_cache_file( $cache_id, $cache_slug, $canonical_url, $data, $alm_current, $alm_found_posts, $facets );
					}

					wp_send_json( $return );

				} else {
					$return = [
						'html' => null,
						'meta' => [
							'postcount'  => 0,
							'totalposts' => 0,
							'debug'      => $debug,
						],
					];

					// Get filter facet options.
					if ( $is_filters && $filters_target && $filters_facets && function_exists( 'alm_filters_get_facets' ) ) {
						$return['facets'] = alm_filters_get_facets( $args, $filters_target );
					}

					wp_send_json( $return );

				}
			}
			wp_die();
		}
	}

	/**
	 * The main function responsible for returning a single AjaxLoadMore instance.
	 *
	 * @since 2.0.0
	 */
	function ajax_load_more() {
		global $ajax_load_more;
		if ( ! isset( $ajax_load_more ) ) {
			$ajax_load_more = new AjaxLoadMore();
		}
		return $ajax_load_more;
	}
	ajax_load_more();

endif;

/**
 * Ajax Load More public render function.
 *
 * @param array $args The shortcode args.
 * @since 4.2.0
 */
function alm_render( $args ) {
	echo do_shortcode( AjaxLoadMore::alm_shortcode( $args ) );
}
