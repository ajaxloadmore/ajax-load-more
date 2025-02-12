<?php
/**
 * Generate args that pass into the ALM WP_Query.
 *
 * @package  AjaxLoadMore
 * @since    3.7
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ALM_QUERY_ARGS' ) ) :
	/**
	 * Initiate the class.
	 */
	class ALM_QUERY_ARGS {

		/**
		 * This function will return a generated $args array.
		 *
		 * @param array   $a The query param array.
		 * @param Boolean $is_ajax Is this an ajax request or server side.
		 * @return array Query constructed arags.
		 */
		public static function alm_build_queryargs( $a, $is_ajax = true ) {
			// ID.
			$id = isset( $a['id'] ) ? $a['id'] : '';

			// Post ID.
			$post_id = isset( $a['post_id'] ) ? $a['post_id'] : '';

			// Filters.
			$facets = isset( $a['facets'] ) && $a['facets'] === 'true' ? true : false;

			// Posts Per Page.
			$posts_per_page = isset( $a['posts_per_page'] ) ? $a['posts_per_page'] : 5;

			// Post Type.
			if ( $is_ajax ) {
				$post_type = isset( $a['post_type'] ) ? explode( ',', $a['post_type'] ) : 'post';
			} else {
				$post_type = explode( ',', $a['post_type'] );
			}

			// Format.
			$post_format = ( isset( $a['post_format'] ) ) ? $a['post_format'] : '';

			// Category.
			$category         = isset( $a['category'] ) ? $a['category'] : '';
			$category__and    = isset( $a['category__and'] ) ? $a['category__and'] : '';
			$category__not_in = isset( $a['category__not_in'] ) ? $a['category__not_in'] : '';

			// Tags.
			$tag         = isset( $a['tag'] ) ? $a['tag'] : '';
			$tag__and    = isset( $a['tag__and'] ) ? $a['tag__and'] : '';
			$tag__not_in = isset( $a['tag__not_in'] ) ? $a['tag__not_in'] : '';

			// Taxonomy.
			$taxonomy          = isset( $a['taxonomy'] ) ? $a['taxonomy'] : '';
			$taxonomy_terms    = isset( $a['taxonomy_terms'] ) ? $a['taxonomy_terms'] : '';
			$taxonomy_operator = isset( $a['taxonomy_operator'] ) ? $a['taxonomy_operator'] : '';
			$taxonomy_operator = empty( $taxonomy_operator ) ? 'IN' : $taxonomy_operator;
			$taxonomy_children = isset( $a['taxonomy_include_children'] ) ? $a['taxonomy_include_children'] : '';
			$taxonomy_children = empty( $taxonomy_children ) ? true : $taxonomy_children;

			$taxonomy_relation = isset( $a['taxonomy_relation'] ) ? $a['taxonomy_relation'] : 'AND';
			$taxonomy_relation = empty( $taxonomy_relation ) || $facets ? 'AND' : $taxonomy_relation;

			// Date.
			$year  = isset( $a['year'] ) ? $a['year'] : '';
			$month = isset( $a['month'] ) ? $a['month'] : '';
			$day   = isset( $a['day'] ) ? $a['day'] : '';

			// Meta/Custom Fields.
			$sort_key     = isset( $a['sort_key'] ) ? $a['sort_key'] : '';
			$meta_key     = isset( $a['meta_key'] ) ? $a['meta_key'] : '';
			$meta_value   = isset( $a['meta_value'] ) ? $a['meta_value'] : '';
			$meta_compare = isset( $a['meta_compare'] ) ? $a['meta_compare'] : '';
			$meta_compare = empty( $meta_compare ) ? 'IN' : $meta_compare;

			$meta_type = isset( $a['meta_type'] ) ? $a['meta_type'] : '';
			$meta_type = empty( $meta_type ) ? 'CHAR' : $meta_type;

			$meta_relation = isset( $a['meta_relation'] ) ? $a['meta_relation'] : '';
			$meta_relation = empty( $meta_relation ) || $facets ? 'AND' : $meta_relation;

			// Date Query.
			$date_query           = isset( $a['date_query'] ) ? $a['date_query'] : '';
			$date_query_before    = isset( $a['date_query_before'] ) ? $a['date_query_before'] : '';
			$date_query_after     = isset( $a['date_query_after'] ) ? $a['date_query_after'] : '';
			$date_query_inclusive = isset( $a['date_query_inclusive'] ) ? $a['date_query_inclusive'] : '';
			$date_query_column    = isset( $a['date_query_column'] ) ? $a['date_query_column'] : '';
			$date_query_compare   = isset( $a['date_query_compare'] ) ? $a['date_query_compare'] : '';
			$date_query_relation  = isset( $a['date_query_relation'] ) ? $a['date_query_relation'] : '';

			// Search.
			$s = isset( $a['search'] ) ? $a['search'] : '';

			// Custom Args.
			$custom_args = isset( $a['custom_args'] ) ? $a['custom_args'] : '';

			// Custom Args.
			$vars = isset( $a['vars'] ) ? $a['vars'] : '';

			// Author.
			$author_id = isset( $a['author'] ) ? $a['author'] : '';

			// Ordering.
			$order   = isset( $a['order'] ) ? $a['order'] : 'DESC';
			$orderby = isset( $a['orderby'] ) ? $a['orderby'] : 'date';

			// Sticky, Include, Exclude, Offset, Status.
			$sticky = isset( $a['sticky_posts'] ) ? $a['sticky_posts'] : '';
			$sticky = $sticky === 'true' ? true : false;

			// Post IN.
			$post__in = isset( $a['post__in'] ) ? $a['post__in'] : '';

			// Exclude.
			$post__not_in = isset( $a['post__not_in'] ) ? $a['post__not_in'] : '';
			$exclude      = isset( $a['exclude'] ) ? $a['exclude'] : '';

			// Offset.
			$offset = isset( $a['offset'] ) ? $a['offset'] : 0;

			// Post Status.
			$post_status = isset( $a['post_status'] ) ? $a['post_status'] : 'publish';
			$post_status = empty( $post_status ) ? 'publish' : $post_status;
			if ( $post_status !== 'publish' && $post_status !== 'inherit' ) {
				// If not 'publish', confirm user has rights to view these posts.
				if ( current_user_can( apply_filters( 'alm_user_role_post_status', 'edit_theme_options' ) ) ) {
					$post_status = $post_status;
				} else {
					$post_status = apply_filters( 'alm_allow_future_posts', false ) ? $post_status : 'publish';
					// e.g. add_filter( 'alm_allow_future_posts', '__return_true' ).
				}
			}

			// Advanced Custom Fields.
			// Only used for Relationship Field. Gallery, Repeater and Flex Content is in the ACF extension.
			if ( $is_ajax ) {
				$acf = ( isset( $a['acf'] ) ) ? true : false;
				if ( $acf ) {
					$acf_post_id           = isset( $a['acf']['post_id'] ) ? $a['acf']['post_id'] : ''; // Post ID.
					$acf_field_type        = isset( $a['acf']['field_type'] ) ? $a['acf']['field_type'] : ''; // Field Type.
					$acf_field_name        = isset( $a['acf']['field_name'] ) ? $a['acf']['field_name'] : ''; // Field Name.
					$acf_parent_field_name = isset( $a['acf']['parent_field_name'] ) ? $a['acf']['parent_field_name'] : ''; // Parent Field Name.
				}
			} else { // phpcs:ignore
				// If Preloaded, $a needs to access acf data differently.
				if ( isset( $a['acf'] ) && $a['acf'] === 'true' ) {
					$acf_post_id           = isset( $a['acf_post_id'] ) ? $a['acf_post_id'] : ''; // Post ID.
					$acf_field_type        = isset( $a['acf_field_type'] ) ? $a['acf_field_type'] : ''; // Field Type.
					$acf_field_name        = isset( $a['acf_field_name'] ) ? $a['acf_field_name'] : ''; // Field Name.
					$acf_parent_field_name = isset( $a['acf_parent_field_name'] ) ? $a['acf_parent_field_name'] : ''; // Parent Field Name.
				}
			}

			// Create initial $args array.
			$args = [
				'post_type'           => $post_type,
				'posts_per_page'      => $posts_per_page,
				'offset'              => $offset,
				'order'               => $order,
				'orderby'             => $orderby,
				'post_status'         => $post_status,
				'ignore_sticky_posts' => true,
			];

			// Category.
			if ( ! empty( $category ) ) {
				$args['category_name'] = $category;
			}
			if ( ! empty( $category__and ) ) {
				$args['category__and'] = explode( ',', $category__and );
			}

			// Category Not In.
			if ( ! empty( $category__not_in ) ) {
				$exclude_cats             = explode( ',', $category__not_in );
				$args['category__not_in'] = $exclude_cats;
			}

			// Tag.
			if ( ! empty( $tag ) ) {
				$args['tag'] = $tag;
			}
			if ( ! empty( $tag__and ) ) {
				$args['tag__and'] = explode( ',', $tag__and );
			}

			// Tag Not In.
			if ( ! empty( $tag__not_in ) ) {
				$exclude_tags        = explode( ',', $tag__not_in );
				$args['tag__not_in'] = $exclude_tags;
			}

			// Date (not using date_query as there was issue with year/month archives).
			if ( ! empty( $year ) ) {
				$args['year'] = $year;
			}
			if ( ! empty( $month ) ) {
				$args['monthnum'] = $month;
			}
			if ( ! empty( $day ) ) {
				$args['day'] = $day;
			}

			// Taxonomy & Post Format.
			// Both use tax_query, so we need to combine the queries.
			if ( ! empty( $post_format ) || ! empty( $taxonomy ) ) {
				$taxonomy          = explode( ':', $taxonomy ); // Convert to array.
				$taxonomy_terms    = explode( ':', $taxonomy_terms ); // Convert to array.
				$taxonomy_operator = explode( ':', $taxonomy_operator ); // Convert to array.
				$taxonomy_children = explode( ':', $taxonomy_children ); // Convert to array.
				$tax_query_total   = count( $taxonomy ); // Total $taxonomy objects.

				if ( empty( $taxonomy ) ) {
					// Post Format only.
					// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
					$args['tax_query'] = [
						alm_get_post_format( $post_format ),
					];

				} else {
					// Post Format.
					if ( ! empty( $post_format ) ) {
						// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
						$args['tax_query'] = [
							'relation' => $taxonomy_relation,
							alm_get_post_format( $post_format ),
						];
					} else {
						// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
						$args['tax_query'] = [
							'relation' => $taxonomy_relation,
						];
					}

					// Loop Taxonomies.
					for ( $i = 0; $i < $tax_query_total; $i++ ) {
						$args['tax_query'][] = alm_get_taxonomy_query(
							$taxonomy[ $i ],
							$taxonomy_terms[ $i ],
							isset( $taxonomy_operator[ $i ] ) ? $taxonomy_operator[ $i ] : 'IN',
							isset( $taxonomy_children[ $i ] ) ? $taxonomy_children[ $i ] : true
						);
					}
				}
			}

			// Meta Query.
			if ( ! empty( $meta_key ) && isset( $meta_value ) || ! empty( $meta_key ) && $meta_compare !== 'IN' ) {
				// Parse multiple meta query.
				$meta_keys        = explode( ':', $meta_key ); // convert to array.
				$meta_value       = explode( ':', $meta_value ); // convert to array.
				$meta_compare     = explode( ':', $meta_compare ); // convert to array.
				$meta_type        = explode( ':', $meta_type ); // convert to array.
				$meta_query_total = count( $meta_keys ); // Total meta_query objects.

				// Add the meta relation.
				// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				$args['meta_query'] = [
					'relation' => $meta_relation,
				];

				// Loop and build the Meta Query.
				for ( $i = 0; $i < $meta_query_total; $i++ ) {
					if ( isset( $meta_keys[ $i ] ) && isset( $meta_value[ $i ] ) ) {
						$meta_array = [
							'key'     => isset( $meta_keys[ $i ] ) ? $meta_keys[ $i ] : '',
							'value'   => isset( $meta_value[ $i ] ) ? $meta_value[ $i ] : '',
							'compare' => isset( $meta_compare[ $i ] ) ? $meta_compare[ $i ] : 'IN',
							'type'    => isset( $meta_type[ $i ] ) ? $meta_type[ $i ] : 'CHAR',
						];
						$args['meta_query'][ alm_create_meta_clause( $meta_keys[ $i ] ) ] = alm_get_meta_query( $meta_array );
					}
				}
			}

			// Date Query.
			if ( $date_query || $date_query_after || $date_query_before ) {
				$args['date_query'] = [];
				if ( ! empty( $date_query_relation ) ) {
					$args['date_query']['relation'] = $date_query_relation;
				}

				// Standard Date Query.
				if ( $date_query ) {
					$args = alm_get_date_query( $date_query, $date_query_compare, $date_query_column, $args );
				}

				// Date Query (Before/After).
				if ( $date_query_before || $date_query_after ) {
					$args = alm_get_date_query_before_after( $args, $date_query_before, $date_query_after, $date_query_inclusive );
				}
			}

			// Sort key.
			if ( ! empty( $sort_key ) && strpos( $orderby, 'meta_value' ) !== false ) {
				// Only order by sort_key, if `orderby` is set to meta_value{_num}.
				$args['meta_key'] = $sort_key; // phpcs:ignore
			}

			// Author.
			if ( ! empty( $author_id ) ) {
				$args['author'] = $author_id;
			}

			// Search Term.
			if ( ! empty( $s ) ) {
				$args['s'] = $s;
			}

			// Custom Args.
			if ( ! empty( $custom_args ) ) {
				$args = self::parse_custom_args( $args, $custom_args );
			}

			// Vars.
			if ( ! empty( $vars ) ) {
				$args = self::parse_custom_vars( $args, $vars );
			}

			// Include posts.
			if ( ! empty( $post__in ) ) {
				$post__in         = explode( ',', $post__in );
				$args['post__in'] = $post__in;
			}

			// Exclude posts.
			if ( ! empty( $post__not_in ) ) {
				$post__not_in         = explode( ',', $post__not_in );
				$args['post__not_in'] = $post__not_in;
			}
			if ( ! empty( $exclude ) ) { // Deprecate this soon.
				$exclude              = explode( ',', $exclude );
				$args['post__not_in'] = $exclude;
			}

			// Language.
			if ( ! empty( $lang ) ) {
				$args['lang'] = $lang;
			}

			// Sticky Posts.
			if ( $sticky ) {
				$sticky_posts        = get_option( 'sticky_posts' ); // Get all sticky post ids.
				$sticky_post__not_in = isset( $args['post__not_in'] ) ? $args['post__not_in'] : '';

				if ( $is_ajax ) { // Ajax Query.
					$sticky_query_args                   = $args;
					$sticky_query_args['post__not_in']   = $sticky_posts;
					$sticky_query_args['posts_per_page'] = apply_filters( 'alm_max_sticky_per_page', 50 ); // Set a maximum to prevent fatal query errors.
					$sticky_query_args['fields']         = 'ids';
					$sticky_query                        = new WP_Query( $sticky_query_args ); // Query all non-sticky posts.

					// If has sticky and regular posts.
					if ( $sticky_posts && $sticky_query->posts ) {
						$standard_posts = $sticky_query->posts;
						if ( $standard_posts ) {
							$sticky_ids = array_merge( $sticky_posts, $standard_posts ); // merge regular posts with sticky.

							$args['post__in'] = alm_sticky_post__not_in( $sticky_ids, $sticky_post__not_in );
							$args['orderby']  = 'post__in'; // set orderby to order by post__in.
						}
					}
				} else { // Preloaded.

					// If more sticky posts than $posts_per_page run a secondary query to get posts to fill query.
					if ( count( $sticky_posts ) <= $posts_per_page ) {

						$sticky_query_args                   = $args;
						$sticky_query_args['post__not_in']   = $sticky_posts;
						$sticky_query_args['posts_per_page'] = apply_filters( 'alm_max_sticky_per_page', 50 ); // Set a maximum to prevent fatal query errors.
						$sticky_query_args['fields']         = 'ids';

						$sticky_query = new WP_Query( $sticky_query_args ); // Query all non sticky posts.

						// If has sticky and regular posts.
						if ( $sticky_posts && $sticky_query->posts ) {
							$standard_posts = $sticky_query->posts;
							if ( $standard_posts ) {
								$sticky_ids      = array_merge( $sticky_posts, $standard_posts ); // merge regular posts with sticky.
								$sticky_ids      = alm_sticky_post__not_in( $sticky_ids, $sticky_post__not_in );
								$args['orderby'] = 'post__in'; // set orderby to order by post__in.
							}
						}
					} else {
						$sticky_ids = $sticky_posts;
					}

					// If has sticky posts.
					if ( $sticky_posts ) {
						$args['post__in'] = $sticky_ids;
						$args['orderby']  = 'post__in'; // set orderby to order by post__in.
					}
				}
			}

			// Advanced Custom Fields.
			if ( ! empty( $acf_field_type ) && ! empty( $acf_field_name ) && function_exists( 'get_field' ) ) {
				if ( $acf_field_type === 'relationship' ) {
					// Relationship Field.
					$acf_post_id  = ( empty( $acf_post_id ) ) ? $post_id : $acf_post_id;
					$acf_post_ids = [];

					if ( empty( $acf_parent_field_name ) ) {
						// Get field value from ACF.
						$acf_post_ids = get_field( $acf_field_name, $acf_post_id );
					} else { // phpcs:ignore
						// Call function in ACF extension.
						if ( function_exists( 'alm_acf_loop_gallery_rows' ) ) {
							// Sub Fields.
							$acf_post_ids = alm_acf_loop_relationship_rows( $acf_parent_field_name, $acf_field_name, $acf_post_id );
						}
					}
					$args['post__in'] = ( $acf_post_ids ) ? $acf_post_ids : [ 0 ];
				}
			}

			/**
			 * Custom `alm_id` query parameter in the WP_Query.
			 * Note: This allows `pre_get_posts` to parse based on ALM ID.
			 */
			$args['alm_id'] = $id;

			// Return the arguments.
			return $args;
		}

		/**
		 * Parse a var parameter as string into array.
		 *
		 * @param object $args The current $args array.
		 * @param string $param The parameter to parse.
		 */
		public static function parse_custom_vars( $args, $param ) {
			if ( empty( $param ) ) {
				return $args;
			}

			// Split the $param at `;`.
			$params = explode( ';', $param );

			// New array.
			$array = [];

			// Loop each $param.
			foreach ( $params as $param ) {
				$param              = explode( ':', $param );  // Split the $argument at ':'.
				$array[ $param[0] ] = $param[1];
			}

			$args['alm_vars'] = $array;

			// Return parsed $array.
			return $args;
		}


		/**
		 * Parse `custom_args` string parameter into array.
		 *
		 * @param  array  $args  The current argument array.
		 * @param  string $param The parameter to parse.
		 * @return array         The modified arguments.
		 */
		public static function parse_custom_args( $args, $param ) {
			$array = explode( ';', $param ); // Split the $param at `;`.

			// Loop each $argument.
			foreach ( $array as $arg ) {
				$arg     = preg_replace( '/\s+/', '', $arg ); // Remove all whitespace.
				$arg     = explode( ':', $arg );  // Split at each colon.
				$arg_arr = explode( ',', $arg[1] );  // Split at each comma.
				if ( count( $arg_arr ) > 1 ) {
					$args[ $arg[0] ] = $arg_arr;
				} else {
					$args[ $arg[0] ] = $arg[1];
				}
			}

			// Return parsed $args.
			return $args;
		}
	}

endif;
