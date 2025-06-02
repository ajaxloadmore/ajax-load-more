<?php
/**
 * Licensing Class.
 *
 * @package AjaxLoadMore
 */

class ALM_Licensing {

	/**
	 * ALM Admin Notices.
	 *
	 * @var array
	 */
	public $notices = [];

	/**
	 * Register hooks and actions.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'admin_init', [ $this, 'license_activation' ] );
		add_action( 'admin_notices', [ $this, 'admin_license_notice' ] );
		add_action( 'after_plugin_row', [ $this, 'alm_plugin_row' ] );
		$this->notices = new ALM_Notices();

		// Loop each addon and add the plugin update message hook.
		foreach ( alm_get_addons() as $addon ) {
			$path = $addon['path'];
			$hook = "in_plugin_update_message-{$path}/{$path}.php";
			add_action( $hook, [ $this, 'alm_prefix_plugin_update_message' ], 10, 2 );
		}
	}

	/**
	 * Handle the adctivation/deactivaton of Ajax Load More licenses.
	 * This only runs when the user clicks the Activate/Deactivate/Refresh buttons.
	 *
	 * @return void
	 */
	public function license_activation() {
		if ( ! current_user_can( apply_filters( 'alm_user_role', 'edit_theme_options' ) ) ) {
			return; // Bail early missing WP capabilities.
		}

		// Run a quick security check.
		$nonce = isset( $_POST['alm_license_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['alm_license_nonce'] ) ) : '';
		if ( ! $nonce || ! check_admin_referer( $nonce, $nonce ) ) {
			return; // Bail early if we didn't click the Activate button.
		}

		$activate   = isset( $_POST['alm_activate_license'] );
		$deactivate = isset( $_POST['alm_deactivate_license'] );
		$refresh    = isset( $_POST['alm_refresh_license'] );

		if ( ! $activate && ! $deactivate && ! $refresh ) {
			return; // Bail early if not activating or deactivating.
		}

		if ( $activate ) {
			$item_id = $_POST['alm_activate_license'] ? sanitize_text_field( wp_unslash( $_POST['alm_activate_license'] ) ) : '';
			$action  = 'activate_license';
		} elseif ( $deactivate ) {
			$item_id = $_POST['alm_deactivate_license'] ? sanitize_text_field( wp_unslash( $_POST['alm_deactivate_license'] ) ) : '';
			$action  = 'deactivate_license';
		} elseif ( $refresh ) {
			$item_id = $_POST['alm_refresh_license'] ? sanitize_text_field( wp_unslash( $_POST['alm_refresh_license'] ) ) : '';
			$action  = 'check_license';
		} else {
			return; // Bail early if no item found.
		}

		// Parse the $_POST parameters.
		$item_key       = isset( $_POST['alm_item_key'] ) ? sanitize_text_field( wp_unslash( $_POST['alm_item_key'] ) ) : '';
		$item_option    = isset( $_POST['alm_item_option'] ) ? sanitize_text_field( wp_unslash( $_POST['alm_item_option'] ) ) : '';
		$license        = isset( $_POST[ $item_key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $item_key ] ) ) : '';
		$transient_name = "alm_{$item_id}_{$license}"; // Create transient name for the license key.

		if ( ! $license || ! $item_id || ! $item_option || ! $item_key || ! is_numeric( $item_id ) ) {
			return; // bail if parameters are missing.
		}

		// Make API request.
		$response = $this->license_request( $action, $item_id, $license );

		// Handle any errors from the API request.
		if ( is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) !== 200 ) {
			if ( is_wp_error( $response ) ) {
				$message = $response->get_error_message();
			} else {
				$message = __( 'An error occurred, please try again.', 'ajax-load-more' );
			}
			$this->notices->add_admin_notice( $message, 'error' );
			return; // Bail early if the response is not okay.
		}

		// API was good, so we can proceed with the license activation/deactivation.
		$license_data = json_decode( wp_remote_retrieve_body( $response ) );
		$name         = isset( $license_data->item_name ) ? $license_data->item_name : __( 'Plugin', 'ajax-load-more' );

		switch ( $action ) {
			case 'deactivate_license':
				$this->do_deactivation( $name, $item_option, $transient_name );
				break;

			case 'activate_license':
			case 'check_license':
				$this->do_activation( $license_data, $name, $item_option, $item_key, $license, $transient_name, $action, $refresh );
				break;
		}

		return;
	}

	/**
	 * Activate a license.
	 *
	 * @param object $license_data   The license data returned from the EDD API.
	 * @param string $name           The name of the plugin or addon.
	 * @param string $item_option    The option name for the item, e.g., 'alm_pro_license'.
	 * @param string $item_key       The key for the item, e.g., 'alm_pro_license_key'.
	 * @param string $license        The license key to activate.
	 * @param string $transient_name The transient name for the license key.
	 * @param string $action         The action to perform, e.g., 'activate_license'.
	 * @param bool   $refresh        Whether this is a license refresh.
	 * @return void
	 */
	public function do_activation( $license_data, $name, $item_option, $item_key, $license, $transient_name, $action = 'activate_license', $refresh = false ) {
		$msg = ''; // Initialize message variable.

		if ( $license_data->success === false ) {
			switch ( $license_data->error ) {
				case 'expired':
					$msg = sprintf(
						// translators: %1$s is the plugin name, %2$s is the expiration date, %3$s is the renewal link, %4$s is the renewal text.
						__( 'Your %1$s license key expired on %2$s &rarr; <a href="%3$s">%4$s</a>', 'ajax-load-more' ),
						$name,
						date_i18n( get_option( 'date_format' ), strtotime( $license_data->expires, current_time( 'timestamp' ) ) ),
						ALM_STORE_URL . "/checkout/?edd_license_key={$license}&download_id={$license_data->item_id}",
						__( 'Renew Now', 'ajax-load-more' )
					);
					break;

				case 'disabled':
				case 'revoked':
					$msg = sprintf(
						// translators: %s is the plugin name.
						__( 'Your %s license key has been disabled.', 'ajax-load-more' ),
						$name,
					);
					break;

				case 'missing':
					$msg = sprintf(
						// translators: %s is the plugin name.
						__( 'Invalid %s license key. Are you sure this license is correct?.', 'ajax-load-more' ),
						$name,
					);
					break;

				case 'invalid':
				case 'site_inactive':
					$msg = sprintf(
						// translators: %s is the plugin name.
						__( 'Your license is not active for this URL.', 'ajax-load-more' ),
						$name,
					);
					break;

				case 'item_name_mismatch':
					// translators: %s is the plugin name.
					$msg = sprintf( __( 'This appears to be an invalid license key for %s.', 'ajax-load-more' ), $name );
					break;

				case 'no_activations_left':
					// translators: %s is the plugin name.
					$msg = sprintf( __( 'This %s license key has reached its activation limit.', 'ajax-load-more' ), $name );
					break;

				default:
					$msg = __( 'An error occurred, please try again.', 'ajax-load-more' );
					break;
			}
		}

		$has_error   = ! empty( $msg ); // Check if there is an error message.
		$notice_type = ! $has_error ? 'success' : 'error'; // Set notice type based on message.

		if ( ! $has_error ) {
			if ( $refresh ) {
				// translators: %s is the plugin name.
				$msg = sprintf( __( '%s license data has been refreshed.', 'ajax-load-more' ), $name );

			} elseif ( $action === 'activate_license' ) {
				// translators: %s is the plugin name.
				$msg = sprintf( __( '%s license activated.', 'ajax-load-more' ), $name );
			}
		}

		if ( $msg ) {
			$this->notices->add_admin_notice( $msg, $notice_type );
		}

		// Set the license status options.
		$this->set_license_status( $license_data, $item_option, $transient_name );

		// Store the license key.
		update_option( $item_key, $license, false );
	}

	/**
	 * Deactivate a license.
	 *
	 * @param array  $response       The response from the license request.
	 * @param string $item_option    The option name for the item, e.g., 'alm_pro_license'.
	 * @param string $transient_name The transient name for the license key.
	 * @return void
	 */
	public function do_deactivation( $name, $option, $transient_name ) {
		// Delete the license key options and transients.
		$this->delete_license_status( $option, $transient_name );

		$msg = sprintf(
			// translators: %s is the plugin name.
			__( '%s license deactivated.', 'ajax-load-more' ),
			$name
		);
		$this->notices->add_admin_notice( $msg, 'warning' );
	}

	/**
	 * Make API request to the ALM Store.
	 *
	 * @param string $action  The action to perform, e.g., 'activate_license'.
	 * @param string $item_id The ID of the item to activate.
	 * @param string $license The license key to activate.
	 * @return array|false    The response from the API or false on failure.
	 */
	public function license_request( $action = 'activate_license', $item_id = '', $license = '' ) {
		if ( ! $item_id || ! $license ) {
			return false; // Bail early if no item found.
		}

		return wp_remote_post(
			ALM_STORE_URL,
			[
				'method'    => 'POST',
				'body'      => [
					'edd_action'  => $action,
					'license'     => $license,
					'item_id'     => $item_id, // EDD Product ID.
					'url'         => home_url(),
					'environment' => function_exists( 'wp_get_environment_type' ) ? wp_get_environment_type() : 'production',
				],
				'timeout'   => 15,
				'sslverify' => apply_filters( 'alm_licensing_sslverify', false ),
			]
		);
	}

	/**
	 * License notifications.
	 *
	 * @since 3.3.0
	 */
	public function admin_license_notice() {
		$screen          = get_current_screen();
		$is_admin_screen = alm_is_admin_screen();
		$show_on         = [ 'dashboard', 'plugins', 'options-general', 'options' ];

		if ( ! $is_admin_screen && ! in_array( $screen->id, $show_on, true ) ) {
			return; // Exit if screen is not dashboard, plugins, settings, etc or ALM admin.
		}

		// Plugin not activated notices.
		$message         = '';
		$invalid_license = false;

		if ( has_action( 'alm_pro_installed' ) ) { // Pro.
			$addons  = alm_get_pro_addon();
			$message = __( 'You have an invalid or expired <a href="admin.php?page=ajax-load-more">Ajax Load More Pro</a> license key. Visit the <a href="admin.php?page=ajax-load-more-licenses">License</a> section to input your key or <a href="https://connekthq.com/plugins/ajax-load-more/pro/" target="_blank">purchase</a> one now.', 'ajax-load-more' );
		} else { // Other Addons.
			$addons  = alm_get_addons();
			$message = __( 'You have invalid or expired <a href="admin.php?page=ajax-load-more">Ajax Load More</a> license keys. Visit the <a href="admin.php?page=ajax-load-more-licenses">Licenses</a> section to input your keys.', 'ajax-load-more' );
		}

		// Loop each addon.
		foreach ( $addons as $addon ) {
			if ( has_action( $addon['action'] ) ) {
				$key    = $addon['key'];
				$option = $addon['settings_field'];
				$status = $this->license_check( $addon['item_id'], get_option( $key ), $option );
				if ( $status !== 'valid' ) {
					$invalid_license = true; // Set the invalid license flag to true.
					break;
				}
			}
		}
		if ( $invalid_license ) {
			$this->notices->add_admin_notice( $message, 'error', '', false );
		}
	}

	/**
	 * Check the status of a license.
	 *
	 * @param int    $item_id The ID of the product.
	 * @param string $license The actual license key.
	 * @param string $option  The option name of the license.
	 * @return bool|string
	 * @since 2.8.3
	 */
	public function license_check( $item_id, $license, $option ) {
		if ( ! $item_id || ! $license || ! $option ) {
			return false;
		}

		// Check for a license transient. License transients expire after 7 days.
		$transient_name = "alm_{$item_id}_{$license}";
		$transient      = get_transient( $transient_name );
		if ( $transient ) {
			return $transient;

		} else {
			$response = $this->license_request( 'check_license', $item_id, $license );
			if ( is_wp_error( $response ) ) {
				return false;
			}

			// Get license data from the response.
			$license_data = json_decode( wp_remote_retrieve_body( $response ) );

			// Set license status options and get the license status.
			$status = $this->set_license_status( $license_data, $option, $transient_name );

			return $status;
		}
	}

	/**
	 * Sets the license status in the options table and transient.
	 *
	 * @param array  $license_data   The license data returned from the EDD API.
	 * @param string $option_prefix  The prefix for the option name, e.g., 'alm_pro_license'.
	 * @param string $transient_name The name of the transient to set.
	 * @return string                The license status, e.g., 'valid', 'expired', 'invalid', etc.
	 */
	public function set_license_status( $license_data = [], $option_prefix = '', $transient_name = '' ) {
		if ( ! $license_data || ! $option_prefix || ! $transient_name ) {
			return 'invalid'; // Bail early if no data or option prefix.
		}

		// Get the license status. If error, make the status of the license an error.
		$status = ( isset( $license_data->error ) ) ? $license_data->error : $license_data->license;

		// Update the options table.
		update_option( "{$option_prefix}_status", $status, false ); // Store the license status.
		update_option( "{$option_prefix}_data", json_encode( $license_data ), false ); // Store the complete license data as JSON.

		// Set transient value to store license status.
		set_transient( $transient_name, $status, 168 * HOUR_IN_SECONDS ); // 7 days

		return $status;
	}

	/**
	 * Deletes all license options data and transient.
	 *
	 * @param string $option_prefix The prefix for the option name, e.g., 'alm_pro_license'.
	 * @param string $transient     The name of the transient to set.
	 * @return void
	 */
	public function delete_license_status( $option_prefix = '', $transient = '' ) {
		delete_option( "{$option_prefix}_key" ); // Delete the license key.
		delete_option( "{$option_prefix}_status" ); // Delete the license status .
		delete_option( "{$option_prefix}_data", ); // Delete the license data array.
		delete_transient( $transient ); // Delete transient.
	}

	/**
	 * Get the license data WP option for a specific addon.
	 * e.g. 'alm_cache_license_status', 'alm_pro_license_status''.
	 *
	 * @param string $option The option name to retrieve the license data from.
	 * @return array
	 */
	public function get_license_data( $option = '' ) {
		$data = get_option( $option );
		if ( ! $data ) {
			return [];
		}
		return json_decode( $data, true );
	}

	/**
	 * Add extra message to plugin updater about expired/inactive licenses.
	 *
	 * @param array  $data     An array of plugin metadata.
	 * @param object $response An object of metadata about the available plugin update.
	 * @since 5.2
	 */
	public function alm_prefix_plugin_update_message( $data, $response ) {
		$addons = alm_get_addons();
		$slug   = $response->slug;

		foreach ( $addons as $key => $addon ) {
			if ( $addon['path'] === $slug ) {
				$index = $key;
			}
		}

		if ( isset( $index ) ) {
			$style = 'display: block; padding: 10px 5px 2px;';
			$addon = $addons[ $index ];

			if ( isset( $addon ) ) {
				$status = get_option( $addon['status'] );

				if ( $status === 'expired' ) {
					// Expired.
					printf(
						'<span style="' . esc_html( $style ) . '">%s %s</span>',
						esc_html__( 'Looks like your subscription has expired.', 'ajax-load-more' ),
						wp_kses_post( __( 'Please login to your <a href="https://connekthq.com/account/" target="_blank">Account</a> to renew the license.', 'ajax-load-more' ) )
					);
				}
				if ( $status === 'invalid' || $status === 'disabled' ) {
					// Invalid/Inactive.
					printf(
						'<span style="' . esc_html( $style ) . '">%s %s</span>',
						esc_html__( 'Looks like your license is inactive and/or invalid.', 'ajax-load-more' ),
						wp_kses_post( __( 'Please activate the <a href="admin.php?page=ajax-load-more-licenses" target="_blank">license</a> or login to your <a href="https://connekthq.com/account/" target="_blank">Account</a> to renew the license.', 'ajax-load-more' ) )
					);
				}
				if ( $status === 'deactivated' ) {
					// Deactivated.
					printf(
						'<span style="' . esc_html( $style ) . '">%s %s</span>',
						esc_html__( 'Looks like your license has been deactivated.', 'ajax-load-more' ),
						wp_kses_post( __( 'Please activate the <a href="admin.php?page=ajax-load-more-licenses" target="_blank">license</a> to update.', 'ajax-load-more' ) )
					);
				}
			}
		}
	}

	/**
	 * Create a notification in the plugin row.
	 *
	 * @param string $plugin_name The plugin path as a name.
	 * @since 5.2
	 */
	public function alm_plugin_row( $plugin_name ) {
		$addons = alm_get_addons();
		$addons = array_merge( alm_get_addons(), alm_get_pro_addon() );
		foreach ( $addons as $addon ) {
			if ( $plugin_name === $addon['path'] . '/' . $addon['path'] . '.php' ) {
				$status = get_option( $addon['status'] );
				// If not valid, display message.
				if ( $status !== 'valid' ) {
					$name  = $addon['name'];
					$style = 'margin: 5px 20px 6px 40px;';
					$title = $name === 'Ajax Load More Pro' ? '<strong>' . $name . '</strong>' : '<strong>Ajax Load More: ' . $name . '</strong>';

					$row = '</tr><tr class="plugin-update-tr"><td colspan="3" class="plugin-update"><div class="update-message" style="' . $style . '">';
					/* translators: %1$s is replaced with link href */
					$row .= sprintf( wp_kses_post( __( '%1$sRegister%2$s your copy of %3$s to receive access to plugin updates and support. Need a license key? %4$sPurchase Now%5$s', 'ajax-load-more' ) ), '<a href="admin.php?page=ajax-load-more-licenses">', '</a>', $title, '<a href="' . $addon['url'] . '" target="blank">', '</a>' );
					$row .= '</div></td>';

					echo wp_kses_post( $row );
				}
			}
		}
	}
}
