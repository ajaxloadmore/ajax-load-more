<?php
/**
 * Repeater Template Writeable CTA
 *
 * @package AjaxLoadMore
 */

// Test server for write capabilities.
$alm_path = AjaxLoadMore::alm_get_repeater_path();
$alm_file = $alm_path . '/default.php'; // Default ALM repeater.

if ( file_exists( $alm_file ) ) {
	if ( is_writable( $alm_file ) ) {
		$status_text = __( 'Read/Write access is enabled within the Ajax Load More Repeater Template directory.', 'ajax-load-more' );
		$status_icon = alm_status_icon( 'success', '', $status_text );
	} else {
		$status_text = __( 'You must enable read/write access to save repeater template data. Please contact your hosting provider or site administrator for more information.', 'ajax-load-more' );
		$status_icon = alm_status_icon( 'failed', '', $status_text );
	}
} else {
	$status_text = __( 'Unable to locate configuration file. Directory access may not be granted.', 'ajax-load-more' );
	$status_icon = alm_status_icon( 'failed', '', $status_text );
}
?>
<div class="cta">
	<header class="cta--header">
		<h3><?php esc_attr_e( 'Read/Write Access', 'ajax-load-more' ); ?></h3>
		<?php echo wp_kses_post( $status_icon ); ?>
	</header>
	<div class="cta-inner">
		<?php
			echo '<p>' . wp_kses_post( $status_text ) . '</p>';
		?>
		<div class="alm-file-location">
			<input type="text" value="<?php echo esc_html( $alm_path ); ?>" readonly="readonly">
		</div>
	</div>
</div>
