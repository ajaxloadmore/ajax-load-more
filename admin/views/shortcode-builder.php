<?php
/**
 * Shortcode Builder Page.
 *
 * @package AjaxLoadMore
 * @since   2.0.0
 */

// @codingStandardsIgnoreStart
?>
<div class="admin ajax-load-more shortcode-builder" id="alm-builder">
	<div class="wrap main-cnkt-wrap">

		<?php require_once ALM_PATH . 'admin/includes/components/header.php'; ?>
		<div class="alm-admin-heading">
			<h1><?php esc_attr_e( 'Shortcode Builder', 'ajax-load-more' ); ?></h1>
		</div>

		<div class="ajax-load-more-inner-wrapper">
		   <div class="cnkt-main stylefree">
			  	<form id="alm-shortcode-builder-form">
					<?php require_once ALM_PATH . 'admin/shortcode-builder/shortcode-builder.php'; ?>
			  	</form>
		  	</div>

		  	<aside class="cnkt-sidebar" data-sticky>
				<div class="cta">
					<h3><?php _e( 'Shortcode Output', 'ajax-load-more' ); ?></h3>
					<div class="cta-inner">
						<p><?php _e( 'Place the following shortcode into the content editor or widget area of your theme.', 'ajax-load-more' ); ?></p>
						<div class="output-wrap">
							<textarea id="shortcode_output" readonly></textarea>
						</div>
					</div>
					<div class="major-publishing-actions">
						<a class="button button-primary copy copy-to-clipboard" data-copied="<?php _e( 'Copied!', 'ajax-load-more' ); ?>"><?php _e( 'Copy Shortcode', 'ajax-load-more' ); ?></a>
						<p class="small reset-shortcode-builder"><a href="javascript:void(0);"><i class="fa fa-refresh"></i> <?php _e( 'Reset', 'ajax-load-more' ); ?></a></p>
					</div>
				</div>
		  	</aside>
	  </div>
	</div>
</div>
