<?php
/**
 * Licenses Page.
 *
 * @package AjaxLoadMore
 * @since   2.0.0
 */

$alm_admin_heading = __( 'Licenses', 'ajax-load-more' );
$alm_pg_title      = has_action( 'alm_pro_installed' ) ? __( 'Pro License', 'ajax-load-more' ) : __( 'Licenses', 'ajax-load-more' );
$alm_pg_desc       = has_action( 'alm_pro_installed' ) ? __( 'Enter your Pro license key to enable updates from the plugins dashboard', 'ajax-load-more' ) : __( 'Enter your license keys below to enable <a href="admin.php?page=ajax-load-more-add-ons">add-on</a> updates from the plugins dashboard', 'ajax-load-more' );

if ( isset( $_POST['license_activate'] ) ) {
	print_r( $_POST );
}

?>
<div class="wrap ajax-load-more main-cnkt-wrap" id="alm-licenses">
	<?php require_once ALM_PATH . 'admin/includes/components/header.php'; ?>
	<div class="ajax-load-more-inner-wrapper">
		<div class="cnkt-main">
			<h2>
				<?php
				if ( has_action( 'alm_pro_installed' ) ) {
					esc_html_e( 'License Key', 'ajax-load-more' );
				} else {
					esc_html_e( 'License Keys', 'ajax-load-more' );
				}
				?>
			</h2>
			<p>
				<?php
				if ( has_action( 'alm_pro_installed' ) ) {
					_e( 'Enter your Ajax Load More Pro license key to receive plugin updates directly from the <a href="plugins.php">WP Plugins dashboard</a>.', 'ajax-load-more' );
				} else {
					_e( 'Enter the license key for each of your Ajax Load More add-ons to receive plugin updates directly from the <a href="plugins.php">WP Plugins dashboard</a>.', 'ajax-load-more' );
				}
				?>
			</p>
			<?php
			$addons      = has_action( 'alm_pro_installed' ) ? alm_get_pro_addon() : alm_get_addons();
			$addon_count = 0;
			foreach ( $addons as $addon ) {
				$name           = $addon['name'];
				$intro          = $addon['intro'];
				$desc           = $addon['desc'];
				$action         = $addon['action'];
				$key            = $addon['key'];
				$settings_field = $addon['settings_field'];
				$url            = $addon['url'];
				$item_id        = $addon['item_id'];

				$constant = 'ALM_' . strtoupper( str_replace( '-', '_', sanitize_title_with_dashes( $name ) ) ) . '_LICENSE_KEY'; // e.g. ALM_CALL_TO_ACTION_LICENSE_KEY.
				$license  = defined( $constant ) ? constant( $constant ) : get_option( $key );

				// If installed.
				if ( ! has_action( $action ) ) {
					continue;
				}
				++$addon_count;

				// Check license status.
				$license_status = alm_license_check( $item_id, $license, $settings_field );
				$is_valid       = $license_status === 'valid';

				// Get the complete license data.
				$license_data = alm_get_license_data( "{$settings_field}_data" );
				?>
				<form method="post" action="admin.php?page=ajax-load-more-licenses">
					<?php
						$nonce = 'alm_' . esc_html( $item_id ) . '_license_nonce';
						wp_nonce_field( $nonce, $nonce );
						settings_fields( $settings_field );
					?>
					<input type="hidden" name="alm_license_nonce" value="<?php echo esc_attr( $nonce ); ?>" />
					<input type="hidden" name="alm_item_name" value="<?php echo esc_attr( $name ); ?>" />
					<input type="hidden" name="alm_item_key" value="<?php echo esc_attr( $key ); ?>" />
					<input type="hidden" name="alm_item_option" value="<?php echo esc_attr( $settings_field ); ?>" />

					<div class="alm-license">
						<div class="alm-license--header">
							<h3 title="<?php echo esc_html( $constant ); ?>"><?php echo esc_html( $name ); ?></h3>
							<a href="<?php echo esc_url( $url ); ?>" target="_blank" aria-label="<?php esc_html_e( 'View Add-on', 'ajax-load-more' ); ?>">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
									<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
								</svg>
							</a>
						</div>
						<div class="alm-license--fields">
							<?php if ( $license_status !== 'valid' ) { ?>
							<div class="alm-license-callout">
								<h4><?php _e( 'Don\'t have a license?', 'ajax-load-more' ); ?></h4>
								<p><?php _e( 'A valid license is required to activate and receive plugin updates directly in your WordPress dashboard', 'ajax-load-more' ); ?> &rarr; <a href="<?php echo $url; ?>?utm_source=WP%20Admin&utm_medium=Licenses&utm_campaign=<?php echo $name; ?>" target="blank"><strong><?php _e( 'Purchase Now', 'ajax-load-more' ); ?>!</strong></a></p>
							</div>
							<?php } ?>
							<label for="<?php echo esc_attr( $key ); ?>">
								<?php esc_attr_e( 'License Key', 'ajax-load-more' ); ?>
							</label>
							<div>
								<input
									id="<?php echo esc_attr( $key ); ?>"
									name="<?php echo esc_attr( $key ); ?>"
									type="<?php echo esc_attr( apply_filters( 'alm_mask_license_keys', false ) ? 'password' : 'text' ); ?>"
									class="regular-text"
									value="<?php echo esc_attr( $license ); ?>"
									placeholder="<?php _e( 'Enter License Key', 'ajax-load-more' ); ?>"
									<?php
									if ( defined( $constant ) ) {
										echo 'disabled';
									}
									?>
								/>
								<?php if ( $license_status === 'valid' ) { ?>
								<span class="alm-license-status active"><?php esc_html_e( 'Active', 'ajax-load-more' ); ?></span>
								<?php } else { ?>
								<span class="alm-license-status inactive">
									<?php echo $license_status === 'expired' ? esc_html__( 'Expired', 'ajax-load-more' ) : esc_html__( 'Inactive', 'ajax-load-more' ); ?></span>
								<?php } ?>
							</div>
						</div>
						<div class="alm-license--actions">
						<button class="button button-primary" type="submit" name="alm_activate_license" value="<?php echo esc_attr( $item_id ); ?>">
								<?php esc_html_e( 'Activate License', 'ajax-load-more' ); ?>
							</button>
							<?php if ( ! $is_valid ) { ?>
							<button class="button button-primary" type="submit" name="alm_activate_license" value="<?php echo esc_attr( $item_id ); ?>">
								<?php esc_html_e( 'Activate License', 'ajax-load-more' ); ?>
							</button>
							<?php } else { ?>
							<button class="button" type="submit" name="alm_deactivate_license" value="<?php echo esc_attr( $item_id ); ?>">
								<?php esc_html_e( 'Deactivate License', 'ajax-load-more' ); ?>
							</button>
							<button class="button button-secondary" type="submit" name="alm_refresh_license">
								<i class="fa fa-refresh" aria-hidden="true"></i> <?php _e( 'Refresh Status', 'ajax-load-more' ); ?>
							</button>
							<?php } ?>
							<?php
							// Expired license. Show Renew button.
							if ( $license && $license_status === 'expired' ) {
								$store_url = ALM_STORE_URL;
								$url       = "{$store_url}/checkout/?edd_license_key={$license}&download_id={$item_id}";
								?>
								<a class="button" href="<?php echo esc_url( $url ); ?>" target="_blank">
									<?php _e( 'Renew License', 'ajax-load-more' ); ?>
								</a>
							<?php } ?>
						</div>

						<?php
						if ( isset( $license_data['success'] ) && $license_data['success'] ) {
							$expires       = isset( $license_data['expires'] ) ? $license_data['expires'] : '';
							$license_limit = isset( $license_data['license_limit'] ) ? $license_data['license_limit'] : false;
							$site_count    = isset( $license_data['site_count'] ) ? $license_data['site_count'] : false;
							$payment_id    = isset( $license_data['payment_id'] ) ? $license_data['payment_id'] : '';

							echo '<div class="alm-license--stats">';

							if ( $expires ) {
								?>
								<div>
									<span><?php esc_html_e( 'License Expires:', 'ajax-load-more' ); ?></span>
									<span>
										<?php
										if ( $expires === 'lifetime' ) {
											echo esc_html__( 'Lifetime', 'ajax-load-more' );
										} else {
											echo date_i18n( get_option( 'date_format' ), strtotime( $expires ) );
										}
										?>
									</span>
								</div>
								<?php
							}

							if ( $site_count !== false && $license_limit !== false ) {
								if ( $license_limit === 0 ) {
									echo '<div>';
									echo '<span>' . __( 'Activations:', 'ajax-load-more' ) . '</span>';
									echo '<span>';
									echo __( 'Unlimited', 'ajax-load-more' );
									echo '</span>';
									echo '</div>';

								} else {
									$account_url = $payment_id ? ALM_STORE_URL . '/purchase-history/?action=manage_licenses&payment_id=105110' : '';
									$is_at_limit = $site_count >= $license_limit;

									echo '<div>';
									echo '<span>' . __( 'Activations:', 'ajax-load-more' ) . '</span>';
									echo '<span>';
									echo esc_html( $site_count ) . '/' . esc_html( $license_limit );
									if ( $account_url && $is_at_limit ) {
										echo ' &nbsp; <a href="' . esc_url( $account_url ) . '" target="_blank">' . esc_html__( 'View Upgrades', 'ajax-load-more' ) . '</a>';
									}
									echo '</span>';
									echo '</div>';
								}
							}
							echo '</div>'; // .alm-license--stats
						}
						?>

						<?php
						// Display Activation Limit Reached message.
						if ( isset( $account_url ) && isset( $is_at_limit ) && $is_at_limit ) {
							?>
							<div class="alm-license-callout end">
								<p>
								<?php
								$message = sprintf(
									/* translators: the license key expiration date */
									__( 'Activation limit reached &mdash; you can add additional %1$s licenses from <a href="%2$s" target="_blank">your account</a>.', 'ajax-load-more' ),
									'<a href="' . $url . '" target="_blank">' . $name . '</a>',
									$account_url
								);
								echo wp_kses_post( $message );
								?>
								</p>
							</div>
							<?php
						}
						?>
					</div>
					<?php alm_print( $license_data ); ?>
				</form>
				<?php
			}
			unset( $addons );
			// No add-ons installed.
			if ( $addon_count === 0 ) :
				?>
			<div class="spacer"></div>
			<div class="license-no-addons">
				<p><?php esc_attr_e( 'You do not have any Ajax Load More add-ons installed', 'ajax-load-more' ); ?> | <a href="admin.php?page=ajax-load-more-add-ons"><strong><?php esc_attr_e( 'Browse Add-ons', 'ajax-load-more' ); ?></strong></a> | <a href="https://connekthq.com/plugins/ajax-load-more/pro/" target="_blank"><strong><?php esc_attr_e( 'Go Pro', 'ajax-load-more' ); ?></strong></a></p>
			</div>
			<?php endif; ?>
		</div>

		<aside class="cnkt-sidebar" data-sticky>
			<div class="cta">
				<h3><?php esc_attr_e( 'About Licenses', 'ajax-load-more' ); ?></h3>
				<div class="cta-inner">
					<ul>
						<li><?php _e( 'License keys are found in the purchase receipt email that was sent immediately after purchase and in the <a target="_blank" href="https://connekthq.com/account/">Account</a> section on our website', 'ajax-load-more' ); ?></li>
						<li><?php _e( 'If you cannot locate your key please open a support ticket by filling out the <a href="https://connekthq.com/support/">support form</a> and reference the email address used when you completed the purchase.', 'ajax-load-more' ); ?></li>
						<li><strong><?php esc_attr_e( 'Are you having issues updating an add-on?', 'ajax-load-more' ); ?></strong><br/><?php esc_attr_e( 'Please try deactivating and then re-activating each license. Once you\'ve done that, try running the update again.', 'ajax-load-more' ); ?></li>
					</ul>
				</div>
				<div class="major-publishing-actions">
					<a class="button button-primary" target="_blank" href="https://connekthq.com/account/">
						<?php esc_attr_e( 'Your Account', 'ajax-load-more' ); ?>
					</a>
				</div>
			</div>
		</aside>
	</div>
</div>
