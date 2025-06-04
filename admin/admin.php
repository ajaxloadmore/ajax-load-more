<?php
/**
 * ALM admin functions and helpers.
 *
 * @package AjaxLoadMore
 * @since   2.0.0
 */

/**
 * Include these files.
 */
if ( ! class_exists( 'ALM_Notices' ) ) {
	require_once plugin_dir_path( __FILE__ ) . 'classes/notices.php';
}
require_once plugin_dir_path( __FILE__ ) . 'functions/layouts.php';
require_once plugin_dir_path( __FILE__ ) . 'functions/plugin-updates.php';
require_once plugin_dir_path( __FILE__ ) . 'functions/repeater-templates.php';
require_once plugin_dir_path( __FILE__ ) . 'functions/settings.php';
require_once plugin_dir_path( __FILE__ ) . 'classes/licensing.php';
( new ALM_Licensing() )->register();

/**
 * Setup the admin hooks
 *
 * @return void
 * @deprecated 5.6
 */
function alm_admin_hooks() {
	require_once plugin_dir_path( __FILE__ ) . 'classes/nag.php';
	( new ALM_Nag() )->register();
}
add_action( 'admin_init', 'alm_admin_hooks' );

/**
 * Render a notification in the dashboard.
 *
 * @since 4.0
 */
function alm_pro_transient_notification() {
	if ( ! has_action( 'alm_pro_installed' ) ) {
		$msg  = '🔥&nbsp; <strong><a href="https://connekthq.com/plugins/ajax-load-more/pro/" target="_blank">Ajax Load More Pro</a></strong> &rarr; ';
		$msg .= 'Get access to all 15+ add-ons in a single installation! &nbsp; <strong><a href="https://connekthq.com/plugins/ajax-load-more/pro/" target="_blank" class="button button-primary">Upgrade Now</a></strong>';
		alm_transient_notification( $msg, 'alm_pro_upgrade', 'YEAR_IN_SECONDS', true );
	}
}

/**
 * Display a notification on pages with transients.
 *
 * @param string  $message        The message to display.
 * @param string  $transient_name The transient name.
 * @param string  $duration       The length to store transient.
 * @param boolean $dismissible    Is this dissmissable.
 * @param string  $type           The tpe of notification.
 * @since 4.0
 */
function alm_transient_notification( $message = '', $transient_name = '', $duration = 'YEAR_IN_SECONDS', $dismissible = true, $type = 'info' ) {
	if ( empty( $transient_name ) ) {
		return; // Bail early if transient is empty.
	}
	$transient   = get_transient( $transient_name );
	$dismissible = $dismissible ? ' is-dismissible' : '';
	if ( ! isset( $transient ) || empty( $transient ) && ! empty( $message ) ) {
		?>
	<div class="notice-<?php echo esc_html( $type ); ?> notice<?php echo esc_html( $dismissible ); ?> alm-transient" data-transient="<?php echo esc_html( $transient_name ); ?>" data-duration="<?php echo esc_html( $duration ); ?>">
		<p><?php echo wp_kses_post( $message ); ?></p>
	</div>
		<?php
	}
}

/**
 * Set plugin transient via Ajax.
 *
 * @since 4.0
 */
function alm_set_transient() {
	$data = filter_input_array( INPUT_POST );
	if ( ! current_user_can( 'edit_theme_options' ) || ! isset( $data['nonce'] ) ) {
		wp_die( esc_attr__( 'You don\'t belong here.', 'ajax-load-more' ) ); // Bail early if missing WP capabilities or nonce.
	}
	if ( ! wp_verify_nonce( $data['nonce'], 'alm_repeater_nonce' ) ) {
		wp_die( esc_attr__( 'Error - unable to verify nonce, please try again.', 'ajax-load-more' ) ); // Verify nonce.
	}
	$transient = $data['transient_name'];
	$duration  = ! isset( $data['duration'] ) ? 'YEAR_IN_SECONDS' : $data['duration'];
	if ( $transient ) {
		set_transient( $transient, 'true', constant( $duration ) );
	}
	wp_die();
}
add_action( 'wp_ajax_alm_set_transient', 'alm_set_transient' ); // Set transient.

/**
 * Create Admin Menu.
 *
 * @since 2.0.0
 */
function alm_admin_menu() {
	global $alm_menu_items;
	$before_link     = '<span style="display:block; border-top: 1px solid #555; padding-top: 8px;">';
	$after_link      = '</span>';
	$style_link_icon = 'style="opacity: 0.6; font-size: 18px; height: 18px; width: 18px; position: relative; left: -2px;"';
	$license_title   = has_action( 'alm_pro_installed' ) ? __( 'License', 'ajax-load-more' ) : __( 'Licenses', 'ajax-load-more' );

	add_menu_page(
		'Ajax Load More',
		'Ajax Load More',
		apply_filters( 'alm_user_role', 'edit_theme_options' ),
		'ajax-load-more',
		'alm_settings_page',
		alm_admin_menu_icon_svg()
	);

	// Settings.
	$alm_settings_page = add_submenu_page(
		'ajax-load-more',
		__( 'Settings', 'ajax-load-more' ),
		__( 'Settings', 'ajax-load-more' ),
		apply_filters( 'alm_user_role', 'edit_theme_options' ),
		'ajax-load-more',
		'alm_settings_page'
	);

	// Add to custom admin menu.
	$alm_menu_items[] = [
		'label' => __( 'Settings', 'ajax-load-more' ),
		'slug'  => 'ajax-load-more',
	];

	// Repeater Templates.
	$alm_template_page = add_submenu_page(
		'ajax-load-more',
		__( 'Templates', 'ajax-load-more' ),
		__( 'Templates', 'ajax-load-more' ),
		apply_filters( 'alm_user_role', 'edit_theme_options' ),
		'ajax-load-more-repeaters',
		'alm_repeater_page'
	);

	// Add to custom admin menu.
	$alm_menu_items[] = [
		'label' => __( 'Templates', 'ajax-load-more' ),
		'slug'  => 'ajax-load-more-repeaters',
	];

	// Shortcode Builder.
	$alm_shortcode_page = add_submenu_page(
		'ajax-load-more',
		__( 'Shortcode Builder', 'ajax-load-more' ),
		__( 'Shortcode Builder', 'ajax-load-more' ),
		apply_filters( 'alm_user_role', 'edit_theme_options' ),
		'ajax-load-more-shortcode-builder',
		'alm_shortcode_builder_page'
	);

	// Add to custom admin menu.
	$alm_menu_items[] = [
		'label' => __( 'Shortcode Builder', 'ajax-load-more' ),
		'slug'  => 'ajax-load-more-shortcode-builder',
	];

	// Filters.
	$alm_filters_page = add_submenu_page(
		'ajax-load-more',
		__( 'Filters', 'ajax-load-more' ),
		$before_link . __( 'Filters', 'ajax-load-more' ) . $after_link,
		apply_filters( 'alm_user_role', 'edit_theme_options' ),
		'ajax-load-more-filters',
		'alm_filters_page'
	);

	// Add to custom admin menu.
	$alm_menu_items[] = [
		'label' => __( 'Filters', 'ajax-load-more' ),
		'slug'  => 'ajax-load-more-filters',
	];

	// Cache.
	if ( has_action( 'alm_cache_installed' ) ) {
		$alm_cache_page = add_submenu_page(
			'ajax-load-more',
			__( 'Cache', 'ajax-load-more' ),
			__( 'Cache', 'ajax-load-more' ),
			apply_filters( 'alm_user_role', 'edit_theme_options' ),
			'ajax-load-more-cache',
			'alm_cache_page'
		);
		add_action( 'load-' . $alm_cache_page, 'alm_load_admin_js' );
		add_action( 'load-' . $alm_cache_page, 'alm_load_cache_admin_js' );

		// Add to custom admin menu.
		$alm_menu_items[] = [
			'label' => __( 'Cache', 'ajax-load-more' ),
			'slug'  => 'ajax-load-more-cache',
		];
	}

	// WooCommerce.
	if ( has_action( 'alm_woocommerce_installed' ) && in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) { // phpcs:ignore
		$alm_woocommerce_page = add_submenu_page(
			'ajax-load-more',
			__( 'WooCommerce', 'ajax-load-more' ),
			__( 'WooCommerce', 'ajax-load-more' ),
			apply_filters( 'alm_user_role', 'edit_theme_options' ),
			'ajax-load-more-woocommerce',
			'alm_woocommerce_page'
		);
		add_action( 'load-' . $alm_woocommerce_page, 'alm_load_admin_js' );

		// Add to custom admin menu.
		$alm_menu_items[] = [
			'label' => __( 'WooCommerce', 'ajax-load-more' ),
			'slug'  => 'ajax-load-more-woocommerce',
		];
	}

	// Add-ons.
	if ( ! has_action( 'alm_pro_installed' ) ) {
		// Don't show if Pro activated.
		$alm_addons_page = add_submenu_page(
			'ajax-load-more',
			__( 'Add-ons', 'ajax-load-more' ),
			$before_link . __( 'Add-ons', 'ajax-load-more' ) . $after_link,
			apply_filters( 'alm_user_role', 'edit_theme_options' ),
			'ajax-load-more-add-ons',
			'alm_add_ons_page'
		);

		// Add to custom admin menu.
		$alm_menu_items[] = [
			'label' => __( 'Add-ons', 'ajax-load-more' ),
			'slug'  => 'ajax-load-more-add-ons',
		];
	}

	// Extensions.
	$alm_extensions_page_before = has_action( 'alm_pro_installed' ) ? $before_link : '';
	$alm_extensions_page_after  = has_action( 'alm_pro_installed' ) ? $after_link : '';

	$alm_extensions_page = add_submenu_page(
		'ajax-load-more',
		__( 'Extensions', 'ajax-load-more' ),
		$alm_extensions_page_before . __( 'Extensions', 'ajax-load-more' ) . $alm_extensions_page_after,
		apply_filters( 'alm_user_role', 'edit_theme_options' ),
		'ajax-load-more-extensions',
		'alm_extensions_page'
	);

	// Add to custom admin menu.
	$alm_menu_items[] = [
		'label' => __( 'Extensions', 'ajax-load-more' ),
		'slug'  => 'ajax-load-more-extensions',
	];

	// Pro.
	if ( has_action( 'alm_pro_installed' ) ) {
		$alm_pro_page = add_submenu_page(
			'ajax-load-more',
			__( 'Pro', 'ajax-load-more' ),
			$before_link . '<span class="dashicons dashicons-plus-alt" ' . $style_link_icon . '></span> ' . __( 'Pro', 'ajax-load-more' ) . $after_link,
			apply_filters( 'alm_user_role', 'edit_theme_options' ),
			'ajax-load-more-pro',
			'alm_pro_page'
		);

		// Add to custom admin menu.
		$alm_menu_items[] = [
			'label' => __( 'Pro', 'ajax-load-more' ),
			'slug'  => 'ajax-load-more-pro',
		];
	} else {
		$alm_go_pro_page = add_submenu_page(
			'ajax-load-more',
			__( 'Pro', 'ajax-load-more' ),
			$before_link . '<span class="dashicons dashicons-plus-alt" ' . $style_link_icon . '></span> ' . __( 'Go Pro', 'ajax-load-more' ) . $after_link,
			apply_filters( 'alm_user_role', 'edit_theme_options' ),
			'ajax-load-more-go-pro',
			'alm_go_pro_page'
		);

		// Add to custom admin menu.
		$alm_menu_items[] = [
			'label' => __( 'Go Pro', 'ajax-load-more' ),
			'slug'  => 'ajax-load-more-go-pro',
		];
	}

	// Licenses.
	$alm_licenses_page = add_submenu_page(
		'ajax-load-more',
		$license_title,
		$before_link . $license_title . $after_link,
		apply_filters( 'alm_user_role', 'edit_theme_options' ),
		'ajax-load-more-licenses',
		'alm_licenses_page'
	);

	// Add to custom admin menu.
	$alm_menu_items[] = [
		'label' => $license_title,
		'slug'  => 'ajax-load-more-licenses',
	];

	// Help.
	$alm_help_page = add_submenu_page(
		'ajax-load-more',
		__( 'Help', 'ajax-load-more' ),
		__( 'Help', 'ajax-load-more' ),
		apply_filters( 'alm_user_role', 'edit_theme_options' ),
		'ajax-load-more-help',
		'alm_help_page'
	);

	// Add to custom admin menu.
	$alm_menu_items[] = [
		'label' => __( 'Help', 'ajax-load-more' ),
		'slug'  => 'ajax-load-more-help',
	];

	// Add admin scripts.
	add_action( 'load-' . $alm_settings_page, 'alm_load_admin_js' );
	add_action( 'load-' . $alm_template_page, 'alm_load_admin_js' );
	add_action( 'load-' . $alm_shortcode_page, 'alm_load_admin_js' );
	add_action( 'load-' . $alm_filters_page, 'alm_load_admin_js' );
	add_action( 'load-' . $alm_filters_page, 'alm_load_filters_admin_scripts' );
	add_action( 'load-' . $alm_help_page, 'alm_load_admin_js' );
	// Pro.
	if ( has_action( 'alm_pro_installed' ) ) {
		add_action( 'load-' . $alm_pro_page, 'alm_load_admin_js' );
		add_action( 'load-' . $alm_pro_page, 'alm_load_pro_admin_js' );

	} else {
		add_action( 'load-' . $alm_addons_page, 'alm_load_admin_js' );
		add_action( 'load-' . $alm_go_pro_page, 'alm_load_admin_js' );
	}
	add_action( 'load-' . $alm_extensions_page, 'alm_load_admin_js' );
	add_action( 'load-' . $alm_licenses_page, 'alm_load_admin_js' );
}
add_action( 'admin_menu', 'alm_admin_menu' );

/**
 * Settings page.
 *
 * @since 2.0.0
 */
function alm_settings_page() {
	include_once ALM_PATH . 'admin/views/settings.php';
}

/**
 *  Custom Repeaters.
 *
 *  @since 2.0.0
 */
function alm_repeater_page() {
	include_once ALM_PATH . 'admin/views/repeater-templates.php';
}

/**
 * Shortcode Builder.
 *
 * @since 2.0.0
 */
function alm_shortcode_builder_page() {
	include_once ALM_PATH . 'admin/views/shortcode-builder.php';
}

/**
 * Ajax Load More Add-ons
 *
 * @since 2.0.0
 */
function alm_add_ons_page() {
	include_once ALM_PATH . 'admin/views/add-ons.php';
}

/**
 *  Ajax Load More Extensions
 *
 *  @since 3.0.0
 */
function alm_extensions_page() {
	include_once ALM_PATH . 'admin/views/extensions.php';
}

/**
 *  Ajax Load More Pro.
 *
 *  @since 4.0.0
 */
function alm_go_pro_page() {
	include_once ALM_PATH . 'admin/views/go-pro.php';
}

/**
 * Examples Page
 *
 * @since 2.0.0
 */
function alm_examples_page() {
	include_once ALM_PATH . 'admin/views/examples.php';
}

/**
 * Help Page (Implementation Inforgraphic).
 *
 * @since 2.8.7
 */
function alm_help_page() {
	include_once ALM_PATH . 'admin/views/help.php';
}

/**
 * Ajax Load More Licenses
 *
 * @since 2.7.0
 */
function alm_licenses_page() {
	include_once ALM_PATH . 'admin/views/licenses.php';
}

/**
 *  Cache Add-on page
 *
 *  @since 3.6.0
 */
function alm_pro_page() {
	include_once ALM_PRO_ADMIN_PATH . 'admin/views/pro.php';
}

/**
 * Cache Add-on page
 *
 * @since 2.6.0
 */
function alm_cache_page() {
	if ( defined( 'ALM_CACHE_ADMIN_PATH' ) && file_exists( ALM_CACHE_ADMIN_PATH . 'admin/views/cache.php' ) ) {
		include_once ALM_CACHE_ADMIN_PATH . 'admin/views/cache.php';
	}
}

/**
 *  Filters Add-on page.
 *
 *  @since 3.4.0
 */
function alm_filters_page() {
	if ( has_action( 'alm_filters_installed' ) && defined( 'ALM_FILTERS_PATH' ) && file_exists( ALM_FILTERS_PATH . 'admin/views/filters.php' ) ) {
		if ( ! function_exists( 'alm_list_all_filters' ) ) {
			include_once ALM_FILTERS_PATH . 'admin/functions.php'; // Deprecated: This is now loaded in Filters add-on.
		}
		include_once ALM_FILTERS_PATH . 'admin/views/filters.php';
	} else {
		include_once ALM_PATH . 'admin/views/filters.php';
	}
}

/**
 * WooCommerce Add-on page.
 *
 * @since 5.3.0
 */
function alm_woocommerce_page() {
	if ( defined( 'ALM_WOO_PATH' ) && file_exists( ALM_WOO_PATH . 'admin/views/woocommerce.php' ) ) {
		include_once ALM_WOO_PATH . 'admin/views/woocommerce.php';
	}
}

/**
 * Load Admin JS
 *
 * @since 2.0.15
 */
function alm_load_admin_js() {
	add_action( 'admin_enqueue_scripts', 'alm_enqueue_admin_scripts' );
}

/**
 * Load Pro add-on scripts.
 *
 * @return void
 */
function alm_load_pro_admin_js() {
	if ( class_exists( 'ALMPro' ) ) {
		ALMPro::alm_enqueue_pro_admin_scripts();
	}
}
/**
 * Load Cache add-on scripts.
 *
 * @return void
 */
function alm_load_cache_admin_js() {
	if ( class_exists( 'ALMCache' ) ) {
		ALMCache::alm_enqueue_cache_admin_scripts();
	}
}

/**
 * Load Filters add-on scripts.
 *
 * @return void
 */
function alm_load_filters_admin_scripts() {
	if ( class_exists( 'ALMFilters' ) ) {
		ALMFilters::alm_enqueue_filters_admin_scripts();
	}
}

/**
 * Enqueue ALM admin CSS & JS.
 *
 * @since 2.0.15
 */
function alm_enqueue_admin_scripts() {
	// Admin CSS.
	wp_enqueue_style( 'alm-admin', ALM_URL . '/build/admin/index.css', '', ALM_VERSION );
	wp_enqueue_style( 'alm-core', ALM_URL . '/build/frontend/ajax-load-more.css', '', ALM_VERSION );

	wp_dequeue_style( 'acf-input' ); // Dequeue ACF select2 on ALM pages.
	wp_dequeue_style( 'sbi_tooltipster' ); // Dequeue external ToolTipster on ALM pages.
	wp_dequeue_script( 'sbi_tooltipster' );

	// CodeMirror Syntax Highlighting if on Repater Template page.
	$screen = get_current_screen();
	if ( in_array( $screen->id, [ 'ajax-load-more_page_ajax-load-more-repeaters' ], true ) ) {
		// CodeMirror CSS.
		wp_enqueue_style( 'alm-codemirror-css', ALM_ADMIN_URL . 'codemirror/lib/codemirror.css', '', ALM_VERSION );

		// CodeMirror JS.
		wp_enqueue_script( 'alm-codemirror', ALM_ADMIN_URL . 'codemirror/lib/codemirror.js', '', ALM_VERSION, false );
		wp_enqueue_script( 'alm-codemirror-matchbrackets', ALM_ADMIN_URL . 'codemirror/addon/edit/matchbrackets.js', '', ALM_VERSION, false );
		wp_enqueue_script( 'alm-codemirror-htmlmixed', ALM_ADMIN_URL . 'codemirror/mode/htmlmixed/htmlmixed.js', '', ALM_VERSION, false );
		wp_enqueue_script( 'alm-codemirror-xml', ALM_ADMIN_URL . 'codemirror/mode/xml/xml.js', '', ALM_VERSION, false );
		wp_enqueue_script( 'alm-codemirror-javascript', ALM_ADMIN_URL . 'codemirror/mode/javascript/javascript.js', '', ALM_VERSION, false );
		wp_enqueue_script( 'alm-codemirror-mode-css', ALM_ADMIN_URL . 'codemirror/mode/css/css.js', '', ALM_VERSION, false );
		wp_enqueue_script( 'alm-codemirror-clike', ALM_ADMIN_URL . 'codemirror/mode/clike/clike.js', '', ALM_VERSION, false );
		wp_enqueue_script( 'alm-codemirror-php', ALM_ADMIN_URL . 'codemirror/mode/php/php.js', '', ALM_VERSION, false );
	}

	// Admin JS.
	wp_enqueue_script( 'jquery-form' );
	wp_enqueue_script( 'alm-admin', ALM_URL . '/build/admin/index.js', [ 'jquery' ], ALM_VERSION, false );
	wp_enqueue_script( 'alm-shortcode-builder', ALM_ADMIN_URL . 'shortcode-builder/js/shortcode-builder.js', [ 'jquery' ], ALM_VERSION, false );

	// Localized JS variables.
	wp_localize_script(
		'alm-admin',
		'alm_admin_localize',
		[
			'ajax_admin_url'   => admin_url( 'admin-ajax.php' ),
			'ajax_load_more'   => __( 'Ajax Load More', 'ajax-load-more' ),
			'active'           => __( 'Active', 'ajax-load-more' ),
			'inactive'         => __( 'Inactive', 'ajax-load-more' ),
			'applying_layout'  => __( 'Applying Layout', 'ajax-load-more' ),
			'template_updated' => __( 'Template Updated', 'ajax-load-more' ),
			'alm_admin_nonce'  => wp_create_nonce( 'alm_repeater_nonce' ),
			'select_authors'   => __( 'Select Author(s)', 'ajax-load-more' ),
			'select_cats'      => __( 'Select Categories', 'ajax-load-more' ),
			'select_tags'      => __( 'Select Tags', 'ajax-load-more' ),
			'select'           => __( 'Select', 'ajax-load-more' ),
			'jump_to_option'   => __( 'Jump to Option', 'ajax-load-more' ),
			'jump_to_template' => __( 'Jump to Template', 'ajax-load-more' ),
			'install_now'      => __( 'Are you sure you want to install this Ajax Load More extension?', 'ajax-load-more' ),
			'install_btn'      => __( 'Install Now', 'ajax-load-more' ),
			'activate_btn'     => __( 'Activate', 'ajax-load-more' ),
			'settings_saving'  => '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> ' . __( 'Saving Settings', 'ajax-load-more' ),
			'settings_saved'   => '<i class="fa fa-check" aria-hidden="true"></i> ' . __( 'Settings Saved Successfully', 'ajax-load-more' ),
			'settings_error'   => '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' . __( 'Error Saving Settings', 'ajax-load-more' ),
			'shortcode_max'    => __( 'There is a maximum of 3 tax_query objects while using the shortcode builder', 'ajax-load-more' ),
			'restapi'          => [
				'url'       => function_exists( 'get_rest_url' ) ? get_rest_url() : '',
				'namespace' => ALM_REST_NAMESPACE,
			],
		]
	);
}

/**
 * Get taxonomy terms for shortcode builder and return HTML markup.
 *
 * @since 2.1.0
 */
function alm_get_tax_terms() {
	$form_data = filter_input_array( INPUT_GET );

	if ( ! current_user_can( 'edit_theme_options' ) || ! isset( $form_data['nonce'] ) ) {
		wp_die( esc_attr__( 'You don\'t belong here.', 'ajax-load-more' ) ); // Bail early if missing WP capabilities or nonce.
	}

	if ( ! wp_verify_nonce( $form_data['nonce'], 'alm_repeater_nonce' ) ) {
		wp_die( esc_attr__( 'Error - unable to verify nonce, please try again.', 'ajax-load-more' ) ); // Verify nonce.
	}

	$taxonomy = isset( $form_data['taxonomy'] ) ? esc_attr( $form_data['taxonomy'] ) : '';
	$index    = isset( $form_data['index'] ) ? esc_attr( $form_data['index'] ) : '1';
	$tax_args = [
		'taxonomy'   => $taxonomy,
		'orderby'    => 'name',
		'order'      => 'ASC',
		'hide_empty' => false,
	];

	$terms = get_terms( $tax_args );
	$value = '';
	if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
		$value .= '<ul>';
		foreach ( $terms as $term ) {
			$value .= '<li><input type="checkbox" class="alm_element" name="tax-term-' . $term->slug . '" id="tax-term-' . $term->slug . '-' . $index . '" data-type="' . $term->slug . '">';
			$value .= '<label for="tax-term-' . $term->slug . '-' . $index . '">' . $term->name . '</label>';
			$value .= '</li>';
		}
		$value .= '</ul>';
		echo $value; // phpcs:ignore
		wp_die();
	} else {
		echo '<p class="warning">' . __( 'No terms exist within this taxonomy', 'ajax-load-more' ) . '</p>';
		wp_die();
	}
}
add_action( 'wp_ajax_alm_get_tax_terms', 'alm_get_tax_terms' );

/**
 * Returns a base64 URL for the svg for use in the menu.
 *
 * @param bool $base64 Whether or not to return base64'd output.
 * @return string SVG icon.
 */
function alm_admin_menu_icon_svg( $base64 = true ) {
	$svg  = '<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">';
	$svg .= '<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58172 0 0 3.58172 0 8V72C0 76.4183 3.58172 80 8 80H72C76.4183 80 80 76.4183 80 72V8C80 3.58172 76.4183 0 72 0H8ZM33.585 59H20V56.91C20.5867 56.5433 21.2192 56.2225 21.8975 55.9475C22.5758 55.6725 23.245 55.4617 23.905 55.315L38.095 19.84H42.165L55.97 55.315C56.7033 55.4617 57.4367 55.6725 58.17 55.9475C58.9033 56.2225 59.545 56.5433 60.095 56.91V59H42.88V56.91C43.5767 56.58 44.3283 56.2683 45.135 55.975C45.9417 55.6817 46.7117 55.4617 47.445 55.315L44.255 46.57H32.045L28.8 55.315C30.4867 55.535 32.0817 56.0667 33.585 56.91V59ZM43.1 42.995L38.2325 28.3232L33.365 42.995H43.1Z" fill="#a7aaad"/>';
	$svg .= '</svg>';

	if ( $base64 ) {
		//phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- This encoding is intended.
		return 'data:image/svg+xml;base64,' . base64_encode( $svg );
	}
	return $svg;
}

/**
 * Filter the WP Admin footer text only on ALM pages
 *
 * @param string $text The footer display text.
 * @since 2.12.0
 */
function alm_filter_admin_footer_text( $text ) {
	if ( ! alm_is_admin_screen() ) {
		return $text;
	}

	$text = '<strong>Ajax Load More</strong> is made with <span style="color: #e25555;">♥</span> by <a href="https://connekthq.com" target="_blank" style="font-weight: 500;">Connekt</a> | <a href="https://wordpress.org/support/plugin/ajax-load-more/reviews/" target="_blank" style="font-weight: 500;">Leave a Review</a> | <a href="https://connekthq.com/plugins/ajax-load-more/support/" target="_blank" style="font-weight: 500;">Get Support</a>';
	if ( ! has_action( 'alm_pro_installed' ) ) {
		$text .= ' | <a href="https://connekthq.com/plugins/ajax-load-more/pro/" target="_blank" style="font-weight: 500;">Go Pro</a>';
	}
	return wp_kses_post( $text );
}
add_filter( 'admin_footer_text', 'alm_filter_admin_footer_text' ); // Admin menu text.
