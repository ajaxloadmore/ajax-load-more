<?php
/**
 * This file hold data about the ALM loaders
 *
 * @package ajaxloadmore
 */

/**
 * Get all loaders as an array.
 *
 * @return array
 */
function alm_get_loaders() {
	$array = [
		[
			'label'   => __( 'Button Style (Dark/Solid)', 'ajax-load-more' ),
			'loaders' => alm_get_button_solid_loaders(),
		],
		[
			'label'   => __( 'Button Style (Light/Outline)', 'ajax-load-more' ),
			'loaders' => alm_get_button_outline_loaders(),
		],
		[
			'label'   => __( 'Infinite Scroll (No Button)', 'ajax-load-more' ),
			'loaders' => alm_get_infinite_loaders(),
		],
	];
	return $array;
}

/**
 * Get all button loaders.
 *
 * @return array
 */
function alm_get_button_solid_loaders() {
	return [
		[
			'value' => 'default',
			'label' => __( 'Default', 'ajax-load-more' ),
		],
		[
			'value' => 'dark',
			'label' => __( 'Dark', 'ajax-load-more' ),
		],
		[
			'value' => 'grey',
			'label' => __( 'Grey', 'ajax-load-more' ),
		],
		[
			'value' => 'blue',
			'label' => __( 'Blue', 'ajax-load-more' ),
		],
		[
			'value' => 'green',
			'label' => __( 'Green', 'ajax-load-more' ),
		],
		[
			'value' => 'purple',
			'label' => __( 'Purple', 'ajax-load-more' ),
		],
	];
}

/**
 * Get all button loaders.
 *
 * @return array
 */
function alm_get_button_outline_loaders() {
	return [
		[
			'value' => 'white',
			'label' => __( 'White', 'ajax-load-more' ),
		],
		[
			'value' => 'light-grey',
			'label' => __( 'Light Grey', 'ajax-load-more' ),
		],
		[
			'value' => 'is-outline',
			'label' => __( 'Default Outline', 'ajax-load-more' ),
		],
		[
			'value' => 'white-inverse',
			'label' => __( 'White Inverse', 'ajax-load-more' ),
		],
	];
}

/**
 * Get all infinite scroll loaders.
 *
 * @return array
 */
function alm_get_infinite_loaders() {
	return [
		[
			'value' => 'infinite classic',
			'label' => __( 'Classic', 'ajax-load-more' ),
		],
		[
			'value' => 'infinite circle-spinner',
			'label' => __( 'Circle Spinner', 'ajax-load-more' ),
		],
		[
			'value' => 'infinite fading-circles',
			'label' => __( 'Fading Circles', 'ajax-load-more' ),
		],
		[
			'value' => 'infinite fading-squares',
			'label' => __( 'Fading Squares', 'ajax-load-more' ),
		],
		[
			'value' => 'infinite ripples',
			'label' => __( 'Ripples', 'ajax-load-more' ),
		],
	];
}
