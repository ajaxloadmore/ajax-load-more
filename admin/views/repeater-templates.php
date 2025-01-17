<?php
/**
 * Repeater Templates Page.
 *
 * @package AjaxLoadMore
 * @since   2.0.0
 */

$alm_admin_heading   = __( 'Templates', 'ajax-load-more' );
$alm_theme_repeaters = isset( $_GET['theme-repeaters'] ) ? true : false;
?>
<div class="wrap ajax-load-more main-cnkt-wrap" id="alm-repeaters">
	<?php require_once ALM_PATH . 'admin/includes/components/header.php'; ?>
	<div class="ajax-load-more-inner-wrapper">
		<div class="cnkt-main stylefree repeaters">
			<ul class="alm-toggle-switch">
				<li>
					<a href="?page=ajax-load-more-repeaters" class="
					<?php
					if ( ! $alm_theme_repeaters ) {
						echo 'active'; }
					?>
					">
						<?php esc_html_e( 'Repeater Templates', 'ajax-load-more' ); ?>
					</a>
				</li>
				<li>
					<a href="?page=ajax-load-more-repeaters&theme-repeaters" class="
					<?php
					if ( $alm_theme_repeaters ) {
						echo 'active'; }
					?>
					">
						<?php esc_html_e( 'Theme Repeaters', 'ajax-load-more' ); ?>
					</a>
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

							// Only display .php files files.
							$allowed = [ 'php', 'html' ];
							if ( in_array( $file_extension, $allowed, true ) ) {
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

										<div class="alm-row">
											<div class="column">
												<div class="file-location">
													<p><?php _e( 'Location', 'ajax-load-more' ); ?>:</p>
													<code title="<?php echo $file; ?>"><?php echo $file_directory; ?>/<?php echo basename( $file ); ?></code>
												</div>
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
						// Empty Theme Repeaters.
						if ( 0 === $count ) {
							?>
							<div style="padding: 25px; text-align: center;">
								<h3><?php esc_html_e( 'Theme Repeaters Not Found!', 'ajax-load-more' ); ?></h3>
								<p style="padding: 0 10%;">
									<?php _e( 'You\'ll need to create and upload templates to your theme directory before you can access them with Ajax Load More', 'ajax-load-more' ); ?>.
								</p>
								<p style="margin: 20px 0 0;">
									<a href="https://connekthq.com/plugins/ajax-load-more/add-ons/theme-repeaters/" class="button button-primary button-large" target="_blank"><?php _e( 'Learn More', 'ajax-load-more' ); ?></a>
									<a href="admin.php?page=ajax-load-more" class="button button-large" target="_blank"><?php _e( 'Manage Settings', 'ajax-load-more' ); ?></a>
								</p>
							</div>
						<?php } ?>

						<?php
					} else {
						// Theme Repeaters Upgrade CTA.
						echo wp_kses_post( alm_display_featured_addon( alm_get_addon( 'theme-repeaters' ), 'Upgrade Now' ) );
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
					// if theme or child theme contains the template, use that file.
					if ( file_exists( $alm_template_theme_file ) ) {
						$alm_local_template = true;
						$alm_read_only      = true;
					}

					$filename = alm_get_default_repeater(); // Get default repeater template.
					$content  = '';
					if ( file_exists( $filename ) ) {
						// phpcs:ignore
						$handle   = fopen( $filename, 'r' );
						// phpcs:ignore
						$content = filesize( $filename ) !== 0 ? fread( $handle, filesize( $filename ) ) : '';
						// phpcs:ignore
						fclose( $handle );
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

							<div class="alm-row">
								<div class="column">
									<?php if ( ! $alm_local_template ) { ?>

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
												?>
										<?php } ?>

										<?php
									} else {
										$file_directory = get_option( 'stylesheet' ) . '/' . strtolower( substr( basename( $alm_template_dir ), strrpos( basename( $alm_template_dir ), '/' ) ) );
										?>
									<p class="warning-callout" style="margin-right: 0; margin-left: 0;"><?php _e( 'It appears you are loading the <a href="https://connekthq.com/plugins/ajax-load-more/docs/repeater-templates/#default-template" target="_blank"><b>default template</b></a> (<em>default.php</em>) from your current theme directory. To modify this template, you must edit the file directly on your server.', 'ajax-load-more' ); ?></p>
									<div class="file-location">
										<p title="<?php echo esc_attr( $filename ); ?>"><?php esc_attr_e( 'Location', 'ajax-load-more' ); ?>:</p>
										<code><?php echo $file_directory; // phpcs:ignore ?></code>
									</div>
									<?php } ?>

									<?php
									// Disbaled Repeater Templates warning.
									if ( ! $alm_local_template && defined( 'ALM_DISABLE_REPEATER_TEMPLATES' ) && ALM_DISABLE_REPEATER_TEMPLATES ) {
										?>
										<p class="warning-callout notify" style="margin-right: 0; margin-left: 0; margin-bottom: 0;">
											<?php echo wp_kses_post( __( 'Repeater Templates editing has been disabled for this instance of Ajax Load More. To enable the template editing, please remove the <strong>ALM_DISABLE_REPEATER_TEMPLATES</strong> PHP constant from your wp-config.php (or functions.php) and re-activate the plugin.', 'ajax-load-more' ) ); ?>
										</p>
									<?php } ?>

								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- End Default Template -->

				<!-- Custom Repeaters -->
					<?php
					// Custom Repeaters CTA.
					if ( ! has_action( 'alm_get_unlimited_repeaters' ) && ! has_action( 'alm_get_custom_repeaters' ) ) {
						// If Custom Repeaters NOT installed.
						echo '<div class="spacer lg"></div>';
						include_once ALM_PATH . 'admin/includes/cta/extend.php';
					}

					// Render Custom Repeaters V1.
					if ( has_action( 'alm_custom_repeaters' ) ) {
						do_action( 'alm_custom_repeaters' );
					}
					// Render Custom Repeaters V2.
					if ( has_action( 'alm_unlimited_repeaters' ) ) {
						do_action( 'alm_unlimited_repeaters' );
					}
					?>
				<script>
					jQuery(document).ready(function($) {
						"use strict";
						var _alm_admin = {};

						/**
						 * Save Custom Repeater Value
						 *
						 * @since 2.0.0
						 */
						_alm_admin.saveRepeater = function(btn, editorId) {
							var container = btn.closest('.repeater-wrap'),
								el = $('textarea._alm_repeater', container),
								textarea = el.next('.CodeMirror'),
								btn = btn,
								value = '',
								repeater = container.data('name'), // Get templete name
								type = container.data('type'), // Get template type (default/repeater/unlimited)
								alias = ($('input._alm_repeater_alias', container).length) ? $('input._alm_repeater_alias', container).val() : '',
								responseText = $(".saved-response", container),
								warning = $('.missing-template', container);

							if(type === undefined) // Fix for custom repeaters v1
								type = 'undefined';

							// Get value from CodeMirror textarea.
							var id = editorId.replace('template-', ''); // Editor ID

							if(id === 'default'){
								// Default Template
								value = editor_default.getValue();
							}else{
								// Repeater Templates
								var eid = window['editor_'+id]; // Get editor ID.
								value = eid.getValue();
							}

							// if value is null, then set repeater to non breaking space.
							if(value === '' || value === 'undefined'){
								value = '&nbsp;';
							}

							// If template is not already saving, then proceed.
							if (!btn.hasClass('saving')) {
								btn.addClass('saving');
								textarea.addClass('loading');
								responseText.addClass('loading').html('<?php _e( 'Saving template...', 'ajax-load-more' ); ?>');
								responseText.animate({'opacity' : 1});

								$.ajax({
									type: 'POST',
									url: alm_admin_localize.ajax_admin_url,
									data: {
										action: 'alm_save_repeater',
										value: value,
										repeater: repeater,
										type: type,
										alias: alias,
										nonce: alm_admin_localize.alm_admin_nonce,
									},
									success: function(response) {

										$('textarea#'+editorId).val(value); // Set the target textarea val to 'value'

										setTimeout(function() {
											responseText.delay(500).html(response).removeClass('loading');
											textarea.removeClass('loading');
											if(warning){
												warning.remove();
											}
										}, 250);

										setTimeout(function() {
											responseText.animate({'opacity': 0}, function(){
												responseText.html('&nbsp;');
												btn.removeClass('saving');
											});

										}, 3000);

									},
									error: function(xhr, status, error) {
										responseText.html('<?php _e( 'Something went wrong and the data could not be saved.', 'ajax-load-more' ); ?>').removeClass('loading');
										btn.removeClass('saving');
										textarea.removeClass('loading');
									}
								});
							}
						}

						$(document).on('click', 'input.save-repeater', function(){
							var btn = $(this),
									editorId = btn.data('editor-id');
							_alm_admin.saveRepeater(btn, editorId);
						});

						/**
						 * Update Repeater Value
						 *
						 *  @since 2.5
						 */
						_alm_admin.updateRepeater = function(btn, editorId) {
							var container = btn.closest('.repeater-wrap'),
								el = $('textarea._alm_repeater', container),
								btn = btn,
								btn_text = btn.html(),
								editor = $('.CodeMirror', container),
								repeater = container.data('name'), // Get templete name
								type = container.data('type'); // Get template type (default/repeater/unlimited)

							//Get value from CodeMirror textarea
							var editorId = repeater,
									id = editorId.replace('template-', ''); // Editor ID

							//If template is not already saving, then proceed
							if (!btn.hasClass('updating')) {
								btn.addClass('updating');
								$('span', btn).text("<?php esc_attr_e( 'Updating Template', 'ajax-load-more' ); ?>...");
								editor.addClass('loading');
								$.ajax({
									type: 'POST',
									url: alm_admin_localize.ajax_admin_url,
									data: {
										action: 'alm_update_repeater',
										repeater: repeater,
										type: type,
										nonce: alm_admin_localize.alm_admin_nonce,
									},
									success: function(response) {
										if(id === 'default'){ // Default Template
											editor_default.setValue(response);
										}else{ // Repeater Templates
											var eid = window['editor_'+id]; // Set editor ID
											eid.setValue(response);
										}

										// Clear button styles
										setTimeout(function() {
											$('span', btn).text("<?php esc_attr_e( 'Template Updated', 'ajax-load-more' ); ?>").blur();
											setTimeout(function() {
												btn.closest('.alm-drop-btn').trigger('click'); // CLose drop menu
												btn.removeClass('updating').html(btn_text).blur();
												editor.removeClass('loading');
											}, 400);
										}, 400);

									},
									error: function(xhr, status, error) {
										btn.removeClass('updating').html(btn_text).blur();
										editor.removeClass('loading');
									}
								});
							}
						}

						$('button.option-update').click(function(){
							var btn = $(this);
							_alm_admin.updateRepeater(btn);
						});

					});
				</script>
			<!-- End Repeaters -->
			<?php } ?>
			</div>
		</div>

		<aside class="cnkt-sidebar" data-sticky>
			<?php
				// Temple TOC for users with Custom Repeaters or Theme Repeaters.
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
