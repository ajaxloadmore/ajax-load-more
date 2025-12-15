<?php
/**
 * WooCommerce Helper.
 *
 * @package AjaxLoadMore
 * @since   5.1.8
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ALM_WOOCOMMERCE' ) ) :

	/**
	 * Initiate the class.
	 */
	class ALM_WOOCOMMERCE {

		/**
		 * Hide the woocommerce pagination on ALM pages.
		 *
		 * @param  boolean $woocommerce Is woocommerce active.
		 * @return string               The raw `<style/>` HTML output.
		 * @since 5.1.8
		 */
		public static function hide_pagination( $woocommerce ) {
			if ( ! $woocommerce ) {
				return false;
			}
			$hide_pagination = apply_filters( 'alm_woo_hide_pagination', true );
			$classname       = apply_filters( 'alm_woo_pagination_class', 'woocommerce-pagination' );
			return $classname && $hide_pagination ? '<style>.' . $classname . '{display:none;}</style>' : '';
		}

		/**
		 * Hide the woocommerce orderby filter on ALM pages.
		 *
		 * @param  boolean $woocommerce Is woocommerce active.
		 * @return string               The raw `<style/>` HTML output.
		 * @since 5.1.8
		 */
		public static function hide_orderby( $woocommerce ) {
			if ( ! $woocommerce ) {
				return false;
			}

			$hide_ordering = apply_filters( 'alm_woo_hide_orderby', false );
			$classname     = apply_filters( 'alm_woo_ordering_class', 'woocommerce-ordering' );
			return $hide_ordering ? '<style>.' . $classname . '{display:none;}</style>' : '';
		}

		/**
		 * Get default WooCommerce props.
		 *
		 * @param string $type     Prop name.
		 * @param string $fallback The default/fallback value.
		 * @return string          The loop prop value.
		 * @since 5.1.8
		 */
		public static function get_loop_prop( $type = '', $fallback = '' ) {
			if ( function_exists( 'wc_get_loop_prop' ) && ! empty( $type ) ) {
				$prop  = wc_get_loop_prop( $type );
				$value = $prop ? $prop : $fallback;
				return $value;
			}
		}

		/**
		 * Get default wrapper class.
		 *
		 * @return string The wrapper class.
		 * @since 5.1.8
		 */
		public static function get_wrapper_class() {
			return 'alm-woocommerce woocommerce';
		}
	}
endif;
