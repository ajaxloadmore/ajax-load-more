<?php
/**
 * Help Page.
 *
 * @package AjaxLoadMore
 * @since   2.0.0
 */

$alm_admin_heading = __( 'Help', 'ajax-load-more' );
$id                = 'alm-help';
$examples          = false;

if ( isset( $_GET['section'] ) ) {
	$the_section = $_GET['section'];
	if ( $the_section == 'examples' ) {
		$examples = true;
		$subtitle = __( 'A collection of everyday shortcode usages and implementation examples', 'ajax-load-more' ) . '.';
		$id       = 'alm-examples';
	}
}
?>
<div class="wrap ajax-load-more main-cnkt-wrap" id="<?php echo $id; ?>">
	<?php require_once ALM_PATH . 'admin/includes/components/header.php'; ?>
	<div class="ajax-load-more-inner-wrapper">
		<div class="cnkt-main stylefree">
			<ul class="alm-toggle-switch">
				<li>
					<a href="?page=ajax-load-more-help" class="
					<?php
					if ( ! $examples ) {
						echo 'active';}
					?>
					">
					<?php _e( 'Implementation Guide', 'ajax-load-more' ); ?>
					</a>
				</li>
				<li>
					<a href="?page=ajax-load-more-help&section=examples" class="
					<?php
					if ( $examples ) {
						echo 'active';}
					?>
					">
					<?php esc_attr_e( 'Examples', 'ajax-load-more' ); ?>
					</a>
				</li>
			</ul>
		<?php
		if ( ! $examples ) {
			// Implementation Guide.
			?>
			<div class="alm-content-wrap">
				<img src="<?php echo esc_attr( ALM_ADMIN_URL ); ?>img/infographic.png">
			</div>
			<?php
		} else {
			// Examples.
			include_once ALM_PATH . 'admin/includes/components/example-list.php';
		}
		?>
		</div>
		<aside class="cnkt-sidebar">
		<?php
		if ( ! $examples ) {
			// Implementation Guide.
			include_once ALM_PATH . 'admin/includes/cta/resources.php';
			include_once ALM_PATH . 'admin/includes/cta/dyk.php';

		} else {
			// Examples.
			?>
		<div class="cta">
			<h3>
				<?php esc_attr_e( 'Example Library', 'ajax-load-more' ); ?>
			</h3>
			<div class="cta-inner">
				<p>
					<?php echo wp_kses_post( __( 'View our collection of over 40 real world Ajax Load More <a href="https://ajaxloadmore.com/examples/" target="_blank">examples</a> available on the plugin website.', 'ajax-load-more' ) ); ?>
				</p>
			</div>
			<div class="major-publishing-actions">
				<a href="https://ajaxloadmore.com/examples/" class="button button-primary" target="_blank">
					<?php esc_attr_e( 'View All Examples', 'ajax-load-more' ); ?>
				</a>
			</div>
		</div>
			<?php
			include_once ALM_PATH . 'admin/includes/cta/dyk.php';
			include_once ALM_PATH . 'admin/includes/cta/resources.php';
		}
		?>
		</aside>
	</div>
</div>
