import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import './index.scss';

registerBlockType('ajax-load-more/filter', {
	icon: {
		src: (
			<svg width="101" height="91" viewBox="0 0 101 91" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					opacity="0.7"
					d="M0.602473 24.9956C1.62341 22.8218 3.78904 21.4399 6.18669 21.4399H73.0117C75.4094 21.4399 77.575 22.8218 78.5959 24.9956C79.6169 27.1693 79.3075 29.7313 77.7915 31.5945L49.4992 66.2969V86.0314C49.4992 87.9102 48.4473 89.6337 46.7612 90.4721C45.0751 91.3106 43.0797 91.1398 41.5792 90.0063L31.6792 82.5534C30.4262 81.6218 29.6992 80.1468 29.6992 78.5786V66.2969L1.39138 31.5789C-0.10909 29.7313 -0.433933 27.1538 0.602473 24.9956Z"
					fill="#B8B8B8"
				/>
				<path
					d="M96.2465 17.287L96.2481 17.285C98.3726 14.6739 98.8037 11.0852 97.3761 8.04559C95.9456 4.99971 92.9013 3.05273 89.529 3.05273H22.704C19.3353 3.05273 16.294 4.99557 14.8615 8.03587C13.4056 11.0775 13.8695 14.6836 15.968 17.2677L15.9711 17.2716L43.7165 51.2997V62.6914C43.7165 65.0297 44.8009 67.2535 46.6982 68.6675C46.7004 68.6691 46.7026 68.6708 46.7049 68.6724L56.5896 76.1139C56.5898 76.114 56.59 76.1142 56.5901 76.1143C58.8604 77.8289 61.872 78.0764 64.3917 76.8234C66.9394 75.5565 68.5165 72.9584 68.5165 70.1442V51.2996L96.2465 17.287Z"
					fill="#EF695D"
					stroke="white"
					strokeWidth="5"
				/>
			</svg>
		),
	},
	edit,
});
