<?php
/**
 * ALM plugin admin update routines.
 *
 * @package AjaxLoadMore
 * @since   5.6
 */

/**
 * ALM upgrade routine.
 *
 * @return void
 */
function alm_upgrade_routine() {
	// Delete `pluginVersion` column from `alm` table.
	if ( get_option( 'alm_drop_pluginVersion' ) !== 'true' ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'alm';
		$wpdb->hide_errors(); // Suppress errors.
		$wpdb->query( "ALTER TABLE $table_name DROP pluginVersion" );
		update_option( 'alm_drop_pluginVersion', 'true' );

		// Delete alm_version option.
		delete_option( 'alm_version' );
	}
}
add_action( 'admin_init', 'alm_upgrade_routine' );
