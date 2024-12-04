<?php
/**
 * Register and save ALM plugin settings.
 *
 * @package AjaxLoadMore
 * @since   5.6
 */

/**
 * Initiate the plugin settings and create setting variables.
 *
 * @since 2.0.0
 */
function alm_admin_init() {
	register_setting(
		'alm-setting-group',
		'alm_settings',
		'alm_sanitize_settings'
	);

	add_settings_section(
		'alm_general_settings',
		'Global Settings',
		'alm_general_settings_callback',
		'ajax-load-more'
	);

	add_settings_section(
		'alm_admin_settings',
		'Admin Settings',
		'alm_admin_settings_callback',
		'ajax-load-more'
	);

	add_settings_field( // Container type.
		'_alm_container_type',
		__( 'Container Type', 'ajax-load-more' ),
		'alm_container_type_callback',
		'ajax-load-more',
		'alm_general_settings'
	);

	add_settings_field(  // Classnames.
		'_alm_classname',
		__( 'Container Classes', 'ajax-load-more' ),
		'alm_class_callback',
		'ajax-load-more',
		'alm_general_settings'
	);

	add_settings_field(  // Disbale CSS.
		'_alm_disable_css',
		__( 'Disable CSS', 'ajax-load-more' ),
		'alm_disable_css_callback',
		'ajax-load-more',
		'alm_general_settings'
	);

	add_settings_field(  // Btn color.
		'_alm_btn_color',
		__( 'Button/Loading Style', 'ajax-load-more' ),
		'alm_btn_color_callback',
		'ajax-load-more',
		'alm_general_settings'
	);

	add_settings_field(  // Inline CSS.
		'_alm_inline_css',
		__( 'Load CSS Inline', 'ajax-load-more' ),
		'alm_inline_css_callback',
		'ajax-load-more',
		'alm_general_settings'
	);

	add_settings_field(  // Button classes.
		'_alm_btn_classname',
		__( 'Button Classes', 'ajax-load-more' ),
		'alm_btn_class_callback',
		'ajax-load-more',
		'alm_general_settings'
	);

	add_settings_field(  // Custom JavaScript.
		'_alm_custom_js',
		__( 'Custom JavaScript', 'ajax-load-more' ),
		'alm_custom_js_callback',
		'ajax-load-more',
		'alm_general_settings'
	);

	add_settings_field(  // Legacy Callbacks.
		'_alm_legacy_callbacks',
		__( 'Legacy Callbacks', 'ajax-load-more' ),
		'alm_legacy_callbacks_callback',
		'ajax-load-more',
		'alm_general_settings'
	);

	add_settings_field(  // Load dynamic queries.
		'_alm_disable_dynamic',
		__( 'Dynamic Content', 'ajax-load-more' ),
		'alm_disable_dynamic_callback',
		'ajax-load-more',
		'alm_admin_settings'
	);

	add_settings_field(  // Display error notices.
		'_alm_error_notices',
		__( 'Error Notices', 'ajax-load-more' ),
		'alm_error_notices_callback',
		'ajax-load-more',
		'alm_admin_settings'
	);

	add_settings_field(  // Uninstall.
		'_alm_uninstall',
		__( 'Delete on Uninstall', 'ajax-load-more' ),
		'alm_uninstall_callback',
		'ajax-load-more',
		'alm_admin_settings'
	);

	// CACHE.
	if ( has_action( 'alm_cache_settings' ) ) {
		do_action( 'alm_cache_settings' );
	}

	// CUSTOM REPEATERS.
	if ( has_action( 'alm_unlimited_settings' ) ) {
		do_action( 'alm_unlimited_settings' );
	}

	// FILTERS.
	if ( has_action( 'alm_filters_settings' ) ) {
		do_action( 'alm_filters_settings' );
	}

	// LAYOUTS.
	if ( has_action( 'alm_layouts_settings' ) ) {
		do_action( 'alm_layouts_settings' );
	}

	// NEXT PAGE.
	if ( has_action( 'alm_nextpage_settings' ) ) {
		do_action( 'alm_nextpage_settings' );
	}

	// PAGINATION.
	if ( has_action( 'alm_paging_settings' ) ) {
		do_action( 'alm_paging_settings' );
	}

	// PRELOADED.
	if ( has_action( 'alm_preloaded_settings' ) ) {
		do_action( 'alm_preloaded_settings' );
	}

	// REST API.
	if ( has_action( 'alm_rest_api_settings' ) ) {
		do_action( 'alm_rest_api_settings' );
	}

	// SEO.
	if ( has_action( 'alm_seo_settings' ) ) {
		do_action( 'alm_seo_settings' );
	}

	// SINGLE POST.
	if ( has_action( 'alm_prev_post_settings' ) ) {
		do_action( 'alm_prev_post_settings' );
	}

	// THEME REPEATERS.
	if ( has_action( 'alm_theme_repeaters_settings' ) ) {
		do_action( 'alm_theme_repeaters_settings' );
	}
}
add_action( 'admin_init', 'alm_admin_init' );

/**
 * Some general settings text.
 *
 * @since 2.0.0
 */
function alm_general_settings_callback() {
	echo '<p>' . esc_html__( 'Customize the user experience of Ajax Load More by updating the fields below.', 'ajax-load-more' ) . '</p>';
}

/**
 * Some general admin settings text.
 *
 * @since 2.0.0
 */
function alm_admin_settings_callback() {
	echo '<p>' . esc_html__( 'The following settings affect the WordPress admin area only.', 'ajax-load-more' ) . '</p>';
}

/**
 * Sanitize our form fields.
 *
 * @param mixed $input The input values.
 * @since 2.0.0
 */
function alm_sanitize_settings( $input ) {
	return $input;
}

/**
 * Setting: Diabale Ajax Load More CSS.
 *
 * @since 2.0.0
 */
function alm_disable_css_callback() {
	$options = get_option( 'alm_settings' );
	$value   = ! isset( $options['_alm_disable_css'] ) ? '0' : $options['_alm_disable_css'];
	?>
		<input type="hidden" name="alm_settings[_alm_disable_css]" value="0" />
		<input type="checkbox" name="alm_settings[_alm_disable_css]" id="alm_disable_css_input" value="1" <?php echo $value ? 'checked="checked"' : ''; ?> />
		<label for="alm_disable_css_input">
			<?php esc_html_e( 'I want to use my own CSS styles.', 'ajax-load-more' ); ?>
			<br/>
			<span style="display:block;">
				<i class="fa fa-file-text-o"></i> &nbsp;
				<a href="<?php echo esc_url( ALM_URL ); ?>/build/frontend/ajax-load-more.css" target="blank">
					<?php esc_attr_e( 'View Ajax Load More CSS', 'ajax-load-more' ); ?>
				</a>
			</span>
		</label>
	<?php
}

/**
 * Setting: Display admin error notices in browser console.
 *
 * @since 2.7.2
 */
function alm_error_notices_callback() {
	$options = get_option( 'alm_settings' );
	$value   = ! isset( $options['_alm_error_notices'] ) ? '1' : $options['_alm_error_notices'];
	?>
		<input type="hidden" name="alm_settings[_alm_error_notices]" value="0" />
		<input type="checkbox" name="alm_settings[_alm_error_notices]" id="alm_error_notices" value="1" <?php echo $value ? 'checked="checked"' : ''; ?> />
		<label for="alm_error_notices">
			<?php esc_html_e( 'Display error messaging regarding repeater template updates in the browser console.', 'ajax-load-more' ); ?>
		</label>
	<?php
}

/**
 * Setting: Disable the dynamic population of categories, tags and authors
 *
 * @since 2.6.0
 */
function alm_disable_dynamic_callback() {
	$options = get_option( 'alm_settings' );
	$value   = ! isset( $options['_alm_disable_dynamic'] ) ? '0' : $options['_alm_disable_dynamic'];
	?>
		<input type="hidden" name="alm_settings[_alm_disable_dynamic]" value="0" />
		<input type="checkbox" name="alm_settings[_alm_disable_dynamic]" id="alm_disable_dynamic" value="1" <?php echo $value ? 'checked="checked"' : ''; ?> />
		<label for="alm_disable_dynamic">
			<?php esc_html_e( 'Disable dynamic population of categories, tags and authors in the Shortcode Builder.', 'ajax-load-more' ); ?>
			<br/>
			<span>
				<?php esc_html_e( 'Recommended if you have a large number of categories, tags and/or authors.', 'ajax-load-more' ); ?>
			</span>
		</label>
	<?php
}

/**
 * Setting: The type of container ul or div
 *
 * @since 2.0.0
 */
function alm_container_type_callback() {
	$options = get_option( 'alm_settings' );
	$value   = ! isset( $options['_alm_container_type'] ) ? '1' : $options['_alm_container_type'];
	?>
	<input type="radio" id="_alm_container_type_one" name="alm_settings[_alm_container_type]" value="1" <?php echo checked( 1, $value, false ); ?> />
	<label for="_alm_container_type_one">
		&lt;ul&gt; <span style="padding-top: 2px;">&lt;!--<em><?php esc_attr_e( 'Ajax Posts Here', 'ajax-load-more' ); ?></em>--&gt;</span> &lt;/ul&gt;
	</label>
	<input type="radio" id="_alm_container_type_two" name="alm_settings[_alm_container_type]" value="2" <?php echo checked( 2, $value, false ); ?> />
	<label for="_alm_container_type_two">
		&lt;div&gt; <span style="padding-top: 2px;">&lt;!--<em><?php esc_attr_e( 'Ajax Posts Here', 'ajax-load-more' ); ?></em>--&gt;</span> &lt;/div&gt;
	</label>
	<label style="cursor: default !important">
		<span style="display:block"><?php esc_attr_e( 'You can modify the container type when building a shortcode.', 'ajax-load-more' ); ?></span>
	</label>
	<?php
}

/**
 * Setting: Add classes to the Ajax Load More wrapper.
 *
 * @since 2.0.0
 */
function alm_class_callback() {
	$options = get_option( 'alm_settings' );
	$value   = isset( $options ) && isset( $options['_alm_classname'] ) ? $options['_alm_classname'] : '';
	?>
	<label for="alm_settings[_alm_classname]">
		<?php
		// translators: The code tag.
		$desc = sprintf( __( 'Add custom classes to the %1$s container. Classes are applied globally and will appear with every instance of Ajax Load More.', 'ajax-load-more' ), '<code>.alm-listing</code>' );
		echo wp_kses_post( $desc );
		?>
		<span style="display:block"><?php esc_attr_e( 'You can also add classes when building a shortcode.', 'ajax-load-more' ); ?>
	</label>
	<br/>
	<input type="text" id="alm_settings[_alm_classname]" name="alm_settings[_alm_classname]" value="<?php echo esc_attr( $value ); ?>" placeholder="posts listing etc..." />
	<?php
}

/**
 * Setting: Get button color.
 *
 * @since 2.0.0
 */
function alm_btn_color_callback() {
	$options       = get_option( 'alm_settings' );
	$type          = isset( $options ) && isset( $options['_alm_btn_color'] ) ? $options['_alm_btn_color'] : 'default';
	$selected      = ' selected="selected"';
	$loading_class = strpos( $type, 'infinite' ) !== false ? ' loading' : ''; // Set loading class for infinite type only.

	$selected0  = $type === 'default' ? $selected : '';
	$selected1  = $type === 'blue' ? $selected : '';
	$selected2  = $type === 'green' ? $selected : '';
	$selected3  = $type === 'red' ? $selected : '';
	$selected4  = $type === 'purple' ? $selected : '';
	$selected5  = $type === 'grey' ? $selected : '';
	$selected6  = $type === 'white' ? $selected : '';
	$selected7  = $type === 'infinite classic' ? $selected : '';
	$selected8  = $type === 'infinite skype' ? $selected : '';
	$selected9  = $type === 'infinite ring' ? $selected : '';
	$selected10 = $type === 'infinite fading-blocks' ? $selected : '';
	$selected11 = $type === 'infinite fading-circles' ? $selected : '';
	$selected12 = $type === 'infinite chasing-arrows' ? $selected : '';
	$selected13 = $type === 'light-grey' ? $selected : '';
	?>
	<label for="alm_settings_btn_color">
		<?php esc_attr_e( 'Choose an Ajax loading style. Select between a Button or Infinite Scroll loading style.', 'ajax-load-more' ); ?><br/>
		<span style="display: block;">
			<?php esc_attr_e( 'Selecting an Infinite Scroll style will remove the click interaction and load content on scroll.', 'ajax-load-more' ); ?>
		</span>
	</label>
	<select id="alm_settings_btn_color" name="alm_settings[_alm_btn_color]">
		<optgroup label="<?php esc_attr_e( 'Button Style (Dark)', 'ajax-load-more' ); ?>">
			<option value="default" class="alm-color default"<?php echo esc_attr( $selected0 ); ?>>Default</option>
			<option value="blue" class="alm-color blue"<?php echo esc_attr( $selected1 ); ?>>Blue</option>
			<option value="green" class="alm-color green"<?php echo esc_attr( $selected2 ); ?>>Green</option>
			<option value="purple" class="alm-color purple"<?php echo esc_attr( $selected4 ); ?>>Purple</option>
			<option value="grey" class="alm-color grey"<?php echo esc_attr( $selected5 ); ?>>Grey</option>
		</optgroup>
		<optgroup label="<?php esc_attr_e( 'Button Style (Light)', 'ajax-load-more' ); ?>">
			<option value="white" class="alm-color white"<?php echo esc_attr( $selected6 ); ?>>White</option>
			<option value="grey" class="alm-color light-grey"<?php echo esc_attr( $selected13 ); ?>>Light Grey</option>
		</optgroup>
		<optgroup label="<?php esc_attr_e( 'Infinite Scroll (No Button)', 'ajax-load-more' ); ?>">
			<option value="infinite classic" class="infinite classic"<?php echo esc_attr( $selected7 ); ?>>Classic</option>
			<option value="infinite skype" class="infinite skype"<?php echo esc_attr( $selected8 ); ?>>Skype</option>
			<option value="infinite ring" class="infinite ring"<?php echo esc_attr( $selected9 ); ?>>Circle Fill</option>
			<option value="infinite fading-blocks" class="infinite fading-blocks"<?php echo esc_attr( $selected10 ); ?>>Fading Blocks</option>
			<option value="infinite fading-circles" class="infinite fading-circles"<?php echo esc_attr( $selected11 ); ?>>Fading Circles</option>
			<option value="infinite chasing-arrows" class="infinite chasing-arrows"<?php echo esc_attr( $selected12 ); ?>>Chasing Arrows</option>
		</optgroup>
	</select>

	<div class="clear"></div>
	<div class="ajax-load-more-wrap core <?php echo esc_attr( $type ); ?>">
		<span><?php esc_attr_e( 'Click to Preview', 'ajax-load-more' ); ?></span>
		<div class="alm-btn-wrap">
			<button style="cursor: pointer;" type="button" class="alm-load-more-btn <?php echo esc_attr( $loading_class ); ?>" id="test-alm-button">
				<?php echo esc_attr( apply_filters( 'alm_button_label', __( 'Load More', 'ajax-load-more' ) ) ); ?>
			</button>
		</div>
	</div>
	<?php
}

/**
 * Setting: Load CSS Inline vs the page <head/>.
 *
 * @since 3.3.1
 */
function alm_inline_css_callback() {
	$options = get_option( 'alm_settings' );
	$value   = ! isset( $options['_alm_inline_css'] ) ? '1' : $options['_alm_inline_css'];
	?>
		<input type="hidden" name="alm_settings[_alm_inline_css]" value="0" />
		<input type="checkbox" name="alm_settings[_alm_inline_css]" id="alm_inline_css" value="1" <?php echo $value ? 'checked="checked"' : ''; ?> />
		<label for="alm_inline_css">
			<?php esc_html_e( 'Improve site performance by loading Ajax Load More CSS inline.', 'ajax-load-more' ); ?>
		</label>
	<?php
}

/**
 * Setting: Add classes to the Ajax Load More button.
 *
 * @since 2.4.1
 */
function alm_btn_class_callback() {
	$options = get_option( 'alm_settings' );
	$value   = ! isset( $options['_alm_btn_classname'] ) ? '' : $options['_alm_btn_classname'];
	?>
		<label for="alm_settings[_alm_btn_classname]">
			<?php esc_html_e( 'Add classes to the Load More button.', 'ajax-load-more' ); ?>
		</label>
		<input type="text" class="btn-classes" id="alm_settings[_alm_btn_classname]" name="alm_settings[_alm_btn_classname]" value="<?php echo esc_attr( $value ); ?>" placeholder="button bg-black rounded etc..." />
		<script>
			// Check if Disable CSS  === true
			if(jQuery( 'input#alm_disable_css_input' ).is(":checked")){
				jQuery( 'select#alm_settings_btn_color' ).parent().parent().hide(); // Hide button color
				jQuery( 'input#alm_inline_css' ).parent().parent().hide(); // Hide inline css
			}
			jQuery( 'input#alm_disable_css_input' ).change(function() {
				var el = jQuery(this);
				if(el.is(":checked")) {
					el.parent().parent( 'tr' ).next( 'tr' ).hide(); // Hide button color
					el.parent().parent( 'tr' ).next( 'tr' ).next( 'tr' ).hide(); // Hide inline css
				}else{
					el.parent().parent( 'tr' ).next( 'tr' ).show(); // show button color
					el.parent().parent( 'tr' ).next( 'tr' ).next( 'tr' ).show(); // show inline css
				}
			});
	</script>
	<?php
}

/**
 * Setting: Custom JS to the shortcode output.
 *
 * @since 5.5.4
 */
function alm_custom_js_callback() {
	$options = get_option( 'alm_settings' );
	$value   = ! isset( $options['_alm_custom_js'] ) ? '' : $options['_alm_custom_js'];
	?>
	<label for="alm_custom_js"><?php esc_attr_e( 'Enter custom JavaScript code.', 'ajax-load-more' ); ?></label>
	<textarea id="alm_custom_js" name="alm_settings[_alm_custom_js]" rows="5"><?php echo wp_kses_post( $value ); ?></textarea>
	<label style="cursor: default !important">
		<span style="display:block;"><?php esc_attr_e( 'JavaScript will be rendered with every Ajax Load More instance.', 'ajax-load-more' ); ?> </span>
	</label>
	<?php
}

/**
 * Setting: Load legacy callback.
 *
 * @since 5.0.0
 */
function alm_legacy_callbacks_callback() {
	$options = get_option( 'alm_settings' );
	$value   = ! isset( $options['_alm_legacy_callbacks'] ) ? '0' : $options['_alm_legacy_callbacks'];
	?>
		<input type="hidden" name="alm_settings[_alm_legacy_callbacks]" value="0" />
		<input type="checkbox" name="alm_settings[_alm_legacy_callbacks]" id="alm_legacy_callbacks" value="1" <?php echo $value ? 'checked="checked"' : ''; ?> />
		<label for="alm_legacy_callbacks">
			<?php esc_html_e( 'Load legacy JavaScript callback functions.', 'ajax-load-more' ); ?>
			<br/>
			<span>
				<?php esc_html_e( 'Ajax Load More JS callback functions were updated in 5.0. Users who were using callbacks prior to ALM 5.0 can load this helper library to maintain compatibility.', 'ajax-load-more' ); ?>
			</span>
		</label>
	<?php
}

/**
 * Setting: Remove all ALM data on uninstall.
 *
 * @since 4.1.0
 */
function alm_uninstall_callback() {
	$options = get_option( 'alm_settings' );
	$value   = ! isset( $options['_alm_uninstall'] ) ? '0' : $options['_alm_uninstall'];
	?>
		<input type="hidden" name="alm_settings[_alm_uninstall]" value="0" />
		<input type="checkbox" name="alm_settings[_alm_uninstall]" id="alm_uninstall" value="1" <?php echo $value ? 'checked="checked"' : ''; ?> />
		<label for="alm_uninstall">
			<?php esc_html_e( 'Check this box if Ajax Load More should remove all of its data* when the plugin is deleted.', 'ajax-load-more' ); ?>
			<br/>
			<span>
				<?php esc_html_e( '* Database Tables, Options and Repeater Templates', 'ajax-load-more' ); ?>
			</span>
		</label>
	<?php
}
