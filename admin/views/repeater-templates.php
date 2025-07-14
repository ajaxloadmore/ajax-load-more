<?php
/**
 * Repeater Templates Page.
 *
 * @package AjaxLoadMore
 * @since   2.0.0
 */

$alm_admin_heading   = __( 'Templates', 'ajax-load-more' );
$alm_theme_repeaters = isset( $_GET['theme-templates'] ) ? true : false;
?>
<div class="wrap ajax-load-more main-cnkt-wrap" id="alm-repeaters">
	<?php require_once ALM_PATH . 'admin/includes/components/header.php'; ?>
	<div class="ajax-load-more-inner-wrapper">
		<div class="cnkt-main stylefree repeaters">

			<ul class="alm-toggle-switch">
				<li>
					<?php
						echo '<a href="?page=ajax-load-more-repeaters" class="' . ( ! $alm_theme_repeaters ? 'active' : '' ) . '">' . esc_html__( 'Repeater Templates', 'ajax-load-more' ) . '</a>';
					?>
				</li>
				<li>
					<?php
					echo '<a href="?page=ajax-load-more-repeaters&theme-templates" class="' . ( $alm_theme_repeaters ? 'active' : '' ) . '">' . esc_html__( 'Theme Templates', 'ajax-load-more' ) . '</a>';
					?>
				</li>
			</ul>

			<div class="alm-content-wrap">
				<?php
				// Theme Repeaters.
				if ( $alm_theme_repeaters ) {
					if ( has_action( 'alm_get_theme_repeater' ) ) {
						$dir   = AjaxLoadMore::alm_get_theme_repeater_path();
						$count = 0;
						foreach ( glob( $dir . '/*' ) as $file ) {
							$file = realpath( $file );
							$link = substr( $file, strlen( $dir ) + 1 );

							$file_extension = strtolower( substr( basename( $file ), strrpos( basename( $file ), '.' ) + 1 ) );
							$file_directory = get_option( 'stylesheet' ) . '/' . strtolower( substr( basename( $dir ), strrpos( basename( $dir ), '/' ) ) );
							$id             = preg_replace( '/\\.[^.\\s]{3,4}$/', '', $link );

							// Only display php & html files.
							if ( in_array( $file_extension, [ 'php', 'html' ], true ) ) {
								?>
							<div class="row template" id="tr-<?php echo esc_html( $id ); ?>">
								<h3 class="heading" tabindex="0"><?php echo basename( $file ); ?></h3>
								<div class="expand-wrap">
									<div class="wrap repeater-wrap cm-readonly" data-name="template-tr-<?php echo esc_attr( $id ); ?>">
										<div class="alm-row">
											<div class="column">
												<?php
													// Open file.
													$template    = fopen( $file, 'r' );
													$tr_contents = '';
												if ( filesize( $file ) != 0 ) {
													$tr_contents = fread( $template, filesize( $file ) );
												}
													fclose( $template );
												?>
												<textarea rows="10" id="template-tr-<?php echo $id; ?>" class="_alm_repeater"><?php echo $tr_contents; ?></textarea>
												<script>
													var editor_default = CodeMirror.fromTextArea(document.getElementById("template-tr-<?php echo esc_attr( $id ); ?>"), {
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
										<span title="<?php _e( 'Template Location', 'ajax-load-more' ); ?>">
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
						if ( $count > 1 ) {
							?>
							<div style="padding: 30px; text-align: center;">
								<h3><?php esc_html_e( 'Templates Not Found!', 'ajax-load-more' ); ?></h3>
								<p style="padding: 0 10%;">
									<?php _e( 'You\'ll need to create and upload templates to your theme directory before you can access the templates with Ajax Load More.', 'ajax-load-more' ); ?>
								</p>
								<p style="margin: 20px 0 0;">
									<a href="https://connekthq.com/plugins/ajax-load-more/add-ons/templates/" class="button button-primary" target="_blank"><?php _e( 'Learn More', 'ajax-load-more' ); ?></a>
									<a href="admin.php?page=ajax-load-more#templates_settings" class="button" target="_blank"><?php _e( 'Manage Directory', 'ajax-load-more' ); ?></a>
								</p>
							</div>
						<?php } ?>
						<?php
					} else {
						// CTA: Templates Upgrade.
						alm_display_featured_addon(
							alm_get_addon( 'templates' ),
							'Upgrade Now',
							'Manage Ajax Load More Templates within your current theme directory.',
							'The Templates add-on will allow you load, edit and maintain Ajax Load More Repeater Templates from your theme.'
						);
					}
					?>

					<?php
				} else {
					// Custom Repeaters.
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
						<div class="wrap repeater-wrap
						<?php
						if ( $alm_local_template ) {
							echo ' cm-readonly';
						}
						?>
						" data-name="default" data-type="default">
							<?php
							if ( ! $alm_local_template ) {
								?>
								<div class="alm-row no-padding-btm">
									<div class="column column-9">
										<label class="trigger-codemirror" data-id="default" for="template-default">
											<?php esc_attr_e( 'Template Code:', 'ajax-load-more' ); ?>
											<span><?php esc_attr_e( 'Enter the PHP and HTML markup for this template.', 'ajax-load-more' ); ?></span>
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
									<p class="warning-callout" style="margin: 0;"><?php _e( 'You\'re loading the <a href="https://connekthq.com/plugins/ajax-load-more/docs/repeater-templates/#default-template" target="_blank"><b>Default Template</b></a> (<em>default.php</em>) from your current theme directory. To modify this template, you must edit the file directly on your server.', 'ajax-load-more' ); ?></p>
								</div>
							</div>
							<div class="file-location">
								<span title="<?php _e( 'Template Location', 'ajax-load-more' ); ?>">
									<i class="fa fa-folder-open" aria-hidden="true"></i>
								</span>
								<code title="<?php echo esc_attr( $file ); ?>">themes/<?php echo esc_attr( $file_directory ); ?></code>
							</div>
							<?php } ?>
					</div>
				</div>
				<!-- End Default Template -->
								<?php
								// CTA: Templates Upgrade.
								if ( ! has_action( 'alm_get_unlimited_repeaters' ) ) {
									// If Custom Repeaters NOT installed.
									echo '<p class="alm-add-template"><button disabled="disabled"><i class="fa fa-plus-square"></i> ' . __( 'Add New Template', 'ajax-load-more' ) . '</button></p>';
									echo '<div class="spacer md"></div>';
									include_once ALM_PATH . 'admin/includes/cta/extend.php';
								}

								// Custom Repeaters V1 listing.
								if ( has_action( 'alm_custom_repeaters' ) ) {
									do_action( 'alm_custom_repeaters' );
								}

								// Custom Repeaters V2 listing.
								if ( has_action( 'alm_unlimited_repeaters' ) ) {
									do_action( 'alm_unlimited_repeaters' );
								}
				}
				?>
			</div>
		</div>

		<aside class="cnkt-sidebar" data-sticky>
			<?php
			// TOC for users with Custom Repeaters or Theme Repeaters.
			if ( ( has_action( 'alm_unlimited_repeaters' ) && ! $alm_theme_repeaters ) || ( $alm_theme_repeaters && has_action( 'alm_theme_repeaters_installed' ) ) ) {
				?>
			<div class="table-of-contents repeaters-toc">
				<div class="cta">
					<div class="cta-inner">
						<select class="toc"></select>
					</div>
				</div>
			</div>
			<?php } ?>

			<div class="cta">
				<h3><?php esc_attr_e( 'What\'s a Repeater Template?', 'ajax-load-more' ); ?></h3>
				<div class="cta-inner">
					<p><?php echo wp_kses_post( __( 'A <a href="https://connekthq.com/plugins/ajax-load-more/docs/repeater-templates/" target="_blank">Repeater Template</a> is a snippet of code that will execute over and over within a <a href="https://developer.wordpress.org/themes/basics/the-loop/" target="_blank">WordPress loop</a>', 'ajax-load-more' ) ); ?>.</p>
				</div>
				<div class="major-publishing-actions">
					<a class="button button-primary" href="https://connekthq.com/plugins/ajax-load-more/docs/repeater-templates/" target="_blank">
						<?php esc_attr_e( 'Learn More', 'ajax-load-more' ); ?>
					</a>
				</div>
			</div>
			<?php
			if ( ! $alm_theme_repeaters ) {
				include_once ALM_PATH . 'admin/includes/cta/writeable.php';
			}
			?>
		</aside>
	</div>
</div>
