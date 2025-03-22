/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var ajaxloadmore;
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/filters/Icon.js":
/*!************************************!*\
  !*** ./src/blocks/filters/Icon.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n  return /*#__PURE__*/React.createElement(\"svg\", {\n    width: \"101\",\n    height: \"91\",\n    viewBox: \"0 0 101 91\",\n    fill: \"none\",\n    xmlns: \"http://www.w3.org/2000/svg\"\n  }, /*#__PURE__*/React.createElement(\"path\", {\n    opacity: \"0.7\",\n    d: \"M0.602473 24.9956C1.62341 22.8218 3.78904 21.4399 6.18669 21.4399H73.0117C75.4094 21.4399 77.575 22.8218 78.5959 24.9956C79.6169 27.1693 79.3075 29.7313 77.7915 31.5945L49.4992 66.2969V86.0314C49.4992 87.9102 48.4473 89.6337 46.7612 90.4721C45.0751 91.3106 43.0797 91.1398 41.5792 90.0063L31.6792 82.5534C30.4262 81.6218 29.6992 80.1468 29.6992 78.5786V66.2969L1.39138 31.5789C-0.10909 29.7313 -0.433933 27.1538 0.602473 24.9956Z\",\n    fill: \"#B8B8B8\"\n  }), /*#__PURE__*/React.createElement(\"path\", {\n    d: \"M96.2465 17.287L96.2481 17.285C98.3726 14.6739 98.8037 11.0852 97.3761 8.04559C95.9456 4.99971 92.9013 3.05273 89.529 3.05273H22.704C19.3353 3.05273 16.294 4.99557 14.8615 8.03587C13.4056 11.0775 13.8695 14.6836 15.968 17.2677L15.9711 17.2716L43.7165 51.2997V62.6914C43.7165 65.0297 44.8009 67.2535 46.6982 68.6675C46.7004 68.6691 46.7026 68.6708 46.7049 68.6724L56.5896 76.1139C56.5898 76.114 56.59 76.1142 56.5901 76.1143C58.8604 77.8289 61.872 78.0764 64.3917 76.8234C66.9394 75.5565 68.5165 72.9584 68.5165 70.1442V51.2996L96.2465 17.287Z\",\n    fill: \"#e75a4d\",\n    stroke: \"white\",\n    strokeWidth: \"5\"\n  }));\n}\n\n//# sourceURL=webpack://ajaxloadmore/./src/blocks/filters/Icon.js?");

/***/ }),

/***/ "./src/blocks/filters/edit.js":
/*!************************************!*\
  !*** ./src/blocks/filters/edit.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }\n/* harmony export */ });\n/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/dom-ready */ \"@wordpress/dom-ready\");\n/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/server-side-render */ \"@wordpress/server-side-render\");\n/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _utils_components_editor_EditWrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/components/editor/EditWrapper */ \"./src/blocks/utils/components/editor/EditWrapper.js\");\n/* harmony import */ var _utils_components_editor_Loader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/components/editor/Loader */ \"./src/blocks/utils/components/editor/Loader.js\");\n/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ \"./src/blocks/filters/block.json\");\n/* harmony import */ var _inspector__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./inspector */ \"./src/blocks/filters/inspector.js\");\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && iter[Symbol.iterator] != null || iter[\"@@iterator\"] != null) return Array.from(iter); }\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }\n\n\n\n\n\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(props) {\n  var attributes = props.attributes;\n  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_inspector__WEBPACK_IMPORTED_MODULE_5__[\"default\"], props), /*#__PURE__*/React.createElement(_utils_components_editor_EditWrapper__WEBPACK_IMPORTED_MODULE_2__[\"default\"], null, /*#__PURE__*/React.createElement((_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_1___default()), {\n    block: _block_json__WEBPACK_IMPORTED_MODULE_4__.name,\n    attributes: attributes,\n    LoadingResponsePlaceholder: _utils_components_editor_Loader__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n    EmptyResponsePlaceholder: _utils_components_editor_Loader__WEBPACK_IMPORTED_MODULE_3__[\"default\"]\n  })));\n}\n\n/**\n * Watch for changes to the DOM and initialize ALM blocks.\n */\nvar almBlockCallback = function almBlockCallback() {\n  var filters = document.querySelectorAll('.wp-block-ajax-load-more-filter');\n  if (filters !== null && filters !== void 0 && filters.length) {\n    _toConsumableArray(filters).forEach(function (filter) {\n      almfilters.wpblock(filter);\n    });\n  }\n};\n_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0___default()(function () {\n  var observer = new MutationObserver(almBlockCallback);\n  var targetNode = document.querySelector('#editor');\n  var config = {\n    attributes: false,\n    childList: true,\n    subtree: true\n  };\n  if (targetNode) {\n    observer.observe(targetNode, config);\n  }\n});\n\n//# sourceURL=webpack://ajaxloadmore/./src/blocks/filters/edit.js?");

/***/ }),

/***/ "./src/blocks/filters/index.js":
/*!*************************************!*\
  !*** ./src/blocks/filters/index.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ \"@wordpress/blocks\");\n/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ \"./src/blocks/filters/edit.js\");\n/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.scss */ \"./src/blocks/filters/index.scss\");\n/* harmony import */ var _Icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Icon */ \"./src/blocks/filters/Icon.js\");\n\n\n\n\n(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('ajax-load-more/filters', {\n  icon: {\n    src: _Icon__WEBPACK_IMPORTED_MODULE_3__[\"default\"]\n  },\n  edit: _edit__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\n});\n\n//# sourceURL=webpack://ajaxloadmore/./src/blocks/filters/index.js?");

/***/ }),

/***/ "./src/blocks/filters/inspector.js":
/*!*****************************************!*\
  !*** ./src/blocks/filters/inspector.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }\n/* harmony export */ });\n/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ \"@wordpress/block-editor\");\n/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ \"@wordpress/components\");\n/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ \"@wordpress/i18n\");\n/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n/**\n * Inspector controls for the block.\n *\n * @param {Object} props Block props.\n * @return {Element} \t Inspector controls.\n */\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(props) {\n  var attributes = props.attributes,\n    setAttributes = props.setAttributes;\n  var _ref = alm_localize || {},\n    _ref$adminurl = _ref.adminurl,\n    adminurl = _ref$adminurl === void 0 ? '' : _ref$adminurl;\n  var _alm_filters_localize = alm_filters_localize,\n    _alm_filters_localize2 = _alm_filters_localize.filters,\n    filters = _alm_filters_localize2 === void 0 ? [] : _alm_filters_localize2,\n    _alm_filters_localize3 = _alm_filters_localize.prefix,\n    prefix = _alm_filters_localize3 === void 0 ? '' : _alm_filters_localize3;\n  var filterList = (filters === null || filters === void 0 ? void 0 : filters.length) && prefix && filters.map(function (filter) {\n    var name = filter.replace(prefix, '');\n    return {\n      label: name,\n      value: name\n    };\n  }) || [];\n  filterList.unshift({\n    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('-- Select Filter --', 'ajax-load-more'),\n    value: ''\n  });\n  return /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {\n    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Settings', 'ajax-load-more')\n  }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {\n    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Filter', 'ajax-load-more'),\n    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select a filter to display by ID.', 'ajax-load-more'),\n    value: attributes === null || attributes === void 0 ? void 0 : attributes.id,\n    options: filterList,\n    onChange: function onChange(value) {\n      return setAttributes({\n        id: value\n      });\n    },\n    disabled: (filterList === null || filterList === void 0 ? void 0 : filterList.length) < 2\n  }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {\n    gap: \"10px\",\n    justify: \"flex-start\",\n    style: {\n      marginTop: '-10px'\n    }\n  }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {\n    href: \"\".concat(adminurl, \"/admin.php?page=ajax-load-more-filters&action=new\"),\n    size: \"compact\",\n    variant: \"primary\",\n    target: \"_blank\"\n  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Create Filter', 'ajax-load-more')), (filterList === null || filterList === void 0 ? void 0 : filterList.length) > 1 && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {\n    href: \"\".concat(adminurl, \"/admin.php?page=ajax-load-more-filters\"),\n    size: \"compact\",\n    variant: \"secondary\",\n    target: \"_blank\"\n  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('View All', 'ajax-load-more'))), /*#__PURE__*/React.createElement(\"hr\", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {\n    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Target', 'ajax-load-more'),\n    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('The ID of the Ajax Load More instance to filter.', 'ajax-load-more'),\n    value: attributes === null || attributes === void 0 ? void 0 : attributes.target,\n    onChange: function onChange(data) {\n      return setAttributes({\n        target: data\n      });\n    },\n    required: true\n  })));\n}\n\n//# sourceURL=webpack://ajaxloadmore/./src/blocks/filters/inspector.js?");

/***/ }),

/***/ "./src/blocks/utils/components/editor/EditWrapper.js":
/*!***********************************************************!*\
  !*** ./src/blocks/utils/components/editor/EditWrapper.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ EditWrapper; }\n/* harmony export */ });\n/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ \"@wordpress/block-editor\");\n/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _functions_sidebar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../functions/sidebar */ \"./src/blocks/utils/functions/sidebar.js\");\nfunction _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\n\n\n/**\n * Component wrapper for a block in Edit mode.\n *\n * @param {Object} props Component props.\n * @return {Element}     The EditWrapper component.\n */\nfunction EditWrapper(props) {\n  var children = props.children,\n    _props$useFocus = props.useFocus,\n    useFocus = _props$useFocus === void 0 ? true : _props$useFocus;\n  var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)();\n  return /*#__PURE__*/React.createElement(\"div\", _extends({}, blockProps, {\n    onFocus: useFocus ? function () {\n      return (0,_functions_sidebar__WEBPACK_IMPORTED_MODULE_1__.openBlockSidebar)();\n    } : null\n  }), children);\n}\n\n//# sourceURL=webpack://ajaxloadmore/./src/blocks/utils/components/editor/EditWrapper.js?");

/***/ }),

/***/ "./src/blocks/utils/components/editor/Loader.js":
/*!******************************************************!*\
  !*** ./src/blocks/utils/components/editor/Loader.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Loader; }\n/* harmony export */ });\n/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ \"@wordpress/components\");\n/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);\n\n\n/**\n * A loader for server-side block rendering/updating in the editor.\n *\n * @return {Element} The Loader component.\n */\nfunction Loader() {\n  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Flex, {\n    justify: \"center\",\n    align: \"center\",\n    style: {\n      padding: '30px 10px'\n    }\n  }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Spinner, {\n    style: {\n      width: '20px',\n      height: '20px'\n    }\n  }));\n}\n\n//# sourceURL=webpack://ajaxloadmore/./src/blocks/utils/components/editor/Loader.js?");

/***/ }),

/***/ "./src/blocks/utils/functions/sidebar.js":
/*!***********************************************!*\
  !*** ./src/blocks/utils/functions/sidebar.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   closeBlockSidebar: function() { return /* binding */ closeBlockSidebar; },\n/* harmony export */   openBlockSidebar: function() { return /* binding */ openBlockSidebar; }\n/* harmony export */ });\n/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ \"@wordpress/data\");\n/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);\n\n\n/**\n * Open the block options.\n */\nfunction openBlockSidebar() {\n  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/edit-post').openGeneralSidebar('edit-post/block');\n}\n/**\n * Close the block options.\n */\nfunction closeBlockSidebar() {\n  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/edit-post').closeGeneralSidebar();\n}\n\n//# sourceURL=webpack://ajaxloadmore/./src/blocks/utils/functions/sidebar.js?");

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??ruleSet[1].rules[2].use[1]!./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./src/blocks/filters/index.scss":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ruleSet[1].rules[2].use[1]!./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./src/blocks/filters/index.scss ***!
  \**********************************************************************************************************************************************************************************************************************************/
/***/ (function() {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack://ajaxloadmore/./src/blocks/filters/index.scss?./node_modules/mini-css-extract-plugin/dist/loader.js??ruleSet%5B1%5D.rules%5B2%5D.use%5B1%5D!./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet%5B1%5D.rules%5B2%5D.use%5B3%5D");

/***/ }),

/***/ "./src/blocks/filters/index.scss":
/*!***************************************!*\
  !*** ./src/blocks/filters/index.scss ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ \"./node_modules/style-loader/dist/runtime/styleDomAPI.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ \"./node_modules/style-loader/dist/runtime/insertBySelector.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ \"./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ \"./node_modules/style-loader/dist/runtime/insertStyleElement.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ \"./node_modules/style-loader/dist/runtime/styleTagTransform.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_2_use_1_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/mini-css-extract-plugin/dist/loader.js??ruleSet[1].rules[2].use[1]!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./index.scss */ \"./node_modules/mini-css-extract-plugin/dist/loader.js??ruleSet[1].rules[2].use[1]!./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./src/blocks/filters/index.scss\");\n/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_2_use_1_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_index_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_2_use_1_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_index_scss__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_2_use_1_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_index_scss__WEBPACK_IMPORTED_MODULE_6__) if(__WEBPACK_IMPORT_KEY__ !== \"default\") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = function(key) { return _node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_2_use_1_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_index_scss__WEBPACK_IMPORTED_MODULE_6__[key]; }.bind(0, __WEBPACK_IMPORT_KEY__)\n/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);\n\n      \n      \n      \n      \n      \n      \n      \n      \n      \n\nvar options = {};\n\noptions.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());\noptions.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());\n\n      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, \"head\");\n    \noptions.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());\noptions.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());\n\nvar update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()((_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_2_use_1_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_index_scss__WEBPACK_IMPORTED_MODULE_6___default()), options);\n\n\n\n\n       /* harmony default export */ __webpack_exports__[\"default\"] = ((_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_2_use_1_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_index_scss__WEBPACK_IMPORTED_MODULE_6___default()) && (_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_2_use_1_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_index_scss__WEBPACK_IMPORTED_MODULE_6___default().locals) ? (_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_2_use_1_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_index_scss__WEBPACK_IMPORTED_MODULE_6___default().locals) : undefined);\n\n\n//# sourceURL=webpack://ajaxloadmore/./src/blocks/filters/index.scss?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ (function(module) {

"use strict";
eval("\n\nvar stylesInDOM = [];\nfunction getIndexByIdentifier(identifier) {\n  var result = -1;\n  for (var i = 0; i < stylesInDOM.length; i++) {\n    if (stylesInDOM[i].identifier === identifier) {\n      result = i;\n      break;\n    }\n  }\n  return result;\n}\nfunction modulesToDom(list, options) {\n  var idCountMap = {};\n  var identifiers = [];\n  for (var i = 0; i < list.length; i++) {\n    var item = list[i];\n    var id = options.base ? item[0] + options.base : item[0];\n    var count = idCountMap[id] || 0;\n    var identifier = \"\".concat(id, \" \").concat(count);\n    idCountMap[id] = count + 1;\n    var indexByIdentifier = getIndexByIdentifier(identifier);\n    var obj = {\n      css: item[1],\n      media: item[2],\n      sourceMap: item[3],\n      supports: item[4],\n      layer: item[5]\n    };\n    if (indexByIdentifier !== -1) {\n      stylesInDOM[indexByIdentifier].references++;\n      stylesInDOM[indexByIdentifier].updater(obj);\n    } else {\n      var updater = addElementStyle(obj, options);\n      options.byIndex = i;\n      stylesInDOM.splice(i, 0, {\n        identifier: identifier,\n        updater: updater,\n        references: 1\n      });\n    }\n    identifiers.push(identifier);\n  }\n  return identifiers;\n}\nfunction addElementStyle(obj, options) {\n  var api = options.domAPI(options);\n  api.update(obj);\n  var updater = function updater(newObj) {\n    if (newObj) {\n      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {\n        return;\n      }\n      api.update(obj = newObj);\n    } else {\n      api.remove();\n    }\n  };\n  return updater;\n}\nmodule.exports = function (list, options) {\n  options = options || {};\n  list = list || [];\n  var lastIdentifiers = modulesToDom(list, options);\n  return function update(newList) {\n    newList = newList || [];\n    for (var i = 0; i < lastIdentifiers.length; i++) {\n      var identifier = lastIdentifiers[i];\n      var index = getIndexByIdentifier(identifier);\n      stylesInDOM[index].references--;\n    }\n    var newLastIdentifiers = modulesToDom(newList, options);\n    for (var _i = 0; _i < lastIdentifiers.length; _i++) {\n      var _identifier = lastIdentifiers[_i];\n      var _index = getIndexByIdentifier(_identifier);\n      if (stylesInDOM[_index].references === 0) {\n        stylesInDOM[_index].updater();\n        stylesInDOM.splice(_index, 1);\n      }\n    }\n    lastIdentifiers = newLastIdentifiers;\n  };\n};\n\n//# sourceURL=webpack://ajaxloadmore/./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ (function(module) {

"use strict";
eval("\n\nvar memo = {};\n\n/* istanbul ignore next  */\nfunction getTarget(target) {\n  if (typeof memo[target] === \"undefined\") {\n    var styleTarget = document.querySelector(target);\n\n    // Special case to return head of iframe instead of iframe itself\n    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n      try {\n        // This will throw an exception if access to iframe is blocked\n        // due to cross-origin restrictions\n        styleTarget = styleTarget.contentDocument.head;\n      } catch (e) {\n        // istanbul ignore next\n        styleTarget = null;\n      }\n    }\n    memo[target] = styleTarget;\n  }\n  return memo[target];\n}\n\n/* istanbul ignore next  */\nfunction insertBySelector(insert, style) {\n  var target = getTarget(insert);\n  if (!target) {\n    throw new Error(\"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.\");\n  }\n  target.appendChild(style);\n}\nmodule.exports = insertBySelector;\n\n//# sourceURL=webpack://ajaxloadmore/./node_modules/style-loader/dist/runtime/insertBySelector.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ (function(module) {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction insertStyleElement(options) {\n  var element = document.createElement(\"style\");\n  options.setAttributes(element, options.attributes);\n  options.insert(element, options.options);\n  return element;\n}\nmodule.exports = insertStyleElement;\n\n//# sourceURL=webpack://ajaxloadmore/./node_modules/style-loader/dist/runtime/insertStyleElement.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction setAttributesWithoutAttributes(styleElement) {\n  var nonce =  true ? __webpack_require__.nc : 0;\n  if (nonce) {\n    styleElement.setAttribute(\"nonce\", nonce);\n  }\n}\nmodule.exports = setAttributesWithoutAttributes;\n\n//# sourceURL=webpack://ajaxloadmore/./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ (function(module) {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction apply(styleElement, options, obj) {\n  var css = \"\";\n  if (obj.supports) {\n    css += \"@supports (\".concat(obj.supports, \") {\");\n  }\n  if (obj.media) {\n    css += \"@media \".concat(obj.media, \" {\");\n  }\n  var needLayer = typeof obj.layer !== \"undefined\";\n  if (needLayer) {\n    css += \"@layer\".concat(obj.layer.length > 0 ? \" \".concat(obj.layer) : \"\", \" {\");\n  }\n  css += obj.css;\n  if (needLayer) {\n    css += \"}\";\n  }\n  if (obj.media) {\n    css += \"}\";\n  }\n  if (obj.supports) {\n    css += \"}\";\n  }\n  var sourceMap = obj.sourceMap;\n  if (sourceMap && typeof btoa !== \"undefined\") {\n    css += \"\\n/*# sourceMappingURL=data:application/json;base64,\".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), \" */\");\n  }\n\n  // For old IE\n  /* istanbul ignore if  */\n  options.styleTagTransform(css, styleElement, options.options);\n}\nfunction removeStyleElement(styleElement) {\n  // istanbul ignore if\n  if (styleElement.parentNode === null) {\n    return false;\n  }\n  styleElement.parentNode.removeChild(styleElement);\n}\n\n/* istanbul ignore next  */\nfunction domAPI(options) {\n  if (typeof document === \"undefined\") {\n    return {\n      update: function update() {},\n      remove: function remove() {}\n    };\n  }\n  var styleElement = options.insertStyleElement(options);\n  return {\n    update: function update(obj) {\n      apply(styleElement, options, obj);\n    },\n    remove: function remove() {\n      removeStyleElement(styleElement);\n    }\n  };\n}\nmodule.exports = domAPI;\n\n//# sourceURL=webpack://ajaxloadmore/./node_modules/style-loader/dist/runtime/styleDomAPI.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ (function(module) {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction styleTagTransform(css, styleElement) {\n  if (styleElement.styleSheet) {\n    styleElement.styleSheet.cssText = css;\n  } else {\n    while (styleElement.firstChild) {\n      styleElement.removeChild(styleElement.firstChild);\n    }\n    styleElement.appendChild(document.createTextNode(css));\n  }\n}\nmodule.exports = styleTagTransform;\n\n//# sourceURL=webpack://ajaxloadmore/./node_modules/style-loader/dist/runtime/styleTagTransform.js?");

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/dom-ready":
/*!**********************************!*\
  !*** external ["wp","domReady"] ***!
  \**********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["domReady"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/server-side-render":
/*!******************************************!*\
  !*** external ["wp","serverSideRender"] ***!
  \******************************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["serverSideRender"];

/***/ }),

/***/ "./src/blocks/filters/block.json":
/*!***************************************!*\
  !*** ./src/blocks/filters/block.json ***!
  \***************************************/
/***/ (function(module) {

"use strict";
eval("module.exports = JSON.parse('{\"$schema\":\"https://schemas.wp.org/trunk/block.json\",\"apiVersion\":3,\"name\":\"ajax-load-more/filters\",\"title\":\"Ajax Load More: Filters\",\"category\":\"ajax-load-more\",\"description\":\"Enable filtering of an Ajax Load More instance.\",\"textdomain\":\"ajax-load-more\",\"supports\":{\"align\":false},\"attributes\":{\"id\":{\"type\":\"string\",\"default\":\"\"},\"target\":{\"type\":\"string\",\"default\":\"\"}},\"editorScript\":[\"file:./index.js\",\"ajax-load-more-filters\"],\"editorStyle\":[\"file:./index.css\",\"ajax-load-more-filters\",\"alm-nouislider\"],\"render\":\"file:./render.php\"}');\n\n//# sourceURL=webpack://ajaxloadmore/./src/blocks/filters/block.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	!function() {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/blocks/filters/index.js");
/******/ 	ajaxloadmore = __webpack_exports__;
/******/ 	
/******/ })()
;