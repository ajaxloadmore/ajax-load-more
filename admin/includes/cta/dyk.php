<?php
/**
 * Did You Know CTA
 *
 * @package AjaxLoadMore
 */

// phpcs:disable
?>
<?php if ( ! has_action( 'alm_pro_installed' ) ) { ?>
<div class="cta dyk">
	<h3><?php esc_attr_e( 'Did You Know?', 'ajax-load-more' ); ?></h3>
	<?php $random = rand( 2, 7 ); ?>
	<?php if ( $random == 2 ) { ?>
	<div class="cta-inner">
		<div class="img">
			<img src="<?php echo ALM_ADMIN_URL; ?>img/add-ons/cache-add-on.jpg">
		</div>
		<div class="text">
			<p class="lg">You can cache your server requests with Ajax Load More!</p>
			<p>The <a target="blank" style="font-weight: 600;" href="https://connekthq.com/plugins/ajax-load-more/add-ons/cache/?utm_source=WP%20Admin&utm_medium=ALM%20DYK&utm_campaign=Cache">Cache</a> add-on creates static HTML files of Ajax Load More requests then delivers those static files to your visitors.</p>
		</div>
	</div>
	<div class="major-publishing-actions">
		<a target="blank" class="button" href="https://connekthq.com/plugins/ajax-load-more/add-ons/cache/?utm_source=WP%20Admin&utm_medium=ALM%20DYK&utm_campaign=Cache">Learn More</a>
	</div>
	<?php } ?>

	<?php if ( $random == 3 ) { ?>
	<div class="cta-inner">
		<div class="img">
			<img src="<?php echo ALM_ADMIN_URL; ?>img/add-ons/prev-post-add-on.jpg">
		</div>
		<div class="text">
			<p class="lg">You can infinite scroll single posts with Ajax Load More!</p>
			<p>The <a target="blank" style="font-weight: 600;" href="https://connekthq.com/plugins/ajax-load-more/add-ons/previous-post/?utm_source=WP%20Admin&utm_medium=ALM%20DYK&utm_campaign=PreviousPost">Single Post</a> add-on will load single posts as you scroll and update the browser URL to the current post.</p>
		</div>
	</div>
	<div class="major-publishing-actions">
		<a target="blank" class="button" href="https://connekthq.com/plugins/ajax-load-more/add-ons/previous-post/?utm_source=WP%20Admin&utm_medium=ALM%20DYK&utm_campaign=PreviousPost">Learn More</a>
	</div>
	<?php } ?>

	<?php if ( $random == 4 ) { ?>
	<div class="cta-inner">
		<div class="img">
			<img src="<?php echo ALM_ADMIN_URL; ?>img/add-ons/comments-add-on.jpg">
		</div>
		<div class="text">
			<p class="lg">You can lazy load blog comments with Ajax Load More!</p>
			<p>The <a target="blank" style="font-weight: 600;" href="https://connekthq.com/plugins/ajax-load-more/add-ons/comments/?utm_source=WP%20Admin&utm_medium=ALM%20DYK&utm_campaign=Comments">Comments</a> add-on will load and display blog comments using the core Ajax Load More infinite scroll functionality.</p>
		</div>
	</div>
	<div class="major-publishing-actions">
		<a target="blank" class="button" href="https://connekthq.com/plugins/ajax-load-more/add-ons/comments/?utm_source=WP%20Admin&utm_medium=ALM%20DYK&utm_campaign=Comments">Learn More</a>
	</div>
	<?php } ?>

	<?php if ( $random == 5 ) { ?>
	<div class="cta-inner">
		<div class="img">
			<img src="<?php echo ALM_ADMIN_URL; ?>img/add-ons/next-page-add-on.jpg">
		</div>
		<div class="text">
			<p class="lg">You can infinite scroll just about anything with the Next Page add-on!</p>
			<p>The <a target="blank" style="font-weight: 600;" href="https://connekthq.com/plugins/ajax-load-more/add-ons/next-page/?utm_source=WP%20Admin&utm_medium=ALM%20DYK&utm_campaign=Next Page">Next Page</a> add-on will allow you to split post content into pages using the Page Break block or the <span style="display: inline-block; font-style: italic; color: #999;">&lt;!--nextpage--&gt;</span> <a href="https://codex.wordpress.org/Write_Post_SubPanel#Quicktags" target="_blank">Quicktag</a> and load the generated pages on demand.</p>
		</div>
	</div>
	<div class="major-publishing-actions">
		<a target="blank" class="button" href="https://connekthq.com/plugins/ajax-load-more/add-ons/next-page/?utm_source=WP%20Admin&utm_medium=ALM%20DYK&utm_campaign=Next Page">Learn More</a>
	</div>
	<?php } ?>

	<?php if ( $random == 6 ) { ?>
	<div class="cta-inner">
		<div class="img">
			<img src="<?php echo ALM_ADMIN_URL; ?>img/add-ons/pro-bundle-add-on.png">
		</div>
		<div class="text">
			<p class="lg">Ajax Load More PRO</p>
			<p>The <a target="blank" style="font-weight: 600;" href="https://connekthq.com/plugins/ajax-load-more/pro/?utm_source=WP%20Admin&utm_medium=ALM%20DYK&utm_campaign=Pro">Pro</a> add-on bundle provides access to all current and future Ajax Load More add-ons in a single installation!</p>
		</div>
	</div>
	<div class="major-publishing-actions">
		<a target="blank" class="button" href="https://connekthq.com/plugins/ajax-load-more/pro/?utm_source=WP%20Admin&utm_medium=ALM%20DYK&utm_campaign=Pro">Learn More</a>
	</div>
	<?php } ?>

	<?php if ( $random == 7 ) { ?>
	<div class="cta-inner">
		<div class="img">
			<img src="<?php echo ALM_ADMIN_URL; ?>img/add-ons/elementor-add-on.jpg">
		</div>
		<div class="text">
			<p class="lg">Ajax Load More integrates directly with Elementor!</p>
			<p>The <a target="blank" style="font-weight: 600;" href="https://connekthq.com/plugins/ajax-load-more/add-ons/elementor/?utm_source=WP%20Admin&utm_medium=ALM%20DYK&utm_campaign=Elementor">Elementor</a> add-on provides integration for the Elementor Posts and WooCommerce Products widget.</p>
		</div>
	</div>
	<div class="major-publishing-actions">
		<a target="blank" class="button" href="https://connekthq.com/plugins/ajax-load-more/add-ons/elementor/?utm_source=WP%20Admin&utm_medium=ALM%20DYK&utm_campaign=elementor">Learn More</a>
	</div>
	<?php } ?>
</div>
<?php } ?>
