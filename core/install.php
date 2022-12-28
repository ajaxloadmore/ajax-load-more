<?php
/**
 * ALM installation functionality.
 *
 * @package  AjaxLoadMore
 * @since    2.0.0
 */

/**
 * Activation hook - Create table & repeater.
 *
 * @param Boolean $network_wide Enable the plugin for all sites in the network or just the current site. Multisite only.
 * @since 2.0.0
 */
function alm_install( $network_wide ) {
	global $wpdb;
	add_option( 'alm_version', ALM_VERSION ); // Add setting to options table.
	if ( is_multisite() && $network_wide ) {
		// Get all blogs in the network and activate plugin on each one.
		$blog_ids = $wpdb->get_col( "SELECT blog_id FROM $wpdb->blogs" );
		foreach ( $blog_ids as $blog_id ) {
			switch_to_blog( $blog_id );
			alm_create_table();
			restore_current_blog();
		}
	} else {
		alm_create_table();
	}
}
register_activation_hook( __FILE__, 'alm_install' );
add_action( 'wpmu_new_blog', 'alm_install' );


/**
 * Create new table and repeater template.
 *
 * @since 2.0.0
 * @updated 3.5
 */
function alm_create_table() {
	global $wpdb;
	$table_name = $wpdb->prefix . 'alm';
	$blog_id    = $wpdb->blogid;
	$repeater   = AjaxLoadMore::alm_get_default_repeater_markup();

	// Create Base Repeater Directory.
	$base_dir = AjaxLoadMore::alm_get_repeater_path();
	AjaxLoadMore::alm_mkdir( $base_dir );

	// Create the default repeater template.
	$file = $base_dir . '/default.php';
	if ( ! file_exists( $file ) ) {
		// phpcs:disable
		$tmp = fopen( $file, 'w+' );
		$w   = fwrite( $tmp, $repeater );
		fclose( $tmp );
		// phpcs:enable
	}

	// Exit if Repeater Templates are disabled, we don't want to create the table.
	if ( defined( 'ALM_DISABLE_REPEATER_TEMPLATES' ) && ALM_DISABLE_REPEATER_TEMPLATES ) {
		return;
	}

	// Create table, if it doesn't already exist.
	// phpcs:ignore
	if ( $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) !== $table_name ) {
		$sql = "CREATE TABLE $table_name (
			id mediumint(9) NOT NULL AUTO_INCREMENT,
			name text NOT NULL,
			repeaterDefault longtext NOT NULL,
			repeaterType text NOT NULL,
			pluginVersion text NOT NULL,
			UNIQUE KEY id (id)
		);";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
		// Insert the default data in created table.
		$wpdb->insert(
			$table_name,
			[
				'name'            => 'default',
				'repeaterDefault' => $repeater,
				'repeaterType'    => 'default',
				'pluginVersion'   => ALM_VERSION,
			]
		);
	}
}
