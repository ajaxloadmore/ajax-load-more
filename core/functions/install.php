<?php
/**
 * ALM installation functionality.
 *
 * @package  AjaxLoadMore
 * @since    2.0.0
 */

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

	if ( defined( 'ALM_DISABLE_REPEATER_TEMPLATES' ) && ALM_DISABLE_REPEATER_TEMPLATES ) {
		return;  // Exit if disabled, we don't want to create the table.
	}

	// Create table, if it doesn't already exist.
	// phpcs:ignore
	if ( $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) !== $table_name ) {
		// phpcs:ignore
		$sql = "CREATE TABLE $table_name (
			id mediumint(9) NOT NULL AUTO_INCREMENT,
			name text NOT NULL,
			repeaterDefault longtext NOT NULL,
			repeaterType text NOT NULL,
			UNIQUE KEY id (id)
		);";
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
		// Insert the default data in created table.
		// phpcs:ignore
		$wpdb->insert(
			$table_name,
			[
				'name'            => 'default',
				'repeaterDefault' => $repeater,
				'repeaterType'    => 'default',
			]
		);
	}
}
