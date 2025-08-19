<?php
/**
 * Go Pro Page.
 *
 * @package AjaxLoadMore
 * @since   2.0.0
 */

$alm_admin_heading = __( 'Ajax Load More Pro', 'ajax-load-more' );
?>
<div class="wrap ajax-load-more main-cnkt-wrap" id="alm-add-ons">
	<?php require_once ALM_PATH . 'admin/includes/components/header.php'; ?>
	<div class="ajax-load-more-inner-wrapper">
		<div class="cnkt-main stylefree">
			<?php
			// Go Pro Upgrade CTA.
			$alm_pro_cta = alm_get_pro_addon();
			if ( $alm_pro_cta && $alm_pro_cta[0] ) {
				alm_display_featured_addon( $alm_pro_cta[0], 'Upgrade Now' );
			}
			?>
			<p style="text-align: center; margin: 15px 0;">
				<?php esc_html_e( 'The following products are included when you purchase Ajax Load More Pro:', 'ajax-load-more' ); ?>
			</p>
			<div class="flexbox-wrap">
			<?php
			$target = 'target="_blank"';
			$addons = alm_get_addons();
			foreach ( $addons as $addon ) {
				$name           = $addon['name'];
				$intro          = $addon['intro'];
				$desc           = $addon['desc'];
				$action         = $addon['action'];
				$key            = $addon['key'];
				$status         = $addon['status'];
				$settings_field = $addon['settings_field'];
				$url            = $addon['url'];
				$img            = $addon['img'];
				?>
				<div class="group group--pro no-shadow">
					<a href="<?php echo $url; ?>?utm_source=WP%20Admin&utm_medium=ALM%20Add-ons&utm_campaign=<?php echo $name; ?>" <?php echo $target; ?>>
						<img src="<?php echo ALM_ADMIN_URL; ?><?php echo $img; ?>" alt="">
						<h2 class="addon-title"><?php echo $name; ?></h2>
						<p class="lg"><?php echo $intro; ?></p>
						<p><?php echo $desc; ?></p>
					</a>
				</div>
			<?php } ?>
			</div>

		</div>

		<aside class="cnkt-sidebar" data-sticky>
			<div class="cta">
				<h3><?php esc_attr_e( 'About the Pro Bundle', 'ajax-load-more' ); ?></h3>
				<div class="cta-inner">
					<p style="padding-bottom: 10px;"><?php esc_attr_e( 'The Ajax Load More Pro bundle is installed as a single add-on with one license and contains every add-on currently available.', 'ajax-load-more' ); ?></p>
					<p style="padding-bottom: 10px;"><?php esc_attr_e( 'Once installed, add-ons are able to be activated and deactivated with ease from the Pro dashboard inside your WordPress admin.', 'ajax-load-more' ); ?></p>
					<p style="padding: 15px 0 0 0; border-top: 1px solid #efefef; font-size: 12px;"><strong><?php esc_attr_e( 'Note:', 'ajax-load-more' ); ?></strong> <?php echo wp_kses_post( __( 'The core Ajax Load More plugin is required to be installed and activated when using the Pro add-on.', 'ajax-load-more' ) ); ?></p>
				</div>
				<div class="major-publishing-actions">
					<a href="https://connekthq.com/plugins/ajax-load-more/pro/?utm_source=WP%20Admin&utm_medium=Go%20Pro%20Dashboard&utm_campaign=ProUpgrade" class="button button-primary" target="_blank">
						<?php esc_attr_e( 'Learn More', 'ajax-load-more' ); ?>
					</a>
				</div>
			</div>
		</aside>
	</div>
</div>
