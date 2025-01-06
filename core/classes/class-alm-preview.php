<?php
/**
 * Ajax Load More preview functions.
 *
 * @package AjaxLoadMore
 * @since 7.2.0
 */


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ALM_PREVIEW' ) ) :

	/**
	 * Initiate the class.
	 */
	class ALM_PREVIEW {

		/**
		 * Class Constructor.
		 */
		public function __construct() {
			add_action( 'template_redirect', [ $this, 'alm_preview' ] );
		}

		/**
		 * Display a preview of ALM.
		 *
		 * @return void
		 */
		public function alm_preview() {
			$params    = filter_input_array( INPUT_GET );
			$shortcode = isset( $params['alm_preview'] ) ? $params['alm_preview'] : false;

			if ( $shortcode && str_contains( $shortcode, '[ajax_load_more' ) && current_user_can( apply_filters( 'alm_user_role', 'edit_theme_options' ) ) ) {
				get_header();

				// Set cache to false.
				$shortcode = str_replace( 'cache="true"', '', $shortcode );

				// Load the preview CSS.
				$css_path = ALM_URL . '/core/classes/assets/alm-preview.css';
				// Create Preview
				?>
				<link rel="stylesheet" href="<?php echo esc_url( $css_path ); ?>" type="text/css" media="all" />
				<div id="alm-preview">
					<div id="alm-preview-intro">
						<div class="alm-logo">
							<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect width="80" height="80" rx="8" fill="#e75a4d" />
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M20 59H33.585V56.91C32.0817 56.0667 30.4867 55.535 28.8 55.315L32.045 46.57H44.255L47.445 55.315C46.7117 55.4617 45.9417 55.6817 45.135 55.975C44.3283 56.2683 43.5767 56.58 42.88 56.91V59H60.095V56.91C59.545 56.5433 58.9033 56.2225 58.17 55.9475C57.4367 55.6725 56.7033 55.4617 55.97 55.315L42.165 19.84H38.095L23.905 55.315C23.245 55.4617 22.5758 55.6725 21.8975 55.9475C21.2192 56.2225 20.5867 56.5433 20 56.91V59ZM38.2325 28.3232L43.1 42.995H33.365L38.2325 28.3232Z"
									fill="white"
									fill-opacity="0.8"
								/>
							</svg>
						</div>
						<h1>
							<?php esc_attr_e( 'Ajax Load More: Preview', 'ajax-load-more' ); ?>
						</h1>
						<p>
							<?php echo wp_kses_post( __( '<strong>Note:</strong> Styling and functionality within this preview environment may not be 100% reflective of how Ajax Load More will appear once added directly to a page on your website.', 'ajax-load-more' ) ); ?>
						</p>
						<pre id="alm-pre"><?php echo wp_kses_post( $shortcode ); ?></pre>
					</div>
					<div id="alm-preview-wrap">
						<?php echo do_shortcode( $shortcode ); ?>
					</div>
				</div>
				<script>
					// Move elements with JS.
					document.title = "Ajax Load More: Preview";
					var container = document.querySelector("#alm-preview");
					document.body.append(container);
				</script>
				<?php
				get_footer();
				exit;
			}
		}
	}

	new ALM_PREVIEW();
endif;
