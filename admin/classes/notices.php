<?php
/**
 * ALM Admin Notice Class.
 *
 * @package ALMFilters
 */

if ( ! class_exists( 'ALM_Notices' ) ) {
	/**
	 * Initiate the class.
	 */
	class ALM_Notices {

		/**
		 * ALM Notices.
		 *
		 * @var array
		 */
		public $notices = [];

		/**
		 * Construct class.
		 */
		public function __construct() {
			add_action( 'admin_notices', [ &$this, 'alm_admin_notices' ] );
			add_filter( 'wp_kses_allowed_html', [ &$this, 'alm_wp_kses_allowed_html' ] );
		}

		/**
		 * Add admin notices.
		 *
		 * @since 1.5
		 * @param string $text  The notice text.
		 * @param string $type  The notice type.
		 * @param string $class The classname for the notice.
		 * @return function
		 */
		public function add_admin_notice( $text, $type = '', $class = '', $dismissible = true ) {
			return $this->add_notice( $text, $type, $class, $dismissible );
		}

		/**
		 * Add admin notices to the $notices array.
		 *
		 * @since 1.5
		 * @param string $text  The notice text.
		 * @param string $type  The notice type.
		 * @param string $class The notice class.
		 * @return void
		 */
		public function add_notice( $text = '', $type = '', $class = '', $dismissible = true ) {
			// Add type to class.
			$class .= $type ? ' notice-' . $type : ''; // notice-info, notice-success, notice-warning, notice-error

			$this->notices[] = [
				'text'        => $text,
				'type'        => $type,
				'class'       => $class,
				'dismissible' => $dismissible,
			];
		}

		/**
		 * Return the $notices.
		 *
		 * @since 1.5
		 * @return array $notices The notice.
		 */
		public function get_notices() {
			if ( empty( $this->notices ) ) {
				return false; // bail early if no notices.
			}
			return $this->notices;
		}

		/**
		 *  Render admin notices in the WP admin.
		 *
		 *  @since  1.5
		 *  @return void
		 */
		public function alm_admin_notices() {
			$notices = $this->get_notices();
			if ( ! $notices ) {
				return; // bail early if no notices.
			}

			// Loop notices.
			foreach ( $notices as $notice ) {
				$open  = '<p>';
				$close = '</p>'
				?>
				<div class="alm-admin-notice notice <?php echo esc_attr( $notice['class'] ); ?><?php echo $notice['dismissible'] ? ' is-dismissible' : ''; ?>">
				<?php
				if ( $notice['type'] ) {
					echo wp_kses_post( $this->alm_filters_get_svg( $notice['type'] ) );
				}
				echo wp_kses_post( $open ) . wp_kses_post( $notice['text'] ) . wp_kses_post( $close );
				?>
				</div>
				<?php
			}
		}

		/**
		 * Render an SVG.
		 *
		 * @param string $svg The SVG to render.
		 * @return string     The SVG as HTML.
		 */
		public function alm_filters_get_svg( $svg = '' ) {
			switch ( $svg ) {
				case 'success':
					return '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00a32a"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>';

				case 'warning':
					return '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#dba617"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>';

				case 'info':
					return '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#72aee6"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>';

				// case 'error':
				// return '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#d63638"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>';
			}
		}

		/**
		 * Allow SVGs in wp_kses.
		 */
		public function alm_wp_kses_allowed_html( $tags ) {
			$tags['svg']  = [
				'xmlns'        => [],
				'fill'         => [],
				'viewbox'      => [],
				'role'         => [],
				'aria-hidden'  => [],
				'focusable'    => [],
				'stroke'       => [],
				'stroke-width' => [],
				'width'        => [],
				'height'       => [],
			];
			$tags['path'] = [
				'd'               => [],
				'fill'            => [],
				'stroke-linecap'  => [],
				'stroke-linejoin' => [],
			];
			return $tags;
		}
	}
}
