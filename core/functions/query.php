<?php
/**
 * ALM Query functions.
 *
 * @package AjaxLoadMore
 * @since 7.5
 */

/**
 * Dispatch query based on args.
 * Note: This function is used to determine if a standard WP_Query or a ALM_Search_Query should be used.
 *
 * @param array $args Query args.
 * @return mixed
 */
function alm_do_query( $args = [], $fields = 'all' ) {
	$search = isset( $args['s'] ) && ! empty( $args['s'] );

	if ( ! $search ) {
		// Run default WP_Query when no search term.
		$query = new WP_Query( $args );
		return $fields === 'ids' ? $query->posts : $query;
	}

	if ( use_alm_search( $args ) ) {
		// Return ALM_Search_Query if search is being performed.
		$query = new ALM_Search_Query( $args );
	} else {
		// Fallback to a WP_Query.
		$query = new WP_Query( $args );
	}
	return $fields === 'ids' ? $query->posts : $query;
}

/**
 * Check if search should be performed using the ALM_Search_Query class.
 *
 * @param array $args Query args.
 * @return boolean
 */
function use_alm_search( $args = [] ) {
	$search = isset( $args['s'] ) && ! empty( $args['s'] );

	if ( empty( $args ) || ! $search || ! class_exists( 'ALM_Search_Query' ) ) {
		return false; // Bail early if no args or ALM_Search_Query doesn't exist.
	}

	$engine = isset( $args['engine'] ) && ! empty( $args['engine'] );
	return $search && $engine; // Return true if search and engine is set.
}
