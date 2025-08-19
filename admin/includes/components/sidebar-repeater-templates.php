<?php
/**
 * Repeater Templates Sidebar Display.
 *
 * @package AjaxLoadMore
 */

?>
<div class="cta">
	<h3><?php esc_html_e( 'What\'s a Repeater Template?', 'ajax-load-more' ); ?></h3>
	<div class="cta-inner">
		<p>
		<?php
		$desc = sprintf(
			__(
				'A <a href="%1$s" target="_blank">Repeater Template</a> is a snippet of code that will execute over and over within a <a href="%2$s" target="_blank">WordPress loop</a>.',
				'ajax-load-more'
			),
			'https://connekthq.com/plugins/ajax-load-more/docs/repeater-templates/',
			'https://developer.wordpress.org/themes/basics/the-loop/'
		);
		echo wp_kses_post( $desc );
		?>
		</p>
	</div>
	<div class="major-publishing-actions">
		<a class="button button-primary" href="https://connekthq.com/plugins/ajax-load-more/docs/repeater-templates/" target="_blank">
			<?php esc_html_e( 'Learn More', 'ajax-load-more' ); ?>
		</a>
	</div>
</div>
