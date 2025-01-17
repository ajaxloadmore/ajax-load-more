<?php
/**
 * This file hold data about add-ons.
 *
 * @package ajaxloadmore
 * @since 5.4.2
 */

/**
 * An array of pro addon parameters.
 *
 * @return array
 * @since 3.6
 */
function alm_get_pro_addon() {
	$path_prefix = 'ajax-load-more-';
	$url_prefix  = 'https://connekthq.com/plugins/ajax-load-more/pro/';

	$addons = [
		[
			'name'           => __( ' Ajax Load More Pro', 'ajax-load-more' ),
			'intro'          => __( ' Get instant access to all premium add-ons in a single installation.', 'ajax-load-more' ),
			'desc'           => __( ' The Pro bundle is installed as a single product with one license key and contains immediate access all premium add-ons.', 'ajax-load-more' ),
			'action'         => 'alm_pro_installed',
			'key'            => 'alm_pro_license_key',
			'status'         => 'alm_pro_license_status',
			'settings_field' => 'alm_pro_license',
			'img'            => 'img/add-ons/pro-bundle-add-on.png',
			'url'            => $url_prefix,
			'item_id'        => ALM_PRO_ITEM_NAME,
			'version'        => 'ALM_PRO_VERSION',
			'path'           => $path_prefix . 'pro',
			'slug'           => 'pro',
		],
	];
	return $addons;
}

/**
 *  An array of add-on parameters.
 *
 *  @return array
 *  @since 3.3.0
 */
function alm_get_addons() {
	$path_prefix = 'ajax-load-more-';
	$url_prefix  = 'https://connekthq.com/plugins/ajax-load-more/add-ons/';

	$addons = [
		[
			'name'           => __( ' Cache', 'ajax-load-more' ),
			'intro'          => __( ' Improve performance with the Ajax Load More caching engine.', 'ajax-load-more' ),
			'desc'           => __( ' The Cache add-on creates static HTML files of Ajax Load More requests then delivers those static files to your visitors.', 'ajax-load-more' ),
			'action'         => 'alm_cache_installed',
			'key'            => 'alm_cache_license_key',
			'status'         => 'alm_cache_license_status',
			'settings_field' => 'alm_cache_license',
			'img'            => 'img/add-ons/cache-add-on.jpg',
			'url'            => $url_prefix . 'cache/',
			'item_id'        => ALM_CACHE_ITEM_NAME,
			'version'        => 'ALM_CACHE_VERSION',
			'path'           => $path_prefix . 'cache',
			'slug'           => 'cache',
		],
		[
			'name'           => __( ' Call to Actions', 'ajax-load-more' ),
			'intro'          => __( ' Ajax Load More extension for displaying advertisements and call to actions.', 'ajax-load-more' ),
			'desc'           => __( ' The Call to Actions add-on provides the ability to inject a custom CTA template within each Ajax Load More loop.', 'ajax-load-more' ),
			'action'         => 'alm_cta_installed',
			'key'            => 'alm_cta_license_key',
			'status'         => 'alm_cta_license_status',
			'settings_field' => 'alm_cta_license',
			'img'            => 'img/add-ons/cta-add-on.jpg',
			'url'            => $url_prefix . 'call-to-actions/',
			'item_id'        => ALM_CTA_ITEM_NAME,
			'version'        => 'ALM_CTA_VERSION',
			'path'           => $path_prefix . 'call-to-actions',
			'slug'           => 'call-to-actions',
		],
		[
			'name'           => __( ' Comments', 'ajax-load-more' ),
			'intro'          => __( ' Load blog comments on demand with Ajax Load More.', 'ajax-load-more' ),
			'desc'           => __( ' The Comments add-on will display your blog comments with Ajax Load More\'s infinite scroll functionality.', 'ajax-load-more' ),
			'action'         => 'alm_comments_installed',
			'key'            => 'alm_comments_license_key',
			'status'         => 'alm_comments_license_status',
			'settings_field' => 'alm_comments_license',
			'img'            => 'img/add-ons/comments-add-on.jpg',
			'url'            => $url_prefix . 'comments/',
			'item_id'        => ALM_COMMENTS_ITEM_NAME,
			'version'        => 'ALM_COMMENTS_VERSION',
			'path'           => $path_prefix . 'comments',
			'slug'           => 'comments',
		],
		[
			'name'           => __( ' Custom Repeaters', 'ajax-load-more' ),
			'intro'          => __( ' Extend Ajax Load More with unlimited repeater templates.', 'ajax-load-more' ),
			'desc'           => __( ' Create, delete and modify repeater templates as you need them with absolutely zero restrictions.', 'ajax-load-more' ),
			'action'         => 'alm_unlimited_installed',
			'key'            => 'alm_unlimited_license_key',
			'status'         => 'alm_unlimited_license_status',
			'settings_field' => 'alm_unlimited_license',
			'img'            => 'img/add-ons/unlimited-add-ons.jpg',
			'url'            => $url_prefix . 'custom-repeaters/',
			'item_id'        => ALM_UNLIMITED_ITEM_NAME,
			'version'        => 'ALM_UNLIMITED_VERSION',
			'path'           => $path_prefix . 'repeaters-v2',
			'slug'           => 'repeaters-v2',
		],
		[
			'name'           => __( ' Elementor', 'ajax-load-more' ),
			'intro'          => __( ' Infinite scroll Elementor widget content with Ajax Load More.', 'ajax-load-more' ),
			'desc'           => __( ' The Elementor add-on provides functionality required for integrating with the Elementor Posts and WooCommerce Products widget.', 'ajax-load-more' ),
			'action'         => 'alm_elementor_installed',
			'key'            => 'alm_elementor_license_key',
			'status'         => 'alm_elementor_license_status',
			'settings_field' => 'alm_elementor_license',
			'img'            => 'img/add-ons/elementor-add-on.jpg',
			'url'            => $url_prefix . 'elementor/',
			'item_id'        => ALM_ELEMENTOR_ITEM_NAME,
			'version'        => 'ALM_ELEMENTOR_VERSION',
			'path'           => $path_prefix . 'elementor',
			'slug'           => 'elementor',
		],
		[
			'name'           => __( ' Filters', 'ajax-load-more' ),
			'intro'          => __( ' Create custom Ajax Load More filters in seconds.', 'ajax-load-more' ),
			'desc'           => __( ' The Filters add-on provides both front-end and admin functionality for building and managing your Ajax filters.', 'ajax-load-more' ),
			'action'         => 'alm_filters_installed',
			'key'            => 'alm_filters_license_key',
			'status'         => 'alm_filters_license_status',
			'settings_field' => 'alm_filters_license',
			'img'            => 'img/add-ons/filters-add-on.jpg',
			'url'            => $url_prefix . 'filters/',
			'item_id'        => ALM_FILTERS_ITEM_NAME,
			'version'        => 'ALM_FILTERS_VERSION',
			'path'           => $path_prefix . 'filters',
			'slug'           => 'filters',
		],
		[
			'name'           => __( ' Layouts', 'ajax-load-more' ),
			'intro'          => __( ' Predefined layouts for repeater templates.', 'ajax-load-more' ),
			'desc'           => __( ' The Layouts add-on provides a collection of unique, well designed and fully responsive templates.', 'ajax-load-more' ),
			'action'         => 'alm_layouts_installed',
			'key'            => 'alm_layouts_license_key',
			'status'         => 'alm_layouts_license_status',
			'settings_field' => 'alm_layouts_license',
			'img'            => 'img/add-ons/layouts-add-on.jpg',
			'url'            => $url_prefix . 'layouts/',
			'item_id'        => ALM_LAYOUTS_ITEM_NAME,
			'version'        => 'ALM_LAYOUTS_VERSION',
			'path'           => $path_prefix . 'layouts',
			'slug'           => 'layouts',
		],
		[
			'name'           => __( ' Next Page', 'ajax-load-more' ),
			'intro'          => __( ' Load and display multipage WordPress content.', 'ajax-load-more' ),
			'desc'           => __( ' The Next Page add-on provides functionality for infinite scrolling paginated posts and pages.', 'ajax-load-more' ),
			'action'         => 'alm_nextpage_installed',
			'key'            => 'alm_nextpage_license_key',
			'status'         => 'alm_nextpage_license_status',
			'settings_field' => 'alm_nextpage_license',
			'img'            => 'img/add-ons/next-page-add-on.jpg',
			'url'            => $url_prefix . 'nextpage/',
			'item_id'        => ALM_NEXTPAGE_ITEM_NAME,
			'version'        => 'ALM_NEXTPAGE_VERSION',
			'path'           => $path_prefix . 'next-page',
			'slug'           => 'next-page',
		],
		[
			'name'           => __( ' Paging', 'ajax-load-more' ),
			'intro'          => __( ' Extend Ajax Load More with a numbered navigation.', 'ajax-load-more' ),
			'desc'           => __( ' The Paging add-on will transform the default infinite scroll functionality into a robust ajax powered navigation system.', 'ajax-load-more' ),
			'action'         => 'alm_paging_installed',
			'key'            => 'alm_paging_license_key',
			'status'         => 'alm_paging_license_status',
			'settings_field' => 'alm_paging_license',
			'img'            => 'img/add-ons/paging-add-ons.jpg',
			'url'            => $url_prefix . 'paging/',
			'item_id'        => ALM_PAGING_ITEM_NAME,
			'version'        => 'ALM_PAGING_VERSION',
			'path'           => $path_prefix . 'paging',
			'slug'           => 'paging',
		],
		[
			'name'           => __( ' Preloaded', 'ajax-load-more' ),
			'intro'          => __( ' Load an initial set of posts before making Ajax requests to the server.', 'ajax-load-more' ),
			'desc'           => __( ' The Preloaded add-on will display content quicker and allow caching of the initial query which can reduce stress on your server.', 'ajax-load-more' ),
			'action'         => 'alm_preload_installed',
			'key'            => 'alm_preloaded_license_key',
			'status'         => 'alm_preloaded_license_status',
			'settings_field' => 'alm_preloaded_license',
			'img'            => 'img/add-ons/preloaded-add-ons.jpg',
			'url'            => $url_prefix . 'preloaded/',
			'item_id'        => ALM_PRELOADED_ITEM_NAME,
			'version'        => 'ALM_PRELOADED_VERSION',
			'path'           => $path_prefix . 'preloaded',
			'slug'           => 'preloaded',
		],
		[
			'name'           => __( 'Query Loop', 'ajax-load-more' ),
			'intro'          => __( 'Infinite scroll the core WordPress Query Loop block.', 'ajax-load-more' ),
			'desc'           => __( ' The Query Loop add-on will enable Ajax loading and infinite scrolling of the Query Loop block.', 'ajax-load-more' ),
			'action'         => 'alm_query_loop_installed',
			'key'            => 'alm_query_loop_license_key',
			'status'         => 'alm_query_loop_license_status',
			'settings_field' => 'alm_query_loop_license',
			'img'            => 'img/add-ons/query-loop-add-on.jpg',
			'url'            => $url_prefix . 'query-loop/',
			'item_id'        => ALM_QUERY_LOOP_ITEM_NAME,
			'version'        => 'ALM_QUERY_LOOP_VERSION',
			'path'           => $path_prefix . 'query-loop',
			'slug'           => 'query-loop',
		],
		[
			'name'           => __( ' Search Engine Optimization', 'ajax-load-more' ),
			'intro'          => __( ' Generate unique paging URLs with every Ajax Load More query.', 'ajax-load-more' ),
			'desc'           => __( ' The SEO add-on will optimize your ajax loaded content for search engines by generating unique URLs with every query.', 'ajax-load-more' ),
			'action'         => 'alm_seo_installed',
			'key'            => 'alm_seo_license_key',
			'status'         => 'alm_seo_license_status',
			'settings_field' => 'alm_seo_license',
			'img'            => 'img/add-ons/seo-add-ons.jpg',
			'url'            => $url_prefix . 'search-engine-optimization/',
			'item_id'        => ALM_SEO_ITEM_NAME,
			'version'        => 'ALM_SEO_VERSION',
			'path'           => $path_prefix . 'seo',
			'slug'           => 'seo',
		],
		[
			'name'           => __( ' Single Posts', 'ajax-load-more' ),
			'intro'          => __( ' An add-on to enable infinite scrolling of single posts.', 'ajax-load-more' ),
			'desc'           => __( ' The Single Posts add-on will load full posts as you scroll and update the browser URL to the current post.', 'ajax-load-more' ),
			'action'         => 'alm_prev_post_installed',
			'key'            => 'alm_prev_post_license_key',
			'status'         => 'alm_prev_post_license_status',
			'settings_field' => 'alm_prev_post_license',
			'img'            => 'img/add-ons/prev-post-add-on.jpg',
			'url'            => $url_prefix . 'single-post/',
			'item_id'        => ALM_PREV_POST_ITEM_NAME,
			'version'        => 'ALM_PREV_POST_VERSION',
			'path'           => $path_prefix . 'previous-post',
			'slug'           => 'previous-post',
		],
		[
			'name'           => __( ' Theme Repeaters', 'ajax-load-more' ),
			'intro'          => __( ' Manage Repeater Templates within your current theme directory.', 'ajax-load-more' ),
			'desc'           => __( ' The Theme Repeater add-on will allow you load, edit and maintain Ajax Load More templates from your theme.', 'ajax-load-more' ),
			'action'         => 'alm_theme_repeaters_installed',
			'key'            => 'alm_theme_repeaters_license_key',
			'status'         => 'alm_theme_repeaters_license_status',
			'settings_field' => 'alm_theme_repeaters_license',
			'img'            => 'img/add-ons/theme-repeater-add-on.jpg',
			'url'            => $url_prefix . 'theme-repeaters/',
			'item_id'        => ALM_THEME_REPEATERS_ITEM_NAME,
			'version'        => 'ALM_THEME_REPEATERS_VERSION',
			'path'           => $path_prefix . 'theme-repeaters',
			'slug'           => 'theme-repeaters',
		],
		[
			'name'           => __( ' WooCommerce', 'ajax-load-more' ),
			'intro'          => __( ' Infinite scroll WooCommerce products with Ajax Load More.', 'ajax-load-more' ),
			'desc'           => __( ' The WooCommerce add-on automatically integrates infinite scrolling into your existing shop templates.', 'ajax-load-more' ),
			'action'         => 'alm_woocommerce_installed',
			'key'            => 'alm_woocommerce_license_key',
			'status'         => 'alm_woocommerce_license_status',
			'settings_field' => 'alm_woocommerce_license',
			'img'            => 'img/add-ons/woocommerce-add-on.jpg',
			'url'            => $url_prefix . 'woocommerce/',
			'item_id'        => ALM_WOO_ITEM_NAME,
			'version'        => 'ALM_WOO_VERSION',
			'path'           => $path_prefix . 'woocommerce',
			'slug'           => 'woocommerce',
		],
	];
	return $addons;
}

/**
 * Get addon details by add-on slug.
 *
 * @param string $slug The addon slug.
 */
function alm_get_addon( $slug ) {
	$addons = alm_get_addons();
	foreach ( $addons as $addon ) {
		if ( $slug === $addon['slug'] ) {
			return $addon;
		}
	}
}

/**
 * Render a CTA to display info about an add-on.
 *
 * @param array  $addon The details.
 * @param string $label The text for the button.
 */
function alm_display_featured_addon( $addon, $label = 'Upgrade Now' ) {
	if ( $addon ) {
		$name  = $addon['name'];
		$intro = $addon['intro'];
		$desc  = $addon['desc'];
		$key   = $addon['key'];
		$url   = $addon['url'];
		$img   = $addon['img'];
		?>
	<section class="alm-cta-upgrade">
		<a href="<?php echo $url; ?>?utm_source=WP%20Admin&utm_medium=ALM%20Add-ons&utm_campaign=<?php echo $name; ?>" target="_blank">
			<div class="img">
				<img src="<?php echo ALM_ADMIN_URL; ?><?php echo $img; ?>" alt="">
			</div>
			<div class="details">
				<h2><?php echo $name; ?></h2>
				<p class="lg"><?php echo $intro; ?></p>
				<p><?php echo $desc; ?></p>
				<?php
					echo '<span class="cnkt-button">' . $label . '</span>';
				?>
			</div>
		</a>
	</section>
		<?php
	}
}
