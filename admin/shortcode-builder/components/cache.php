<?php if ( has_action( 'alm_cache_installed' ) ) { ?>
<div class="row input cache add-on" id="alm-cache">
	<h3 class="heading" tabindex="0"><?php _e( 'Cache', 'ajax-load-more' ); ?></h3>
	<div class="expand-wrap">
		<section class="first">
			<div class="shortcode-builder--label">
				<p><?php _e( 'Turn on content caching.', 'ajax-load-more' ); ?></p>
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

		<div class="cache_id nested-component">
			<div class="nested-component--inner">
				<section>
				<div class="shortcode-builder--label">
					<h4><?php _e( 'Cache ID', 'ajax-load-more' ); ?></h4>
					<p><?php _e( 'You must generate a unique ID for this cached query to be used as a content identifier.', 'ajax-load-more' ); ?></p>
				</div>
				<div class="shortcode-builder--fields">
					<div class="inner">
						<input type="text" class="alm_element" name="cache-id" id="cache-id">
						<div class="clear"></div>
						<p class="generate-id">
							<a href="javascript:void(0);" data-id="cache-id">
								<i class="fa fa-random"></i> <?php _e( 'Generate Cache ID', 'ajax-load-more' ); ?>
							</a>
						</p>
					</div>
				</div>
				</section>
			</div>
		</div>
	</div>
</div>
<?php } ?>
