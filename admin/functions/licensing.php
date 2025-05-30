<?php
/**
 * ALM licensing admin functions and helpers.
 *
 * @package AjaxLoadMore
 * @since   5.6
 */

/**
 * Activates the license key.
 *
 * @return void
 */
function alm_activate_license() {
	// Bail early if not activating or missing WP capabilities.
	if ( ! isset( $_POST['alm_activate_license'] ) || ! current_user_can( apply_filters( 'alm_user_role', 'edit_theme_options' ) ) ) {
		return;
	}

	$nonce       = isset( $_POST['alm_license_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['alm_license_nonce'] ) ) : '';
	$item_id     = isset( $_POST['alm_activate_license'] ) ? sanitize_text_field( wp_unslash( $_POST['alm_activate_license'] ) ) : '';
	$item_name   = isset( $_POST['alm_item_name'] ) ? sanitize_text_field( wp_unslash( $_POST['alm_item_name'] ) ) : '';
	$item_key    = isset( $_POST['alm_item_key'] ) ? sanitize_text_field( wp_unslash( $_POST['alm_item_key'] ) ) : '';
	$item_option = isset( $_POST['alm_item_option'] ) ? sanitize_text_field( wp_unslash( $_POST['alm_item_option'] ) ) : '';
	$license     = isset( $_POST[ $item_key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $item_key ] ) ) : '';

	if ( ! $nonce || ! $license || ! $item_id || ! $item_option || ! $item_key || ! is_numeric( $item_id ) ) {
		error_log( 'ALM: License activation failed due to missing item details.' );
		return; // bail if no item found.
	}

	// Run a security check.
	if ( ! check_admin_referer( $nonce, $nonce ) ) {
		exit; // Bail early if we didn't click the Activate button.
	}

	// Create the params for the request.
	$api_params = [
		'edd_action'  => 'activate_license',
		'license'     => $license,
		'item_id'     => $item_id, // EDD Product ID.
		'url'         => home_url(),
		'environment' => function_exists( 'wp_get_environment_type' ) ? wp_get_environment_type() : 'production',
	];

	// Call API.
	$response = wp_remote_post(
		ALM_STORE_URL,
		[
			'method'    => 'POST',
			'body'      => $api_params,
			'timeout'   => 15,
			'sslverify' => apply_filters( 'alm_licensing_sslverify', false ),
		]
	);

	$message = 'Plugin activated successfully!';

	// Make sure the response came back okay.
	if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
		if ( is_wp_error( $response ) ) {
			$message = $response->get_error_message();
		} else {
			$message = __( 'An error occurred, please try again.', 'ajax-load-more' );
		}
	} else {
		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		if ( false === $license_data->success ) {
			switch ( $license_data->error ) {
				case 'expired':
					$message = sprintf(
						/* translators: the license key expiration date */
						__( 'Your license key expired on %s.', 'ajax-load-more' ),
						date_i18n( get_option( 'date_format' ), strtotime( $license_data->expires, current_time( 'timestamp' ) ) )
					);
					break;

				case 'disabled':
				case 'revoked':
					$message = __( 'Your license key has been disabled.', 'ajax-load-more' );
					break;

				case 'missing':
					$message = __( 'Invalid license.', 'ajax-load-more' );
					break;

				case 'invalid':
				case 'site_inactive':
					$message = __( 'Your license is not active for this URL.', 'ajax-load-more' );
					break;

				case 'item_name_mismatch':
					/* translators: the plugin name */
					$message = sprintf( __( 'This appears to be an invalid license key for %s.', 'ajax-load-more' ), $item_name );
					break;

				case 'no_activations_left':
					$message = __( 'Your license key has reached its activation limit.', 'ajax-load-more' );
					break;

				default:
					$message = __( 'An error occurred, please try again.', 'ajax-load-more' );
					break;
			}
		}
	}

	echo '<div style="padding-left:200px;">';
	alm_print( $_POST ); // Debugging line, remove in production
	echo $message . '<br />';
	echo "{$item_option}_status" . '<br />';
	echo "{$item_option}_data" . '<br />';
	alm_print( $license_data ); // Debugging line, remove in production
	echo '</div>';

	// Update the options for the license.
	update_option( "{$item_option}_status", $license_data->license );
	update_option( "{$item_option}_data", json_encode( $license_data ), false ); // Store the complete license data as JSON.
	update_option( $item_key, $license );

	// If error, make error the status of the license an error.
	$license_status = ( isset( $license_data->error ) ) ? $license_data->error : $license_data->license;

	// Set transient value to store license status.
	set_transient( "alm_{$item_id}_{$license}", $license_status, 168 * HOUR_IN_SECONDS ); // 7 days

	// // Check if anything passed on a message constituting a failure
	// if ( ! empty( $message ) ) {
	// $redirect = add_query_arg(
	// [
	// 'page'          => EDD_SAMPLE_PLUGIN_LICENSE_PAGE,
	// 'sl_activation' => 'false',
	// 'message'       => rawurlencode( $message ),
	// ],
	// admin_url( 'plugins.php' )
	// );

	// wp_safe_redirect( $redirect );
	// exit();
	// }

	// // $license_data->license will be either "valid" or "invalid"
	// if ( 'valid' === $license_data->license ) {
	// update_option( 'edd_sample_license_key', $license );
	// }
	// update_option( 'edd_sample_license_status', $license_data->license );
	// wp_safe_redirect( admin_url( 'plugins.php?page=' . EDD_SAMPLE_PLUGIN_LICENSE_PAGE ) );

	// exit();
}
add_action( 'admin_init', 'alm_activate_license' );

/**
 * Activate Add-on licenses.
 *
 * @since 2.8.3
 */
function alm_license_activation() {
	$form_data = filter_input_array( INPUT_GET );

	if ( ! current_user_can( apply_filters( 'alm_user_role', 'edit_theme_options' ) ) || ! isset( $form_data['nonce'] ) ) {
		// Bail early if missing WP capabilities or nonce.
		return;
	}

	if ( ! wp_verify_nonce( $form_data['nonce'], 'alm_repeater_nonce' ) ) {
		// Verify nonce.
		wp_die( esc_attr__( 'Error - unable to verify nonce, please try again.', 'ajax-load-more' ) );
	}

	$type    = $form_data['type']; // activate OR deactivate.
	$item_id = $form_data['item'];
	$license = $form_data['license'];
	$upgrade = $form_data['upgrade'];
	$status  = $form_data['status'];
	$key     = $form_data['key'];

	// API Action.
	if ( 'activate' === $type || 'check' === $type ) {
		$action = 'activate_license';
	} else {
		$action = 'deactivate_license';
	}

	// Create the params for the request.
	$api_params = [
		'edd_action'  => $action,
		'license'     => $license,
		'item_id'     => $item_id, // the ID of our product in EDD.
		'url'         => home_url(),
		'environment' => function_exists( 'wp_get_environment_type' ) ? wp_get_environment_type() : 'production',
	];

	// Call API.
	$response = wp_remote_post(
		ALM_STORE_URL,
		[
			'method'    => 'POST',
			'body'      => $api_params,
			'timeout'   => 30,
			'sslverify' => apply_filters( 'alm_licensing_sslverify', false ),
		]
	);

	// Make sure the response came back okay.
	if ( is_wp_error( $response ) ) {
		wp_send_json( $response );
	}

	$license_data = $response['body'];
	$license_data = json_decode( $license_data ); // decode the license data.

	$return['success'] = $license_data->success;

	$msg = '';
	if ( 'activate' === $type ) {
		$return['license_limit']    = $license_data->license_limit;
		$return['expires']          = $license_data->expires;
		$return['site_count']       = $license_data->site_count;
		$return['activations_left'] = $license_data->activations_left;
		$return['item_name']        = $license_data->item_name;

		if ( $license_data->activations_left === 0 && $license_data->success === false ) {
			$msg = '<strong>You\'re out of available licenses <em>( ' . $license_data->license_limit . ' / ' . $license_data->site_count . ' )</em>.</strong>Please visit the <a href="' . $upgrade . '" target="_blank">' . $license_data->item_name . '</a> website to add additional licenses.';
		}
	}
	$return['msg'] = $msg;

	// If error, make error the status of the license an error.
	$license_status = ( isset( $license_data->error ) ) ? $license_data->error : $license_data->license;

	$return['license'] = $license_status;

	// Update the options table.
	update_option( $status, $license_status );
	update_option( $key, $license );

	// Set transient value to store license status.
	set_transient( "alm_{$item_id}_{$license}", $license_status, 168 * HOUR_IN_SECONDS ); // 7 days

	// Send the response.
	wp_send_json( $return );
}
add_action( 'wp_ajax_alm_license_activation', 'alm_license_activation' );

/**
 * Invalid license notifications.
 *
 * @since 3.3.0
 */
function alm_admin_notice_errors() {
	$screen          = get_current_screen();
	$is_admin_screen = alm_is_admin_screen();
	$excluded        = [ 'dashboard', 'plugins', 'options-general', 'options' ];

	// Exit if screen is not dashboard, plugins, settings or ALM admin.
	if ( ! $is_admin_screen && ! in_array( $screen->id, $excluded, true ) ) {
		return;
	}

	$message = '';
	$count   = 0;

	if ( has_action( 'alm_pro_installed' ) ) {
		// Pro.
		$addons  = alm_get_pro_addon();
		$message = __( 'You have an invalid or expired <a href="admin.php?page=ajax-load-more"><b>Ajax Load More Pro</b></a> license key - visit the <a href="admin.php?page=ajax-load-more-licenses">License</a> section to input your key or <a href="https://connekthq.com/plugins/ajax-load-more/pro/" target="_blank">purchase</a> one now.', 'ajax-load-more' );
	} else {
		// Other Addons.
		$addons  = alm_get_addons();
		$message = __( 'You have invalid or expired <a href="admin.php?page=ajax-load-more"><b>Ajax Load More</b></a> license keys - visit the <a href="admin.php?page=ajax-load-more-licenses">Licenses</a> section to input your keys.', 'ajax-load-more' );
	}

	// Loop each addon.
	foreach ( $addons as $addon ) {
		if ( has_action( $addon['action'] ) ) {
			$key    = $addon['key'];
			$option = $addon['settings_field'];

			// Check license status.
			$license_status = alm_license_check( $addon['item_id'], get_option( $key ), $option );
			if ( $license_status !== 'valid' ) {
				++$count;
			}
		}
	}
	if ( $count > 0 ) {
		printf( '<div class="%1$s"><p>%2$s</p></div>', 'notice error alm-err-notice', wp_kses_post( $message ) );
	}
}
add_action( 'admin_notices', 'alm_admin_notice_errors' );

/**
 * Check the status of a license.
 *
 * @param string $item_id The ID of the product.
 * @param string $license The actual license key.
 * @param string $option  The option name of the license.
 * @return bool|string
 * @since 2.8.3
 */
function alm_license_check( $item_id = '', $license = '', $option = '' ) {
	if ( ! $item_id || ! $license || ! $option ) {
		return false;
	}

	// Check for a license transient. This expires after 7 days.
	$transient = get_transient( "alm_{$item_id}_{$license}" );
	if ( $transient ) {
		return $transient;

	} else {
		// Send request to the API to check the license status.
		$api_params = [
			'edd_action' => 'check_license',
			'license'    => $license,
			'item_id'    => $item_id,
			'url'        => home_url(),
		];
		$response   = wp_remote_post(
			ALM_STORE_URL,
			[
				'body'      => $api_params,
				'timeout'   => 15,
				'sslverify' => apply_filters( 'alm_licensing_sslverify', false ),
			]
		);
		if ( is_wp_error( $response ) ) {
			return false;
		}

		// Get Data.
		$license_data = json_decode( wp_remote_retrieve_body( $response ) );
		$status       = isset( $license_data->license ) ? $license_data->license : 'invalid';

		// Update the options table.
		update_option( "{$option}_status", $status, false ); // Store the license status.
		update_option( "{$option}_data", json_encode( $license_data ), false ); // Store the complete license data as JSON.

		// Set transient value to store license status.
		set_transient( $transient, $status, 168 * HOUR_IN_SECONDS ); // 7 days

		return $status; // Return the status.
	}
}

/**
 * Get the license data for a specific addon.
 *
 * @param string $option_name The option name to retrieve the license data from.
 * @return array
 */
function alm_get_license_data( $option_name = '' ) {
	$license_data = get_option( $option_name );
	if ( ! $license_data ) {
		return [];
	}
	return json_decode( $license_data, true );
}

/**
 * Custom licensing update notifications on plugins.php listing.
 *
 * @see https://developer.wordpress.org/reference/hooks/in_plugin_update_message-file/
 * @since 5.2
 */
function alm_plugin_update_license_messages() {
	foreach ( alm_get_addons() as $addon ) {
		$path = $addon['path'];
		$hook = "in_plugin_update_message-{$path}/{$path}.php";
		add_action( $hook, 'alm_prefix_plugin_update_message', 10, 2 );
	}
}
alm_plugin_update_license_messages();

/**
 * Add extra message to plugin updater about expired/inactive licenses.
 *
 * @param array  $plugin_data An array of plugin metadata.
 * @param object $response    An object of metadata about the available plugin update.
 * @since 5.2
 */
function alm_prefix_plugin_update_message( $plugin_data, $response ) {
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
function alm_plugin_row( $plugin_name ) {
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
add_action( 'after_plugin_row', 'alm_plugin_row' );
