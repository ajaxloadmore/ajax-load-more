<?php if ( has_action( 'alm_comments_installed' ) ) { ?>
<div class="row input comments add-on" id="alm-comments">
	<h3 class="heading" tabindex="0"><?php _e( 'Comments', 'ajax-load-more' ); ?></h3>
	<div class="expand-wrap">
		<section class="first">
		<div class="shortcode-builder--label">
				<p><?php _e( 'Enable Ajax Load More to display blog comments.', 'ajax-load-more' ); ?></p>
			</div>
		<div class="shortcode-builder--fields">
			<div class="inner">
				<ul>
					<li>
					<input class="alm_element" type="radio" name="comments" value="true" id="comments-true" >
					<label for="comments-true"><?php _e( 'True', 'ajax-load-more' ); ?></label>
					</li>
					<li>
					<input class="alm_element" type="radio" name="comments" value="false" id="comments-false"  checked="checked">
					<label for="comments-false"><?php _e( 'False', 'ajax-load-more' ); ?></label>
					</li>
				</ul>
			</div>
		</div>
		</section>

		<div class="comments_extras nested-component">
			<div class="nested-component--inner">

			<section>
				<div class="shortcode-builder--label">
					<h4><?php _e( 'Post ID', 'ajax-load-more' ); ?></h4>
					<p>
						<?php _e( 'The ID of the current post.', 'ajax-load-more' ); ?><br/>
						<small><?php _e( '<strong>Note</strong>: Leave empty to default to the current post ID.' ); ?></small>
					</p>
				</div>
				<div class="shortcode-builder--fields">
					<div class="inner">
						<input type="text" value="" id="comments_post_id"  class="alm_element">
					</div>
				</div>
			</section>

			<section>
				<div class="shortcode-builder--label">
					<h4><?php _e( 'Comments Per Page', 'ajax-load-more' ); ?></h4>
						<p><?php _e( 'The number of top level items to show for each page of comments.', 'ajax-load-more' ); ?></p>
						<p><small><?php _e( '<strong>Note</strong>: Does not include comment replies.', 'ajax-load-more' ); ?></small></p>
				</div>
					<div class="shortcode-builder--fields">
					<div class="inner">
						<input type="number" class="alm_element numbers-only" name="comments-per-page" id="comments-per-page" step="1" min="1" value="5">
					</div>
				</div>
			</section>

			<section>
				<div class="shortcode-builder--label">
					<h4><?php _e( 'Comment Type', 'ajax-load-more' ); ?></h4>
						<p><?php _e( 'The type of comment(s) to display.', 'ajax-load-more' ); ?></p>
					</div>
				<div class="shortcode-builder--fields">
					<div class="inner">
						<select class="alm_element comments_type" id="comments_type">
						<option value="comment" selected="selected"><?php _e( 'Comment', 'ajax-load-more' ); ?></option>
						<option value="all"><?php _e( 'All', 'ajax-load-more' ); ?></option>
						<option value="trackback"><?php _e( 'Trackback', 'ajax-load-more' ); ?></option>
						<option value="pingback"><?php _e( 'Pingback', 'ajax-load-more' ); ?></option>
						<option value="pings"><?php _e( 'Pings', 'ajax-load-more' ); ?></option>
						</select>
					</div>
				</div>
			</section>

			<section>
				<div class="shortcode-builder--label">
					<h4><?php _e( 'Comment Style', 'ajax-load-more' ); ?></h4>
					<p><?php _e( 'Select the HTML container style for your comments.', 'ajax-load-more' ); ?></p>
				</div>
				<div class="shortcode-builder--fields">
					<div class="inner">
						<ul class="comment_container_type">
							<li>
							<input type="radio" id="comment-type-ol" value="ol" name="alm_comment_style" class="alm_element" checked="checked">
							<label for="comment-type-ol">&lt;ol&gt; &lt;/ol&gt;</label>
							</li>
							<li>
							<input type="radio" id="comment-type-ul" value="ul" name="alm_comment_style" class="alm_element">
							<label for="comment-type-ul">&lt;ul&gt; &lt;/ul&gt;</label>
							</li>
							<li>
							<input type="radio" id="comment-type-div" value="div" name="alm_comment_style" class="alm_element">
							<label for="comment-type-div">&lt;div&gt; &lt;/div&gt;</label>
							</li>
						</ul>
					</div>
				</div>
			</section>

			<section>
				<div class="shortcode-builder--label">
				<h4><?php _e( 'Comment Template', 'ajax-load-more' ); ?></h4>
					<p><?php _e( 'Select a <a href="admin.php?page=ajax-load-more-repeaters">Repeater Template</a> to display comment data.', 'ajax-load-more' ); ?></p>
					<p><small><?php _e( '<strong>Note</strong>: Selecting <span>None</span> will use the default WordPress comment layout.', 'ajax-load-more' ); ?></small></p>
				</div>
				<div class="shortcode-builder--fields">
					<div class="inner">
						<select class="alm_element comments_template" id="comments_template">
							<option value="none" selected="selected"><?php _e( 'None', 'ajax-load-more' ); ?></option>
							<optgroup label="<?php _e( 'Custom Repeaters', 'ajax-load-more' ); ?>">
								<option name="default" id="chk-default" value="default"><?php _e( 'Default', 'ajax-load-more' ); ?></option>
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
							// Get Theme Repeaters
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
				<div class="select-theme-repeater">
					<span class="or"><?php _e( 'or', 'ajax-load-more' ); ?></span>
					<div class="shortcode-builder--label">
						<h4><?php _e( 'Callback Function', 'ajax-load-more' ); ?></h4>
							<p><?php _e( 'A custom <a href="https://codex.wordpress.org/Function_Reference/wp_list_comments#Arguments" target="_blank">callback</a> function that will display each comment.', 'ajax-load-more' ); ?></p>
							<p><small><?php _e( '<strong>Note</strong>: The majority of premium themes have a custom callback function for displaying comments. Please see comments.php or functions.php within your theme directory to locate the callback function for your theme.', 'ajax-load-more' ); ?></small></p>
						</div>
					<div class="shortcode-builder--fields">
						<div class="inner">
						<input type="text" value="" placeholder="function_name" id="comments_callback"  class="alm_element">
						</div>
					</div>
				</div>
			</section>

			<p class="warning-callout">
				<?php _e( 'You must add the comments shortcode directly to your single template file using the <a href="https://developer.wordpress.org/reference/functions/do_shortcode/" target="_blank">do_shortcode</a> method.', 'ajax-load-more' ); ?> <a class="button-small" href="https://connekthq.com/plugins/ajax-load-more/add-ons/comments/" target="_blank"><?php _e( 'View Docs', 'ajax-load-more' ); ?></a>
			</p>

			</div>
		</div>
	</div>
</div>
<?php } ?>
