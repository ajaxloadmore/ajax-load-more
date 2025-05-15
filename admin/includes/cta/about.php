<?php
/**
 * About CTA
 *
 * @package AjaxLoadMore
 */

?>
<div class="cta">
	<h3><?php esc_attr_e( 'Other Plugins by Connekt', 'ajax-load-more' ); ?></h3>
	<div class="cta-inner">
		<ul class="project-listing">
			<li>
				<a target="blank" href="https://wordpress.org/plugins/block-manager/">
					<img src="<?php echo esc_url( ALM_ADMIN_URL ); ?>img/logos/block-manager-icon.png" alt="">
					<div>
						<h4>Block Manager</h4>
						<p>A plugin to remove unwanted Gutenberg blocks from the WordPress block inserter.</p>
					</div>
				</a>
			</li>
			<li>
				<a target="blank" href="https://getinstantimages.com/">
					<img src="<?php echo esc_url( ALM_ADMIN_URL ); ?>img/logos/instant-images-icon.png" alt="">
					<div>
						<h4>Instant Images</h4>
						<p>One click photo uploads to your media library from Unsplash, Pixabay and Pexels.</p>
					</div>
				</a>
			</li>
		</ul>
	</div>
	<div class="major-publishing-actions">
		<a href="https://connekthq.com/about/" class="button" target="_blank">
			<?php esc_html_e( 'About Connekt', 'ajax-load-more-filters' ); ?>
		</a>
	</div>
</div>
