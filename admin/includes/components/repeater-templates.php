<?php
/**
 * Repeater Templates Display.
 *
 * @package AjaxLoadMore
 */

if ( has_action( 'alm_custom_repeaters' ) || has_action( 'alm_unlimited_repeaters' ) ) {
	include ALM_PATH . 'admin/includes/components/toggle-all-button.php'; // Expand/Collapse toggle.
}
?>

<!-- Default Template -->
<div class="row template default-repeater" id="default-template">
	<?php
	// Check for local repeater template.
	$alm_local_template = false;
	$alm_read_only      = 'false';
	$alm_template_dir   = 'alm_templates';
	if ( is_child_theme() ) {
		$alm_template_theme_file = get_stylesheet_directory() . '/' . $alm_template_dir . '/default.php';
		if ( ! file_exists( $alm_template_theme_file ) ) {
			$alm_template_theme_file = get_template_directory() . '/' . $alm_template_dir . '/default.php';
		}
	} else {
		$alm_template_theme_file = get_template_directory() . '/' . $alm_template_dir . '/default.php';
	}
	// If theme or child theme contains the template, use that file.
	if ( file_exists( $alm_template_theme_file ) ) {
		$alm_local_template = true;
		$alm_read_only      = true;
	}

	$filename = alm_get_default_repeater(); // Get default repeater template.
	$content  = '';
	if ( file_exists( $filename ) ) {
		$handle   = fopen( $filename, 'r' ); // phpcs:ignore
		$content = filesize( $filename ) !== 0 ? fread( $handle, filesize( $filename ) ) : ''; // phpcs:ignore
		fclose( $handle ); // phpcs:ignore
	}
	?>
	<h3 class="heading" tabindex="0"><?php esc_attr_e( 'Default Template', 'ajax-load-more' ); ?></h3>
	<div class="expand-wrap">
		<div class="wrap repeater-wrap <?php echo ( $alm_local_template ) ? 'cm-readonly' : ''; ?>" data-name="default" data-type="default">
			<?php
			if ( ! $alm_local_template ) {
				?>
				<div class="alm-row no-padding-btm">
					<div class="column column-9">
						<label class="trigger-codemirror" data-id="default" for="template-default">
							<?php esc_attr_e( 'Template Code:', 'ajax-load-more' ); ?>
							<span><?php esc_attr_e( 'The PHP and HTML markup for this template.', 'ajax-load-more' ); ?></span>
						</label>
					</div>
					<div class="column column-3">
						<?php do_action( 'alm_get_layouts' ); ?>
					</div>
				</div>
				<?php
			}
			?>
			<div class="alm-row">
				<div class="column">
					<?php
					// Add warning if template doesn't exist in filesystem.
					if ( ! $content ) {
						// Get content from DB.
						global $wpdb;
						$table_name = $wpdb->prefix . 'alm';
						$row        = $wpdb->get_row( "SELECT * FROM $table_name WHERE repeaterType = 'default'" ); // Get first result only
						$content    = ! empty( $row ) && $row->repeaterDefault ? $row->repeaterDefault : '';
						?>
					<p class="warning-callout notify missing-template" style="margin: 10px 0 20px;">
						<?php esc_attr_e( 'This default ALM template is missing from the filesystem! Click the "Save Template" button to save the template.', 'ajax-load-more' ); ?>
					</p>
					<?php } ?>
					<textarea rows="10" id="template-default" class="_alm_repeater"><?php echo $content; // phpcs:ignore ?></textarea>
					<script>
						var editor_default = CodeMirror.fromTextArea(document.getElementById("template-default"), {
							mode:  "application/x-httpd-php",
							lineNumbers: true,
							styleActiveLine: true,
							lineWrapping: true,
							matchBrackets: true,
							readOnly: true,
							viewportMargin: Infinity,
							foldGutter: true,
							viewportMargin: Infinity,
							readOnly: <?php echo esc_attr( $alm_read_only ); ?>,
							gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
						});
					</script>
				</div>
			</div>

			<?php if ( ! $alm_local_template ) { ?>
			<div class="alm-row">
				<div class="column">
					<?php if ( ! defined( 'ALM_DISABLE_REPEATER_TEMPLATES' ) || ( defined( 'ALM_DISABLE_REPEATER_TEMPLATES' ) && ! ALM_DISABLE_REPEATER_TEMPLATES ) ) { ?>
						<input type="submit" value="<?php _e( 'Save Template', 'ajax-load-more' ); ?>" class="button button-primary save-repeater" data-editor-id="template-default">
						<div class="saved-response">&nbsp;</div>
						<?php
						$repeater_options = [  // phpcs:ignore
							'path' => $filename,
							'name' => 'default',
							'type' => 'standard',
						];
						include ALM_PATH . 'admin/includes/components/repeater-options.php';
						unset( $repeater_options );
					}

					// Disbaled Repeater Templates warning.
					if ( defined( 'ALM_DISABLE_REPEATER_TEMPLATES' ) && ALM_DISABLE_REPEATER_TEMPLATES ) {
						?>
						<p class="warning-callout notify" style="margin-right: 0; margin-left: 0; margin-bottom: 0;">
							<?php echo wp_kses_post( __( 'Repeater Templates editing has been disabled for this instance of Ajax Load More. To enable the template editing, please remove the <strong>ALM_DISABLE_REPEATER_TEMPLATES</strong> PHP constant from your wp-config.php (or functions.php) and re-activate the plugin.', 'ajax-load-more' ) ); ?>
						</p>
					<?php } ?>
				</div>
			</div>
			<?php } // End if not local template ?>
		</div>
		<?php
		if ( $alm_local_template ) {
			$file_directory = get_option( 'stylesheet' ) . '/' . strtolower( substr( basename( $alm_template_dir ), strrpos( basename( $alm_template_dir ), '/' ) ) );
			?>
			<div class="alm-row no-padding-top">
				<div class="column">
					<p class="warning-callout" style="margin: 0;"><?php _e( 'You\'re loading the <a href="https://connekthq.com/plugins/ajax-load-more/docs/repeater-templates/#default-template" target="_blank"><b>Default Template</b></a> (<em>default.php</em>) from your active theme directory. To modify this template, you must edit the file directly on your server.', 'ajax-load-more' ); ?></p>
				</div>
			</div>
			<div class="file-location">
				<span title="<?php _e( 'Template Location', 'ajax-load-more' ); ?>">
					<i class="fa fa-folder-open" aria-hidden="true"></i>
				</span>
				<code title="<?php echo esc_attr( $file_directory ); ?>">themes/<?php echo esc_attr( $file_directory ); ?></code>
			</div>
			<?php } ?>
	</div>
</div>
<!-- End Default Template -->
<?php
// CTA: Templates Upgrade.
if ( ! has_action( 'alm_get_unlimited_repeaters' ) ) {
	// If Custom Repeaters NOT installed.
	echo '<div class="spacer md"></div>';
	include_once ALM_PATH . 'admin/includes/cta/extend.php';
	echo '<p class="alm-add-template"><button disabled="disabled"><i class="fa fa-plus-square"></i> ' . __( 'Add New Template', 'ajax-load-more' ) . '</button></p>';
}
// Custom Repeaters V1 listing.
if ( has_action( 'alm_custom_repeaters' ) ) {
	do_action( 'alm_custom_repeaters' );
}
// Custom Repeaters V2 listing.
if ( has_action( 'alm_unlimited_repeaters' ) ) {
	do_action( 'alm_unlimited_repeaters' );
}
