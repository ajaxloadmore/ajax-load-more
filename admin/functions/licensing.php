<?php
/**
 * ALM licensing admin functions and helpers.
 *
 * @package AjaxLoadMore
 * @since   5.6
 */

/**
 * Activate Add-on licenses.
 *
 * @since 2.8.3
 */
function alm_license_activation() {
	$form_data = filter_input_array( INPUT_GET );

	if ( ! current_user_can( apply_filters( 'alm_user_role', 'edit_theme_options' ) ) || ! isset( $form_data['nonce'] ) ) {
		// Bail early if missing WP capabilities or nonce.
		wp_die( esc_attr__( 'You don\'t belong here.', 'ajax-load-more' ) );
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
	$screen              = get_current_screen();
	$alm_is_admin_screen = alm_is_admin_screen();

	// Exit if screen is not dashboard, plugins, settings or ALM admin.
	if ( ! $alm_is_admin_screen && $screen->id !== 'dashboard' && $screen->id !== 'plugins' && $screen->id !== 'options-general' && $screen->id !== 'options' ) {
		return;
	}

	$class   = 'notice error alm-err-notice';
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
			$status = get_option( $addon['status'] );
			// Check license status.
			$license_status = alm_license_check( $addon['item_id'], get_option( $key ), $status );
			if ( ! isset( $status ) || empty( $status ) || $license_status !== 'valid' ) {
				++$count;
			}
		}
	}

	// Print result.
	if ( $count > 0 ) {
		printf( '<div class="%1$s"><p>%2$s</p></div>', wp_kses_post( $class ), wp_kses_post( $message ) );
	}
}
add_action( 'admin_notices', 'alm_admin_notice_errors' );


/**
 * Check the status of a license.
 *
 * @param string $item_id The ID of the product.
 * @param string $license The actual license key.
 * @param string $status The status of the license.
 * @since 2.8.3
 */
function alm_license_check( $item_id = null, $license = null, $status = null ) {
	if ( ! $item_id || ! $license || ! $status ) {
		return false;
	}

	// Get plugin transient for license status.
	if ( get_transient( "alm_{$item_id}_{$license}" ) ) {

		// Transient exists.
		return get_transient( "alm_{$item_id}_{$license}" );

	} else {
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
				'sslverify' => false,
			]
		);
		if ( is_wp_error( $response ) ) {
			return false;
		}

		// Get Data.
		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		// Update the options table.
		update_option( $status, $license_data->license );

		// Set transient value to store license status.
		set_transient( "alm_{$item_id}_{$license}", $license_data->license, 168 * HOUR_IN_SECONDS ); // 7 days

		// Return the status.
		return $license_data->license;
	}
}

/**
 * Custom licensing update notifications on plugins.php listing.
 *
 * @see https://developer.wordpress.org/reference/hooks/in_plugin_update_message-file/
 * @since 5.2
 */
function alm_plugin_update_license_messages() {
	$addons = alm_get_addons();
	foreach ( $addons as $addon ) {
		$path = $addon['path'];
		$hook = "in_plugin_update_message-{$path}/{$path}.php";
		add_action( $hook, 'alm_prefix_plugin_update_message', 10, 2 );
	}
}
alm_plugin_update_license_messages();

/**
 * Add extra message to plugin updater about expired/inactive licenses.
 *
 * @param array  $data     An array of plugin metadata.
 * @param object $response An object of metadata about the available plugin update.
 * @since 5.2
 */
function alm_prefix_plugin_update_message( $data, $response ) {
	$addons  = alm_get_addons();
	$slug    = $response->slug;
	$version = $response->new_version;

	foreach ( $addons as $key => $addon ) {
		if ( $addon['path'] === $slug ) {
			$index = $key;
		}
	}

	if ( isset( $index ) ) {
		$style = 'display: block; padding: 10px 5px 2px;';
		$addon = $addons[ $index ];

		if ( isset( $addon ) ) {
			$name   = '<strong>' . $addon['name'] . '</strong>';
			$status = get_option( $addon['status'] );

			// Expired.
			if ( $status === 'expired' ) {
				printf(
					'<span style="' . esc_html( $style ) . '">%s %s</span>',
					esc_html( __( 'Looks like your subscription has expired.', 'ajax-load-more' ) ),
					wp_kses_post( __( 'Please login to your <a href="https://connekthq.com/account/" target="_blank">Account</a> to renew the license.', 'ajax-load-more' ) )
				);
			}

			// Invalid/Inactive.
			if ( $status === 'invalid' || $status === 'disabled' ) {
				printf(
					'<span style="' . esc_html( $style ) . '">%s %s</span>',
					esc_html( __( 'Looks like your license is inactive and/or invalid.', 'ajax-load-more' ) ),
					wp_kses_post( __( 'Please activate the <a href="admin.php?page=ajax-load-more-licenses" target="_blank">license</a> or login to your <a href="https://connekthq.com/account/" target="_blank">Account</a> to renew the license.', 'ajax-load-more' ) )
				);
			}

			// Deactivated.
			if ( $status === 'deactivated' ) {
				printf(
					'<span style="' . esc_html( $style ) . '">%s %s</span>',
					esc_html( __( 'Looks like your license has been deactivated.', 'ajax-load-more' ) ),
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
	$addons     = alm_get_addons();
	$pro_addons = alm_get_pro_addon();

	$addons = array_merge( alm_get_addons(), alm_get_pro_addon() );
	foreach ( $addons as $addon ) {
		if ( $plugin_name === $addon['path'] . '/' . $addon['path'] . '.php' ) {

			$status = get_option( $addon['status'] );
			$name   = $addon['name'];
			$style  = 'margin: 5px 20px 6px 40px;';

			// Invalid.
			if ( $status !== 'valid' ) {
				$title = $name === 'Ajax Load More Pro' ? '<strong>' . $name . '</strong>' : '<strong>Ajax Load More: ' . $name . '</strong>';

				$row = '</tr><tr class="plugin-update-tr"><td colspan="3" class="plugin-update"><div class="update-message" style="' . $style . '">';
				/* translators: %1$s is replaced with link href */
				$row .= sprintf( wp_kses_post( __( '%1$sRegister%2$s your copy of %3$s to receive access to automatic upgrades and support. Need a license key? %4$sPurchase one now%5$s.', 'ajax-load-more' ) ), '<a href="admin.php?page=ajax-load-more-licenses">', '</a>', $title, '<a href="' . $addon['url'] . '" target="blank">', '</a>' );
				$row .= '</div></td>';

				// phpcs:ignore
				echo $row;
			}
		}
	}
}
add_action( 'after_plugin_row', 'alm_plugin_row' );
