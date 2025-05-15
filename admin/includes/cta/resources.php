<?php
/**
 * Resources CTA
 *
 * @package AjaxLoadMore
 */

?>
<div class="cta resources">
	<h3><?php esc_attr_e( 'Plugin Resources', 'ajax-load-more' ); ?></h3>
	<div class="cta-inner">
		<ul>
			<li>
				<a target="blank" href="https://connekthq.com/plugins/ajax-load-more/"><i class="fa fa-desktop"></i> <?php esc_attr_e( 'Ajax Load More Demo Site', 'ajax-load-more' ); ?></a>
			</li>

			<li>
				<a target="blank" href="https://connekthq.com/plugins/ajax-load-more/docs/implementation-guide/"><i class="fa fa-file-text" aria-hidden="true"></i> <?php _e( 'Implementation Guide', 'ajax-load-more' ); ?></a>
			</li>
			<li>
				<a target="blank" href="https://connekthq.com/plugins/ajax-load-more/docs/"><i class="fa fa-pencil"></i> <?php esc_attr_e( 'Documentation', 'ajax-load-more' ); ?></a>
			</li>
			<?php if ( ! alm_has_addon_shortcodes() ) { ?>
			<li>
				<a target="blank" href="http://wordpress.org/support/plugin/ajax-load-more"><i class="fa fa-question-circle"></i> <?php esc_attr_e( 'Support and Issues', 'ajax-load-more' ); ?></a>
			</li>
			<?php } else { ?>
			<li>
				<a target="blank" href="https://connekthq.com/support/?product=Ajax%20Load%20More"><i class="fa fa-question-circle"></i> <?php esc_attr_e( 'Get Support', 'ajax-load-more' ); ?></a>
			</li>
			<?php } ?>
			<li>
				<a target="blank" href="https://wordpress.org/support/view/plugin-reviews/ajax-load-more"><i class="fa fa-star"></i> <?php esc_attr_e( 'Reviews', 'ajax-load-more' ); ?></a>
			</li>
			<li>
				<a target="blank" href="https://wordpress.org/plugins/ajax-load-more/"><i class="fa fa-wordpress"></i> <?php esc_attr_e( 'WordPress', 'ajax-load-more' ); ?></a>
			</li>
			<li>
				<a target="blank" href="https://github.com/ajaxloadmore/ajax-load-more"><i class="fa fa-github"></i> <?php esc_attr_e( 'Github', 'ajax-load-more' ); ?></a>
			</li>
		</ul>
	</div>
</div>
