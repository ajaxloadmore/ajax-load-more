<?php
/**
 * REST API CTA
 *
 * @package AjaxLoadMore
 */

// phpcs:disable
?>
<?php
// Only render REST API test if REST API is active
$options = get_option( 'alm_settings' ); // Get ALM Options

if ( isset( $options['_alm_use_rest_api'] ) && $options['_alm_use_rest_api'] !== '1' ) { // REST API manually disabled from ALM settings.
	if ( ! function_exists( 'get_rest_url' ) ) {
		?>
	<div class="cta restapi-access">
		<h3><?php _e( 'REST API Access', 'ajax-load-more' ); ?></h3>
		<div class="cta-inner">
		   <div class="item">
			  <p class="writeable-title">
				 <i class="fa fa-exclamation"></i>
				 <strong><?php _e( 'REST API Blocked', 'ajax-load-more' ); ?></strong><br/>
				<?php echo __( 'Unable to access the WordPress REST API. Are you running a security plugin or have your server configured in a way that may be preventing access to the REST API?', 'ajax-load-more' ); ?>
			 </p>
			 <p class="writeable-title">
				<a href="https://ajaxloadmore.com/support" target="_blank" class="button button-primary"><?php _e( 'Get Plugin Support', 'ajax-load-more' ); ?></a>
			 </p>
		   </div>
	   </div>
	</div>
	<?php } ?>
<?php } ?>
