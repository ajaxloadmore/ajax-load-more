<?php if ( has_action( 'alm_cta_installed' ) ) { ?>
<div class="row cta add-on" id="alm-cta">
	<h3 class="heading" tabindex="0"><?php _e( 'Call to Actions', 'ajax-load-more' ); ?></h3>
	<div class="expand-wrap">

		<section class="first">
		<div class="shortcode-builder--label">
				<p><?php _e( 'Insert call to action block.', 'ajax-load-more' ); ?></p>
			</div>
		<div class="shortcode-builder--fields">
			<div class="inner">
				<ul>
					<li>
					<input class="alm_element" type="radio" name="cta" value="true" id="cta-true" >
					<label for="cta-true"><?php _e( 'True', 'ajax-load-more' ); ?></label>
					</li>
					<li>
					<input class="alm_element" type="radio" name="cta" value="false" id="cta-false" checked="checked">
					<label for="cta-false"><?php _e( 'False', 'ajax-load-more' ); ?></label>
					</li>
				</ul>
			</div>
		</div>
		</section>

		<div class="cta_template_wrap nested-component">
			<div class="nested-component--inner">

			<section>
				<div class="shortcode-builder--label">
					<h4><?php _e( 'Template', 'ajax-load-more' ); ?></h4>
					<?php echo '<p>' . __( 'Select a <a href="admin.php?page=ajax-load-more-repeaters">Repeater Template</a> to display the call to action.', 'ajax-load-more' ) . '</p>'; ?>
				</div>
				<div class="shortcode-builder--fields">
					<div class="inner">
						<select name="cta-template-select" class="alm_element">
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
			<section>
				<div class="shortcode-builder--label">
					<h4><?php _e( 'CTA Positioning', 'ajax-load-more' ); ?></h4>
					<p><?php _e( 'Insert call to action <strong><em id="sequence-update-before-after">before</em></strong> post #<strong><em id="sequence-update">1</em></strong>', 'ajax-load-more' ); ?>.</p>
				</div>
				<div class="shortcode-builder--fields">
					<div class="inner">

					<label class="full"><?php _e( 'Before / After', 'ajax-load-more' ); ?>:</label>
					<select class="alm_element cta-before-after" name="cta-before-after" id="cta-before-after">
					<option value="before" selected="selected"><?php _e( 'Before', 'ajax-load-more' ); ?></option>
					<option value="after"><?php _e( 'After', 'ajax-load-more' ); ?></option>
					</select>
					<div class="clear"></div>
					<div class="spacer" style="height: 30px;"></div>
					<label class="full" for="cta-position"><?php _e( 'Post #', 'ajax-load-more' ); ?>:</label>
					<input type="number" min="1" step="1" value="1" placeholder="1" id="cta-position" class="alm_element numbers-only" name="cta-position">
					</div>
				</div>
			</section>
			<p class="warning-callout">
				<?php _e( 'Call to actions do NOT count as a post within an Ajax Load More loop.', 'ajax-load-more' ); ?><br/>
				<?php _e( 'For example, if you set <strong>posts_per_page="5"</strong> in your shortcode, 6 items will be displayed.', 'ajax-load-more' ); ?>
			</p>

			</div>
		</div>

	</div>
</div>
<?php } ?>
