import { InspectorControls } from '@wordpress/block-editor';
import { Button, Flex, PanelBody, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Inspector controls for the block.
 *
 * @param {Object} props Block props.
 * @return {Element} 	 Inspector controls.
 */
export default function (props) {
	const { attributes, setAttributes } = props;
	const { adminurl = '' } = alm_localize;

	return (
		<InspectorControls>
			<PanelBody title={__('Settings', 'ajax-load-more')}>
				<TextareaControl
					label={__('ALM Shortcode', 'ajax-load-more')}
					placeholder={'[ajax_load_more]'}
					value={attributes?.shortcode}
					onChange={(data) => setAttributes({ shortcode: data })}
					help={__('Note: Infinite scroll is disabled within the Block Editor.', 'ajax-load-more')}
					rows={6}
				/>
				<Flex
					gap="5px"
					justify="flex-start"
					style={{
						marginTop: '-10px',
					}}
				>
					<Button href={`${adminurl}/admin.php?page=ajax-load-more-shortcode-builder`} size="compact" variant="secondary" target="_blank">
						{__('Create Shortcode', 'ajax-load-more')}
					</Button>
				</Flex>
			</PanelBody>
		</InspectorControls>
	);
}
