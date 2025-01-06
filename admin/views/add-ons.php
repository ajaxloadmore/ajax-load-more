<?php
/**
 * Add-ons Page.
 *
 * @package AjaxLoadMore
 * @since   2.0.0
 */

$alm_admin_heading = __( 'Add-ons', 'ajax-load-more' );
?>
<div class="wrap ajax-load-more main-cnkt-wrap" id="alm-add-ons">
	<?php require_once ALM_PATH . 'admin/includes/components/header.php'; ?>
	<div class="ajax-load-more-inner-wrapper">
		<div class="cnkt-main stylefree">
			<?php
			// Go Pro Upgrade CTA.
			$alm_pro_cta = alm_get_pro_addon();
			if ( $alm_pro_cta && $alm_pro_cta[0] ) {
				echo wp_kses_post( alm_display_featured_addon( $alm_pro_cta[0], 'Upgrade Now' ) );
				echo '<div class="spacer lg"></div>';
			}
			?>
			<section class="flexbox-wrap">
				<?php
				$alm_addons = alm_get_addons();
				foreach ( $alm_addons as $alm_addon ) {
					$name           = $alm_addon['name']; //phpcs:ignore
					$intro          = $alm_addon['intro']; //phpcs:ignore
					$desc           = $alm_addon['desc']; //phpcs:ignore
					$action         = $alm_addon['action']; //phpcs:ignore
					$key            = $alm_addon['key']; //phpcs:ignore
					$status         = $alm_addon['status']; //phpcs:ignore
					$settings_field = $alm_addon['settings_field']; //phpcs:ignore
					$url            = $alm_addon['url']; //phpcs:ignore
					$img            = $alm_addon['img']; //phpcs:ignore
					?>
				<div class="group no-shadow
					<?php
					if ( has_action( $action ) ) {
						echo ' installed'; }
					?>
				">
				<a href="<?php echo esc_url( $url ); ?>?utm_source=WP%20Admin&utm_medium=ALM%20Add-ons&utm_campaign=<?php echo esc_attr( $name ); ?>" target="_blank">
					<img src="<?php echo esc_url( ALM_ADMIN_URL ) . esc_attr( $img ); ?>" alt="">
					<h2 class="addon-title"><?php echo esc_attr( $name ); ?></h2>
					<p class="lg"><?php echo esc_attr( $intro ); ?></p>
					<p><?php echo esc_attr( $desc ); ?></p>
					<?php
					if ( has_action( $action ) ) {
						echo '<span class="cnkt-button installed"><i class="fa fa-check-square"></i> ' . esc_attr__( 'Installed', 'ajax-load-more' ) . '</span> ';
					} else {
						echo '<span class="cnkt-button">' . esc_attr__( 'Purchase', 'ajax-load-more' ) . '</span>';
					}
					?>
				</a>
				</div>
				<?php } ?>
			</section>
			<div class="call-out call-out--centered light no-shadow">
				<p><?php echo wp_kses_post( __( 'All add-ons are installed as standalone plugins and with a valid license key will receive plugin update notifications directly within the <a href="plugins.php">WordPress plugin dashboard</a>.', 'ajax-load-more' ) ); ?></p>
			</div>
		</div>

		<aside class="cnkt-sidebar" data-sticky>
			<?php require_once ALM_PATH . 'admin/includes/cta/add-ons.php'; ?>
		</aside>
	</div>
</div>
