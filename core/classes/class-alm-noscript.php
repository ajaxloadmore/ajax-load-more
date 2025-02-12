<?php
/**
 * Class that generates a WP_Query for injection into <noscript />.
 *
 * @package AjaxLoadMore
 * @since   3.7
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ALM_NOSCRIPT' ) ) :

	/**
	 * Initiate the class.
	 */
	class ALM_NOSCRIPT {

		/**
		 * Element tag.
		 *
		 * @var element
		 */
		public static $element = 'noscript';

		/**
		 * This function will return a generated query for the noscript.
		 *
		 * @since 1.8
		 * @param array  $params       ALM params.
		 * @param string $container    The HTML container.
		 * @param string $css_classes  The css classnames.
		 * @param string $permalink    The current permalink.
		 * @return HTMLElement
		 */
		public static function alm_get_noscript( $params, $container = 'ul', $css_classes = '', $permalink = '' ) {
			$paged   = $params['paged'] ? $params['paged'] : 1;
			$filters = $params['filters'] ? $params['filters'] : false;

			if ( $params['users'] ) {
				// Users.
				if ( has_action( 'alm_users_preloaded' ) && $params['users'] ) {
					// Encrypt User Role.
					if ( ! empty( $params['users_role'] ) && function_exists( 'alm_role_encrypt' ) ) {
						$params['users_role'] = alm_role_encrypt( $params['users_role'] );
					}

					// Update offset.
					$params['offset'] = self::set_offset( $paged, $params['users_per_page'], $params['offset'] );
					$output           = apply_filters( 'alm_users_preloaded', $params, $params['users_per_page'], $params['repeater'], $params['theme_repeater'] ); // located in Users add-on.

					return self::render( $output['data'], $container, '', $css_classes );
				}
			} elseif ( $params['acf'] && ( $params['acf_field_type'] !== 'relationship' ) ) {
				// Advanced Custom Fields (Repeater, Gallery, Flex Content.
				if ( has_action( 'alm_acf_installed' ) && $params['acf'] ) {

					// Update offset.
					$params['offset'] = self::set_offset( $paged, $params['posts_per_page'], $params['offset'] );
					$output           = apply_filters( 'alm_acf_preloaded', $params, $params['repeater'], $params['theme_repeater'] ); // located in ACF add-on.

					return self::render( $output, $container, '', $css_classes );
				}
			} else {
				// Standard ALM.
				// Build the $args array to use with this WP_Query.
				$args = ALM_QUERY_ARGS::alm_build_queryargs( $params, false );

				$filters = $params['filters'];
				if ( $filters ) {
					$paged = $_GET && isset( $_GET['pg'] ) ? $_GET['pg'] : 1; // Set page number when using filters.
				}

				/**
				 * ALM Core Filter Hook
				 *
				 * @return array Modified array.
				*/
				$args = apply_filters( 'alm_query_args_' . $params['id'], $args, $params['post_id'] );

				// Update Paged and offset.
				$posts_per_page = $args['posts_per_page'];
				$args['paged']  = $paged;
				$args['offset'] = self::set_offset( $paged, $posts_per_page, $params['offset'] );

				$output = '';
				$i      = 0;

				$noscript_query = new WP_Query( $args );

				if ( $noscript_query->have_posts() ) :
					$alm_found_posts = $noscript_query->found_posts;
					$alm_page        = $paged;
					while ( $noscript_query->have_posts() ) :
						$noscript_query->the_post();
						++$i;
						$alm_current = $i;
						$alm_item    = $args['offset'] + $i;
						$output     .= alm_loop( $params['repeater'], $params['theme_repeater'], $alm_found_posts, $alm_page, $alm_item, $alm_current, $args );
					endwhile;
					wp_reset_postdata();

				endif;

				$paging = self::build_noscript_paging( $noscript_query, $filters, $permalink );

				return self::render( $output, $container, $paging, $css_classes );

			}
		}

		/**
		 * Create paging navigation.
		 *
		 * @since 2.8.3
		 * @param array   $query     The current query array.
		 * @param boolean $filters   Is this a Filters add-on URL.
		 * @param string  $permalink The current permalink.
		 * @return HTMLElement
		 */
		public static function build_noscript_paging( $query = [], $filters = false, $permalink = '' ) {
			// Set up query variables.
			$numposts       = $query->found_posts;
			$posts_per_page = $query->query_vars['posts_per_page'];
			$total          = ceil( $numposts / $posts_per_page );
			$start_page     = 1;
			$content        = '';

			// Get existing querystring and build array.
			parse_str( $_SERVER['QUERY_STRING'], $querystring );

			if ( $total > 1 ) {

				$content .= '<div class="alm-paging">';
				$content .= __( 'Pages: ', 'ajax-load-more' );

				// Loop pages.
				for ( $i = $start_page; $i <= $total; $i++ ) {
					if ( $filters ) {
						$querystring['pg'] = $i;
						$url               = $permalink . '?' . http_build_query( $querystring );
					} else {
						$url = get_pagenum_link( $i );
					}
					$content .= '<span class="page"><a href="' . $url . '">' . $i . '</a></span>';
				}

				$content .= '</div>';
			}

			return $content;
		}

		/**
		 * This function will return the HTML output of the <noscript/>.
		 *
		 * @since 1.8
		 * @param string $output      The noscript output.
		 * @param string $container   The ALM container.
		 * @param string $paging      ALM paging.
		 * @param string $css_classes Custom CSS classes.
		 * @return HTMLElement
		 */
		public static function render( $output, $container, $paging, $css_classes ) {
			return ( ! empty( $output ) ) ? '<' . esc_attr( self::$element ) . '><' . esc_attr( $container ) . ' class="alm-listing alm-noscript' . esc_attr( $css_classes ) . '">' . $output . '</' . esc_attr( $container ) . '>' . $paging . '</' . esc_attr( self::$element ) . '>' : '';
		}

		/**
		 * This function will set the offset of the noscript query
		 *
		 * @since 1.8
		 * @param string $paged The page number.
		 * @param string $per_page The amount per page.
		 * @param string $offset The offset value.
		 * @return int
		 */
		public static function set_offset( $paged, $per_page, $offset ) {
			return ( $paged * $per_page ) - $per_page + $offset;
		}
	}
endif;
