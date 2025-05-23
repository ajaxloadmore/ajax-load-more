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
	const filters = document.querySelectorAll('.wp-block-ajax-load-more-filter');
	if (filters?.length) {
		[...filters].forEach((filter) => {
			almfilters.wpblock(filter);
		});
	}
};

domReady(() => {
	const observer = new MutationObserver(almBlockCallback);
	const targetNode = document.querySelector('#editor');
	const config = { attributes: false, childList: true, subtree: true };
	if (targetNode) {
		observer.observe(targetNode, config);
	}
});
