<?php
namespace ALMElementor\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;

// phpcs:ignorefile

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @since 1.1.0
 */
class ALMElementor extends Widget_Base {
	const LOGO_PATH = ALM_ADMIN_URL .'/img/alm-logo.svg';
	const CSS = 'cursor: default; height: 120px; width: 100%; background: #f7f7f7 url('. self::LOGO_PATH .') no-repeat center 40%; border: 1px solid #efefef; text-align: center; font-size: 12px; font-weight: 600; padding-top: 85px;"';

  /**
   * Retrieve the widget name.
   *
   * @since 1.1.0
   *
   * @access public
   *
   * @return string Widget name.
   */
  public function get_name() {
    return 'ajax-load-more';
  }

  /**
   * Retrieve the widget title.
   *
   * @since 1.1.0
   *
   * @access public
   *
   * @return string Widget title.
   */
  public function get_title() {
    return __( 'ALM Shortcode', 'ajax-load-more' );
  }

  /**
   * Retrieve the widget icon.
   *
   * @since 1.1.0
   *
   * @access public
   *
   * @return string Widget icon.
   */
  public function get_icon() {
    return 'fa fa-code';
  }

  /**
   * Retrieve the list of categories the widget belongs to.
   *
   * Used to determine where to display the widget in the editor.
   *
   * Note that currently Elementor supports only one category.
   * When multiple categories passed, Elementor uses the first one.
   *
   * @since 1.1.0
   *
   * @access public
   *
   * @return array Widget categories.
   */
  public function get_categories() {
    return [ 'ajax-load-more' ];
  }

  /**
   * Register the widget controls.
   *
   * Adds different input fields to allow the user to change and customize the widget settings.
   *
   * @since 1.1.0
   *
   * @access protected
   */
	protected function register_controls() {
		$this->start_controls_section(
			'section_shortcode',
			[
				'label' => __( 'Shortcode', 'ajax-load-more' ),
			]
		);

		$this->add_control(
			'alm_shortcode',
			[
				'label' => __( 'Ajax Load More Shortcode', 'ajax-load-more' ),
				'type' => Controls_Manager::TEXTAREA,
				'default' => __( '[ajax_load_more]', 'ajax-load-more' ),
				/* translators: 1: Shortcode Builder link tag. 2: Shortcode Builder closing link tag. */
				'description' => __( 'The shortcode will not render while Elementor is in live edit mode, you must preview the page to view Ajax Load More functionality.', 'ajax-load-more' ) .'<br/><br/>&raquo; '. sprintf(__('%1$sBuild Shortcode%2$s', 'ajax-load-more' ), '<a href="admin.php?page=ajax-load-more-shortcode-builder" target="_blank">', '</a>'),
				'placeholder' => '[ajax_load_more]',
			]
		);

		$this->end_controls_section();
	}

  /**
   * Render the widget output on the frontend.
   * Written in PHP and used to generate the final HTML.
   *
   * @since 1.1.0
   *
   * @access protected
   */
  protected function render() {
		$this->add_inline_editing_attributes( 'alm_shortcode', 'none' );
		$shortcode = $this->get_settings_for_display( 'alm_shortcode' );
		$shortcode = do_shortcode( shortcode_unautop( $shortcode ) );
		if( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			echo '<div style="'. self::CSS .'">';
			echo __( 'Ajax Load More Shortcode', 'ajax-load-more' );
			echo '</div>';
		} else {
			echo '<div class="elementor-alm-shortcode">'. $shortcode .'</div>';
		}
  }

	/**
	 * Render shortcode widget output in the editor.
	 * Written as a Backbone JavaScript template and used to generate the live preview.
	 *
	 * @since 2.9.0
	 * @access protected
	 */
	protected function content_template() {
		?>
		<#
		view.addInlineEditingAttributes( 'alm_shortcode', 'none' );
		#>
		<?php
		if( \Elementor\Plugin::$instance->editor->is_edit_mode() ) { ?>
			<div style="<?php echo self::CSS; ?>"><?php _e( 'Ajax Load More Shortcode', 'ajax-load-more' ); ?></div>
		<?php }
	}
}
