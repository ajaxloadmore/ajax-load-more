<?php
/**
 * ALM admin helpers.
 *
 * @package  AjaxLoadMore
 * @since    2.0.0
 */

/**
 * Determine whether user is on an ALM admin screen.
 *
 * @return boolean
 * @since 2.12.0
 */
function alm_is_admin_screen() {
	$screen = get_current_screen();
	return $screen && $screen->parent_base === 'ajax-load-more';
}

/**
 * Does user have an add-ons for shortcode builder installed and activated?
 *
 * @return boolean
 * @since 2.13.0.1
 */
function alm_has_addon_shortcodes() {
	$installed = false;
	$actions   = [
		'alm_cache_installed',
		'alm_cta_installed',
		'alm_filters_installed',
		'alm_comments_installed',
		'alm_nextpage_installed',
		'alm_preload_installed',
		'alm_paging_installed',
		'alm_prev_post_installed',
		'alm_seo_installed',
		'alm_single_post_installed',
		'alm_users_installed',
	];

	// Loop actions to determine if add-on/extension is installed.
	foreach ( $actions as $action ) {
		if ( has_action( $action ) ) {
			$installed = true;
		}
	}

	if ( $installed ) {
		return true;
	} else {
		return false;
	}
}

/**
 * Does user have an extensions for shortcode builder installed and activated?
 *
 * @return boolean
 * @since 5.4
 */
function alm_has_extension_shortcodes() {
	$installed = false;
	$actions   = [
		'alm_acf_installed',
		'alm_rest_api_installed',
		'alm_terms_installed',
		'alm_users_installed',
	];

	// Loop actions to determine if add-on/extension is installed.
	foreach ( $actions as $action ) {
		if ( has_action( $action ) ) {
			$installed = true;
		}
	}
	return $installed ? true : false;
}

/**
 * Check if any add-on installed and activated.
 * Note: Used on the license screen.
 *
 * @return boolean
 * @since 2.13.0
 * @deprecated 3.3.0
 */
function alm_has_addon() {
	if ( has_action( 'alm_cta_installed' ) || has_action( 'alm_comments_installed' ) || has_action( 'alm_unlimited_installed' ) || has_action( 'alm_layouts_installed' ) || has_action( 'alm_nextpage_installed' ) || has_action( 'alm_preload_installed' ) || has_action( 'alm_paging_installed' ) || has_action( 'alm_prev_post_installed' ) || has_action( 'alm_single_post_installed' ) || has_action( 'alm_rest_api_installed' ) || has_action( 'alm_seo_installed' ) || has_action( 'alm_theme_repeaters_installed' ) ) {
		return true;
	} else {
		return false;
	}
}

/**
 * Render a CTA status icon.
 *
 * @param string $status The status of the message.
 * @param string $label  The text of the message.
 * @param string $title  The title for the element.
 * @return string
 */
function alm_status_icon( $status = 'success', $label = '', $title = '' ) {
	$html = '<div class="alm-status ' . $status . '" title="' . $title . '">';
	switch ( $status ) {
		case 'success':
			$html .= '<span><i class="fa fa-check"></i></span>';
			break;
		case 'failed':
			$html .= '<span><i class="fa fa-exclamation"></i></span>';
			break;
		case 'warning':
			$html .= '<span><i class="fa fa-exclamation-triangle"></i></span>';
			break;
	}
	$html .= $label ? '<span>' . $label . '</span>' : '';
	$html .= '</div>';
	return $html;
}
