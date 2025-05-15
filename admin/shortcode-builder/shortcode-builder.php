<?php
/**
 * Shortcode Builder.
 *
 * @package AjaxLoadMore
 */

$alm_options = get_option( 'alm_settings' );
if ( empty( $alm_options ) ) {
	$alm_options = [];
}

// Check if '_alm_disable_dynamic is set within settings.
if ( ! isset( $alm_options['_alm_disable_dynamic'] ) ) {
	$alm_options['_alm_disable_dynamic'] = '0';
}

$disable_dynamic_content = $alm_options['_alm_disable_dynamic'];
$show_max                = 100; // Max number of items to show.
?>

<div class="alm-tabbed-wrapper">
	<div class="alm-tabbed-wrapper--nav">
		<div class="cnkt-sticky-wrapper">
			<ul class="cnkt-sticky">
				<?php if ( alm_has_addon_shortcodes() ) { ?>
				<li><button type="button" class="active" data-id="add-ons"><i class="fa fa-plus-circle"></i> <?php _e( 'Add-ons', 'ajax-load-more' ); ?></button></li>
				<?php } ?>
				<?php if ( alm_has_extension_shortcodes() ) { ?>
				<li><button type="button" data-id="extensions"><i class="fa fa-plug"></i> <?php _e( 'Extensions', 'ajax-load-more' ); ?></button></li>
				<?php } ?>
				<li><button type="button" data-id="display-settings"><i class="fa fa-cog"></i> <?php _e( 'Display Settings', 'ajax-load-more' ); ?></button></li>
				<li><button type="button" data-id="query-parameters"><i class="fa fa-database"></i> <?php _e( 'Query Parameters', 'ajax-load-more' ); ?></button></li>
				<li><button type="button" data-id="integrations"><i class="fa fa-handshake-o" aria-hidden="true"></i> <?php _e( 'Integrations', 'ajax-load-more' ); ?></button></li>
			</ul>
		</div>
	</div>

	<div class="alm-tabbed-wrapper--sections">

		<!-- Add-ons -->
		<?php
			// ../admin-functions.php
		if ( alm_has_addon_shortcodes() ) :
			?>
		<div class="shortcode-parameter-wrap alm-tabbed-wrapper--section" tabindex="0" id="add-ons">

			<h2><?php _e( 'Add-ons', 'ajax-load-more' ); ?></h2>
			<p class="section-intro">
				<?php _e( 'Configure your Ajax Load More add-ons.', 'ajax-load-more' ); ?>
			</p>
			<ul class="section-anchor-nav"></ul>

			<div class="section-wrap">
				<?php
				require_once 'components/cache.php';
				require_once 'components/cta.php';
				require_once 'components/comments.php';
				require_once 'components/filters.php';
				require_once 'components/layouts.php';
				require_once 'components/nextpage.php';
				require_once 'components/paging.php';
				require_once 'components/preloaded.php';
				require_once 'components/seo.php';
				require_once 'components/single-post.php';
				?>
			</div>
		</div>
		<?php endif; ?>
		<!-- End Add-ons -->

		<!-- Extensions -->
		<?php
			// ../admin-functions.php
		if ( alm_has_extension_shortcodes() ) :
			?>
		<div class="shortcode-parameter-wrap alm-tabbed-wrapper--section" tabindex="0" id="extensions">
			<h2><?php _e( 'Extensions', 'ajax-load-more' ); ?></h2>
			<p class="section-intro">
				<?php _e( 'Configure your Ajax Load More extensions.', 'ajax-load-more' ); ?>
			</p>
			<ul class="section-anchor-nav"></ul>
			<div class="section-wrap">
				<?php
				require_once 'components/acf.php';
				require_once 'components/rest-api.php';
				require_once 'components/term-query.php';
				require_once 'components/users.php';
				?>
			</div>
		</div>
		<?php endif; ?>
		<!-- End Extensions -->

		<!-- Display Settings -->
		<div class="shortcode-parameter-wrap alm-tabbed-wrapper--section" tabindex="0" id="display-settings">

			<h2><?php _e( 'Display Settings', 'ajax-load-more' ); ?></h2>
			<p class="section-intro">
				<?php _e( 'Display Settings allow you create a custom Ajax Load More experience for your visitors.', 'ajax-load-more' ); ?>
			</p>
			<ul class="section-anchor-nav"></ul>

			<div class="section-wrap">
				<!-- Template Selection -->
				<div class="row repeater" id="alm-template">
					<h3 class="heading" tabindex="0"><?php esc_attr_e( 'Template Selection', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section>
							<div class="shortcode-builder--label">
								<h4><?php esc_attr_e( 'Template', 'ajax-load-more' ); ?></h4>
								<p><?php echo __( 'Select the <a href="admin.php?page=ajax-load-more-repeaters" target="_parent">Repeater Template</a> for displaying the content in the Ajax Load More loop.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<select name="template-select" class="alm_element">
										<optgroup label="<?php _e( 'Custom Repeaters', 'ajax-load-more' ); ?>">
											<option name="default" value="default"><?php _e( 'Default', 'ajax-load-more' ); ?></option>
											<?php
											if ( has_action( 'alm_get_custom_repeaters' ) ) {
												do_action( 'alm_get_custom_repeaters' );
											}
											if ( has_action( 'alm_get_unlimited_repeaters' ) ) {
												do_action( 'alm_get_unlimited_repeaters' );
											}
											?>
										</optgroup>
										<?php
										// Theme Repeaters
										if ( has_action( 'alm_list_theme_repeaters' ) ) {
											echo '<optgroup label="' . __( 'Theme Repeaters', 'ajax-load-more' ) . '">';
											do_action( 'alm_list_theme_repeaters' );
											echo '</optgroup>';
										}
										?>
									</select>
								</div>
							</div>
						</section>
						<?php
						// Custom Repeaters CTA.
						// TODO: Update this to reference the new Templates add-on.
						if ( ! has_action( 'alm_get_unlimited_repeaters' ) && ! has_action( 'alm_theme_repeaters_installed' ) ) {
							echo '<div class="call-out--shortcode-builder">';
							include ALM_PATH . 'admin/includes/cta/extend.php';
							echo '</div>';
						}
						?>
					</div>
				</div>

				<!-- Options -->
				<div class="row input alm-instance-options" id="alm-instance-options">
					<h3 class="heading" tabindex="0"><?php _e( 'Options', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">

						<!-- ID -->
						<section class="first">
							<div class="shortcode-builder--label">
								<h4><?php _e( 'ID', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'Adding a unique ID will allow you target this specific Ajax Load More instance with the alm_query_args_id() filter', 'ajax-load-more' ); ?>."></a></h4>
								<p>
									<?php _e( 'Set a unique ID for this Ajax Load More instance. Lowercase alphanumeric characters only.', 'ajax-load-more' ); ?>
									<small>e.g. my_alm_listing</small>
								</p>
								<p><a class="button-small" href="https://connekthq.com/plugins/ajax-load-more/docs/filter-hooks/#alm_query_args" target="_blank"><?php _e( 'Learn More', 'ajax-load-more' ); ?></a></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<input type="text" class="alm_element id-only" name="unique-id" id="unique-id" style="text-transform: lowercase;" autocomplete="off">
									<div class="clear"></div>
									<p class="generate-id"><a href="javascript:void(0);" data-id="unique-id"><i class="fa fa-random"></i> <?php _e( 'Generate ID', 'ajax-load-more' ); ?></a></p>
								</div>
							</div>
						</section>

						<!-- Loading Style -->
						<?php
						$loading_style = ( isset( $alm_options['_alm_btn_color'] ) ) ? $alm_options['_alm_btn_color'] : 'default';
						$selected      = ' selected="selected"';
						?>
						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Button/Loading Style', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'You can define a global button/loading style on the Ajax Load More settings screen', 'ajax-load-more' ); ?>."></a></h4>
								<p><?php _e( 'Select an Ajax loading style - you can choose between a Button or Infinite Scroll.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<select id="loading-style" class="alm_element" data-default="<?php echo $loading_style; ?>">
										<optgroup label="<?php _e( 'Button Style (Dark)', 'ajax-load-more' ); ?>">
											<option value="default" class="alm-color default"<?php echo ( $loading_style === 'default' ) ? $selected : ''; ?>>Red (Default)</option>
											<option value="blue" class="alm-color blue"<?php echo ( $loading_style === 'blue' ) ? $selected : ''; ?>>Blue</option>
											<option value="green" class="alm-color green"<?php echo ( $loading_style === 'green' ) ? $selected : ''; ?>>Green</option>
											<option value="purple" class="alm-color purple"<?php echo ( $loading_style === 'purple' ) ? $selected : ''; ?>>Purple</option>
											<option value="grey" class="alm-color grey"<?php echo ( $loading_style === 'grey' ) ? $selected : ''; ?>>Grey</option>
										</optgroup>
										<optgroup label="<?php _e( 'Button Style (Light)', 'ajax-load-more' ); ?>">
											<option value="white" class="alm-color white"<?php echo ( $loading_style === 'white' ) ? $selected : ''; ?>>White</option>
											<option value="light-grey" class="alm-color light-grey"<?php echo ( $loading_style === 'light-grey' ) ? $selected : ''; ?>>Light Grey</option>
										</optgroup>
										<optgroup label="<?php _e( 'Infinite Scroll (No Button)', 'ajax-load-more' ); ?>">
											<option value="infinite classic" class="infinite classic"<?php echo ( $loading_style === 'infinite classic' ) ? $selected : ''; ?>>Classic</option>
											<option value="infinite skype" class="infinite skype"<?php echo ( $loading_style === 'infinite skype' ) ? $selected : ''; ?>>Skype</option>
											<option value="infinite ring" class="infinite ring"<?php echo ( $loading_style === 'infinite ring' ) ? $selected : ''; ?>>Circle Fill</option>
											<option value="infinite fading-blocks" class="infinite fading-blocks"<?php echo ( $loading_style === 'infinite fading-blocks' ) ? $selected : ''; ?>>Fading Blocks</option>
											<option value="infinite fading-circles" class="infinite fading-circles"<?php echo ( $loading_style === 'infinite fading-circles' ) ? $selected : ''; ?>>Fading Circles</option>
											<option value="infinite chasing-arrows" class="infinite chasing-arrows"<?php echo ( $loading_style === 'infinite chasing-arrows' ) ? $selected : ''; ?>>Chasing Arrows</option>
										</optgroup>
									</select>
									<div class="clear"></div>
									<div class="ajax-load-more-wrap core target <?php echo $loading_style; ?>" data-base="ajax-load-more-wrap core ">
										<div class="alm-btn-wrap">
											<span><?php _e( 'CLICK TO PREVIEW', 'ajax-load-more' ); ?></span>
											<button class="alm-load-more-btn" type="button">
												<?php echo apply_filters( 'alm_button_label', __( 'Load More', 'ajax-load-more' ) ); ?>
											</button>
										</div>
									</div>
								</div>
							</div>
						</section>

						<!-- Container Type -->
						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Container Type', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'You can define a global container type on the Ajax Load More settings screen', 'ajax-load-more' ); ?>."></a></h4>
								<p><?php _e( 'Override the global Container Type set in <a href="admin.php?page=ajax-load-more">ALM Settings</a>.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<ul class="container_type">
										<li>
										<input type="radio" id="type-ul" value="ul" name="alm_container_type" class="alm_element">
										<label for="type-ul">&lt;ul /&gt;</label>
										</li>
										<li>
										<input type="radio" id="type-div" value="div" name="alm_container_type" class="alm_element">
										<label for="type-div">&lt;div /&gt;</label>
										</li>
										<li>
										<input type="radio" id="type-ol" value="ol" name="alm_container_type" class="alm_element">
										<label for="type-ol">&lt;ol /&gt;</label>
										</li>
										<li>
										<input type="radio" id="type-table" value="table" name="alm_container_type" class="alm_element">
										<label for="type-table">&lt;table /&gt;</label>
										</li>
									</ul>
								</div>
							</div>
						</section>

						<!-- Container Classes -->
						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Container Classes', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'You can define global container classes on the Ajax Load More settings screen', 'ajax-load-more' ); ?>."></a></h4>
								<p>
									<?php _e( 'Add custom CSS classes to the <span>.alm-listing</span> container.', 'ajax-load-more' ); ?>
									<small>e.g. row blog-listing etc...</small>
								</p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<input class="alm_element" name="container-classes" type="text" id="container-classes" placeholder="row blog-listing">
								</div>
							</div>
						</section>

						<!-- Pause -->
						<section class="pause_load" id="alm-pause">
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Pause', 'ajax-load-more' ); ?></h4>
								<p><?php _e( 'Do not load Ajax content until the user clicks or interacts with the <em>Load More</em> button.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<ul>
										<li>
										<input class="alm_element" type="radio" name="pause" value="t" id="pause_t">
										<label for="pause_t"><?php _e( 'True', 'ajax-load-more' ); ?></label>
										</li>
										<li>
										<input class="alm_element" type="radio" name="pause" value="f" id="pause_f" checked="checked">
										<label for="pause_f"><?php _e( 'False', 'ajax-load-more' ); ?></label>
										</li>
									</ul>
								</div>
							</div>
						</section>

						<!-- Destroy After -->
						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Destroy After', 'ajax-load-more' ); ?></h4>
								<p><?php _e( 'Remove Ajax Load More functionality after {<em>n</em>} number of pages have been loaded.', 'ajax-load-more' ); ?></p>
								<p><a class="button-small" href="https://connekthq.com/plugins/ajax-load-more/examples/destroy-after/" target="_blank"><?php _e( 'View Example', 'ajax-load-more' ); ?></a></p>
							</div>
							<div class="shortcode-builder--fields alm-destroy-after">
								<div class="inner">
									<input type="number" class="alm_element numbers-only" placeholder="0" name="destroy-after" id="disable-after" step="1" min="0" value="">
								</div>
							</div>
						</section>

						<!-- Images Loaded -->
						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Images Loaded', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'Background images are not supported.', 'ajax-load-more' ); ?>"></a></h4>
								<p><?php _e( 'Wait for all images to load before displaying ajax loaded content.', 'ajax-load-more' ); ?></p>
								<p><a class="button-small" href="https://connekthq.com/plugins/ajax-load-more/examples/images-loaded/" target="_blank"><?php _e( 'View Example', 'ajax-load-more' ); ?></a></p>
							</div>
							<div class="shortcode-builder--fields alm-images-loaded">
								<div class="inner">
									<ul>
										<li>
											<input class="alm_element" type="radio" name="images_loaded" value="t" id="images_loaded_t">
											<label for="images_loaded_t"><?php _e( 'True', 'ajax-load-more' ); ?></label>
										</li>
										<li>
											<input class="alm_element" type="radio" name="images_loaded" value="f" id="images_loaded_f" checked="checked">
											<label for="images_loaded_f"><?php _e( 'False', 'ajax-load-more' ); ?></label>
										</li>
									</ul>
								</div>
							</div>
						</section>

						<!-- Loading Placeholder -->
						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Loading Placeholder', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'A loading placeholder can help the understand content is about to rendered.', 'ajax-load-more' ); ?>"></a></h4>
								<p><?php _e( 'Display a placeholder image while Ajax content is being loaded.', 'ajax-load-more' ); ?></p>
								<p><a class="button-small" href="https://connekthq.com/plugins/ajax-load-more/examples/placeholder/" target="_blank"><?php _e( 'View Example', 'ajax-load-more' ); ?></a></p>
							</div>
							<div class="shortcode-builder--fields alm-placeholder-wrap">
								<div class="inner">
									<ul>
										<li>
											<input class="alm_element" type="radio" name="has_placeholder" value="t" id="has_placeholder_t">
											<label for="has_placeholder_t"><?php _e( 'True', 'ajax-load-more' ); ?></label>
										</li>
										<li>
											<input class="alm_element" type="radio" name="has_placeholder" value="f" id="has_placeholder_f" checked="checked">
											<label for="has_placeholder_f"><?php _e( 'False', 'ajax-load-more' ); ?></label>
										</li>
									</ul>
								</div>
								<div class="inner alm-placeholder-target" style="display: none;">
									<div class="alm-styled-input">
										<label for="placeholder" aria-label="Enter Placeholder URL"><?php _e( 'URL:', 'ajax-load-more' ); ?></label>
										<input class="alm_element" name="placeholder" type="text" id="placeholder" data-empty="<?php echo ALM_URL; ?>/build/frontend/img/placeholder.png" value="<?php echo ALM_URL; ?>/build/frontend/img/placeholder.png" style="width: 100%;" />
									</div>
									<div class="spacer"></div>
									<img id="placeholder-img" style="padding: 10px; border: 2px dashed #efefef;" src="<?php echo ALM_URL; ?>/build/frontend/img/placeholder.png" value="<?php echo ALM_URL; ?>/build/frontend/img/placeholder.png" alt="" />
								</div>
							</div>
						</section>

						<!-- No Results -->
						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'No Results Text', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'HTML is allowed, however when adding quote marks in classnames or IDs you must single quotes as shown in the example.', 'ajax-load-more' ); ?>"></a></h4>
								<p><?php _e( 'Add text/html to be displayed when no results are returned in the Ajax query.', 'ajax-load-more' ); ?><br/><small><?php _e( 'e.g. &lt;div class=\'no-results\'>Sorry, nothing found in this query&lt;/div>', 'ajax-load-more' ); ?></small></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner ">
									<textarea class="alm_element" id="no_results_text" rows="6"></textarea>
								</div>
							</div>
						</section>

					</div>
				</div>
				<!-- End Options -->

				<!-- Button Labels -->
				<div class="row input btn-label" id="alm-btn-label">
					<h3 class="heading" tabindex="0"><?php _e( 'Button Labels', 'ajax-load-more' ); ?></h3>

					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Label', 'ajax-load-more' ); ?></h4>
								<p><?php _e( 'Customize the text of the <em>Load More</em> button.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<input class="alm_element" name="button-label" type="text" id="button-label" value="<?php _e( 'Load More', 'ajax-load-more' ); ?>">
								</div>
							</div>
						</section>

						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Loading Label', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'Leave field empty to not update button text while loading content', 'ajax-load-more' ); ?>."></a></h4>
								<p><?php _e( 'Update the text of the <em>Load More</em> button while content is loading.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<input class="alm_element" name="button-loading-label" type="text" id="button-loading-label" value="" placeholder="<?php _e( 'Loading Posts...', 'ajax-load-more' ); ?>">
								</div>
							</div>
						</section>

						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Done Label', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'Leave field empty to not update button text', 'ajax-load-more' ); ?>."></a></h4>
								<p><?php _e( 'Update the text of the <em>Load More</em> button when no content remains to be loaded.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<input class="alm_element" name="button-done-label" type="text" id="button-done-label" value="" placeholder="<?php _e( 'No Posts Remaining...', 'ajax-load-more' ); ?>">
								</div>
							</div>
						</section>

					</div>
				</div>
				<!-- Button Labels -->

				<!-- Transition -->
				<div class="row input transition" id="alm-transition">
					<h3 class="heading" tabindex="0"><?php _e( 'Transition', 'ajax-load-more' ); ?></h3>

					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Type', 'ajax-load-more' ); ?></h4>
								<p><?php _e( 'Select the loading transition style.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<select class="alm_element transition" name="transition">
										<option value="fade" selected="selected"><?php _e( 'Fade In', 'ajax-load-more' ); ?></option>
										<option value="masonry"><?php _e( 'Masonry', 'ajax-load-more' ); ?></option>
										<option value="none"><?php _e( 'None', 'ajax-load-more' ); ?></option>
									</select>
								</div>
							</div>
						</section>

						<div class="clear"></div>

						<div class="transition-options nested-component">
							<div class="nested-component--inner">
								<section>
									<div class="shortcode-builder--label">
										<h4><?php _e( 'Delay', 'ajax-load-more' ); ?></h4>
										<p><?php _e( 'Stagger the display of each post incrementally.', 'ajax-load-more' ); ?><br/>
										<small><?php _e( 'Note: Delay in milliseconds.', 'ajax-load-more' ); ?></small></p>
									</div>
									<div class="shortcode-builder--fields">
										<div class="inner">
											<input type="number" class="alm_element numbers-only" name="transition_delay" id="transition_delay" placeholder="50" value="0" step="25" min="0" max="500">
										</div>
									</div>
								</section>
							</div>
						</div>

						<div class="clear"></div>

						<div class="masonry-options nested-component" style="display: none;">
							<div class="nested-component--inner">

								<section>
									<div class="shortcode-builder--label full">
										<h4><?php _e( 'Masonry Options', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'Ajax Load More does not support all available Masonry options', 'ajax-load-more' ); ?>."></a></h4>
										<p><?php _e( 'The following Masonry <a href="https://masonry.desandro.com/options.html" target="_blank">options</a> are supported by Ajax Load More.', 'ajax-load-more' ); ?></p>
									</div>
								</section>

								<section>
									<div class="shortcode-builder--label">
										<h4><?php _e( 'Item Selector', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'Item Selector is required for Masonry to target each element loaded with Ajax.', 'ajax-load-more' ); ?>"></a></h4>
										<p><?php _e( 'Enter the target classname of each masonry item.', 'ajax-load-more' ); ?><br/>
										e.g <span>.grid-item</span>
										</p>
									</div>
									<div class="shortcode-builder--fields">
										<div class="inner">
											<input type="text" class="alm_element" name="masonry-item" id="masonry-item" placeholder=".grid-item">
										</div>
									</div>
								</section>

								<section>
									<div class="shortcode-builder--label">
										<h4><?php _e( 'Column Width', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'If columnWidth is not set, Masonry will use the outer width of the first Item Selector.', 'ajax-load-more' ); ?>"></a></h4>
										<p><?php _e( 'Enter the <a href="https://masonry.desandro.com/options.html#columnwidth" target="_blank">columnWidth</a> of the masonry items.', 'ajax-load-more' ); ?><br/>
										e.g <span>80</span>
										</p>
									</div>
									<div class="shortcode-builder--fields">
										<div class="inner">
											<input type="number" class="alm_element numbers-only" name="masonry-columnwidth" id="masonry-columnwidth" placeholder="80" min="0" step="1">
										</div>
									</div>
								</section>

								<section>
									<div class="shortcode-builder--label">
										<h4><?php _e( 'Animation Type', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'All Masonry animations include a fade-in effect as items are loaded.', 'ajax-load-more' ); ?>"></a></h4>
										<p><?php _e( 'Select a loading animation for Masonry items.', 'ajax-load-more' ); ?></p>
									</div>
									<div class="shortcode-builder--fields">
										<div class="inner">
											<ul>
												<li style="width:100%;">
													<input class="alm_element" type="radio" name="masonry-animation" value="default" id="masonry-animation-default" checked="checked">
													<label for="masonry-animation-default">
														<?php _e( 'Default (Zoom)', 'ajax-load-more' ); ?>
														<span class="description"><?php _e( 'Items scale up from 50% to 100% size on load.', 'ajax-load-more' ); ?></span>
													</label>
												</li>
												<li style="width:100%;">
													<input class="alm_element" type="radio" name="masonry-animation" value="zoom-out" id="masonry-animation-zoom-out">
													<label for="masonry-animation-zoom-out">
														<?php _e( 'Zoom Out', 'ajax-load-more' ); ?>
														<span class="description"><?php _e( 'Items scale down from 125% to 100% size on load.', 'ajax-load-more' ); ?></span>
													</label>
												</li>
												<li style="width:100%;">
													<input class="alm_element" type="radio" name="masonry-animation" value="slide-up" id="masonry-animation-up">
													<label for="masonry-animation-up">
														<?php _e( 'Slide Up', 'ajax-load-more' ); ?>
														<span class="description"><?php _e( 'Items animate up as they are loaded into view.', 'ajax-load-more' ); ?></span>
													</label>
												</li>
												<li style="width:100%;">
													<input class="alm_element" type="radio" name="masonry-animation" value="slide-down" id="masonry-animation-down">
													<label for="masonry-animation-down">
														<?php _e( 'Slide Down', 'ajax-load-more' ); ?>
														<span class="description"><?php _e( 'Items animate down when loaded into view.', 'ajax-load-more' ); ?></span>
													</label>
												</li>
												<li style="width:100%;">
													<input class="alm_element" type="radio" name="masonry-animation" value="none" id="masonry-animation-none">
													<label for="masonry-animation-none">
														<?php _e( 'None', 'ajax-load-more' ); ?>
													</label>
												</li>
											</ul>
										</div>
									</div>
								</section>

								<section>
									<div class="shortcode-builder--label">
										<h4><?php _e( 'Horizontal Order', 'ajax-load-more' ); ?></h4>
										<p><?php _e( 'Lays out items to maintain left-to-right order.', 'ajax-load-more' ); ?>
										</p>
									</div>
									<div class="shortcode-builder--fields">
										<div class="inner">
											<ul>
												<li>
													<input class="alm_element" type="radio" name="masonry-horizontalorder" value="t" id="horizontalOrder_t" checked="checked">
													<label for="horizontalOrder_t"><?php _e( 'True', 'ajax-load-more' ); ?></label>
												</li>
												<li>
													<input class="alm_element" type="radio" name="masonry-horizontalorder" value="f" id="horizontalOrder_f">
													<label for="horizontalOrder_f"><?php _e( 'False', 'ajax-load-more' ); ?></label>
												</li>
											</ul>
										</div>
									</div>
								</section>

								<p class="warning-callout">
									<?php _e( 'Don\'t see your favorite Masonry option listed? You can always add your own!', 'ajax-load-more' ); ?>
									<a class="button-small" href="https://connekthq.com/plugins/ajax-load-more/docs/masonry/" target="_blank"><?php _e( 'View Docs', 'ajax-load-more' ); ?></a>
								</p>
							</div>

						</div>

					</div>
				</div>
				<!-- End Transition -->

				<!-- Scrolling -->
				<div class="row checkbox scroll_load" id="alm-scroll">
					<h3 class="heading" tabindex="0"><?php _e( 'Scrolling', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Enable Scrolling', 'ajax-load-more' ); ?></h4>
								<p><?php _e( 'Load more posts as the user scrolls the page.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<ul>
										<li>
											<input class="alm_element" type="radio" name="scroll" value="t" id="scroll_t" checked="checked">
											<label for="scroll_t"><?php _e( 'True', 'ajax-load-more' ); ?></label>
										</li>
										<li>
											<input class="alm_element" type="radio" name="scroll" value="f" id="scroll_f">
											<label for="scroll_f"><?php _e( 'False', 'ajax-load-more' ); ?></label>
										</li>
									</ul>
								</div>
							</div>
						</section>

						<div class="clear"></div>

						<div class="scrolling-options nested-component">
							<div class="nested-component--inner">

								<!-- Scroll Distance -->
								<section class="border-btm scroll_distance">
									<div class="shortcode-builder--label">
										<h4><?php _e( 'Scroll Distance', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'Distance is based on the position of the loading button from the bottom of the screen', 'ajax-load-more' ); ?>."></a></h4>
										<p><?php _e( 'The distance from the bottom of the screen to trigger loading of posts. (Default = 100)', 'ajax-load-more' ); ?>
										<small><strong><?php _e( 'Pro-tip', 'ajax-load-more' ); ?>:</strong> <?php _e( 'Use a negative number (-200) to trigger a post load before the button is in view', 'ajax-load-more' ); ?></small></p></p>
									</div>
									<div class="shortcode-builder--fields">
										<div class="inner">
											<div class="builder-option-toggle">
												<input type="number" class="alm_element numbers-only" name="scroll-distance" id="scroll-distance" step="50" min="-100000" value="100">
												<div class="builder-option-toggle--buttons">
													<button type="button" value="px" class="pixels active">px</button>
													<button type="button" value="%" class="perc">%</button>
												</div>
											</div>
										</div>
									</div>
								</section>

								<!-- Max Pages -->
								<section class="border-btm max_pages">
									<div class="shortcode-builder--label">
										<h4><?php _e( 'Maximum Pages', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'If using an Infinite Scroll button style you should set this to 0', 'ajax-load-more' ); ?>."></a></h4>
										<p><?php _e( 'Maximum number of pages to load while scrolling. (0 = unlimited)', 'ajax-load-more' ); ?></p>
									</div>
									<div class="shortcode-builder--fields">
										<div class="inner">
											<input type="number" class="alm_element numbers-only" name="max-select" id="max-select" step="1" min="0" value="0">
										</div>
									</div>
								</section>

								<!-- Pause Override -->
								<section class="border-btm pause_override">
									<div class="shortcode-builder--label">
										<h4><?php _e( 'Pause Override', 'ajax-load-more' ); ?></h4>
										<p><?php _e( 'Override the Pause parameter and allow scrolling to trigger the initial loading of posts.', 'ajax-load-more' ); ?></p>
									</div>
									<div class="shortcode-builder--fields">
										<ul>
											<li>
												<input class="alm_element" type="radio" name="pause_override" value="t" id="pause_override_t">
												<label for="pause_override_t"><?php _e( 'True', 'ajax-load-more' ); ?></label>
											</li>
											<li>
												<input class="alm_element" type="radio" name="pause_override" value="f" id="pause_override_f" checked="checked">
												<label for="pause_override_f"><?php _e( 'False', 'ajax-load-more' ); ?></label>
											</li>
										</ul>
									</div>
								</section>
							</div>

						</div>

						<!-- Scroll Container -->
						<section class="border-btm scroll_container_section">
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Scroll Container', 'ajax-load-more' ); ?></h4>
								<p><?php _e( 'Confine Ajax Load More scrolling to a parent container element.', 'ajax-load-more' ); ?></p>
								</div>
							<div class="shortcode-builder--fields">
								<ul>
									<li>
										<input class="alm_element" type="radio" name="scroll_container_toggle" value="t" id="scroll_container_t">
										<label for="scroll_container_t"><?php _e( 'True', 'ajax-load-more' ); ?></label>
									</li>
									<li>
										<input class="alm_element" type="radio" name="scroll_container_toggle" value="f" id="scroll_container_f" checked="checked">
										<label for="scroll_container_f"><?php _e( 'False', 'ajax-load-more' ); ?></label>
									</li>
								</ul>
							</div>
						</section>

						<div class="clear"></div>

						<div class="scroll-container-options nested-component" style="display: none;">
							<div class="nested-component--inner">

								<!-- Scroll Container -->
								<section class="border-btm scroll_container">
									<div class="shortcode-builder--label">
										<h4><?php _e( 'Container Element', 'ajax-load-more' ); ?></h4>
										<p><?php _e( 'Enter the ID or classname of the parent container element to be used as the scrolling container.', 'ajax-load-more' ); ?></p>
										</div>
									<div class="shortcode-builder--fields">
										<div class="inner">
											<input type="text" class="alm_element" name="scroll-container" id="scroll-container" placeholder="#my-div">
										</div>
									</div>
								</section>

								<!-- Scroll Direction -->
								<section class="border-btm scroll_direction">
									<div class="shortcode-builder--label">
										<h4><?php _e( 'Scroll Direction', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'Scroll Direction only works when using a Scroll Container.', 'ajax-load-more' ); ?>"></a></h4>
										<p><?php _e( 'Select the direction Ajax Load More should scroll to load posts.', 'ajax-load-more' ); ?></p>
										</div>
									<div class="shortcode-builder--fields">
										<ul>
											<li>
												<input class="alm_element" type="radio" name="scroll_direction" value="vertical" id="scroll_direction_v" checked="checked">
												<label for="scroll_direction_v"><?php _e( 'Vertical', 'ajax-load-more' ); ?></label>
											</li>
											<li>
												<input class="alm_element" type="radio" name="scroll_direction" value="horizontal" id="scroll_direction_h">
												<label for="scroll_direction_h"><?php _e( 'Horizontal', 'ajax-load-more' ); ?></label>
											</li>
										</ul>
									</div>
								</section>

							</div>
						</div>

					</div>
				</div>
				<!-- End Scrolling -->

				<!-- Progress Bar -->
				<div class="row input alm-progress-bar" id="alm-progress-bar">
					<h3 class="heading" tabindex="0"><?php _e( 'Progress Bar', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<p><?php _e( 'Display progress bar indicator at the top of the window while loading Ajax content.', 'ajax-load-more' ); ?></p>
								<p><a class="button-small" href="https://connekthq.com/plugins/ajax-load-more/examples/progress-bar/" target="_blank"><?php _e( 'View Example', 'ajax-load-more' ); ?></a></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<ul>
										<li>
											<input class="alm_element" type="radio" name="progress_bar" value="t" id="progress_bar_t">
											<label for="progress_bar_t"><?php _e( 'True', 'ajax-load-more' ); ?></label>
										</li>
										<li>
											<input class="alm_element" type="radio" name="progress_bar" value="f" id="progress_bar_f" checked="checked">
											<label for="progress_bar_f"><?php _e( 'False', 'ajax-load-more' ); ?></label>
										</li>
									</ul>
								</div>
							</div>
						</section>

						<div class="clear"></div>

						<div class="progress-bar-options nested-component" style="display: none;">
							<div class="nested-component--inner">
								<section>
									<div class="shortcode-builder--label">
										<h4><?php _e( 'Color', 'ajax-load-more' ); ?> </h4>
										<p><?php _e( 'Enter the hex color of the progress bar', 'ajax-load-more' ); ?>.<br/>
										<?php _e( 'Default:', 'ajax-load-more' ); ?> #<span>ed7070</span>
										</p>
									</div>
									<div class="shortcode-builder--fields">
										<div class="inner" style="position: relative;">
											<input type="text" class="alm_element" name="progress_bar_color" id="progress_bar_color" placeholder="ed7070" value="ed7070" maxlength="6" style="padding-left: 40px;">
											<span class="progress_bar_color_indicator"></span>
										</div>
									</div>
								</section>
							</div>
						</div>

					</div>

				</div>
				<!-- End Progress Bar -->

			</div>
		</div>
		<!-- End Display Settings -->

		<!-- ****************************** -->

		<!-- Query Parameters -->
		<div class="shortcode-parameter-wrap alm-tabbed-wrapper--section" tabindex="0" id="query-parameters">

			<h2>
				<?php _e( 'Query Parameters', 'ajax-load-more' ); ?>
				<a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'When using Ajax Load More add-ons or extensions not all Query Parameters will be available in the query.', 'ajax-load-more' ); ?>"></a>
			</h2>
			<p class="section-intro">
				<?php _e( 'Query Parameters allow you build a custom <b>WP_Query</b> based on Ajax Load More shortcode values.', 'ajax-load-more' ); ?>
			</p>
			<ul class="section-anchor-nav"></ul>

			<div class="section-wrap">
				<!-- Posts Per Page -->
				<div class="row input posts_per_page" id="alm-post-page">
					<h3 class="heading" tabindex="0"><?php _e( 'Posts Per Page', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<p><?php _e( 'Select the number of posts to load with each Ajax request.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<input type="number" class="alm_element numbers-only" name="display_posts-select" id="display_posts-select" step="1" min="1" value="5">
								</div>
							</div>
						</section>
					</div>
				</div>
				<!-- End Posts Per Page -->

				<!-- Post Types -->
				<?php
				$pt_args = [
					'public' => true,
				];
				$types   = get_post_types( $pt_args );
				if ( $types ) {
					?>
					<div class="row checkboxes post_types" id="alm-post-types">
						<h3 class="heading" tabindex="0"><?php _e( 'Post Type', 'ajax-load-more' ); ?></h3>

						<div class="expand-wrap">
							<section class="first">
								<div class="shortcode-builder--label">
									<p><?php _e( 'Select the Post Types to include in this Ajax Load More query.', 'ajax-load-more' ); ?></p>
								</div>
								<div class="shortcode-builder--fields">
									<div class="inner">
										<ul class="alm-post-type-list">
										<?php
										foreach ( $types as $type ) {
											$typeobj = get_post_type_object( $type );
											$name    = $typeobj->name;
											if ( $name !== 'revision' && $name !== 'nav_menu_item' && $name !== 'acf' ) {
												echo '<li><input class="alm_element" type="checkbox" name="chk-' . $typeobj->name . '" id="chk-' . $typeobj->name . '" data-type="' . $typeobj->name . '">';
												echo '<label for="chk-' . $typeobj->name . '">';
												echo $typeobj->labels->singular_name;
												echo '</label>';
												echo '</li>';
											}
										}
										?>
										<li><input class="alm_element chk-any" type="checkbox" name="chk-any" id="chk-any" data-type="any"><label for="chk-any"><?php _e( 'Any', 'ajax-load-more' ); ?></label></li>
										</ul>
									</div>
								</div>
							</section>

							<!-- Sticky Posts -->
							<div class="sticky-wrap nested-component">
								<div class="nested-component--inner">
									<section>
										<div class="shortcode-builder--label">
											<h4><?php _e( 'Sticky Posts', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'Sticky posts are only available for Posts', 'ajax-load-more' ); ?>."></a></h4>
											<p><?php _e( 'Preserve the ordering of sticky posts by having them appear first in the Ajax listing.', 'ajax-load-more' ); ?></p>
										</div>
										<div class="shortcode-builder--fields">
											<div class="inner">
												<ul>
													<li style="width:100%;">
													<input class="alm_element" type="checkbox" name="alm_sticky_posts" id="alm_sticky_posts" value="true">
													<label for="alm_sticky_posts"><?php _e( 'Enable Sticky Posts', 'ajax-load-more' ); ?></label>
													</li>
												</ul>
											</div>
										</div>
									</section>
								</div>
							</div>

						</div>

					</div>
					<?php
				}
				?>
				<!-- End Post Types -->


				<!-- Post Formats -->
				<?php
				if ( current_theme_supports( 'post-formats' ) ) {
					$post_formats = get_theme_support( 'post-formats' );
					if ( $post_formats ) {
						echo '<div class="row checkboxes post_format" id="alm-post-format">';
							echo '<h3 class="heading" tabindex="0">' . __( 'Post Format', 'ajax-load-more' ) . '</h3>';
							echo '<div class="expand-wrap">';
								echo '<section class="first">';
									echo '<div class="shortcode-builder--label">';
									echo '<p>' . __( 'Select a Post Format to query.', 'ajax-load-more' ) . '</p>';
									echo '</div>';
									echo '<div class="shortcode-builder--fields"><div class="inner"><select class="alm_element" name="post-format-select" id="post-format-select">';
									echo '<option value="" selected="selected">-- ' . __( 'Select Post Format', 'ajax-load-more' ) . ' --</option>';
									echo '<option name="chk-standard" id="chk-standard" value="standard">' . __( 'Standard', 'ajax-load-more' ) . '</option>';
						foreach ( $post_formats[0] as $post_format ) {
							echo '<option name="chk-' . $post_format . '" id="chk-' . $post_format . '" value="' . $post_format . '">' . ucwords( $post_format ) . '</option>';
						}
									echo '</select></div></div>';
								echo '</section>';
							echo '</div>';
						echo '</div>';
					}
				}
				?>
				<!-- End Post Formats -->


				<!-- Categories -->
				<?php
				if ( $disable_dynamic_content ) {
					$cats = 'null';
				} else {
					$cats = get_categories();
					if ( $cats && count( $cats ) > $show_max ) {
						$disable_dynamic_content = true;
					}
				}
				if ( $cats ) {
					$cat_link = 'https://developer.wordpress.org/reference/classes/wp_query/#category-parameters';
					?>
				<div class="row checkboxes categories" id="alm-categories">
					<h3 class="heading" tabindex="0"><?php _e( 'Category', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Include', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'Get posts by category using a category_name or category__and query', 'ajax-load-more' ); ?>."></a></h4>
								<p><?php _e( 'Comma separated list of categories to include by', 'ajax-load-more' ); ?> <strong class="alm-populate"><?php _e( 'slug', 'ajax-load-more' ); ?></strong>.
								<small class="alm-populate-eg">e.g. design, research etc...</small></p>
								<p><a class="button-small" href="admin.php?page=ajax-load-more-help&section=examples#example-category" target="_blank"><?php _e( 'View Example', 'ajax-load-more' ); ?></a></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<div class="category-toggle category_name">
										<?php
										if ( ! $disable_dynamic_content ) {
											echo '<select class="alm_element multiple" name="category-select" id="category-select" multiple="multiple">';
											foreach ( $cats as $cat ) {
												echo '<option name="chk-' . $cat->slug . '" id="chk-' . $cat->slug . '" value="' . $cat->slug . '">' . $cat->name . '</option>';
											}
											echo '</select>';
										} else {
											echo '<input type="text" class="alm_element" name="category-select" id="category-select" placeholder="design, development, science etc..." style="margin-bottom: 15px;">';
										}
										?>
									</div>
									<div class="category-toggle category__and" style="display: none;">
										<?php
										if ( ! $disable_dynamic_content ) {
											echo '<select class="alm_element multiple" name="category--and-select" id="category--and-select" multiple="multiple">';
											foreach ( $cats as $cat ) {
												echo '<option name="chk-' . $cat->term_id . '" id="chk-' . $cat->term_id . '" value="' . $cat->term_id . '">' . $cat->name . '</option>';
											}
											echo '</select>';
										} else {
											echo '<input type="text" class="alm_element" name="category--and-select" id="category--and-select" placeholder="10,29,31 etc...">';
										}
										?>
									</div>
									<ul style="padding: 20px 0 0;">
										<li style="width: 100%;">
											<input class="alm_element" type="checkbox" name="category-select-type" value="category__and" id="category__and">
											<label for="category__and">
												category__and <span>(<a href="<?php echo $cat_link; ?>" target="_blank"><?php _e( 'What\'s this', 'ajax-load-more' ); ?>?</a>)</span>
											</label>
										</li>
									</ul>
								</div>
							</div>
						</section>

						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Exclude', 'ajax-load-more' ); ?></h4>
								<p>
									<?php _e( 'Comma separated list of categories to exclude by ID.', 'ajax-load-more' ); ?>
									<small>e.g. 3, 12, 35 etc..</small>
								</p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<?php
									if ( ! $disable_dynamic_content ) {
										echo '<select class="alm_element multiple" name="category-exclude-select" id="category-exclude-select" multiple="multiple">';
										foreach ( $cats as $cat ) {
											echo '<option name="chk-' . $cat->term_id . '" id="chk-' . $cat->term_id . '" value="' . $cat->term_id . '">' . $cat->name . '</option>';
										}
										echo '</select>';
									} else {
										echo '<input type="text" class="alm_element numbers-only" name="category-exclude-select" id="category-exclude-select" placeholder="10, 12, 19 etc...">';
									}
									?>
								</div>
								<div class="clear"></div>
							</div>
						</section>
					</div>
				</div>
				<!-- End Category -->

					<?php
				}

				// Tags
				if ( $disable_dynamic_content ) {
					$tags = 'null';
				} else {
					$tags = get_tags();
					if ( $tags && count( $tags ) > $show_max ) {
						$disable_dynamic_content = true;
					}
				}
				if ( $tags ) {
					$tag_link = 'https://developer.wordpress.org/reference/classes/wp_query/#tag-parameters';
					?>
				<div class="row checkboxes tags" id="alm-tags">
					<h3 class="heading" tabindex="0"><?php _e( 'Tag', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Include', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'Get posts by tags using a tag or tag__and query', 'ajax-load-more' ); ?>."></a></h4>
								<p><?php _e( 'Comma separated list of tags to include by', 'ajax-load-more' ); ?> <strong class="alm-populate"><?php _e( 'slug', 'ajax-load-more' ); ?></strong>.
								<small class="alm-populate-eg">e.g. toronto, canada etc...</small></p>
								<p><a class="button-small" href="admin.php?page=ajax-load-more-help&section=examples#example-tag" target="_blank">
									<?php _e( 'View Example', 'ajax-load-more' ); ?>
									</a></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<div class="tag-toggle tag_normal">
										<?php
										if ( ! $disable_dynamic_content ) {
											echo '<select class="alm_element multiple" name="tag-select" id="tag-select" multiple="multiple">';
											foreach ( $tags as $tag ) {
												echo '<option name="chk-' . $tag->slug . '" id="chk-' . $tag->slug . '" value="' . $tag->slug . '">' . $tag->name . '</option>';
											}
											echo '</select>';
										} else {
											echo '<input type="text" class="alm_element" name="tag-select" id="tag-select" placeholder="hockey, toronto, canada etc..." style="margin-bottom: 20px;">';
										}
										?>
									</div>
									<div class="tag-toggle tag__and" style="display: none;">
										<?php
										if ( ! $disable_dynamic_content ) {
											echo '<select class="alm_element multiple" name="tag--and-select" id="tag--and-select" multiple="multiple">';
											foreach ( $tags as $tag ) {
												echo '<option name="chk-' . $tag->term_id . '" id="chk-' . $tag->term_id . '" value="' . $tag->term_id . '">' . $tag->name . '</option>';
											}
											echo '</select>';
										} else {
											echo '<input type="text" class="alm_element" name="tag--and-select" id="tag--and-select" placeholder="12, 23, 29 etc...">';
										}
										?>
									</div>
									<ul style="padding: 20px 0 0;">
										<li style="width: 100%;">
											<input class="alm_element" type="checkbox" name="tag-select-type" value="tag__and" id="tag__and">
											<label for="tag__and">
												tag__and <span>(<a href="<?php echo $tag_link; ?>" target="_blank"><?php _e( 'What\'s this', 'ajax-load-more' ); ?>?</a>)</span>
											</label>
										</li>
									</ul>
								</div>
							</div>
						</section>

						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Exclude', 'ajax-load-more' ); ?></h4>
								<p>
									<?php _e( 'Comma separated list of tags to exclude by ID', 'ajax-load-more' ); ?>.
									<small>e.g. 30, 12, 99 etc..</small>
								</p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<?php
									if ( ! $disable_dynamic_content ) {
										echo '<select class="alm_element multiple" name="tag-exclude-select" id="tag-exclude-select" multiple="multiple">';
										foreach ( $tags as $tag ) {
											echo '<option name="chk-' . $tag->term_id . '" id="chk-' . $tag->term_id . '" value="' . $tag->term_id . '">' . $tag->name . '</option>';
										}
										echo '</select>';
									} else {
										echo '<input type="text" class="alm_element numbers-only" name="tag-exclude-select" id="tag-exclude-select" placeholder="10, 12, 19 etc...">';
									}
									?>
								</div>
								<div class="clear"></div>
							</div>
						</section>
				</div>
				</div>
				<?php } ?>
				<!-- End Tags -->

				<?php
				// Taxonomies
				$tax_args   = [
					'public'   => true,
					'_builtin' => false,
				];
				$tax_output = 'objects';
				$taxonomies = get_taxonomies( $tax_args, $tax_output );
				if ( $taxonomies ) {
					?>
				<div class="row taxonomy" id="alm-taxonomy">
					<h3 class="heading" tabindex="0"><?php _e( 'Taxonomy', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<p><?php _e( 'Select a taxonomy to query and then select the terms and operator.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<?php include ALM_PATH . 'admin/shortcode-builder/includes/tax-query-options.php'; ?>
								<div class="section-control">
									<button id="add-tax-query" class="button button-primary"><?php _e( 'Add Another', 'ajax-load-more' ); ?></button>
								</div>
							</div>
						</section>
					</div>
				</div>
				<?php } ?>
				<!-- End Taxonomies -->

				<!-- Meta_Query -->
				<div class="row input meta-key" id="alm-meta-key">
					<h3 class="heading" tabindex="0"><?php _e( 'Custom Fields (Meta_Query)', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first full">
							<div class="shortcode-builder--label">
								<p><?php _e( 'Query for <a href="https://developer.wordpress.org/reference/classes/wp_query/#custom-field-post-meta-parameters" target="_blank">custom fields</a> by entering a key, value and operator.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="meta-query-wrap-first">
									<div class="meta-query-wrap">
										<?php require ALM_PATH . 'admin/shortcode-builder/includes/meta-query-options.php'; ?>
									</div>
								</div>
								<div id="meta-query-relation">
									<div class="inner border-top highlighted">
										<label for="meta-relation" class="full"><?php _e( 'Relation:', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'The logical relationship between each custom field when there is more than one', 'ajax-load-more' ); ?>."></a></label>
										<select class="alm_element meta-relation" name="meta-relation">
											<option value="AND" selected="selected">AND</option>
											<option value="OR">OR</option>
										</select>
									</div>
								</div>
								<div id="meta-query-extended"></div>
								<div class="section-control">
									<button type="button" class="button button-primary" id="add-meta-query"><?php _e( 'Add Another', 'ajax-load-more' ); ?></button>
								</div>
							</div>
						</section>
					</div>
				</div>
				<!-- End Meta Query -->

				<!-- Date -->
				<div class="row input date" id="alm-date">
					<h3 class="heading" tabindex="0"><?php _e( 'Date', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<p><?php _e( 'Enter a year, month(number) and day to query by date archive.', 'ajax-load-more' ); ?></p>
								<p><a class="button-small" href="admin.php?page=ajax-load-more-help&section=examples#example-date" target="_blank"><?php _e( 'View Example', 'ajax-load-more' ); ?></a></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner flex-grid flex-grid--three">
									<div>
										<?php $today = getdate(); ?>
										<label for="input-year" class="full"><?php _e( 'Year:', 'ajax-load-more' ); ?></label>
										<input name="input-year" class="alm_element sm numbers-only" type="text" id="input-year" maxlength="4" placeholder="<?php echo $today['year']; ?>">
									</div>
									<div>
										<label for="input-month" class="full"><?php _e( 'Month:', 'ajax-load-more' ); ?></label>
										<input name="input-month" class="alm_element sm numbers-only" type="text" id="input-month" maxlength="2" placeholder="<?php echo $today['mon']; ?>">
									</div>
									<div>
										<label for="input-day" class="full"><?php _e( 'Day:', 'ajax-load-more' ); ?></label>
										<input name="input-day" class="alm_element sm numbers-only" type="text" id="input-day" maxlength="2" placeholder="<?php echo $today['mday']; ?>">
									</div>
								</div>
							</div>
						</section>
					</div>
				</div>
				<!-- End Date -->

				<?php
				// List Authors
				if ( $disable_dynamic_content ) {
					$authors = 'null';
				} else {
					$authors = get_users();
					if ( $authors && count( $authors ) > $show_max ) {
						$disable_dynamic_content = true;
					}
				}
				if ( $authors ) {
					echo '<div class="row select authors" id="alm-authors">';
					echo '<h3 class="heading" tabindex="0">' . __( 'Author', 'ajax-load-more' ) . '</h3>';
					echo '<div class="expand-wrap">';
					echo '<section class="first">';
					echo '<div class="shortcode-builder--label">';
					echo '<p>' . __( 'Select an Author to query(by ID).', 'ajax-load-more' ) . '</p>';
					?>
					<p><a class="button-small" href="admin.php?page=ajax-load-more-help&section=examples#example-author" target="_blank"><?php _e( 'View Example', 'ajax-load-more' ); ?></a></p>
					<?php
					echo '</div>';
					echo '<div class="shortcode-builder--fields"><div class="inner">';
					if ( ! $disable_dynamic_content ) {
						echo '<select class="alm_element multiple" name="author-select" id="author-select" multiple="multiple">';
						foreach ( $authors as $author ) {
							echo '<option name="chk-' . $author->user_login . '" id="chk-' . $author->user_login . '" value="' . $author->ID . '">' . $author->display_name . '</option>';
						}
						echo '</select>';
					} else {
						echo '<input type="text" class="alm_element numbers-only" name="author-select" id="author-select" placeholder="1">';
					}
					echo '</div></div>';
					echo '</section>';
					echo '</div>';
					echo '</div>';
				}
				?>
				<!-- End Authors -->

				<!-- Search -->
				<div class="row input search-term" id="alm-search">
					<h3 class="heading" tabindex="0"><?php _e( 'Search', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<p><?php _e( 'Enter a search term to query.', 'ajax-load-more' ); ?></p>
								<p><?php _e( 'Search uses the default WordPress search, however Ajax Load More does offer integrations with SearchWP and Relevanssi.', 'ajax-load-more' ); ?></p>
								<p><a class="button-small" href="https://connekthq.com/plugins/ajax-load-more/examples/search-results/" target="_blank"><?php _e( 'View Example', 'ajax-load-more' ); ?></a></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<input name="search-term" class="alm_element" type="text" id="search-term" value="" placeholder="<?php _e( 'Enter search term', 'ajax-load-more' ); ?>">
								</div>
							</div>
						</section>
					</div>
				</div>
				<!-- End Search -->

				<!-- Post Parameters -->
				<div class="row input post-in" id="alm-post-in">
					<h3 class="heading" tabindex="0"><?php _e( 'Post Parameters', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Include', 'ajax-load-more' ); ?></h4>
								<p><?php _e( 'A comma separated list of post ID\'s to query.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<input name="post__in" class="alm_element numbers-only" type="text" id="post__in" value="" placeholder="<?php _e( '225, 340, 818, etc...', 'ajax-load-more' ); ?>">
								</div>
							</div>
						</section>
						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Exclude', 'ajax-load-more' ); ?></h4>
								<p><?php _e( 'A comma separated list of post ID\'s to exclude from query.', 'ajax-load-more' ); ?></p>
								<p><a class="button-small" href="admin.php?page=ajax-load-more-help&section=examples#example-exclude" target="_blank"><?php _e( 'View Example', 'ajax-load-more' ); ?></a></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<input class="alm_element numbers-only" name="exclude-posts" type="text" id="exclude-posts" value="" placeholder="199, 216, 345, etc...">
								</div>
							</div>
						</section>
						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Post Status', 'ajax-load-more' ); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'Post Status parameters are only available for logged in (admin) users. Non logged in users will only have access to view content in a \'publish\' or \'inherit\' state.', 'ajax-load-more' ); ?>."></a></h4>
								<p><?php _e( 'Select status of the post.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<select class="alm_element" name="post-status" id="post-status">
										<option value="publish" selected="selected"><?php _e( 'Published', 'ajax-load-more' ); ?></option>
										<option value="any">Any</option>
										<option value="draft">Draft</option>
										<option value="future">Future</option>
										<option value="pending">Pending</option>
										<option value="private">Private</option>
										<option value="trash">Trash</option>
										<option value="inherit">Inherit</option>
									</select>
								</div>
							</div>
						</section>
					</div>
				</div>
				<!-- End Post Parameters -->

				<!-- Ordering -->
				<div class="row ordering" id="alm-order">
					<h3 class="heading" tabindex="0"><?php _e( 'Ordering', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Order', 'ajax-load-more' ); ?></h4>
								<p><?php _e( 'Return results by ascending or descending order.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<select class="alm_element" name="post-order" id="post-order">
										<option value="DESC" selected="selected">DESC (default)</option>
										<option value="ASC">ASC</option>
									</select>
								</div>
							</div>
						</section>
						<section>
							<div class="shortcode-builder--label">
								<h4><?php _e( 'Orderby', 'ajax-load-more' ); ?></h4>
								<p><?php _e( 'Sort results by specific ordering parameter.', 'ajax-load-more' ); ?></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<select class="alm_element" name="post-orderby" id="post-orderby">
										<option value="date" selected="selected">Date (default)</option>
										<option value="title">Title</option>
										<option value="name">Name (slug)</option>
										<option value="menu_order">Menu Order</option>
										<option value="author">Author</option>
										<option value="ID">ID</option>
										<option value="comment_count">Comment Count</option>
										<option value="modified">Modified</option>
										<option value="post__in">Post In</option>
										<option value="meta_value">meta_value</option>
										<option value="meta_value_num">meta_value_num</option>
									</select>
								</div>
							</div>
						</section>
						<div class="sort-key-options nested-component hide-section">
							<section>
								<div class="shortcode-builder--label">
									<h4><?php _e( 'Sort Key', 'ajax-load-more' ); ?></h4>
									<p><?php _e( 'The custom field key for sorting results by custom field value.', 'ajax-load-more' ); ?></p>
								</div>
								<div class="shortcode-builder--fields">
									<div class="inner">
										<input class="alm_element" name="sort-key" type="text" id="sort-key" value="" placeholder="my_custom_field">
									</div>
								</div>
							</section>
						</div>
					</div>
				</div>
				<!-- End Ordering -->

				<!-- Offset -->
				<div class="row input offset" id="alm-offset">
					<h3 class="heading" tabindex="0"><?php _e( 'Offset', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<p><?php _e( 'Offset the initial query by <em>\'x\'</em> number of posts', 'ajax-load-more' ); ?>.</p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<input type="number" class="alm_element numbers-only" name="offset-select" id="offset-select" value="0" step="1" min="0">
								</div>
							</div>
						</section>
					</div>
				</div>
				<!-- End Offset -->

				<!-- Custom Arguments -->
				<div class="row input custom-arguments" id="alm-custom-args">
					<h3 class="heading" tabindex="0"><?php _e( 'Custom Arguments', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<p><?php _e( 'A semicolon separated list of custom value:pair arguments.', 'ajax-load-more' ); ?>  <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e( 'Custom Arguments can be used to query by parameters not available in the Shortcode Builder', 'ajax-load-more' ); ?>."></a><br/><small>e.g. event_display:upcoming</small></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<input name="custom-args" class="alm_element" type="text" id="custom-args" value="" placeholder="<?php _e( 'event_display:upcoming', 'ajax-load-more' ); ?>">
								</div>
							</div>
						</section>
					</div>
				</div>
				<!-- End Custom Arguments -->

			</div>

		</div>
		<!-- End Query Parameters -->

		<!-- ****************************** -->

		<!-- Integrations -->
		<div class="shortcode-parameter-wrap alm-tabbed-wrapper--section" tabindex="0" id="integrations">

			<h2><?php _e( 'Integrations', 'ajax-load-more' ); ?></h2>
			<p class="section-intro">
				<?php _e( 'Ajax Load More provides integrations for popular plugins and core WP functionality - when selecting an integration, Ajax Load More will automatically set various parameters on the server side to provide the best experience for users based on the selected integration.', 'ajax-load-more' ); ?>
			</p>
			<ul class="section-anchor-nav"></ul>

			<div class="section-wrap">
				<!-- Archives -->
				<div class="row input alm-archive" id="alm-archive">
					<h3 class="heading" tabindex="0"><?php _e( 'Archives', 'ajax-load-more' ); ?></h3>
					<div class="expand-wrap">
						<section class="first">
							<div class="shortcode-builder--label">
								<p><?php _e( 'Ajax Load More will automatically create an archive query while viewing site archives.', 'ajax-load-more' ); ?></p>
								<p><?php _e( 'Search, taxonomy, category, tag, date (year, month, day), post type and author archives are currently supported.', 'ajax-load-more' ); ?></p>
								<p><a class="button-small" href="https://connekthq.com/plugins/ajax-load-more/docs/archives/" target="_blank"><?php _e( 'View Docs', 'ajax-load-more' ); ?></a></p>
							</div>
							<div class="shortcode-builder--fields">
								<div class="inner">
									<ul>
										<li>
											<input class="alm_element" type="radio" name="archive" value="t" id="archive_t">
											<label for="archive_t"><?php _e( 'True', 'ajax-load-more' ); ?></label>
										</li>
										<li>
											<input class="alm_element" type="radio" name="archive" value="f" id="archive_f" checked="checked">
											<label for="archive_f"><?php _e( 'False', 'ajax-load-more' ); ?></label>
										</li>
									</ul>
								</div>
							</div>
						</section>
						<p class="warning-callout"><?php _e( '<b>Note</b>: Do not select Query Parameters other than <b>Posts Per Page</b> and/or <b>Post Type</b> when using the Archives integration. Ajax Load More will automatically create the perfect shortcode for you based on the current archive page.', 'ajax-load-more' ); ?></p>
					</div>
				</div>
			</div>
		</div>

	</div>
</div>

<div class="clear"></div>
