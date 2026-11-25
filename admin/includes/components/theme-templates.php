<?php
/**
 * Theme Templates Display.
 *
 * @package AjaxLoadMore
 */

if ( has_action( 'alm_get_theme_repeater' ) ) {
	$dir   = AjaxLoadMore::alm_get_theme_repeater_path();
	$count = 0;
	$files = $dir ? glob( $dir . '/*' ) : [];
	foreach ( $files ? $files : [] as $file ) {
		if ( ! is_file( $file ) || ! alm_is_path_inside( $file, $dir ) ) {
			continue; // Skip files that resolve outside of the template directory.
		}

		$file           = realpath( $file );
		$file_extension = strtolower( substr( basename( $file ), strrpos( basename( $file ), '.' ) + 1 ) );
		$file_directory = get_option( 'stylesheet' ) . '/' . strtolower( substr( basename( $dir ), strrpos( basename( $dir ), '/' ) ) );
		$template_id    = preg_replace( '/\\.[^.\\s]{3,4}$/', '', substr( $file, strlen( $dir ) + 1 ) );

		// Only display php & html files.
		if ( in_array( $file_extension, [ 'php', 'html' ], true ) ) {
			?>
		<div class="row template" id="tr-<?php echo esc_html( $template_id ); ?>">
			<h3 class="heading" tabindex="0"><?php echo esc_html( basename( $file ) ); ?></h3>
			<div class="expand-wrap">
				<div class="wrap repeater-wrap cm-readonly" data-name="template-tr-<?php echo esc_attr( $template_id ); ?>">
					<div class="alm-row">
						<div class="column">
							<?php
							// Open file.
							$template    = fopen( $file, 'r' ); // phpcs:ignore
							$tr_contents = '';
							if ( filesize( $file ) !== 0 ) {
								$tr_contents = fread( $template, filesize( $file ) ); // phpcs:ignore
							}
							fclose( $template ); // phpcs:ignore
							?>
							<textarea rows="10" id="template-tr-<?php echo $template_id; ?>" class="_alm_repeater"><?php echo $tr_contents; // phpcs:ignore ?></textarea>
							<script>
								var editor_default = CodeMirror.fromTextArea(document.getElementById("template-tr-<?php echo esc_attr( $template_id ); ?>"), {
									mode:  "application/x-httpd-php",
									lineNumbers: true,
									styleActiveLine: true,
									lineWrapping: true,
									matchBrackets: true,
									viewportMargin: Infinity,
									foldGutter: true,
									viewportMargin: Infinity,
									readOnly: true,
									gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
								});
							</script>
						</div>
					</div>
					<?php
					$repeater_options = [
						'path' => $file,
						'name' => basename( $file ),
						'dir'  => $dir,
						'type' => 'theme-repeater',
					];
					include ALM_PATH . 'admin/includes/components/repeater-options.php';
					unset( $repeater_options );
					?>
				</div>
				<div class="file-location">
					<span title="<?php esc_attr_e( 'Template Location', 'ajax-load-more' ); ?>">
						<i class="fa fa-folder-open" aria-hidden="true"></i>
					</span>
					<code title="<?php echo esc_attr( $file ); ?>">themes/<?php echo esc_attr( $file_directory ); ?>/<?php echo esc_attr( basename( $file ) ); ?></code>
				</div>
			</div>
		</div>
			<?php
			++$count;
			unset( $template );
			unset( $file );
		}
	}
	// Expand/Collapse toggle.
	if ( $count > 1 ) {
		include ALM_PATH . 'admin/includes/components/toggle-all-button.php';
	}
	?>
	<?php
	// Empty Theme Theme Templates.
	if ( $count < 1 ) {
		?>
		<div style="padding: 75px 25px; text-align: center;">
			<h3><?php esc_html_e( 'Templates Not Found!', 'ajax-load-more' ); ?></h3>
			<p style="padding: 0 10%;">
								<?php esc_html_e( 'Templates must be uploaded to your selected Theme Templates directory before this feature can be used.', 'ajax-load-more' ); ?>
			</p>
			<p style="margin: 20px 0 0;">
				<a href="https://ajaxloadmore.com/add-ons/templates/" class="button button-primary" target="_blank"><?php esc_html_e( 'Learn More', 'ajax-load-more' ); ?></a>
				<a href="admin.php?page=ajax-load-more#templates_settings" class="button"><?php esc_html_e( 'Manage Directory', 'ajax-load-more' ); ?></a>
			</p>
		</div>
	<?php } ?>
	<?php
} else {
	// CTA: Templates Upgrade.
	alm_display_featured_addon(
		alm_get_addon( 'templates' ),
		'Upgrade Now',
		'Load Ajax Load More Templates from your active theme.',
		'The Templates add-on will allow you load, edit, and manage Ajax Load More Repeater Templates from your theme.',
		'img/add-ons/theme-repeater-add-on.jpg',
	);
}
