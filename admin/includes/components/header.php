<?php
/**
 * Plugin admin header.
 *
 * @package AjaxLoadMore
 */

$alm_menu_items   = $GLOBALS['alm_menu_items'];
$alm_current_page = filter_input( INPUT_GET, 'page' );
?>
<header class="alm-admin-toolbar">
	<a class="alm-admin-toolbar--logo" href="<?php get_admin_url(); ?>admin.php?page=ajax-load-more">
		<?php require_once ALM_PATH . 'admin/includes/components/logo.php'; ?>
		<?php echo esc_attr( ALM_TITLE ); ?>
	</a>
	<a class="plugin-link" href="https://wordpress.org/plugins/ajax-load-more/" target="_blank">
		<span class="dashicons dashicons-wordpress"></span>
		<?php echo esc_attr( ALM_VERSION ); ?>
	</a>
</header>
<?php
if ( $alm_menu_items ) {
	?>
<div class="alm-admin-nav">
	<nav>
		<?php
		foreach ( $alm_menu_items as $alm_menu_item ) {
			$alm_menu_class = $alm_current_page === $alm_menu_item['slug'] ? ' class="current"' : '';
			echo '<a href="admin.php?page=' . esc_attr( $alm_menu_item['slug'] ) . '"' . wp_kses_post( $alm_menu_class ) . '>' . esc_attr( $alm_menu_item['label'] ) . '</a>';
		}
		?>
	</nav>
</div>
<?php } ?>
<div class="alm-admin-h1-wrap">
	<h1>
		<span class="offscreen"><?php echo wp_kses_post( $alm_admin_heading ); ?></span>
	</h1>
	<hr class="wp-header-end" />
</div>
