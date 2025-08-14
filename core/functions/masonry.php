<?php
/**
 * Functions related to Masonry integration.
 *
 * @package AjaxLoadMore
 */

/**
 * Masonry HTML wrapper open.
 *
 * @param string $transition Transition type.
 * @return string            Raw HTML.
 * @since 3.1.0
 */
function alm_masonry_before( $transition ) {
	return $transition === 'masonry' ? '<div class="alm-masonry" style="opacity: 0;">' : '';
}
add_filter( 'alm_masonry_before', 'alm_masonry_before' );

/**
 * Masonry HTML wrapper close.
 *
 * @param string $transition Transition type.
 * @return string            Raw HTML.
 * @since 3.1.0
 */
function alm_masonry_after( $transition ) {
	return $transition === 'masonry' ? '</div>' : '';
}
add_filter( 'alm_masonry_after', 'alm_masonry_after' );
