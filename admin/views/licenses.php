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
			$addons        = has_action( 'alm_pro_installed' ) ? alm_get_pro_addon() : alm_get_addons();
			$addon_count   = 0;
			$alm_licensing = new ALM_Licensing();

			foreach ( $addons as $addon ) {
				$name           = $addon['name'];
				$intro          = $addon['intro'];
				$desc           = $addon['desc'];
				$action         = $addon['action'];
				$key            = $addon['key'];
				$settings_field = $addon['settings_field'];
				$url            = $addon['url'];
				$item_id        = $addon['item_id'];
				$constant       = 'ALM_' . strtoupper( str_replace( '-', '_', sanitize_title_with_dashes( $name ) ) ) . '_LICENSE_KEY'; // e.g. ALM_CALL_TO_ACTION_LICENSE_KEY.
				$license        = defined( $constant ) ? constant( $constant ) : get_option( $key );

				// If installed.
				if ( ! has_action( $action ) ) {
					continue;
				}
				++$addon_count;

				// Check license status.
				$license_status = $alm_licensing->license_check( $item_id, $license, $settings_field );
				$is_valid       = $license_status === 'valid';

				// Get the complete license data.
				$license_data = $alm_licensing->get_license_data( "{$settings_field}_data" );

				// Set initial variables.
				$account_url = '';
				$is_at_limit = false;
				?>
				<form method="post" action="admin.php?page=ajax-load-more-licenses" autocomplete="off">
					<?php
						$nonce = 'alm_' . esc_html( $item_id ) . '_license_nonce';
						wp_nonce_field( $nonce, $nonce );
						settings_fields( $settings_field );
					?>
					<input type="hidden" name="alm_license_nonce" value="<?php echo esc_attr( $nonce ); ?>" />
					<input type="hidden" name="alm_item_key" value="<?php echo esc_attr( $key ); ?>" />
					<input type="hidden" name="alm_item_option" value="<?php echo esc_attr( $settings_field ); ?>" />

					<div class="alm-license" data-status="">
						<div class="alm-license--header">
							<h3 title="<?php echo esc_html( $constant ); ?>">
								<span class="<?php echo $license_status === 'valid' ? 'is-valid' : 'is-invalid'; ?>"></span>
								<?php echo esc_html( $name ); ?>
							</h3>
							<a href="<?php echo esc_url( $url ); ?>" target="_blank" aria-label="<?php esc_html_e( 'View Add-on', 'ajax-load-more' ); ?>">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
									<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
								</svg>
							</a>
						</div>
						<div class="alm-license--fields">
								<?php if ( $license_status !== 'valid' ) { ?>
							<div class="alm-license-callout">
								<span class="alm-license-callout--icon">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
									</svg>
								</span>
								<div><?php _e( 'A valid license is required to activate and receive plugin updates directly in your WordPress dashboard', 'ajax-load-more' ); ?> &rarr; <a href="<?php echo $url; ?>?utm_source=WP%20Admin&utm_medium=Licenses&utm_campaign=<?php echo $name; ?>" target="blank"><strong><?php _e( 'Purchase Now', 'ajax-load-more' ); ?>!</strong></a></div>
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
									value="<?php echo esc_attr( $license ); ?>"
									placeholder="<?php _e( 'Enter License Key', 'ajax-load-more' ); ?>"
									<?php
									if ( defined( $constant ) || $is_valid ) {
										echo 'readonly';
									}
									if ( defined( $constant ) ) {
										echo ' class="has-constant"';
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
								<?php if ( ! $is_valid ) { ?>
							<button class="button button-primary button-large" type="submit" name="alm_activate_license" value="<?php echo esc_attr( $item_id ); ?>">
									<?php esc_html_e( 'Activate License', 'ajax-load-more' ); ?>
							</button>
							<?php } else { ?>
							<button class="button button-large" type="submit" name="alm_deactivate_license" value="<?php echo esc_attr( $item_id ); ?>">
									<?php esc_html_e( 'Deactivate License', 'ajax-load-more' ); ?>
							</button>
							<button class="button button-link button-large" type="submit" name="alm_refresh_license" value="<?php echo esc_attr( $item_id ); ?>">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
									<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
								</svg>
									<?php _e( 'Refresh Status', 'ajax-load-more' ); ?>
							</button>
							<?php } ?>
								<?php
								// Expired license. Show Renew button.
								if ( $license && $license_status === 'expired' ) {
									$url = ALM_STORE_URL . "/checkout/?edd_license_key={$license}&download_id={$item_id}";
									?>
								<a class="button button-link button-large" href="<?php echo esc_url( $url ); ?>" target="_blank">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
	<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
</svg>

									<?php _e( 'Renew License', 'ajax-load-more' ); ?>
								</a>
								<?php } ?>
						</div>

								<?php
								if ( $license_status === 'valid' && isset( $license_data['success'] ) && $license_data['success'] ) {
									$expires       = isset( $license_data['expires'] ) ? $license_data['expires'] : '';
									$license_limit = isset( $license_data['license_limit'] ) ? $license_data['license_limit'] : false;
									$site_count    = isset( $license_data['site_count'] ) ? $license_data['site_count'] : false;
									$payment_id    = isset( $license_data['payment_id'] ) ? $license_data['payment_id'] : '';

									echo '<div class="alm-license--stats">';
									if ( $expires ) {
										?>
								<div>
									<span><?php esc_html_e( 'Expires:', 'ajax-load-more' ); ?></span>
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
											echo $site_count . '<em>/</em>' . __( 'Unlimited', 'ajax-load-more' );
											echo '</em>';
											echo '</div>';

										} else {
											$account_url = $payment_id ? ALM_STORE_URL . "/purchase-history/?action=manage_licenses&payment_id={$payment_id}" : '';
											$is_at_limit = $site_count >= $license_limit;
											if ( (int) $site_count > (int) $license_limit ) {
												$site_count = $license_limit; // Limit display to the license limit.
											}
											echo '<div>';
											echo '<span>' . __( 'Activations:', 'ajax-load-more' ) . '</span>';
											echo '<span>';
											echo esc_html( $site_count ) . '<em>/</em>' . esc_html( $license_limit );
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
								if ( $license_status === 'valid' && $account_url && $is_at_limit ) {
									?>
							<div class="alm-license-callout end">
								<span	span class="alm-license-callout--icon">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
									</svg>
								</span>
								<div>
										<?php
										$message = sprintf(
											/* translators: the license key expiration date */
											__( 'Activation limit reached. You can purchase additional %1$s licenses from <a href="%2$s" target="_blank">your account</a>.', 'ajax-load-more' ),
											'<a href="' . $url . '" target="_blank">' . $name . '</a>',
											$account_url
										);
										echo wp_kses_post( $message );
										?>
								</div>
							</div>
									<?php
								}
								?>
					</div>
								<?php // alm_print( $license_data ); ?>
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
						<li><strong><?php esc_attr_e( 'Are you having issues updating an add-on?', 'ajax-load-more' ); ?></strong><br/>
						<?php esc_attr_e( 'Try deactivating and re-activating the license. Once you\'ve done that, try running the update again.', 'ajax-load-more' ); ?></li>
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
