<?php
/**
 * Shortcode Builder Page.
 *
 * @package AjaxLoadMore
 * @since   2.0.0
 */

$alm_admin_heading = __( 'Shortcode Builder', 'ajax-load-more' );
?>
<div class="wrap ajax-load-more shortcode-builder main-cnkt-wrap" id="alm-builder">
	<?php require_once ALM_PATH . 'admin/includes/components/header.php'; ?>
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
					<p><?php _e( 'Place the Ajax Load More shortcode into the content editor, Ajax Load More block or a widget area of your theme.', 'ajax-load-more' ); ?></p>
					<div class="output-wrap">
						<textarea id="shortcode_output" readonly></textarea>
					</div>
				</div>
				<div class="major-publishing-actions">
					<button class="button button-primary copy copy-to-clipboard" data-copied="<?php _e( 'Copied!', 'ajax-load-more' ); ?>"><?php _e( 'Copy Shortcode', 'ajax-load-more' ); ?></button>
					<a id="shortcode-preview" class="button button-secondary" data-home-url="<?php echo esc_url( get_home_url() ); ?>" href="<?php echo esc_url( get_home_url() ); ?>?alm_preview=[ajax_load_more]" target="_blank"><?php _e( 'Preview', 'ajax-load-more' ); ?></a>
					<button class="button reset-shortcode-builder"><?php _e( 'Reset', 'ajax-load-more' ); ?></button>
				</div>
			</div>
		</aside>
	</div>
</div>
