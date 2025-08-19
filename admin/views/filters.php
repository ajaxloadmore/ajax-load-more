<?php
/**
 * Filters Page.
 *
 * @package AjaxLoadMore
 * @since   7.0.0
 */

$alm_admin_heading = __( 'Filters', 'ajax-load-more' );
$alm_pg_title      = ( has_action( 'alm_pro_installed' ) ) ? __( 'Pro License', 'ajax-load-more' ) : __( 'Licenses', 'ajax-load-more' );
$alm_pg_desc       = ( has_action( 'alm_pro_installed' ) ) ? __( 'Enter your Pro license key to enable updates from the plugins dashboard', 'ajax-load-more' ) : __( 'Enter your license keys below to enable <a href="admin.php?page=ajax-load-more-add-ons">add-on</a> updates from the plugins dashboard', 'ajax-load-more' );
?>
<div class="wrap ajax-load-more main-cnkt-wrap" id="alm-licenses">
	<?php require_once ALM_PATH . 'admin/includes/components/header.php'; ?>
	<div class="ajax-load-more-inner-wrapper">
		<div class="cnkt-main stylefree">
			<?php
			// Display Filters CTA.
			$alm_filters_cta = alm_get_addon( 'filters' );
			if ( $alm_filters_cta ) {
				alm_display_featured_addon( $alm_filters_cta, 'Upgrade Now' );
			}
			?>
		</div>

		<aside class="cnkt-sidebar" data-sticky>
			<div class="cta">
				<h3><?php esc_attr_e( 'About Filters', 'ajax-load-more' ); ?></h3>
				<div class="cta-inner">
					<p><?php esc_attr_e( 'The Filters add-on is a no-coding required solution that makes filtering with Ajax Load More easy and intuitive for both site developers and the frontend users.', 'ajax-load-more' ); ?></p>
					<p><strong><?php esc_attr_e( 'Examples:', 'ajax-load-more' ); ?></strong><br/>
						<a href="https://connekthq.com/plugins/ajax-load-more/add-ons/filters/#examples" target="_blank"><?php esc_attr_e( 'Basic Filtering', 'ajax-load-more' ); ?></a>,
						<a href="https://connekthq.com/plugins/ajax-load-more/add-ons/filters/facet-filtering/" target="_blank"><?php esc_attr_e( 'Facets', 'ajax-load-more' ); ?></a>,
						<a href="https://connekthq.com/plugins/ajax-load-more/add-ons/filters/datepicker-range/" target="_blank"><?php esc_attr_e( 'Date Picker', 'ajax-load-more' ); ?></a>,
						<a href="https://connekthq.com/plugins/ajax-load-more/add-ons/filters/search/?search=Ajax%20Load%20More" target="_blank"><?php esc_attr_e( 'Search', 'ajax-load-more' ); ?></a>,
						<a href="https://connekthq.com/plugins/ajax-load-more/add-ons/filters/selected-filters/?category=open-source+release-notes" target="_blank"><?php esc_attr_e( 'Selected Filters', 'ajax-load-more' ); ?></a>
					</p>
				</div>
				<div class="major-publishing-actions">
					<a class="button button-primary" target="_blank" href="https://connekthq.com/plugins/ajax-load-more/add-ons/filters/">
						<?php esc_attr_e( 'Learn More', 'ajax-load-more' ); ?>
					</a>
				</div>
			</div>
		</aside>
	</div>
</div>
