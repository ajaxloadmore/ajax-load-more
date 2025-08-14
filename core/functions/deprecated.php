<?php
/**
 * Deprecated functions for Ajax Load More.
 *
 * @package AjaxLoadMore
 */

/**
 * Query by custom taxonomy values.
 *
 * @since 2.5.0
 * @deprecated in 2.5.0
 * @return array
 */
function alm_get_taxonomy( $taxonomy, $taxonomy_terms, $taxonomy_operator ) {
	if ( ! empty( $taxonomy ) && ! empty( $taxonomy_terms ) && ! empty( $taxonomy_operator ) ) {
		$the_terms = explode( ',', $taxonomy_terms );
		$args      = array(
			'taxonomy' => $taxonomy,
			'field'    => 'slug',
			'terms'    => $the_terms,
			'operator' => $taxonomy_operator,
		);
		return $args;
	}
}

/**
 * Query by custom taxonomy values.
 *
 * @since 2.5.0
 * @deprecated in 2.8.5
 * @return array
 */
function alm_get_tax_query( $post_format, $taxonomy, $taxonomy_terms, $taxonomy_operator ) {

	// Taxonomy.
	if ( ! empty( $taxonomy ) && ! empty( $taxonomy_terms ) && ! empty( $taxonomy_operator ) && empty( $post_format ) ) {
		$the_terms = explode( ',', $taxonomy_terms );
		$args      = array(
			'taxonomy' => $taxonomy,
			'field'    => 'slug',
			'terms'    => $the_terms,
			'operator' => $taxonomy_operator,
		);
		return $args;
	}

	// Post Format.
	if ( ! empty( $post_format ) && empty( $taxonomy ) ) {
		$format = "post-format-$post_format";

		// If query is for standard then we need to filter by NOT IN
		if ( $format == 'post-format-standard' ) {
			if ( ( $post_formats = get_theme_support( 'post-formats' ) ) && is_array( $post_formats[0] ) && count( $post_formats[0] ) ) {
				  $terms = array();
				foreach ( $post_formats[0] as $format ) {
					$terms[] = 'post-format-' . $format;
				}
			}
			$args = array(
				'taxonomy' => 'post_format',
				'terms'    => $terms,
				'field'    => 'slug',
				'operator' => 'NOT IN',
			);
		} else {
			$args = array(
				'taxonomy' => 'post_format',
				'field'    => 'slug',
				'terms'    => array( $format ),
			);
		}
		return $args;
	}

	// Taxonomy && Post Format.
	if ( ! empty( $post_format ) && ! empty( $taxonomy ) && ! empty( $taxonomy_terms ) && ! empty( $taxonomy_operator ) ) {
		$the_terms = explode( ',', $taxonomy_terms );
		$args      = array(
			'taxonomy' => $taxonomy,
			'field'    => 'slug',
			'terms'    => $the_terms,
			'operator' => $taxonomy_operator,
		);
		$format    = "post-format-$post_format";
		// If query is for standard then we need to filter by NOT IN.
		if ( $format == 'post-format-standard' ) {
			if ( ( $post_formats = get_theme_support( 'post-formats' ) ) && is_array( $post_formats[0] ) && count( $post_formats[0] ) ) {
				  $terms = array();
				foreach ( $post_formats[0] as $format ) {
					$terms[] = 'post-format-' . $format;
				}
			}
			$format_args = array(
				'taxonomy' => 'post_format',
				'terms'    => $terms,
				'field'    => 'slug',
				'operator' => 'NOT IN',
			);
		} else {
			$format_args = array(
				'taxonomy' => 'post_format',
				'field'    => 'slug',
				'terms'    => array( $format ),
			);
		}
		$args[] = $format_args; // Combined format and tax $args
		return $args;
	}
}
