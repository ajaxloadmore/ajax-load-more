<?php
// @codingStandardsIgnoreStart
if ( has_action( 'alm_nextpage_installed' ) ) { ?>
<div class="row input next-page add-on" id="alm-next-page">
   <h3 class="heading" tabindex="0"><?php _e('Next Page', 'ajax-load-more'); ?></h3>
   <div class="expand-wrap">

      <section class="first">
         <div class="shortcode-builder--label">
   		 	<p><?php _e('Enable the infinite scrolling of multipage WordPress content using the', 'ajax-load-more'); ?> <span>< !--nextpage-- ></span> <?php _e('Quicktag or Page Break block.', 'ajax-load-more'); ?></p>
   		 </div>
         <div class="shortcode-builder--fields">
            <div class="inner">
               <ul>
						<li>
							<input class="alm_element" type="radio" name="next-page" value="true" id="next-page-true" >
							<label for="next-page-true"><?php _e('True', 'ajax-load-more'); ?></label>
						</li>
						<li>
							<input class="alm_element" type="radio" name="next-page" value="false" id="next-page-false"  checked="checked">
							<label for="next-page-false"><?php _e('False', 'ajax-load-more'); ?></label>
						</li>
               </ul>
            </div>
      	</div>
      </section>

      <div class="next-page-content nested-component" style="display: none;">
	      <div class="nested-component--inner">

            <section>
   	         <div class="shortcode-builder--label">
   	            <h4><?php _e('Post ID', 'ajax-load-more'); ?></h4>
   	   		 	<p><?php _e('The ID of the current page/post.', 'ajax-load-more'); ?></p>
						<p><small><?php _e('Note: %post_id% will be converted to the current Post ID automatically.', 'ajax-load-more'); ?></small></p>
   	   		 </div>
   	         <div class="shortcode-builder--fields">
   	            <div class="inner">
   	               <input type="text" value="%post_id%" id="next-page_post_id"  class="alm_element disabled-input" disabled="disabled">
   	            </div>
   	         </div>
            </section>

				<section>
   	         <div class="shortcode-builder--label">
   	            <h4><?php _e('Type', 'ajax-load-more'); ?></h4>
   	   		 	<p><?php _e('Select the Next Page loading type.', 'ajax-load-more'); ?></p>
						<p><small><?php _e('Note: Fullpage will load the entire post content on initial page load.', 'ajax-load-more'); ?></small></p>
   	   		 </div>
   	   		 <div class="shortcode-builder--fields">
					 <div class="inner">
						<ul>
							<li>
								<input class="alm_element" type="radio" name="next-page-type" value="paged" id="next-page-paged" checked="checked">
								<label for="next-page-paged"><?php _e('Paged', 'ajax-load-more'); ?></label>
							</li>
							<li>
								<input class="alm_element" type="radio" name="next-page-type" value="fullpage" id="next-page-fullpage">
								<label for="next-page-fullpage"><?php _e('Fullpage', 'ajax-load-more'); ?></label>
							</li>
						</ul>
					</div>
   	         </div>
            </section>

            <section>
   	         <div class="shortcode-builder--label">
   	            <h4><?php _e('URL Rewrite', 'ajax-load-more'); ?></h4>
   	   		 	<p><?php _e('Update the browser address bar as pages come into view.', 'ajax-load-more'); ?></p>
   	   		 </div>
   	   		 <div class="shortcode-builder--fields">
   	            <div class="inner">
   	               <ul>
   	                   <li style="width:100%;">
   	                      <input class="alm_element" type="checkbox" name="next-page-url" id="next-page-url" value="true" checked="checked">
   	                      <label for="next-page-url"><?php _e('Yes, update the URL.', 'ajax-load-more'); ?></label>
   	                   </li>
   	               </ul>
   	            </div>
   	         </div>
            </section>

            <section>
   	         <div class="shortcode-builder--label">
   	            <h4><?php _e('Page Title Template', 'ajax-load-more'); ?></h4>
   	   		 	<p><?php _e('The page title template is used to update the browser title each time a new page is loaded.', 'ajax-load-more'); ?></p>
						 <p><small><?php _e('Page title will NOT be updated if this field remains empty.', 'ajax-load-more'); ?></small></p>
   	   		 </div>
   	   		 <div class="shortcode-builder--fields">
   	            <div class="inner">
   	               <input type="text" class="alm_element" name="next-page-title-template" id="next-page-title-template" value="<?php echo apply_filters('alm_nextpage_title_template', ''); ?>" placeholder="<?php echo apply_filters('alm_nextpage_title_template', 'Page {page} of {total} - {post-title}'); ?>">
							<br/>
							<div class="form-table" style="border: none;">
								<div class="template-tags">
									<h4><?php _e('Template Tags', 'ajax-load-more'); ?></h4>
									<ul>
										<li><pre>{page}</pre> <?php _e('Current Page Number', 'ajax-load-more'); ?></li>
										<li><pre>{total}</pre> <?php _e('Total Number of Pages', 'ajax-load-more'); ?></li>
										<li><pre>{post-title}</pre> <?php _e('Title of Post', 'ajax-load-more'); ?></li>
										<li><pre>{site-title}</pre> <?php _e('Site Title', 'ajax-load-more'); ?></li>
										<li><pre>{tagline}</pre> <?php _e('Site Tagline', 'ajax-load-more'); ?></li>
									</ul>
								</div>
							</div>
   	            </div>
   	         </div>
            </section>

	         <section>
   	         <div class="shortcode-builder--label">
   	            <h4><?php _e('Scroll to Page', 'ajax-load-more'); ?></h4>
   	   		 	<p>
   	      		 	<?php _e('Automatically slide users to the next page when the \'Load More\' action completes.', 'ajax-load-more'); ?>
   	   		 	</p>
   	   		 </div>
   	         <div class="shortcode-builder--fields">
      	         <section class="first">
      	            <div class="half">
      	               <label for="next-page-scroll" class="full"><?php _e('Enable Scrolling', 'ajax-load-more'); ?></label>
      	               <select class="alm_element" name="next-page-scroll" id="next-page-scroll">
      	                   <option value="true"><?php _e('True', 'ajax-load-more'); ?></option>
      	                   <option value="false" selected="selected"><?php _e('False', 'ajax-load-more'); ?></option>
      	               </select>
      	            </div>
      	            <div class="half">
      	               <label for="next-page-scroll-top" class="full">
      	                  <?php _e('Scroll Top', 'ajax-load-more'); ?>
      	                  <a href="javascript:void(0)" class="fa fa-question-circle tooltip" title="<?php _e('The scrolltop position of the browser window (used with scrolling and fwd/back browser buttons).','ajax-load-more'); ?>"></a>
      	               </label>
      	               <input id="next-page-scroll-top" name="next-page-scroll-top" class="alm_element sm" type="number" min="0" max="1000" step="1" value="30" placeholder="30">
      	            </div>
      	         </section>
   	         </div>
	         </section>

	         <p class="warning-callout">
	            <?php _e('You must add the Next Page shortcode directly to your template file using the <a href="https://developer.wordpress.org/reference/functions/do_shortcode/" target="_blank">do_shortcode</a> method.', 'ajax-load-more'); ?> <a class="button-small" href="https://ajaxloadmore.com/add-ons/next-page/" target="_blank"><?php _e('View Docs', 'ajax-load-more'); ?></a>
	         </p>
	      </div>

      </div>
   </div>
</div>
<?php } ?>
