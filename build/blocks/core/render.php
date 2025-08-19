<?php
/**
 * Ajax Load More Block Render
 *
 * @package AjaxLoadMore
 */

$shortcode = $attributes['shortcode'];

if ( $shortcode ) {
	echo do_shortcode( $shortcode );

	// Query Loop support.
	if ( isset( $block ) && class_exists( 'ALM_QUERY_LOOP' ) ) {
		$query_id = '';
		if ( isset( $block->context['queryId'] ) && $block->context['queryId'] ) {
			$query_id = $block->context['queryId'] ?? '';
		} elseif ( alm_is_block_editor() && isset( $_GET['queryId'] ) ) {
			// Block editor fix, retrieve queryId from the request.
			$query_id = sanitize_text_field( wp_unslash( $_GET['queryId'] ) );
		}
		if ( $query_id ) {
			echo ALM_QUERY_LOOP::alm_query_loop_config( $query_id, $attributes, $block );
		}
	}
} else {
	// Block editor display messages.
	ALM_BLOCK::alm_block_editor_message(
		__( 'Ajax Load More', 'ajax-load-more' ),
		__( 'You must enter an Ajax Load More shortcode.', 'ajax-load-more' )
	);
}
