<?php
/**
 * ALM Repeater Template admin functions and helpers.
 *
 * @package AjaxLoadMore
 * @since   5.6
 */

/**
 * Repeater Template save functionality.
 *
 * @throws Exception Unable to write to Repeater Template.
 * @since 2.0.0
 */
function alm_save_repeater() {
	$form_data = filter_input_array( INPUT_POST );

	if ( ! current_user_can( apply_filters( 'alm_user_role', 'edit_theme_options' ) ) || ! isset( $form_data['nonce'] ) ) {
		// Bail early if missing WP capabilities or nonce.
		wp_die( esc_attr__( 'You don\'t belong here.', 'ajax-load-more' ) );
	}

	if ( ! wp_verify_nonce( $form_data['nonce'], 'alm_repeater_nonce' ) ) {
		// Verify nonce.
		wp_die( esc_attr__( 'Error - unable to verify nonce, please try again.', 'ajax-load-more' ) );
	}

	global $wpdb;
	$table_name = $wpdb->prefix . 'alm';
	$blog_id    = $wpdb->blogid;
	$options    = get_option( 'alm_settings' );

	// Get form variables.
	$c = trim( stripslashes( $form_data['value'] ) ); // Value.
	$n = trim( stripslashes( str_replace( '/', '', $form_data['repeater'] ) ) ); // Name.
	$t = trim( stripslashes( $form_data['type'] ) ); // Type.
	$a = trim( stripslashes( $form_data['alias'] ) ); // Alias.

		// Default.
	if ( $t === 'default' ) {
		// Create base Repeater Template directory).
		$base_dir = AjaxLoadMore::alm_get_repeater_path();
		AjaxLoadMore::alm_mkdir( $base_dir );
		$f = $base_dir . '/default.php';
	} elseif ( $t === 'unlimited' ) {
		// Custom Repeaters >= 2.5.
		if ( ALM_UNLIMITED_VERSION >= '2.5' ) {
			// Get path to repeater dir (alm_templates).
			$base_dir = AjaxLoadMore::alm_get_repeater_path();
			AjaxLoadMore::alm_mkdir( $base_dir );
			$f = $base_dir . '/' . $n . '.php';
		} else {
			$f = $blog_id > 1 ? ALM_UNLIMITED_PATH . 'repeaters/' . $blog_id . '/' . $n . '.php' : ALM_UNLIMITED_PATH . 'repeaters/' . $n . '.php';
		}
	} else {
		// Custom Repeaters v1.
		$f = ALM_REPEATER_PATH . 'repeaters/' . $n . '.php';
	}

	// Write Repeater Template.
	try {
		// phpcs:ignore
		$o = fopen( $f, 'w+' ); // Open file.
		if ( ! $o ) {
			throw new Exception( '[Ajax Load More] Unable to open repeater template - ' . $f . ' - Please check your file path and ensure your server is configured to allow Ajax Load More to read and write files.' );
		}
		// phpcs:ignore
		$w = fwrite( $o, $c ); // Save the file.
		if ( ! $w ) {
			throw new Exception( '[Ajax Load More] Error saving repeater template - ' . $f . ' - Please check your file path and ensure your server is configured to allow Ajax Load More to read and write files.', 'ajax-load-more' );
		}
		// phpcs:ignore
		fclose( $o ); // Close file.

	} catch ( Exception $e ) {
		// Display error message in console.
		if ( isset( $options['_alm_error_notices'] ) || $options['_alm_error_notices'] === '1' ) {
			echo '<script>console.log("' . wp_kses_post( $e->getMessage() ) . '");</script>';
		}
	}

	// Save to database.
	if ( $t === 'default' ) {
		$data_update = [ 'repeaterDefault' => "$c" ];
		$data_where  = [ 'name' => 'default' ];
	} elseif ( $t === 'unlimited' ) { // Custom Repeaters v2.
		$table_name  = $wpdb->prefix . 'alm_unlimited';
		$data_update = [
			'repeaterDefault' => "$c",
			'alias'           => "$a",
		];
		$data_where  = [ 'name' => $n ];
	} else { // Custom Repeaters.
		$data_update = [
			'repeaterDefault' => "$c",
			'alias'           => "$a",
		];
		$data_where  = [ 'name' => $n ];
	}

	$wpdb->update( $table_name, $data_update, $data_where ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching

	// Handle results message.
	if ( $w ) {
		echo '<span class="saved">' . esc_attr__( 'Template Saved Successfully', 'ajax-load-more' ) . '</span>';
	} else {
		echo '<span class="saved-error"><b>' . esc_attr__( 'Error Writing File', 'ajax-load-more' ) . '</b></span><br/>' . esc_html__( 'Something went wrong and the data could not be saved.', 'ajax-load-more' );
	}

	wp_die();
}
add_action( 'wp_ajax_alm_save_repeater', 'alm_save_repeater' );

/**
 * Update Repeater Template from database.
 * User case: User deletes plugin, then installs again and the version has not change. Click 'Update from DB' option to load template.
 *
 * @since 2.5.0
 */
function alm_update_repeater() {
	$form_data = filter_input_array( INPUT_POST );

	if ( ! current_user_can( apply_filters( 'alm_user_role', 'edit_theme_options' ) ) || ! isset( $form_data['nonce'] ) ) {
		// Bail early if missing WP capabilities or nonce.
		wp_die( esc_attr__( 'You don\'t belong here.', 'ajax-load-more' ) );
	}

	if ( ! wp_verify_nonce( $form_data['nonce'], 'alm_repeater_nonce' ) ) {
		// Verify nonce.
		wp_die( esc_attr__( 'Error - unable to verify nonce, please try again.', 'ajax-load-more' ) );
	}

	// Get form variabless.
	$n = Trim( stripslashes( str_replace( '/', '', $form_data['repeater'] ) ) ); // Repeater name.
	$t = Trim( stripslashes( $form_data['type'] ) ); // Repeater type (default | unlimited).

	// Get value from database.
	global $wpdb;
	$table_name = $wpdb->prefix . 'alm';

	if ( $t === 'default' ) {
		$n = 'default';
	}
	if ( $t === 'unlimited' ) {
		$table_name = $wpdb->prefix . 'alm_unlimited';
	}

	$repeater = $wpdb->get_var( 'SELECT repeaterDefault FROM ' . $table_name . " WHERE name = '" . esc_sql( $n ) . "'" ); // phpcs:ignore

	// Return template value as a string.
	echo $repeater ? $repeater : ''; // phpcs:ignore

	wp_die();
}
add_action( 'wp_ajax_alm_update_repeater', 'alm_update_repeater' );

/**
 * This function will export a repeater template and force download.
 *
 * @since 3.6
 */
function alm_repeaters_export() {
	$form_data = filter_input_array( INPUT_POST );

	// Confirm post data and WP capabilities.
	if ( isset( $form_data['alm_repeaters_export'] ) && ! wp_doing_ajax() && current_user_can( apply_filters( 'alm_user_role', 'edit_theme_options' ) ) ) {

		$type = esc_attr( $form_data['alm_repeaters_export_type'] );
		$name = sanitize_file_name( $form_data['alm_repeaters_export_name'] );

		// Security checker.
		// Note: Confirm filename name does not contain relative server path.
		if ( false !== strpos( $name, './' ) ) {
			wp_die( esc_html__( 'Something isn\'t right here...', 'ajax-load-more' ) );
		}

		if ( $type === 'theme-repeater' ) {
			$file = AjaxLoadMore::alm_get_theme_repeater_path() . '/' . $name;
		} else {
			$file = AjaxLoadMore::alm_get_repeater_path() . '/' . $name . '.php';
		}

		if ( file_exists( $file ) ) {
			header( 'Content-Description: File Transfer' );
			header( 'Content-Type: application/octet-stream' );
			header( 'Content-Disposition: attachment; filename="' . basename( $file ) . '"' );
			// phpcs:ignore
			readfile( $file );
			exit();
		}
	}
}
add_action( 'admin_init', 'alm_repeaters_export' );
