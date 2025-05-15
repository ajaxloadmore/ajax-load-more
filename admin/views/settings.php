<?php
/**
 * Settings Page.
 *
 * @package AjaxLoadMore
 * @since   2.0.0
 */

$alm_admin_heading = __( 'Settings', 'ajax-load-more' );
?>
<div class="alm-settings-feedback"></div>
<?php alm_pro_transient_notification(); ?>
<div class="wrap ajax-load-more settings main-cnkt-wrap" id="alm-settings">
	<?php require_once ALM_PATH . 'admin/includes/components/header.php'; ?>
	<div class="ajax-load-more-inner-wrapper">
		<section class="cnkt-main stylefree">
			<div class="alm-tabbed-wrapper">
			<?php
				global $wp_settings_sections, $wp_settings_fields;
				$page = 'ajax-load-more';
			?>
				<div class="alm-tabbed-wrapper--nav">
					<ul>
						<?php
						foreach ( (array) $wp_settings_sections[ $page ] as $alm_section ) {
							$section_id = $alm_section['id'];

							echo '<li><button type="button" data-id="' . esc_attr( str_replace( 'alm_', '', $section_id ) ) . '">';
							if ( $alm_section['title'] ) {
								if ( $section_id === 'alm_general_settings' || $section_id === 'alm_admin_settings' ) {
									echo '<i class="fa fa-cog"></i>' . esc_attr( $alm_section['title'] );
								} else {
									$nav_title = str_replace( ' Settings', '', $alm_section['title'] );

									// Append 's' to the title if the section in array.
									$nav_title = in_array(
										$section_id,
										[
											'alm_filters_settings',
											'alm_theme_repeaters_settings',
											'alm_prev_post_settings',
										],
										true
									) ? $nav_title . 's' : $nav_title;

									echo '<i class="fa fa-plus-circle"></i>' . esc_attr( $nav_title );
								}
							}
							echo '</button></li>';
						}
						?>
					</ul>
				</div>
				<div class="alm-tabbed-wrapper--sections">
					<?php settings_errors(); ?>
					<form action="options.php" method="post" id="alm_OptionsForm">
					<?php
					settings_fields( 'alm-setting-group' );
					/**
					 * Custom Settings Page.
					 *
					 * @see https://developer.wordpress.org/reference/functions/do_settings_sections/.
					 */
					if ( ! isset( $wp_settings_sections[ $page ] ) ) {
						return;
					}

					// Loop each section.
					foreach ( (array) $wp_settings_sections[ $page ] as $alm_section ) {
						echo '<div class="shortcode-parameter-wrap alm-tabbed-wrapper--section" tabindex="0" id="' . esc_attr( str_replace( 'alm_', '', $alm_section['id'] ) ) . '">';
						if ( $alm_section['title'] ) {
							echo '<h2>' . esc_attr( $alm_section['title'] ) . '</h2>';
						}

						if ( $alm_section['callback'] ) {
							call_user_func( $alm_section['callback'], $alm_section );
						}

						if ( ! isset( $wp_settings_fields ) || ! isset( $wp_settings_fields[ $page ] ) || ! isset( $wp_settings_fields[ $page ][ $alm_section['id'] ] ) ) {
							continue;
						}
						// Display settings in table.
						echo '<table class="form-table" role="presentation">';
						do_settings_fields( $page, $alm_section['id'] );
						echo '</table>';
						echo '</div>';
					}

					// get the older values, wont work the first time.
					$options = get_option( '_alm_settings' );
					?>
						<div class="save-in-progress"></div>
					</form>
				</div>
			</div>
		</section>
		<aside class="cnkt-sidebar">
			<?php require_once ALM_PATH . 'admin/includes/cta/resources.php'; ?>
			<?php require_once ALM_PATH . 'admin/includes/cta/dyk.php'; ?>
			<?php require_once ALM_PATH . 'admin/includes/cta/about.php'; ?>
		</aside>
	</div>
</div>
