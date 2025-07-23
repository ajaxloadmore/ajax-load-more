<?php
/**
 * Theme Templates Sidebar Display.
 *
 * @package AjaxLoadMore
 */

?>
<div class="cta">
	<h3><?php esc_html_e( 'What\'s a Theme Template?', 'ajax-load-more' ); ?></h3>
	<div class="cta-inner">
		<p>
		<?php
		$desc = sprintf( __( 'Theme Templates are <a href="%1$s" target="_blank">Repeater Templates</a> loaded from the active theme directory.', 'ajax-load-more' ), 'https://connekthq.com/plugins/ajax-load-more/docs/repeater-templates/' );
		echo wp_kses_post( $desc );
		?>
		</p>
		<p><?php echo wp_kses_post( __( 'Manage and maintain Ajax Load More templates with your favorite code editor and push updates via GIT or SFTP.', 'ajax-load-more' ) ); ?></p>
	</div>
	<div class="major-publishing-actions">
		<a class="button button-primary" href="https://connekthq.com/plugins/ajax-load-more/docs/repeater-templates/" target="_blank">
			<?php esc_html_e( 'Learn More', 'ajax-load-more' ); ?>
		</a>
		<?php if ( has_action( 'alm_get_theme_repeater' ) ) { ?>
		<a href="admin.php?page=ajax-load-more#templates_settings" class="button"><?php esc_html_e( 'Manage Directory', 'ajax-load-more' ); ?></a>
		<?php } ?>
	</div>
</div>
