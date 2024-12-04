<?php
/**
 * Ajax Load More Block Render
 *
 * @package AjaxLoadMore
 */

$shortcode = $attributes['shortcode'];

if ( $shortcode ) {
	echo do_shortcode( $shortcode );

} else {
	// Block editor display messages.
	ALM_BLOCK::alm_block_editor_message(
		__( 'Ajax Load More', 'ajax-load-more' ),
		__( 'You must enter an Ajax Load More shortcode.', 'ajax-load-more' )
	);
}
