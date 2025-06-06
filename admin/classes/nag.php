<?php
/**
 * Admin Notice Nag.
 *
 * @package AjaxLoadMore
 */

if ( ! class_exists( 'ALM_NAG' ) ) :

	/**
	 * ALM_NAG Class.
	 */
	class ALM_NAG {
		const OPTION_INSTALL_DATE     = 'alm-install-date';
		const OPTION_ADMIN_NOTICE_KEY = 'alm-hide-notice';
		const OPTION_NAG_DELAY        = '-7 days';

		/**
		 * ALM Admin Notices.
		 *
		 * @var array
		 */
		public $notices = [];

		/**
		 * Setup the class.
		 */
		public function register() {
			$this->catch_hide_notice();
			$this->bind();
			$this->notices = new ALM_Notices();
		}

		/**
		 * Catch the hide nag request
		 */
		private function catch_hide_notice() {
			if ( isset( $_GET[ ALM_Nag::OPTION_ADMIN_NOTICE_KEY ] ) && current_user_can( apply_filters( 'alm_user_role', 'edit_theme_options' ) ) ) {
				// Add user meta.
				global $current_user;
				add_user_meta( $current_user->ID, ALM_Nag::OPTION_ADMIN_NOTICE_KEY, '1', true );

				// Build redirect URL.
				$query_params = $this->get_admin_querystring_array();
				unset( $query_params[ ALM_Nag::OPTION_ADMIN_NOTICE_KEY ] );
				$query_string = http_build_query( $query_params );
				if ( $query_string != '' ) {
					$query_string = '?' . $query_string;
				}

				$redirect_url = 'http';
				if ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] == 'on' ) {
					$redirect_url .= 's';
				}
				$redirect_url .= '://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'] . $query_string;

				wp_redirect( $redirect_url );
				exit;
			}
		}

		/**
		 * Bind nag message
		 */
		private function bind() {
			// Is admin notice hidden?
			$current_user = wp_get_current_user();
			$hide_notice  = get_user_meta( $current_user->ID, ALM_Nag::OPTION_ADMIN_NOTICE_KEY, true );

			// Check if we need to display the notice.
			if ( current_user_can( 'install_plugins' ) && '' == $hide_notice ) {
				// Get installation date.
				$datetime_install = $this->get_install_date();
				$datetime_past    = new DateTime( ALM_Nag::OPTION_NAG_DELAY );
				if ( $datetime_past >= $datetime_install ) {
					// 10 or more days ago, show admin notice.
					add_action( 'admin_notices', [ $this, 'display_admin_notice' ] );
				}
			}
		}

		/**
		 * Get the install data
		 *
		 * @return DateTime
		 */
		private function get_install_date() {
			$date_string = get_site_option( ALM_Nag::OPTION_INSTALL_DATE, '' );
			if ( $date_string == '' ) {
				// There is no install date, plugin was installed before version 1.2.0. Add it now.
				$date_string = self::insert_install_date();
			}
			return new DateTime( $date_string );
		}

		/**
		 * Parse the admin query string
		 *
		 * @return array
		 */
		private function get_admin_querystring_array() {
			if ( isset( $_SERVER['QUERY_STRING'] ) ) {
				parse_str( $_SERVER['QUERY_STRING'], $params );
				return $params;
			}
		}

		/**
		 * Insert the install date
		 *
		 * @return string
		 */
		public static function insert_install_date() {
			if ( ! get_site_option( ALM_Nag::OPTION_INSTALL_DATE ) ) {
				$datetime_now = new DateTime();
				$date_string  = $datetime_now->format( 'Y-m-d' );
				add_site_option( ALM_Nag::OPTION_INSTALL_DATE, $date_string, '', 'no' );
				return $date_string;
			}
		}

		/**
		 * Display the admin notice
		 */
		public function display_admin_notice() {
			$query_params = $this->get_admin_querystring_array();
			$query_string = '?' . http_build_query( array_merge( $query_params, [ ALM_Nag::OPTION_ADMIN_NOTICE_KEY => '1' ] ) );

			$msg  = '<span>';
			$msg .= sprintf(
				// translators: %1$s is the Ajax Load More admin page URL, %2$s is the WordPress.org plugin review URL.
				__( 'Looks like you\'ve been using the <a href="%1$s">Ajax Load More</a> plugin for some time now, would you consider leaving a review at <a href="%2$s" target="_blank">wordpress.org</a>?', 'ajax-load-more' ),
				get_admin_url() . 'admin.php?page=ajax-load-more',
				'http://wordpress.org/support/view/plugin-reviews/ajax-load-more/',
			);
			$msg .= '<br/>';
			$msg .= __( 'All reviews, both good and bad are important as they help the plugin grow and improve over time.', 'ajax-load-more' );
			$msg .= '</span>';

			$msg .= '<span class="alm-nag-buttons">';
			$msg .= sprintf(
				// translators: %1$s is the WordPress.org plugin review URL, %2$s is the admin page URL, %3$s is the Leave Review button text, %4$s is the No thanks button text, %5$s is the I\'ve already done this button text.
				"<a href='%1\$s' target='_blank' class='button button-primary'>%3\$s</a><a href='%2\$s' class='button'>%4\$s</a><a href='%2\$s' class='button-no'>%5\$s</a>",
				'http://wordpress.org/support/view/plugin-reviews/ajax-load-more',
				$query_string,
				__( 'Leave Review', 'ajax-load-more' ),
				__( 'No thanks', 'ajax-load-more' ),
				__( 'I\'ve already done this', 'ajax-load-more' )
			);
			$msg .= '</span>';

			$this->notices->add_admin_notice(
				$msg,
				'info',
				'nag-notice',
				false
			);
		}
	}

endif;
