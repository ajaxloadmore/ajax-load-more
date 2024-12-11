<?php
/**
 * Ajax Load More Block Render
 *
 * @package AjaxLoadMore
 */

$shortcode = $attributes['shortcode'];

if ( $shortcode ) {
	echo do_shortcode( $shortcode );

	// Query Loop.
	$query_id = isset( $block->context['queryId'] ) ? $block->context['queryId'] : '';
	if ( $query_id && class_exists( 'ALM_QUERY_LOOP' ) ) {
		echo ALM_QUERY_LOOP::alm_query_loop_config( $query_id, $attributes, $block );
	}

} else {
	// Block editor display messages.
	ALM_BLOCK::alm_block_editor_message(
		__( 'Ajax Load More', 'ajax-load-more' ),
		__( 'You must enter an Ajax Load More shortcode.', 'ajax-load-more' )
	);
}
