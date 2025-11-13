<?php if ( has_action( 'alm_cache_installed' ) ) { ?>
<div class="row input cache add-on" id="alm-cache">
	<h3 class="heading" tabindex="0"><?php _e( 'Cache', 'ajax-load-more' ); ?></h3>
	<div class="expand-wrap">
		<section class="first">
			<div class="shortcode-builder--label">
				<p><?php _e( 'Turn on caching of Ajax requests.', 'ajax-load-more' ); ?></p>
			</div>
			<div class="shortcode-builder--fields">
				<div class="inner">
					<ul>
						<li>
						<input class="alm_element" type="radio" name="cache" value="true" id="cache-true" >
						<label for="cache-true"><?php _e( 'True', 'ajax-load-more' ); ?></label>
						</li>
						<li>
						<input class="alm_element" type="radio" name="cache" value="false" id="cache-false"  checked="checked">
						<label for="cache-false"><?php _e( 'False', 'ajax-load-more' ); ?></label>
						</li>
					</ul>
				</div>
			</div>
		</section>
	</div>
</div>
<?php } ?>
