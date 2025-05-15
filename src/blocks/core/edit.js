import domReady from '@wordpress/dom-ready';
import ServerSideRender from '@wordpress/server-side-render';
import EditWrapper from '../utils/components/editor/EditWrapper';
import Loader from '../utils/components/editor/Loader';
import block from './block.json';
import Inspector from './inspector';

export default function (props) {
	const { attributes } = props;
	return (
		<>
			<Inspector {...props} />
			<EditWrapper>
				<ServerSideRender block={block.name} attributes={attributes} LoadingResponsePlaceholder={Loader} EmptyResponsePlaceholder={Loader} />
			</EditWrapper>
		</>
	);
}

/**
 * Watch for changes to the DOM and initialize ALM blocks.
 */
const almBlockCallback = function () {
	setTimeout(() => {
		const targetClass = '.wp-block-ajax-load-more-core .ajax-load-more-wrap';

		/**
		 * Support iFrame block editor.
		 * @see https://make.wordpress.org/core/2023/07/18/miscellaneous-editor-changes-in-wordpress-6-3/#post-editor-iframed
		 */
		const iframe = document.querySelector('iframe[name="editor-canvas"]');

		// Get all instances of ALM blocks.
		const alm = iframe ? iframe.contentWindow.document.querySelectorAll(targetClass) : document.querySelectorAll(targetClass);

		if (alm?.length) {
			[...alm].forEach((instance) => {
				ajaxloadmore.wpblock(instance);
			});
		}
	}, 1000);
};

domReady(() => {
	const observer = new MutationObserver(almBlockCallback);
	const targetNode = document.querySelector('#editor');
	const config = { attributes: false, childList: true, subtree: true };
	if (targetNode) {
		observer.observe(targetNode, config);
	}
});
