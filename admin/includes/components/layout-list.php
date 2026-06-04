<?php
/**
 * Layout dropdown functionality in the Repeater Template view.
 *
 * @package  AjaxLoadMore
 * @since    2.0.0
 */

// Layout add-on path.
$alm_layouts_href = 'https://ajaxloadmore.com/add-ons/layouts/?utm_source=WP%20Admin&utm_medium=Extend&utm_campaign=Layouts';

?>
<div class="alm-drop-btn alm-layout-selection">
	<a href="javascript:void(0);" class="target">
		<i class="fa fa-file-code-o" aria-hidden="true"></i> <?php esc_attr_e( 'Layouts', 'ajax-load-more' ); ?>
	</a>
	<div class="alm-dropdown">
		<div class="alm-drop-inner">
			<?php
			if ( has_action( 'alm_layouts_installed' ) ) {

				// List custom layouts.
				include ALM_PATH . 'admin/includes/components/custom-layouts.php';

				// Get add-on Layouts.
				do_action( 'alm_get_layouts_add_on' );
			} else {
				?>
				<ul>
					<li>
						<button type="button" class="layout" data-type="default">
							<i class="fa fa-file-code-o" aria-hidden="true"></i>
							<?php esc_attr_e( 'Default Layout', 'ajax-load-more' ); ?>
						</button>
					</li>
				</ul>
				<?php
				// List custom layouts.
				require ALM_PATH . 'admin/includes/components/custom-layouts.php';
				?>
				<div class="call-out call-out--centered radius-normal margin-top-half">
					<p style="font-size: 13px;">
						<i class="fa fa-file-code-o" aria-hidden="true"></i>
						<?php
						// translators: %1$s is the opening <a> tag, %2$s is the closing </a> tag.
						$alm_layouts_translation = sprintf( __( 'Get predefined responsive layouts with the %1$sLayouts%2$s add-on.', 'ajax-load-more' ), '<a href="' . $alm_layouts_href . '">', '</a>' );
						echo wp_kses_post( $alm_layouts_translation );
						?>
					</p>
					<div>
						<a class="cnkt-button" href="<?php echo esc_attr( $alm_layouts_href ); ?>">
							<i class="fa fa-angle-right" aria-hidden="true"></i>
							<?php esc_attr_e( 'Upgrade Now', 'ajax-load-more' ); ?>
						</a>
					</div>
				</div>
				<?php
			}
			?>
		</div>
	</div>
</div>
