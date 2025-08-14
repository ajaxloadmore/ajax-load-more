var ajaxloadmore;
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 325:
/***/ (function() {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 379:
/***/ (function(module) {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 569:
/***/ (function(module) {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 216:
/***/ (function(module) {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 565:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 795:
/***/ (function(module) {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ 589:
/***/ (function(module) {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

;// CONCATENATED MODULE: external ["wp","blocks"]
var external_wp_blocks_namespaceObject = window["wp"]["blocks"];
;// CONCATENATED MODULE: external ["wp","domReady"]
var external_wp_domReady_namespaceObject = window["wp"]["domReady"];
var external_wp_domReady_default = /*#__PURE__*/__webpack_require__.n(external_wp_domReady_namespaceObject);
;// CONCATENATED MODULE: external ["wp","serverSideRender"]
var external_wp_serverSideRender_namespaceObject = window["wp"]["serverSideRender"];
var external_wp_serverSideRender_default = /*#__PURE__*/__webpack_require__.n(external_wp_serverSideRender_namespaceObject);
;// CONCATENATED MODULE: external ["wp","blockEditor"]
var external_wp_blockEditor_namespaceObject = window["wp"]["blockEditor"];
;// CONCATENATED MODULE: external ["wp","data"]
var external_wp_data_namespaceObject = window["wp"]["data"];
;// CONCATENATED MODULE: ./src/blocks/utils/functions/sidebar.js


/**
 * Open the block options.
 */
function openBlockSidebar() {
  (0,external_wp_data_namespaceObject.dispatch)('core/edit-post').openGeneralSidebar('edit-post/block');
}
/**
 * Close the block options.
 */
function closeBlockSidebar() {
  dispatch('core/edit-post').closeGeneralSidebar();
}
;// CONCATENATED MODULE: ./src/blocks/utils/components/editor/EditWrapper.js
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



/**
 * Component wrapper for a block in Edit mode.
 *
 * @param {Object} props Component props.
 * @return {Element}     The EditWrapper component.
 */
function EditWrapper(props) {
  var children = props.children,
    _props$useFocus = props.useFocus,
    useFocus = _props$useFocus === void 0 ? true : _props$useFocus;
  var blockProps = (0,external_wp_blockEditor_namespaceObject.useBlockProps)();
  return /*#__PURE__*/React.createElement("div", _extends({}, blockProps, {
    onFocus: useFocus ? function () {
      return openBlockSidebar();
    } : null
  }), children);
}
;// CONCATENATED MODULE: external ["wp","components"]
var external_wp_components_namespaceObject = window["wp"]["components"];
;// CONCATENATED MODULE: ./src/blocks/utils/components/editor/Loader.js


/**
 * A loader for server-side block rendering/updating in the editor.
 *
 * @return {Element} The Loader component.
 */
function Loader() {
  return /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Flex, {
    justify: "center",
    align: "center",
    style: {
      padding: '30px 10px'
    }
  }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Spinner, {
    style: {
      width: '20px',
      height: '20px'
    }
  }));
}
;// CONCATENATED MODULE: ./src/blocks/filters/block.json
var block_namespaceObject = JSON.parse('{"u2":"ajax-load-more/filters"}');
;// CONCATENATED MODULE: external ["wp","i18n"]
var external_wp_i18n_namespaceObject = window["wp"]["i18n"];
;// CONCATENATED MODULE: ./src/blocks/filters/inspector.js




/**
 * Inspector controls for the block.
 *
 * @param {Object} props Block props.
 * @return {Element} 	 Inspector controls.
 */
/* harmony default export */ function inspector(props) {
  var attributes = props.attributes,
    setAttributes = props.setAttributes;
  var _ref = alm_localize || {},
    _ref$adminurl = _ref.adminurl,
    adminurl = _ref$adminurl === void 0 ? '' : _ref$adminurl;
  var _alm_filters_localize = alm_filters_localize,
    _alm_filters_localize2 = _alm_filters_localize.filters,
    filters = _alm_filters_localize2 === void 0 ? [] : _alm_filters_localize2,
    _alm_filters_localize3 = _alm_filters_localize.prefix,
    prefix = _alm_filters_localize3 === void 0 ? '' : _alm_filters_localize3;
  var filterList = (filters === null || filters === void 0 ? void 0 : filters.length) && prefix && filters.map(function (filter) {
    var name = filter.replace(prefix, '');
    return {
      label: name,
      value: name
    };
  }) || [];
  filterList.unshift({
    label: (0,external_wp_i18n_namespaceObject.__)('-- Select Filter --', 'ajax-load-more'),
    value: ''
  });
  return /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.InspectorControls, null, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.PanelBody, {
    title: (0,external_wp_i18n_namespaceObject.__)('Settings', 'ajax-load-more')
  }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.SelectControl, {
    label: (0,external_wp_i18n_namespaceObject.__)('Filter', 'ajax-load-more'),
    help: (0,external_wp_i18n_namespaceObject.__)('Select a filter to display by ID.', 'ajax-load-more'),
    value: attributes === null || attributes === void 0 ? void 0 : attributes.id,
    options: filterList,
    onChange: function onChange(value) {
      return setAttributes({
        id: value
      });
    },
    disabled: (filterList === null || filterList === void 0 ? void 0 : filterList.length) < 2
  }), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Flex, {
    gap: "10px",
    justify: "flex-start",
    style: {
      marginTop: '-10px'
    }
  }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Button, {
    href: "".concat(adminurl, "/admin.php?page=ajax-load-more-filters&action=new"),
    size: "compact",
    variant: "primary",
    target: "_blank"
  }, (0,external_wp_i18n_namespaceObject.__)('Create Filter', 'ajax-load-more')), (filterList === null || filterList === void 0 ? void 0 : filterList.length) > 1 && /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Button, {
    href: "".concat(adminurl, "/admin.php?page=ajax-load-more-filters"),
    size: "compact",
    variant: "secondary",
    target: "_blank"
  }, (0,external_wp_i18n_namespaceObject.__)('View All', 'ajax-load-more'))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.TextControl, {
    label: (0,external_wp_i18n_namespaceObject.__)('Target', 'ajax-load-more'),
    help: (0,external_wp_i18n_namespaceObject.__)('The ID of the Ajax Load More instance to filter.', 'ajax-load-more'),
    value: attributes === null || attributes === void 0 ? void 0 : attributes.target,
    onChange: function onChange(data) {
      return setAttributes({
        target: data
      });
    },
    required: true
  })));
}
;// CONCATENATED MODULE: ./src/blocks/filters/edit.js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }






/* harmony default export */ function edit(props) {
  var attributes = props.attributes;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(inspector, props), /*#__PURE__*/React.createElement(EditWrapper, null, /*#__PURE__*/React.createElement((external_wp_serverSideRender_default()), {
    block: block_namespaceObject.u2,
    attributes: attributes,
    LoadingResponsePlaceholder: Loader,
    EmptyResponsePlaceholder: Loader
  })));
}

/**
 * Watch for changes to the DOM and initialize ALM blocks.
 */
var almBlockCallback = function almBlockCallback() {
  var filters = document.querySelectorAll('.wp-block-ajax-load-more-filter');
  if (filters !== null && filters !== void 0 && filters.length) {
    _toConsumableArray(filters).forEach(function (filter) {
      almfilters.wpblock(filter);
    });
  }
};
external_wp_domReady_default()(function () {
  var observer = new MutationObserver(almBlockCallback);
  var targetNode = document.querySelector('#editor');
  var config = {
    attributes: false,
    childList: true,
    subtree: true
  };
  if (targetNode) {
    observer.observe(targetNode, config);
  }
});
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(379);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(795);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(569);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(565);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(216);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(589);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??ruleSet[1].rules[2].use[1]!./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./src/blocks/filters/index.scss
var filters = __webpack_require__(325);
var filters_default = /*#__PURE__*/__webpack_require__.n(filters);
;// CONCATENATED MODULE: ./src/blocks/filters/index.scss

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()((filters_default()), options);




       /* harmony default export */ var blocks_filters = ((filters_default()) && (filters_default()).locals ? (filters_default()).locals : undefined);

;// CONCATENATED MODULE: ./src/blocks/filters/Icon.js
/* harmony default export */ function Icon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "101",
    height: "91",
    viewBox: "0 0 101 91",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    opacity: "0.7",
    d: "M0.602473 24.9956C1.62341 22.8218 3.78904 21.4399 6.18669 21.4399H73.0117C75.4094 21.4399 77.575 22.8218 78.5959 24.9956C79.6169 27.1693 79.3075 29.7313 77.7915 31.5945L49.4992 66.2969V86.0314C49.4992 87.9102 48.4473 89.6337 46.7612 90.4721C45.0751 91.3106 43.0797 91.1398 41.5792 90.0063L31.6792 82.5534C30.4262 81.6218 29.6992 80.1468 29.6992 78.5786V66.2969L1.39138 31.5789C-0.10909 29.7313 -0.433933 27.1538 0.602473 24.9956Z",
    fill: "#B8B8B8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M96.2465 17.287L96.2481 17.285C98.3726 14.6739 98.8037 11.0852 97.3761 8.04559C95.9456 4.99971 92.9013 3.05273 89.529 3.05273H22.704C19.3353 3.05273 16.294 4.99557 14.8615 8.03587C13.4056 11.0775 13.8695 14.6836 15.968 17.2677L15.9711 17.2716L43.7165 51.2997V62.6914C43.7165 65.0297 44.8009 67.2535 46.6982 68.6675C46.7004 68.6691 46.7026 68.6708 46.7049 68.6724L56.5896 76.1139C56.5898 76.114 56.59 76.1142 56.5901 76.1143C58.8604 77.8289 61.872 78.0764 64.3917 76.8234C66.9394 75.5565 68.5165 72.9584 68.5165 70.1442V51.2996L96.2465 17.287Z",
    fill: "#e75a4d",
    stroke: "white",
    strokeWidth: "5"
  }));
}
;// CONCATENATED MODULE: ./src/blocks/filters/index.js




(0,external_wp_blocks_namespaceObject.registerBlockType)('ajax-load-more/filters', {
  icon: {
    src: Icon
  },
  edit: edit
});
}();
ajaxloadmore = __webpack_exports__;
/******/ })()
;