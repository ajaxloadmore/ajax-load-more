<?php
// @codingStandardsIgnoreStart

if(has_action('alm_single_post_installed')){ ?>

<div class="row input previous-post add-on" id="alm-previous-post">
   <h3 class="heading" tabindex="0"><?php _e('Single Posts', 'ajax-load-more'); ?></h3>
   <div class="expand-wrap">

      <section class="first">
         <div class="shortcode-builder--label">
   		 	<p><?php _e('Enable the infinite scrolling of single posts.', 'ajax-load-more'); ?></p>
   		 </div>
         <div class="shortcode-builder--fields">
            <div class="inner">
               <ul>
                   <li>
                    <input class="alm_element" type="radio" name="prev-post" value="true" id="prev-post-true">
                    <label for="prev-post-true"><?php _e('True', 'ajax-load-more'); ?></label>
                   </li>
                   <li>
                    <input class="alm_element" type="radio" name="prev-post" value="false" id="prev-post-false" checked="checked">
                    <label for="prev-post-false"><?php _e('False', 'ajax-load-more'); ?></label>
                   </li>
               </ul>
            </div>
         </div>
      </section>

      <div class="prev_post_options nested-component" style="display: none;">
	      <div class="nested-component--inner">

				<section>
   	         <div class="shortcode-builder--label">
   	            <h4><?php _e('Post ID', 'ajax-load-more'); ?></h4>
   	   		 	<p><?php _e('The ID of the current post.', 'ajax-load-more'); ?></p>
						<p><small><?php _e( '<strong>Note</strong>: Leave empty to default to the current post ID.' ) ;?></small></p>
   	   		</div>
   	         <div class="shortcode-builder--fields">
   	            <div class="inner">
   	               <input type="text" value="" id="pp_id"  class="alm_element">
   	            </div>
   	         </div>
		      </section>

		      <section>
   	         <div class="shortcode-builder--label">
   	            <h4><?php _e('Target', 'ajax-load-more'); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e('Repeater Templates are not required when using the Target implementation.', 'ajax-load-more'); ?>"></a></h4>
   	   		 	<p><?php _e('Enter the ID or classname of HTML element that wraps your single post content.', 'ajax-load-more'); ?>
   	   		 	<small>e.g. #container or .post-wrapper</small></p>
   	   		 	<p><a class="button-small" href="https://connekthq.com/plugins/ajax-load-more/add-ons/single-posts/#implementation" target="_blank"><?php _e('View Guide', 'ajax-load-more'); ?></a></p>
   	   		 </div>
   	         <div class="shortcode-builder--fields">
   		         <div class="inner">
		               <input type="text" id="pp-target" class="alm_element" value="" placeholder="#container">
		            </div>
		         </div>
		      </section>

		      <section>
   	         <div class="shortcode-builder--label">
   	            <h4><?php _e('Post Ordering', 'ajax-load-more'); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e('By default, the Single Posts add-on will use the core WordPress `get_previous_post` function, but you can adjust that here.', 'ajax-load-more'); ?>"></a></h4>
   	   		 	<p><?php _e('Select the posts loading order.', 'ajax-load-more'); ?></p>
   	   		 	<p><a class="button-small" href="https://connekthq.com/plugins/ajax-load-more/add-ons/single-post/#ordering" target="_blank"><?php _e('View Docs', 'ajax-load-more'); ?></a></p>
   	   		 </div>
   	         <div class="shortcode-builder--fields">
   	            <div class="inner">
   	               <select class="alm_element" name="pp-order" id="pp-order">
   		               <option value="previous" selected="selected"><?php _e('Previous Post (by date DESC)', 'ajax-load-more'); ?></option>
   		               <option value="next"><?php _e('Next Post (by date ASC)', 'ajax-load-more'); ?></option>
   		               <option value="latest"><?php _e('Latest Post (Start from most recent)', 'ajax-load-more'); ?></option>
   		               <option value="post__in"><?php _e('Post IDs (Array)', 'ajax-load-more'); ?></option>
   		               <option value="custom_query"><?php _e('Custom Query', 'ajax-load-more'); ?></option>
   	               </select>
   	            </div>
   	         </div>
		      </section>

	         <div id="pp_custom_query" style="display: none;">
		         <section>
   					<div class="shortcode-builder--label">
   		            <h4><?php _e('Custom Query Order', 'ajax-load-more'); ?></h4>
							<p><?php _e('Select the post ordering of the custom query.', 'ajax-load-more'); ?></p>
   	   		 	</div>
   		         <div class="shortcode-builder--fields">
   		            <select class="alm_element" name="pp-custom-query" id="pp-custom-query">
   		               <option value="previous" selected="selected"><?php _e('Previous Post (Continue by date DESC)', 'ajax-load-more'); ?></option>
   		               <option value="latest"><?php _e('Latest Post (Start from most recent)', 'ajax-load-more'); ?></option>
   	               </select>
   		         </div>
		         </section>
	         </div>

	         <div id="pp_post__in" style="display: none;">
		         <section>
   					<div class="shortcode-builder--label">
   		            <h4><?php _e('Post ID Array', 'ajax-load-more'); ?></h4>
   		   		 	<p><?php _e('A comma separated list of post ID\'s to query by order.', 'ajax-load-more'); ?></p>
   	   		 	</div>
   		         <div class="shortcode-builder--fields">
   		            <div class="inner">
   		               <input id="pp_post__in_input" class="alm_element numbers-only" type="text" placeholder="23, 66, 99">
   		            </div>
   		         </div>
		         </section>
	         </div>

		      <div id="pp_extras">
					<section>
   		         <div class="shortcode-builder--label">
   		            <h4><?php _e('Taxonomy', 'ajax-load-more'); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e('Selecting a taxonomy means only previous posts from the same taxonomy term will be returned. If a post has multiple terms attached, each term will be considered using an OR relationship query.','ajax-load-more'); ?>"></a></h4>
   		   		 	<p><?php _e('Query previous posts from the same taxonomy term(s).', 'ajax-load-more'); ?></p>
   		   		 </div>
   		         <div class="shortcode-builder--fields">
   		            <div class="inner">
								<?php
								// Taxonomies
								$pp_tax_args = array(
									'public'   => true,
									'_builtin' => false
								);
								$pp_tax_output = 'objects';
								$pp_taxonomies = get_taxonomies( $pp_tax_args, $pp_tax_output );
   		            	echo '<select class="alm_element" name="pp-taxonomy-select" id="pp-taxonomy-select">';
   		         		echo '<option value="" selected="selected">-- ' . __('Select Taxonomy', 'ajax-load-more') . ' --</option>';
   		         	   echo '<option value="category">' . __('Category', 'ajax-load-more') . '</option>';
   		         	   echo '<option value="post_tag">' . __('Tag', 'ajax-load-more') . '</option>';
   		               if ( $pp_taxonomies ) {
   		            	   foreach( $pp_taxonomies as $pp_taxonomy ){
   		                     echo '<option name="pp-'.$pp_taxonomy->query_var.'" id="pp-'.$pp_taxonomy->query_var.'" value="'.$pp_taxonomy->query_var.'">'.$pp_taxonomy->label.'</option>';
   		            	   }
   		            	}
   		            	echo '</select>';
   		            	?>
   		            </div>
   		         </div>
		         </section>

		         <section>
   		         <div class="shortcode-builder--label">
   		            <h4><?php _e('Excluded Terms ', 'ajax-load-more'); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e('A comma-separated list of excluded terms by ID.','ajax-load-more'); ?>"></a></h4>
   		   		 	<p><?php _e('Exclude posts by term ID from the previous post query.', 'ajax-load-more'); ?></p>
   		   		 </div>
   		         <div class="shortcode-builder--fields">
   		            <div class="inner">
   		               <input type="text" id="pp-term-exclude" class="alm_element numbers-only" value="" placeholder="5, 8, 35">
   		            </div>
   		         </div>
		         </section>
	         </div>

	         <section>
   	         <div class="shortcode-builder--label">
   		         <h4><?php _e('Post Preview', 'ajax-load-more'); ?></h4>
   	   		 	<p><?php _e('Show a preview of Ajax loaded posts and have the user click to load the remainder of the post.', 'ajax-load-more'); ?></p>
						 <p><a class="button-small" href="https://connekthq.com/accessibility-and-ajax-load-more/?showpreview=true" target="_blank"><?php _e('View Example', 'ajax-load-more'); ?></a></p>
   	   		 </div>
   	         <div class="shortcode-builder--fields">
   	            <div class="inner">
   	               <ul>
   	                   <li>
   	                    <input class="alm_element" type="radio" name="prev-post-preview" value="true" id="prev-post-preview-true">
   	                    <label for="prev-post-preview-true"><?php _e('True', 'ajax-load-more'); ?></label>
   	                   </li>
   	                   <li>
   	                    <input class="alm_element" type="radio" name="prev-post-preview" value="false" id="prev-post-preview-false" checked="checked">
   	                    <label for="prev-post-preview-false"><?php _e('False', 'ajax-load-more'); ?></label>
   	                   </li>
   	               </ul>
   	            </div>
   	         </div>
	         </section>

				<!-- Preview Options -->
	         <div class="clear"></div>
				<div id="pp_preview_options" class="nested-component" style="display: none;">
					<section>
						<div class="shortcode-builder--label">
							<h4><?php _e('Button Label', 'ajax-load-more'); ?></h4>
							<p><?php _e('Enter a label for the preview button.', 'ajax-load-more'); ?></p>
						</div>
						<div class="shortcode-builder--fields">
							<div class="inner">
								<input type="text" id="pp-preview-label" class="alm_element" value="<?php echo apply_filters( 'alm_single_post_preview_button_label', 'Continue Reading' ); ?>" placeholder="<?php echo apply_filters( 'alm_single_post_preview_button_label', 'Continue Reading' ); ?>">
							</div>
						</div>
					</section>
					<section>
						<div class="shortcode-builder--label">
							<h4><?php _e('Height', 'ajax-load-more'); ?></h4>
							<p><?php _e('Set the initial height of the preview in pixels.', 'ajax-load-more'); ?></p>
						</div>
						<div class="shortcode-builder--fields">
							<div class="inner">
								<input type="number" class="alm_element numbers-only" name="pp-preview-height" id="pp-preview-height" step="1" min="1" value="<?php echo apply_filters( 'alm_single_post_preview_height', 700 ); ?>">
							</div>
						</div>
					</section>
				</div>

	         <section>
					<div class="shortcode-builder--label">
						<h4><?php _e('Reading Progress Bar', 'ajax-load-more'); ?></h4>
						<p><?php _e('Display a reading progress bar indicator at the top or bottom of the browser window.', 'ajax-load-more'); ?></p>
						 <p><a class="button-small" href="https://connekthq.com/accessibility-and-ajax-load-more/?progressbar=true" target="_blank"><?php _e('View Example', 'ajax-load-more'); ?></a></p>
					</div>
   	         <div class="shortcode-builder--fields">
   	            <div class="inner">
   	               <ul>
								<li>
									<input class="alm_element" type="radio" name="prev-post-progress" value="true" id="prev-post-progress-true">
									<label for="prev-post-progress-true"><?php _e('True', 'ajax-load-more'); ?></label>
								</li>
								<li>
									<input class="alm_element" type="radio" name="prev-post-progress" value="false" id="prev-post-progress-false" checked="checked">
									<label for="prev-post-progress-false"><?php _e('False', 'ajax-load-more'); ?></label>
								</li>
   	               </ul>
   	            </div>
   	         </div>
	         </section>

	         <!-- Reading Progress Bar Options -->
	         <div class="clear"></div>
	         <div id="pp_progressbar_options" class="nested-component" style="display: none;">

	   	      <div class="nested-component--inner">

	   	         <section>
   	   	         <div class="shortcode-builder--label">
   	                  <h4><?php _e('Position', 'ajax-load-more'); ?></h4>
   	                  <p><?php _e('Select the window position of the progress bar.', 'ajax-load-more'); ?></p>
   	               </div>
   	               <div class="shortcode-builder--fields">
   	                  <div class="inner">
   	                     <ul>
   	                         <li>
   	                          <input class="alm_element" type="radio" name="prev-post-progress-position" value="top" id="prev-post-progress-position-top" checked="checked">
   	                          <label for="prev-post-progress-position-top"><?php _e('Top', 'ajax-load-more'); ?></label>
   	                         </li>
   	                         <li>
   	                          <input class="alm_element" type="radio" name="prev-post-progress-position" value="bottom" id="prev-post-progress-position-btm">
   	                          <label for="prev-post-progress-position-btm"><?php _e('Bottom', 'ajax-load-more'); ?></label>
   	                         </li>
   	                     </ul>
   	                  </div>
   	               </div>
	   	         </section>

	   	         <section>
   	               <div class="shortcode-builder--label">
   	                  <h4><?php _e('Height', 'ajax-load-more'); ?></h4>
   	                  <p><?php _e('Select the height of the progress bar in pixels.', 'ajax-load-more'); ?></p>
   	               </div>
   	               <div class="shortcode-builder--fields">
   	                  <div class="inner">
   	                     <input type="number" class="alm_element numbers-only" name="prev-post-progress-height" id="prev-post-progress-height" step="1" min="1" value="10">
   	                  </div>
   	               </div>
	   	         </section>

	   	         <section>
   	   	         <div class="shortcode-builder--label">
   	   	            <h4><?php _e('Colors', 'ajax-load-more'); ?> </h4>
   	   	   		 	<p><?php _e('Enter the hex color values of the reading progress bar', 'ajax-load-more'); ?>.<br/>
   	   	   		 	<?php _e('Default:', 'ajax-load-more'); ?> #<span>ed7070</span>
   	   	   		 	</p>
   	   	   		</div>
   	   	   		<div class="shortcode-builder--fields">
   	   	            <div class="inner" style="position: relative;">
   	      	            <ul>
   	         	            <li class="prev-post-progress-front-color">
   	         	               <label for="prev-post-progress-color"><?php _e('Foreground Color:', 'ajax-load-more'); ?></label>
   	                           <div style="position: relative;">
   	                              <input type="text" class="alm_element" name="prev-post-progress-color" id="prev-post-progress-color" placeholder="ed7070" value="ed7070" maxlength="6" style="padding-left: 40px; width: 100%;">
   	                              <span class="progress_bar_color_indicator"></span>
   	                           </div>
   	         	            </li>
   	         	            <li class="prev-post-progress-back-color">
   	         	               <label for="prev-post-progress-color-bkg"><?php _e('Background Color:', 'ajax-load-more'); ?> <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e('Leave empty for a transparent background','ajax-load-more'); ?>."></a></label>
   	                           <div style="position: relative;">
   	                              <input type="text" class="alm_element" name="prev-post-progress-color-bkg" id="prev-post-progress-color-bkg" placeholder="efefef" value="" maxlength="6" style="padding-left: 40px; width: 100%;">
   	                              <style>
   	                                 .progress_bar_color_indicator_alt{
   	                                    background-color: transparent;
   	                                 }
   	                              </style>
   	                              <span class="progress_bar_color_indicator progress_bar_color_indicator_alt"></span>
   	                           </div>
   	         	            </li>
   	      	            </ul>
   	   	            </div>
   	   	         </div>
	   	         </section>
	   	      </div>
	         </div>
	         <!-- END Reading Progress Bar -->

	         <?php if( is_plugin_active( 'elementor-pro/elementor-pro.php' ) ) { ?>
				<!-- Elementor -->
				<section>
		         <div class="shortcode-builder--label">
			         <h4><?php _e('Elementor', 'ajax-load-more'); ?></h4>
		   		 	<p><?php _e('Set Elementor <b>true</b> if you are using Elementor templates to build single posts.', 'ajax-load-more'); ?></p>
		   		 	<p><a class="button-small" href="https://connekthq.com/elementor-infinite-scrolling/" target="_blank"><?php _e('View Blog Post', 'ajax-load-more'); ?></a></p>
		   		</div>
		         <div class="shortcode-builder--fields">
			         <div class="inner">
		               <ul>
		                  <li>
		                     <input class="alm_element" type="radio" name="elementor-single" value="t" id="elementor_t">
		                     <label for="elementor_t"><?php _e('True', 'ajax-load-more'); ?></label>
		                  </li>
		                  <li>
		                     <input class="alm_element" type="radio" name="elementor-single" value="f" id="elementor_f" checked="checked">
		                     <label for="elementor_f"><?php _e('False', 'ajax-load-more'); ?></label>
		                  </li>
		               </ul>
			         </div>
		         </div>
				</section>
			   <?php } ?>

	         <div class="clear"></div>

	         <p class="warning-callout">
	            <?php _e('You must add the Single Post shortcode directly to your single template file using the <a href="https://developer.wordpress.org/reference/functions/do_shortcode/" target="_blank">do_shortcode</a> method.', 'ajax-load-more'); ?> <a class="button-small" href="https://connekthq.com/plugins/ajax-load-more/add-ons/single-post/" target="_blank"><?php _e('View Docs', 'ajax-load-more'); ?></a>
	         </p>
	      </div>

      </div>
   </div>
</div>
<?php } ?>
