<?php if ( isset( $repeater_options ) ) { ?>
<div class="alm-drop-btn alm-repeater-options">
	<a href="javascript:void(0);" class="target">
		<i class="fa fa-cog"></i><span class="offscreen"><?php esc_attr_e( 'Options', 'ajax-load-more' ); ?></span>
	</a>
	<div class="alm-dropdown">
		<div class="alm-drop-inner">
			<ul>
				<?php if ( $repeater_options['type'] !== 'theme-repeater' ) { ?>
				<li>
					<button type="button" class="option option-update">
						<i class="fa fa-pencil"></i>
						<span><?php esc_attr_e( 'Update from Database', 'ajax-load-more' ); ?></span>
					</button>
				</li>
				<?php } ?>

				<?php
				if ( isset( $repeater_options['path'] ) ) {
					$path = str_replace( '/', '_', $repeater_options['path'] );
					?>
				<li class="option download">
					<form action="" method="POST" id="<?php echo esc_attr( $path ); ?>">
						<input type="hidden" name="alm_repeaters_export_type" value="<?php echo $repeater_options['type']; ?>">
						<input type="hidden" name="alm_repeaters_export" value="<?php echo AjaxLoadMore::alm_get_repeater_path(); ?>">
						<input type="hidden" name="alm_repeaters_export_name" value="<?php echo $repeater_options['name']; ?>">
						<button type="button" class="download-repeater">
							<i class="fa fa-download"></i> <?php esc_attr_e( 'Download Template', 'ajax-load-more' ); ?>
						</button>
					</form>
				</li>
				<?php } ?>
				<li>
					<button type="button" class="option copy" data-copied="<?php esc_attr_e( 'Copied!', 'ajax-load-more' ); ?>" data-copy="<?php esc_attr_e( 'Copy Template', 'ajax-load-more' ); ?>">
						<i class="fa fa-file"></i>
						<span><?php esc_attr_e( 'Copy Template', 'ajax-load-more' ); ?></span>
					</button>
				</li>

			</ul>
		</div>
	</div>
</div>
<?php } ?>
