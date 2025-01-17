<?php
/**
 * Get preloaded posts and append to alm object.
 *
 * @package ajaxloadmore
 * @since 2.0
 */

// Initial vars.
$preloaded_output = '';
$preload_offset   = $offset;

/**
 * Paging Add-on.
 * Set $preloaded_amount to $posts_per_page.
 */
if ( $paging === 'true' ) {
	$preload_offset = $query_args['paged'] > 1 ? $preloaded_amount * ( $query_args['paged'] - 1 ) : $preload_offset;
}

/**
 * CTA Add-on.Paging Add-on.
 * Parse $cta_position.
 */
if ( $cta ) {
	$cta_pos_array = explode( ':', $cta_position );
	$cta_pos       = (string) $cta_pos_array[0];
	$cta_val       = (string) $cta_pos_array[1];
	if ( $cta_pos !== 'after' ) {
		$cta_pos = 'before';
	}
}

// Modify $query_args with new offset and posts_per_page.
$query_args['offset']         = $preload_offset;
$query_args['posts_per_page'] = $preloaded_amount;

if ( $comments ) {
	/**
	 * Comments Add-on.
	 */

	if ( has_action( 'alm_comments_installed' ) && $comments ) {
		/**
		 * Preloaded Comments Filter.
		 *
		 * @return void
		 */
		$preloaded_comments = apply_filters( 'alm_comments_preloaded', $query_args ); // located in comments add-on

		// Count the comments.
		$total_comments = wp_count_comments( $comments_post_id ? $comments_post_id : $post_id );

		// Add localized ALM JS variables.
		ALM_LOCALIZE::add_localized_var( 'total_posts', $total_comments->approved, $localize_id );

		$post_count = $total_comments->approved > $preloaded_amount ? $preloaded_amount : $total_comments->approved;
		ALM_LOCALIZE::add_localized_var( 'post_count', $post_count, $localize_id );

		$preloaded_output .= $preloaded_comments;
	}
} elseif ( $users ) {
	/**
	 * Users Extension.
	 */

	if ( has_action( 'alm_users_preloaded' ) && $users ) {

		// Encrypt User Role.
		if ( ! empty( $users_role ) && function_exists( 'alm_role_encrypt' ) ) {
			$query_args['users_role'] = alm_role_encrypt( $users_role );
		}

		/**
		 * Preloaded Users Filter.
		 *
		 * @return void
		 */
		$preloaded_users = apply_filters( 'alm_users_preloaded', $query_args, $preloaded_amount, $repeater, $theme_repeater ); // located in Users add-on

		$preloaded_users_data  = $preloaded_users['data'];
		$preloaded_users_total = $preloaded_users['total'];

		// Add localized ALM JS variables.
		ALM_LOCALIZE::add_localized_var( 'total_posts', $preloaded_users_total, $localize_id );

		// Add post_count to localized ALM JS variables.
		$post_count = $preloaded_users_total > $preloaded_amount ? $preloaded_amount : $preloaded_users_total;
		ALM_LOCALIZE::add_localized_var( 'post_count', $post_count, $localize_id );

		// Append content.
		$preloaded_output .= $preloaded_users_data;
	}
} elseif ( $term_query ) {
	/**
	 * Term Query Extension.
	 */

	if ( has_action( 'alm_terms_preloaded' ) && $term_query ) {
		/**
		 * Preloaded Terms Filter.
		 *
		 * @return void
		 */
		$preloaded_terms = apply_filters( 'alm_terms_preloaded', $query_args, $preloaded_amount, $repeater, $theme_repeater ); // located in Terms extension.

		$preloaded_terms_data  = $preloaded_terms['data'];
		$preloaded_terms_total = $preloaded_terms['total'];

		// Add localized ALM JS variables.
		ALM_LOCALIZE::add_localized_var( 'total_posts', $preloaded_terms_total, $localize_id );

		// Add post_count to localized ALM JS variables.
		$post_count = $preloaded_terms_total > $preloaded_amount ? $preloaded_amount : $preloaded_terms_total;
		ALM_LOCALIZE::add_localized_var( 'post_count', $post_count, $localize_id );

		$preloaded_output .= $preloaded_terms_data;
	}
} elseif ( $acf && $acf_field_type !== 'relationship' ) {
	/**
	 * ACF Extension - Repeater, Gallery, Flexible Content
	 */

	if ( has_action( 'alm_acf_installed' ) && $acf ) {
		/**
		 * Preloaded ACF Filter.
		 *
		 * @return void
		 */
		$preloaded_acf = apply_filters( 'alm_acf_preloaded', $query_args, $repeater, $theme_repeater ); // located in ACF add-on

		// Add total_posts to localized ALM JS variables.
		$acf_total_rows = apply_filters( 'alm_acf_total_rows', $query_args );
		ALM_LOCALIZE::add_localized_var( 'total_posts', $acf_total_rows, $localize_id );

		// Add post_count to localized ALM JS variables.
		$post_count = $acf_total_rows > $preloaded_amount ? $preloaded_amount : $acf_total_rows;
		ALM_LOCALIZE::add_localized_var( 'post_count', $post_count, $localize_id );

		$preloaded_output .= $preloaded_acf;
	}
} else {
	/**
	 * Standard Ajax Load More.
	 */

	/**
	 * This function will return an $args array for the ALM WP_Query.
	 *
	 * @return array
	 */
	if ( class_exists( 'ALM_QUERY_ARGS' ) ) {
		$args = ALM_QUERY_ARGS::alm_build_queryargs( $query_args, false );
	}

	/**
	 * ALM Core Filter Hook.
	 *
	 * @return array
	 * @deprecated 2.10
	 */
	$args = apply_filters( 'alm_modify_query_args', $args, $slug );

	/**
	 * ALM Core Filter Hook.
	 *
	 * @return array
	 */
	$args = apply_filters( 'alm_query_args_' . $id, $args, $post_id );

	/**
	 *  WP_Query
	 *
	 * @return WP_Query
	 */
	$alm_preload_query = new WP_Query( $args );

	/**
	 * ALM Core Filter Hook to modify the returned query.
	 *
	 * @return WP_Query;
	 */
	$alm_preload_query = apply_filters( 'alm_query_after_' . $id, $alm_preload_query, $post_id );

	$alm_total_posts = $alm_preload_query->found_posts - $offset;
	$alm_post_count  = $alm_preload_query->post_count;
	$output          = '';

	if ( $alm_preload_query->have_posts() ) :
		$alm_item        = 0;
		$alm_page        = 0;
		$alm_current     = 0;
		$alm_found_posts = $alm_total_posts;

		while ( $alm_preload_query->have_posts() ) :
			$alm_preload_query->the_post();

			++$alm_item;
			++$alm_current;

			// Call to Action [Before].
			if ( $cta === 'true' && has_action( 'alm_cta_inc' ) && $cta_pos === 'before' ) {
				$output .= (string) $alm_current === (string) $cta_val ? apply_filters( 'alm_cta_inc', $cta_repeater, $cta_theme_repeater, $alm_found_posts, $alm_page, $alm_item, $alm_current, true, $args ) : '';
			}

			// Repeater Template.
			$output .= alm_loop( $repeater, $theme_repeater, $alm_found_posts, $alm_page, $alm_item, $alm_current, $args );

			// Call to Action [After].
			if ( $cta === 'true' && has_action( 'alm_cta_inc' ) && $cta_pos === 'after' ) {
				$output .= (string) $alm_current === (string) $cta_val ? apply_filters( 'alm_cta_inc', $cta_repeater, $cta_theme_repeater, $alm_found_posts, $alm_page, $alm_item, $alm_current, true, $args ) : '';
			}

		endwhile;
		wp_reset_query(); // phpcs:ignore WordPress.WP.DiscouragedFunctions.wp_reset_query_wp_reset_query

		/**
		 * SEO & Filters.
		 * Create <noscript/> pagination of current query.
		 *
		 * ALM Core Filter Hook
		 *
		 * @return html;
		 */
		if ( has_action( 'alm_seo_installed' ) && $seo === 'true' || $filters ) {
			if ( ! apply_filters( 'alm_disable_noscript_' . $id, false ) ) {
				$noscript_pagingnav = apply_filters( 'alm_noscript_pagination', $alm_preload_query, $filters );
			}
		}

	endif;

	// Add localized ALM JS variables.
	ALM_LOCALIZE::add_localized_var( 'total_posts', $alm_total_posts, $localize_id );
	ALM_LOCALIZE::add_localized_var( 'post_count', $alm_post_count, $localize_id );
	ALM_LOCALIZE::add_localized_var( 'page', $query_args['paged'], $localize_id );
	ALM_LOCALIZE::add_localized_var( 'pages', ceil( $alm_total_posts / $posts_per_page ), $localize_id );

	// Get Filter Facets.
	if ( $filters && $facets && function_exists( 'alm_filters_get_facets' ) && ! empty( $target ) ) {
		ALM_LOCALIZE::add_localized_var( 'facets', alm_filters_get_facets( $args, $target ), $localize_id );
	}
	$preloaded_output .= $output;
}

// Add Preloaded data to $ajaxloadmore object.
$ajaxloadmore .= $preloaded_output;
