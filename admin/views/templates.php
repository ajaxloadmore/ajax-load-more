<?php
/**
 * Repeater Templates Page.
 *
 * @package AjaxLoadMore
 * @since   2.0.0
 */

$alm_admin_heading   = __( 'Templates', 'ajax-load-more' );
$alm_theme_repeaters = isset( $_GET['theme-templates'] ) ? true : false;
?>
<div class="wrap ajax-load-more main-cnkt-wrap" id="alm-repeaters">
	<?php require_once ALM_PATH . 'admin/includes/components/header.php'; ?>
	<div class="ajax-load-more-inner-wrapper">
		<div class="cnkt-main stylefree repeaters">
			<ul class="alm-toggle-switch">
				<li>
					<?php
						echo '<a href="?page=ajax-load-more-repeaters" class="' . ( ! $alm_theme_repeaters ? 'active' : '' ) . '">' . esc_html__( 'Repeater Templates', 'ajax-load-more' ) . '</a>';
					?>
				</li>
				<li>
					<?php
					echo '<a href="?page=ajax-load-more-repeaters&theme-templates" class="' . ( $alm_theme_repeaters ? 'active' : '' ) . '">' . esc_html__( 'Theme Templates', 'ajax-load-more' ) . '</a>';
					?>
				</li>
			</ul>
			<div class="alm-content-wrap">
				<?php
				if ( $alm_theme_repeaters ) {
					// Theme Templates.
					require_once ALM_PATH . 'admin/includes/components/theme-templates.php';

				} else {
					// Repeater Templates.
					require_once ALM_PATH . 'admin/includes/components/repeater-templates.php';

				}
				?>
			</div>
		</div>

		<aside class="cnkt-sidebar" data-sticky>
			<?php
			// TOC for users with Templates add-on.
			if ( ( has_action( 'alm_unlimited_repeaters' ) && ! $alm_theme_repeaters ) || ( $alm_theme_repeaters && has_action( 'alm_theme_repeaters_installed' ) ) ) {
				echo '<div class="table-of-contents repeaters-toc"><select class="toc"></select></div>';
			}
			?>
			<?php
			if ( $alm_theme_repeaters ) {
				require_once ALM_PATH . 'admin/includes/components/sidebar-theme-templates.php';

			} else {
				require_once ALM_PATH . 'admin/includes/components/sidebar-repeater-templates.php';
			}
			?>
			<?php
			if ( ! $alm_theme_repeaters ) {
				include_once ALM_PATH . 'admin/includes/cta/writeable.php';
			}
			?>
		</aside>
	</div>
</div>
