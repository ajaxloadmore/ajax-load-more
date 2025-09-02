<?php
/**
 * ALM Query functions.
 *
 * @package AjaxLoadMore
 * @since 7.5
 */

use Elementor\Core\Logger\Items\PHP;

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
		// Default WP_Query.
		$query = new WP_Query( $args );
		return $fields === 'ids' ? $query->posts : $query;
	}

	if ( alm_use_search( $args ) ) {
		// ALM Search Query.
		$results          = new ALM_Search_Query( $args, true );
		$args['post__in'] = $results->posts;
		$args['orderby']  = 'post__in';
	}

	// Run WP_Query.
	$query = new WP_Query( $args );
	return $fields === 'ids' ? $query->posts : $query;
}

/**
 * Check if search should be performed using the ALM_Search_Query class.
 *
 * @param array $args Query args.
 * @return boolean
 */
function alm_use_search( $args = [] ) {
	$search = isset( $args['s'] ) && ! empty( $args['s'] );

	if ( empty( $args ) || ! $search || ! class_exists( 'ALM_Search_Query' ) ) {
		return false; // Bail early if missing args or ALM_Search_Query doesn't exist.
	}

	// Get the search engine.
	$engine = isset( $args['engine'] ) && ! empty( $args['engine'] );
	return $search && $engine ? true : false; // Return true if search and engine is set.
}
