var ajaxloadmore;
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 924:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(210);

var callBind = __webpack_require__(559);

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};


/***/ }),

/***/ 559:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(612);
var GetIntrinsic = __webpack_require__(210);

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}


/***/ }),

/***/ 249:
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory();
	}
	else {}
}(this, function () {

	/*globals window, global, require*/

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {

	    var crypto;

	    // Native crypto from window (Browser)
	    if (typeof window !== 'undefined' && window.crypto) {
	        crypto = window.crypto;
	    }

	    // Native crypto in web worker (Browser)
	    if (typeof self !== 'undefined' && self.crypto) {
	        crypto = self.crypto;
	    }

	    // Native crypto from worker
	    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
	        crypto = globalThis.crypto;
	    }

	    // Native (experimental IE 11) crypto from window (Browser)
	    if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
	        crypto = window.msCrypto;
	    }

	    // Native crypto from global (NodeJS)
	    if (!crypto && typeof __webpack_require__.g !== 'undefined' && __webpack_require__.g.crypto) {
	        crypto = __webpack_require__.g.crypto;
	    }

	    // Native crypto import via require (NodeJS)
	    if (!crypto && "function" === 'function') {
	        try {
	            crypto = __webpack_require__(480);
	        } catch (err) {}
	    }

	    /*
	     * Cryptographically secure pseudorandom number generator
	     *
	     * As Math.random() is cryptographically not safe to use
	     */
	    var cryptoSecureRandomInt = function () {
	        if (crypto) {
	            // Use getRandomValues method (Browser)
	            if (typeof crypto.getRandomValues === 'function') {
	                try {
	                    return crypto.getRandomValues(new Uint32Array(1))[0];
	                } catch (err) {}
	            }

	            // Use randomBytes method (NodeJS)
	            if (typeof crypto.randomBytes === 'function') {
	                try {
	                    return crypto.randomBytes(4).readInt32LE();
	                } catch (err) {}
	            }
	        }

	        throw new Error('Native crypto module could not be used to get secure random number.');
	    };

	    /*
	     * Local polyfill of Object.create

	     */
	    var create = Object.create || (function () {
	        function F() {}

	        return function (obj) {
	            var subtype;

	            F.prototype = obj;

	            subtype = new F();

	            F.prototype = null;

	            return subtype;
	        };
	    }());

	    /**
	     * CryptoJS namespace.
	     */
	    var C = {};

	    /**
	     * Library namespace.
	     */
	    var C_lib = C.lib = {};

	    /**
	     * Base object for prototypal inheritance.
	     */
	    var Base = C_lib.Base = (function () {


	        return {
	            /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */
	            extend: function (overrides) {
	                // Spawn
	                var subtype = create(this);

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
	                    subtype.init = function () {
	                        subtype.$super.init.apply(this, arguments);
	                    };
	                }

	                // Initializer's prototype is the subtype object
	                subtype.init.prototype = subtype;

	                // Reference supertype
	                subtype.$super = this;

	                return subtype;
	            },

	            /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */
	            create: function () {
	                var instance = this.extend();
	                instance.init.apply(instance, arguments);

	                return instance;
	            },

	            /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */
	            init: function () {
	            },

	            /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */
	            mixIn: function (properties) {
	                for (var propertyName in properties) {
	                    if (properties.hasOwnProperty(propertyName)) {
	                        this[propertyName] = properties[propertyName];
	                    }
	                }

	                // IE won't copy toString using the loop above
	                if (properties.hasOwnProperty('toString')) {
	                    this.toString = properties.toString;
	                }
	            },

	            /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */
	            clone: function () {
	                return this.init.prototype.extend(this);
	            }
	        };
	    }());

	    /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var WordArray = C_lib.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 4;
	            }
	        },

	        /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */
	        toString: function (encoder) {
	            return (encoder || Hex).stringify(this);
	        },

	        /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */
	        concat: function (wordArray) {
	            // Shortcuts
	            var thisWords = this.words;
	            var thatWords = wordArray.words;
	            var thisSigBytes = this.sigBytes;
	            var thatSigBytes = wordArray.sigBytes;

	            // Clamp excess bits
	            this.clamp();

	            // Concat
	            if (thisSigBytes % 4) {
	                // Copy one byte at a time
	                for (var i = 0; i < thatSigBytes; i++) {
	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
	                }
	            } else {
	                // Copy one word at a time
	                for (var j = 0; j < thatSigBytes; j += 4) {
	                    thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
	                }
	            }
	            this.sigBytes += thatSigBytes;

	            // Chainable
	            return this;
	        },

	        /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */
	        clamp: function () {
	            // Shortcuts
	            var words = this.words;
	            var sigBytes = this.sigBytes;

	            // Clamp
	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
	            words.length = Math.ceil(sigBytes / 4);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone.words = this.words.slice(0);

	            return clone;
	        },

	        /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */
	        random: function (nBytes) {
	            var words = [];

	            for (var i = 0; i < nBytes; i += 4) {
	                words.push(cryptoSecureRandomInt());
	            }

	            return new WordArray.init(words, nBytes);
	        }
	    });

	    /**
	     * Encoder namespace.
	     */
	    var C_enc = C.enc = {};

	    /**
	     * Hex encoding strategy.
	     */
	    var Hex = C_enc.Hex = {
	        /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var hexChars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                hexChars.push((bite >>> 4).toString(16));
	                hexChars.push((bite & 0x0f).toString(16));
	            }

	            return hexChars.join('');
	        },

	        /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */
	        parse: function (hexStr) {
	            // Shortcut
	            var hexStrLength = hexStr.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < hexStrLength; i += 2) {
	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
	            }

	            return new WordArray.init(words, hexStrLength / 2);
	        }
	    };

	    /**
	     * Latin1 encoding strategy.
	     */
	    var Latin1 = C_enc.Latin1 = {
	        /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var latin1Chars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                latin1Chars.push(String.fromCharCode(bite));
	            }

	            return latin1Chars.join('');
	        },

	        /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */
	        parse: function (latin1Str) {
	            // Shortcut
	            var latin1StrLength = latin1Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < latin1StrLength; i++) {
	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
	            }

	            return new WordArray.init(words, latin1StrLength);
	        }
	    };

	    /**
	     * UTF-8 encoding strategy.
	     */
	    var Utf8 = C_enc.Utf8 = {
	        /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            try {
	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
	            } catch (e) {
	                throw new Error('Malformed UTF-8 data');
	            }
	        },

	        /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */
	        parse: function (utf8Str) {
	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	        }
	    };

	    /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	        /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */
	        reset: function () {
	            // Initial values
	            this._data = new WordArray.init();
	            this._nDataBytes = 0;
	        },

	        /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */
	        _append: function (data) {
	            // Convert string to WordArray, else assume WordArray already
	            if (typeof data == 'string') {
	                data = Utf8.parse(data);
	            }

	            // Append
	            this._data.concat(data);
	            this._nDataBytes += data.sigBytes;
	        },

	        /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */
	        _process: function (doFlush) {
	            var processedWords;

	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var dataSigBytes = data.sigBytes;
	            var blockSize = this.blockSize;
	            var blockSizeBytes = blockSize * 4;

	            // Count blocks ready
	            var nBlocksReady = dataSigBytes / blockSizeBytes;
	            if (doFlush) {
	                // Round up to include partial blocks
	                nBlocksReady = Math.ceil(nBlocksReady);
	            } else {
	                // Round down to include only full blocks,
	                // less the number of blocks that must remain in the buffer
	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
	            }

	            // Count words ready
	            var nWordsReady = nBlocksReady * blockSize;

	            // Count bytes ready
	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

	            // Process blocks
	            if (nWordsReady) {
	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
	                    // Perform concrete-algorithm logic
	                    this._doProcessBlock(dataWords, offset);
	                }

	                // Remove processed words
	                processedWords = dataWords.splice(0, nWordsReady);
	                data.sigBytes -= nBytesReady;
	            }

	            // Return processed words
	            return new WordArray.init(processedWords, nBytesReady);
	        },

	        /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone._data = this._data.clone();

	            return clone;
	        },

	        _minBufferSize: 0
	    });

	    /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */
	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         */
	        cfg: Base.extend(),

	        /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */
	        init: function (cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-hasher logic
	            this._doReset();
	        },

	        /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            // Append
	            this._append(messageUpdate);

	            // Update the hash
	            this._process();

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Final message update
	            if (messageUpdate) {
	                this._append(messageUpdate);
	            }

	            // Perform concrete-hasher logic
	            var hash = this._doFinalize();

	            return hash;
	        },

	        blockSize: 512/32,

	        /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */
	        _createHelper: function (hasher) {
	            return function (message, cfg) {
	                return new hasher.init(cfg).finalize(message);
	            };
	        },

	        /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */
	        _createHmacHelper: function (hasher) {
	            return function (message, key) {
	                return new C_algo.HMAC.init(hasher, key).finalize(message);
	            };
	        }
	    });

	    /**
	     * Algorithm namespace.
	     */
	    var C_algo = C.algo = {};

	    return C;
	}(Math));


	return CryptoJS;

}));

/***/ }),

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(249));
	}
	else {}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Constants table
	    var T = [];

	    // Compute constants
	    (function () {
	        for (var i = 0; i < 64; i++) {
	            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
	        }
	    }());

	    /**
	     * MD5 hash algorithm.
	     */
	    var MD5 = C_algo.MD5 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Swap endian
	            for (var i = 0; i < 16; i++) {
	                // Shortcuts
	                var offset_i = offset + i;
	                var M_offset_i = M[offset_i];

	                M[offset_i] = (
	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	                );
	            }

	            // Shortcuts
	            var H = this._hash.words;

	            var M_offset_0  = M[offset + 0];
	            var M_offset_1  = M[offset + 1];
	            var M_offset_2  = M[offset + 2];
	            var M_offset_3  = M[offset + 3];
	            var M_offset_4  = M[offset + 4];
	            var M_offset_5  = M[offset + 5];
	            var M_offset_6  = M[offset + 6];
	            var M_offset_7  = M[offset + 7];
	            var M_offset_8  = M[offset + 8];
	            var M_offset_9  = M[offset + 9];
	            var M_offset_10 = M[offset + 10];
	            var M_offset_11 = M[offset + 11];
	            var M_offset_12 = M[offset + 12];
	            var M_offset_13 = M[offset + 13];
	            var M_offset_14 = M[offset + 14];
	            var M_offset_15 = M[offset + 15];

	            // Working varialbes
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];

	            // Computation
	            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
	            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
	            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
	            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
	            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
	            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
	            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
	            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
	            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
	            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
	            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
	            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
	            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
	            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
	            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
	            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

	            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
	            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
	            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
	            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
	            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
	            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
	            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
	            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
	            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
	            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
	            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
	            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
	            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
	            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
	            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
	            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

	            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
	            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
	            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
	            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
	            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
	            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
	            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
	            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
	            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
	            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
	            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
	            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
	            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
	            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
	            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
	            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

	            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
	            d = II(d, a, b, c, M_offset_7,  10, T[49]);
	            c = II(c, d, a, b, M_offset_14, 15, T[50]);
	            b = II(b, c, d, a, M_offset_5,  21, T[51]);
	            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
	            d = II(d, a, b, c, M_offset_3,  10, T[53]);
	            c = II(c, d, a, b, M_offset_10, 15, T[54]);
	            b = II(b, c, d, a, M_offset_1,  21, T[55]);
	            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
	            d = II(d, a, b, c, M_offset_15, 10, T[57]);
	            c = II(c, d, a, b, M_offset_6,  15, T[58]);
	            b = II(b, c, d, a, M_offset_13, 21, T[59]);
	            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
	            d = II(d, a, b, c, M_offset_11, 10, T[61]);
	            c = II(c, d, a, b, M_offset_2,  15, T[62]);
	            b = II(b, c, d, a, M_offset_9,  21, T[63]);

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

	            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
	            var nBitsTotalL = nBitsTotal;
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
	                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
	            );
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
	            );

	            data.sigBytes = (dataWords.length + 1) * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var hash = this._hash;
	            var H = hash.words;

	            // Swap endian
	            for (var i = 0; i < 4; i++) {
	                // Shortcut
	                var H_i = H[i];

	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	            }

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    function FF(a, b, c, d, x, s, t) {
	        var n = a + ((b & c) | (~b & d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function GG(a, b, c, d, x, s, t) {
	        var n = a + ((b & d) | (c & ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function HH(a, b, c, d, x, s, t) {
	        var n = a + (b ^ c ^ d) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function II(a, b, c, d, x, s, t) {
	        var n = a + (c ^ (b | ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.MD5('message');
	     *     var hash = CryptoJS.MD5(wordArray);
	     */
	    C.MD5 = Hasher._createHelper(MD5);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacMD5(message, key);
	     */
	    C.HmacMD5 = Hasher._createHmacHelper(MD5);
	}(Math));


	return CryptoJS.MD5;

}));

/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, window */
  if ( true ) {
    // AMD - RequireJS
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( typeof window != 'undefined' ? window : this, function() {

"use strict";

function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  // copy over to avoid interference if .off() in listener
  listeners = listeners.slice(0);
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  for ( var i=0; i < listeners.length; i++ ) {
    var listener = listeners[i]
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
  }

  return this;
};

proto.allOff = function() {
  delete this._events;
  delete this._onceEvents;
};

return EvEmitter;

}));


/***/ }),

/***/ 648:
/***/ (function(module) {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ 612:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__(648);

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ 210:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = __webpack_require__(405)();
var hasProto = __webpack_require__(185)();

var getProto = Object.getPrototypeOf || (
	hasProto
		? function (x) { return x.__proto__; } // eslint-disable-line no-proto
		: null
);

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
	'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

if (getProto) {
	try {
		null.error; // eslint-disable-line no-unused-expressions
	} catch (e) {
		// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
		var errorProto = getProto(getProto(e));
		INTRINSICS['%Error.prototype%'] = errorProto;
	}
}

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen && getProto) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __webpack_require__(612);
var hasOwn = __webpack_require__(642);
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};


/***/ }),

/***/ 185:
/***/ (function(module) {

"use strict";


var test = {
	foo: {}
};

var $Object = Object;

module.exports = function hasProto() {
	return { __proto__: test }.foo === test.foo && !({ __proto__: null } instanceof $Object);
};


/***/ }),

/***/ 405:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __webpack_require__(419);

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};


/***/ }),

/***/ 419:
/***/ (function(module) {

"use strict";


/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),

/***/ 642:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(612);

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);


/***/ }),

/***/ 564:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 'use strict';
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(158)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( EvEmitter ) {
      return factory( window, EvEmitter );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

})( typeof window !== 'undefined' ? window : this,

// --------------------------  factory -------------------------- //

function factory( window, EvEmitter ) {

'use strict';

var $ = window.jQuery;
var console = window.console;

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var arraySlice = Array.prototype.slice;

// turn element or nodeList into an array
function makeArray( obj ) {
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    return obj;
  }

  var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
  if ( isArrayLike ) {
    // convert nodeList to array
    return arraySlice.call( obj );
  }

  // array of single index
  return [ obj ];
}

// -------------------------- imagesLoaded -------------------------- //

/**
 * @param {Array, Element, NodeList, String} elem
 * @param {Object or Function} options - if function, use as callback
 * @param {Function} onAlways - callback function
 */
function ImagesLoaded( elem, options, onAlways ) {
  // coerce ImagesLoaded() without new, to be new ImagesLoaded()
  if ( !( this instanceof ImagesLoaded ) ) {
    return new ImagesLoaded( elem, options, onAlways );
  }
  // use elem as selector string
  var queryElem = elem;
  if ( typeof elem == 'string' ) {
    queryElem = document.querySelectorAll( elem );
  }
  // bail if bad element
  if ( !queryElem ) {
    console.error( 'Bad element for imagesLoaded ' + ( queryElem || elem ) );
    return;
  }

  this.elements = makeArray( queryElem );
  this.options = extend( {}, this.options );
  // shift arguments if no options set
  if ( typeof options == 'function' ) {
    onAlways = options;
  } else {
    extend( this.options, options );
  }

  if ( onAlways ) {
    this.on( 'always', onAlways );
  }

  this.getImages();

  if ( $ ) {
    // add jQuery Deferred object
    this.jqDeferred = new $.Deferred();
  }

  // HACK check async to allow time to bind listeners
  setTimeout( this.check.bind( this ) );
}

ImagesLoaded.prototype = Object.create( EvEmitter.prototype );

ImagesLoaded.prototype.options = {};

ImagesLoaded.prototype.getImages = function() {
  this.images = [];

  // filter & find items if we have an item selector
  this.elements.forEach( this.addElementImages, this );
};

/**
 * @param {Node} element
 */
ImagesLoaded.prototype.addElementImages = function( elem ) {
  // filter siblings
  if ( elem.nodeName == 'IMG' ) {
    this.addImage( elem );
  }
  // get background image on element
  if ( this.options.background === true ) {
    this.addElementBackgroundImages( elem );
  }

  // find children
  // no non-element nodes, #143
  var nodeType = elem.nodeType;
  if ( !nodeType || !elementNodeTypes[ nodeType ] ) {
    return;
  }
  var childImgs = elem.querySelectorAll('img');
  // concat childElems to filterFound array
  for ( var i=0; i < childImgs.length; i++ ) {
    var img = childImgs[i];
    this.addImage( img );
  }

  // get child background images
  if ( typeof this.options.background == 'string' ) {
    var children = elem.querySelectorAll( this.options.background );
    for ( i=0; i < children.length; i++ ) {
      var child = children[i];
      this.addElementBackgroundImages( child );
    }
  }
};

var elementNodeTypes = {
  1: true,
  9: true,
  11: true
};

ImagesLoaded.prototype.addElementBackgroundImages = function( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    // Firefox returns null if in a hidden iframe https://bugzil.la/548397
    return;
  }
  // get url inside url("...")
  var reURL = /url\((['"])?(.*?)\1\)/gi;
  var matches = reURL.exec( style.backgroundImage );
  while ( matches !== null ) {
    var url = matches && matches[2];
    if ( url ) {
      this.addBackground( url, elem );
    }
    matches = reURL.exec( style.backgroundImage );
  }
};

/**
 * @param {Image} img
 */
ImagesLoaded.prototype.addImage = function( img ) {
  var loadingImage = new LoadingImage( img );
  this.images.push( loadingImage );
};

ImagesLoaded.prototype.addBackground = function( url, elem ) {
  var background = new Background( url, elem );
  this.images.push( background );
};

ImagesLoaded.prototype.check = function() {
  var _this = this;
  this.progressedCount = 0;
  this.hasAnyBroken = false;
  // complete if no images
  if ( !this.images.length ) {
    this.complete();
    return;
  }

  function onProgress( image, elem, message ) {
    // HACK - Chrome triggers event before object properties have changed. #83
    setTimeout( function() {
      _this.progress( image, elem, message );
    });
  }

  this.images.forEach( function( loadingImage ) {
    loadingImage.once( 'progress', onProgress );
    loadingImage.check();
  });
};

ImagesLoaded.prototype.progress = function( image, elem, message ) {
  this.progressedCount++;
  this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
  // progress event
  this.emitEvent( 'progress', [ this, image, elem ] );
  if ( this.jqDeferred && this.jqDeferred.notify ) {
    this.jqDeferred.notify( this, image );
  }
  // check if completed
  if ( this.progressedCount == this.images.length ) {
    this.complete();
  }

  if ( this.options.debug && console ) {
    console.log( 'progress: ' + message, image, elem );
  }
};

ImagesLoaded.prototype.complete = function() {
  var eventName = this.hasAnyBroken ? 'fail' : 'done';
  this.isComplete = true;
  this.emitEvent( eventName, [ this ] );
  this.emitEvent( 'always', [ this ] );
  if ( this.jqDeferred ) {
    var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
    this.jqDeferred[ jqMethod ]( this );
  }
};

// --------------------------  -------------------------- //

function LoadingImage( img ) {
  this.img = img;
}

LoadingImage.prototype = Object.create( EvEmitter.prototype );

LoadingImage.prototype.check = function() {
  // If complete is true and browser supports natural sizes,
  // try to check for image status manually.
  var isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    // report based on naturalWidth
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    return;
  }

  // If none of the checks above matched, simulate loading on detached element.
  this.proxyImage = new Image();
  this.proxyImage.addEventListener( 'load', this );
  this.proxyImage.addEventListener( 'error', this );
  // bind to image as well for Firefox. #191
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.proxyImage.src = this.img.src;
};

LoadingImage.prototype.getIsImageComplete = function() {
  // check for non-zero, non-undefined naturalWidth
  // fixes Safari+InfiniteScroll+Masonry bug infinite-scroll#671
  return this.img.complete && this.img.naturalWidth;
};

LoadingImage.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  this.emitEvent( 'progress', [ this, this.img, message ] );
};

// ----- events ----- //

// trigger specified handler for event type
LoadingImage.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

LoadingImage.prototype.onload = function() {
  this.confirm( true, 'onload' );
  this.unbindEvents();
};

LoadingImage.prototype.onerror = function() {
  this.confirm( false, 'onerror' );
  this.unbindEvents();
};

LoadingImage.prototype.unbindEvents = function() {
  this.proxyImage.removeEventListener( 'load', this );
  this.proxyImage.removeEventListener( 'error', this );
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

// -------------------------- Background -------------------------- //

function Background( url, element ) {
  this.url = url;
  this.element = element;
  this.img = new Image();
}

// inherit LoadingImage prototype
Background.prototype = Object.create( LoadingImage.prototype );

Background.prototype.check = function() {
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.img.src = this.url;
  // check if image is already complete
  var isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    this.unbindEvents();
  }
};

Background.prototype.unbindEvents = function() {
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

Background.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  this.emitEvent( 'progress', [ this, this.element, message ] );
};

// -------------------------- jQuery -------------------------- //

ImagesLoaded.makeJQueryPlugin = function( jQuery ) {
  jQuery = jQuery || window.jQuery;
  if ( !jQuery ) {
    return;
  }
  // set local variable
  $ = jQuery;
  // $().imagesLoaded()
  $.fn.imagesLoaded = function( options, callback ) {
    var instance = new ImagesLoaded( this, options, callback );
    return instance.jqDeferred.promise( $(this) );
  };
};
// try making plugin
ImagesLoaded.makeJQueryPlugin();

// --------------------------  -------------------------- //

return ImagesLoaded;

});


/***/ }),

/***/ 792:
/***/ (function() {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 631:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
// ie, `has-tostringtag/shams
var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')
    ? Symbol.toStringTag
    : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
    [].__proto__ === Array.prototype // eslint-disable-line no-proto
        ? function (O) {
            return O.__proto__; // eslint-disable-line no-proto
        }
        : null
);

function addNumericSeparator(num, str) {
    if (
        num === Infinity
        || num === -Infinity
        || num !== num
        || (num && num > -1000 && num < 1000)
        || $test.call(/e/, str)
    ) {
        return str;
    }
    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof num === 'number') {
        var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
        if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
        }
    }
    return $replace.call(str, sepRegex, '$&_');
}

var utilInspect = __webpack_require__(654);
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    }
    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    }
    var numericSeparator = opts.numericSeparator;

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
    }
    if (typeof obj === 'bigint') {
        var bigIntStr = String(obj) + 'n';
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function' && !isRegExp(obj)) { // in older engines, regexes are callable
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + $join.call(xs, ', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
        }
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
            mapForEach.call(obj, function (value, key) {
                mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
            });
        }
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
            setForEach.call(obj, function (value) {
                setParts.push(inspect(value, obj));
            });
        }
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
        if (ys.length === 0) { return tag + '{}'; }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + $join.call(ys, ', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return $replace.call(String(s), /"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
    if (hasShammedSymbols) {
        return obj && typeof obj === 'object' && obj instanceof Symbol;
    }
    if (typeof obj === 'symbol') {
        return true;
    }
    if (!obj || typeof obj !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = $replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), ' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}


/***/ }),

/***/ 798:
/***/ (function(module) {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = {
    'default': Format.RFC3986,
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return String(value);
        }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
};


/***/ }),

/***/ 129:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var stringify = __webpack_require__(261);
var parse = __webpack_require__(235);
var formats = __webpack_require__(798);

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),

/***/ 235:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(769);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    allowSparse: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = { __proto__: null };

    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = utils.maybeMap(
                parseArrayValue(part.slice(pos + 1), options),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else if (cleanRoot !== '__proto__') {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    if (options.allowSparse === true) {
        return obj;
    }

    return utils.compact(obj);
};


/***/ }),

/***/ 261:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var getSideChannel = __webpack_require__(478);
var utils = __webpack_require__(769);
var formats = __webpack_require__(798);
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var sentinel = {};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    commaRoundTrip,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    format,
    formatter,
    encodeValuesOnly,
    charset,
    sideChannel
) {
    var obj = object;

    var tmpSc = sideChannel;
    var step = 0;
    var findFlag = false;
    while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
        // Where object last appeared in the ref tree
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== 'undefined') {
            if (pos === step) {
                throw new RangeError('Cyclic object value');
            } else {
                findFlag = true; // Break while
            }
        }
        if (typeof tmpSc.get(sentinel) === 'undefined') {
            step = 0;
        }
    }

    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        });
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (generateArrayPrefix === 'comma' && isArray(obj)) {
        // we need to join elements in
        if (encodeValuesOnly && encoder) {
            obj = utils.maybeMap(obj, encoder);
        }
        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];
    } else if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? prefix + '[]' : prefix;

    for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var keyPrefix = isArray(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, key) : adjustedPrefix
            : adjustedPrefix + (allowDots ? '.' + key : '[' + key + ']');

        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            commaRoundTrip,
            strictNullHandling,
            skipNulls,
            generateArrayPrefix === 'comma' && encodeValuesOnly && isArray(obj) ? null : encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
    if (opts && 'commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {
        throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
    }
    var commaRoundTrip = generateArrayPrefix === 'comma' && opts && opts.commaRoundTrip;

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    var sideChannel = getSideChannel();
    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            commaRoundTrip,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};


/***/ }),

/***/ 769:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var formats = __webpack_require__(798);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset, kind, format) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
            || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        /* eslint operator-linebreak: [2, "before"] */
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};


/***/ }),

/***/ 478:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(210);
var callBound = __webpack_require__(924);
var inspect = __webpack_require__(631);

var $TypeError = GetIntrinsic('%TypeError%');
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
 * This function traverses the list returning the node corresponding to the
 * given key.
 *
 * That node is also moved to the head of the list, so that if it's accessed
 * again we don't need to traverse the whole list. By doing so, all the recently
 * used nodes can be accessed relatively quickly.
 */
var listGetNode = function (list, key) { // eslint-disable-line consistent-return
	for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			curr.next = list.next;
			list.next = curr; // eslint-disable-line no-param-reassign
			return curr;
		}
	}
};

var listGet = function (objects, key) {
	var node = listGetNode(objects, key);
	return node && node.value;
};
var listSet = function (objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = { // eslint-disable-line no-param-reassign
			key: key,
			next: objects.next,
			value: value
		};
	}
};
var listHas = function (objects, key) {
	return !!listGetNode(objects, key);
};

module.exports = function getSideChannel() {
	var $wm;
	var $m;
	var $o;
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listGet($o, key);
				}
			}
		},
		has: function (key) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapHas($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listHas($o, key);
				}
			}
			return false;
		},
		set: function (key, value) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map) {
				if (!$m) {
					$m = new $Map();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					/*
					 * Initialize the linked list as an empty node, so that we don't have
					 * to special-case handling of the first node: we can always refer to
					 * it as (previous node).next, instead of something like (list).head
					 */
					$o = { key: {}, next: null };
				}
				listSet($o, key, value);
			}
		}
	};
	return channel;
};


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

/***/ }),

/***/ 480:
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ 654:
/***/ (function() {

/* (ignored) */

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  almScroll: function() { return /* binding */ almScroll; },
  analytics: function() { return /* binding */ analytics; },
  click: function() { return /* binding */ click; },
  filter: function() { return /* binding */ filter; },
  getOffset: function() { return /* binding */ getOffset; },
  getPostCount: function() { return /* binding */ ajax_load_more_getPostCount; },
  getTotalPosts: function() { return /* binding */ getTotalPosts; },
  getTotalRemaining: function() { return /* binding */ getTotalRemaining; },
  reset: function() { return /* binding */ ajax_load_more_reset; },
  start: function() { return /* binding */ start; },
  wpblock: function() { return /* binding */ wpblock; }
});

// NAMESPACE OBJECT: ./node_modules/axios/lib/platform/common/utils.js
var common_utils_namespaceObject = {};
__webpack_require__.r(common_utils_namespaceObject);
__webpack_require__.d(common_utils_namespaceObject, {
  hasBrowserEnv: function() { return hasBrowserEnv; },
  hasStandardBrowserEnv: function() { return hasStandardBrowserEnv; },
  hasStandardBrowserWebWorkerEnv: function() { return hasStandardBrowserWebWorkerEnv; },
  navigator: function() { return _navigator; },
  origin: function() { return origin; }
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/bind.js


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/utils.js




// utils is a library of generic helper functions non-specific to axios

const {toString: utils_toString} = Object.prototype;
const {getPrototypeOf} = Object;
const {iterator, toStringTag} = Symbol;

const kindOf = (cache => thing => {
    const str = utils_toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
}

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
}

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];

  const _iterator = generator.call(obj);

  let result;

  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const utils_hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
}

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
}

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  }

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
}

const noop = () => {}

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
}

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[toStringTag] === 'FormData' && thing[iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  }

  return visit(obj, 0);
}

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({source, data}) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);

    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    }
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === 'function',
  isFunction(_global.postMessage)
);

const asap = typeof queueMicrotask !== 'undefined' ?
  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

// *********************


const isIterable = (thing) => thing != null && isFunction(thing[iterator]);


/* harmony default export */ var utils = ({
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty: utils_hasOwnProperty,
  hasOwnProp: utils_hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/AxiosError.js




/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});

const AxiosError_prototype = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(AxiosError_prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(AxiosError_prototype);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* harmony default export */ var core_AxiosError = (AxiosError);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/null.js
// eslint-disable-next-line strict
/* harmony default export */ var helpers_null = (null);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/toFormData.js




// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored


/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (helpers_null || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils.isSpecCompliantForm(formData);

  if (!utils.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils.isBlob(value)) {
      throw new core_AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils.isArray(value) && isFlatArray(value)) ||
        ((utils.isFileList(value) || utils.endsWith(key, '[]')) && (arr = utils.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils.forEach(value, function each(el, key) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/* harmony default export */ var helpers_toFormData = (toFormData);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/AxiosURLSearchParams.js




/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && helpers_toFormData(params, this, options);
}

const AxiosURLSearchParams_prototype = AxiosURLSearchParams.prototype;

AxiosURLSearchParams_prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

AxiosURLSearchParams_prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/* harmony default export */ var helpers_AxiosURLSearchParams = (AxiosURLSearchParams);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/buildURL.js





/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function buildURL_encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?(object|Function)} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || buildURL_encode;

  if (utils.isFunction(options)) {
    options = {
      serialize: options
    };
  } 

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ?
      params.toString() :
      new helpers_AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/InterceptorManager.js




class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

/* harmony default export */ var core_InterceptorManager = (InterceptorManager);

;// CONCATENATED MODULE: ./node_modules/axios/lib/defaults/transitional.js


/* harmony default export */ var defaults_transitional = ({
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js



/* harmony default export */ var classes_URLSearchParams = (typeof URLSearchParams !== 'undefined' ? URLSearchParams : helpers_AxiosURLSearchParams);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/classes/FormData.js


/* harmony default export */ var classes_FormData = (typeof FormData !== 'undefined' ? FormData : null);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/classes/Blob.js


/* harmony default export */ var classes_Blob = (typeof Blob !== 'undefined' ? Blob : null);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/index.js




/* harmony default export */ var browser = ({
  isBrowser: true,
  classes: {
    URLSearchParams: classes_URLSearchParams,
    FormData: classes_FormData,
    Blob: classes_Blob
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/common/utils.js
const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';



;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/index.js



/* harmony default export */ var platform = ({
  ...common_utils_namespaceObject,
  ...browser
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/toURLEncodedForm.js






function toURLEncodedForm(data, options) {
  return helpers_toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/formDataToJSON.js




/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};

    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/* harmony default export */ var helpers_formDataToJSON = (formDataToJSON);

;// CONCATENATED MODULE: ./node_modules/axios/lib/defaults/index.js










/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: defaults_transitional,

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils.isObject(data);

    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils.isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify(helpers_formDataToJSON(data)) : data;
    }

    if (utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data) ||
      utils.isReadableStream(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return helpers_toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (utils.isResponse(data) || utils.isReadableStream(data)) {
      return data;
    }

    if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw core_AxiosError.from(e, core_AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

/* harmony default export */ var lib_defaults = (defaults);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/parseHeaders.js




// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
/* harmony default export */ var parseHeaders = (rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/AxiosHeaders.js





const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils.isString(value)) return;

  if (utils.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite)
    } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils.isObject(header) && utils.isIterable(header)) {
      let obj = {}, dest, key;
      for (const entry of header) {
        if (!utils.isArray(entry)) {
          throw TypeError('Object iterator must return a key-value pair');
        }

        obj[key = entry[0]] = (dest = obj[key]) ?
          (utils.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]]) : entry[1];
      }

      setHeaders(obj, valueOrRewrite)
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils.forEach(this, (value, header) => {
      const key = utils.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  getSetCookie() {
    return this.get("set-cookie") || [];
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils.freezeMethods(AxiosHeaders);

/* harmony default export */ var core_AxiosHeaders = (AxiosHeaders);

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/transformData.js






/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || lib_defaults;
  const context = response || config;
  const headers = core_AxiosHeaders.from(context.headers);
  let data = context.data;

  utils.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/isCancel.js


function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/CanceledError.js





/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  core_AxiosError.call(this, message == null ? 'canceled' : message, core_AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, core_AxiosError, {
  __CANCEL__: true
});

/* harmony default export */ var cancel_CanceledError = (CanceledError);

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/settle.js




/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new core_AxiosError(
      'Request failed with status code ' + response.status,
      [core_AxiosError.ERR_BAD_REQUEST, core_AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/parseProtocol.js


function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/speedometer.js


/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/* harmony default export */ var helpers_speedometer = (speedometer);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/throttle.js
/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  }

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if ( passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs)
        }, threshold - passed);
      }
    }
  }

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

/* harmony default export */ var helpers_throttle = (throttle);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/progressEventReducer.js




const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = helpers_speedometer(50, 250);

  return helpers_throttle(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };

    listener(data);
  }, freq);
}

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
}

const asyncDecorator = (fn) => (...args) => utils.asap(() => fn(...args));

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isURLSameOrigin.js


/* harmony default export */ var isURLSameOrigin = (platform.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
  url = new URL(url, platform.origin);

  return (
    origin.protocol === url.protocol &&
    origin.host === url.host &&
    (isMSIE || origin.port === url.port)
  );
})(
  new URL(platform.origin),
  platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
) : () => true);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/cookies.js



/* harmony default export */ var cookies = (platform.hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      utils.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      utils.isString(path) && cookie.push('path=' + path);

      utils.isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  });


;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isAbsoluteURL.js


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/combineURLs.js


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/buildFullPath.js





/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/mergeConfig.js





const headersToObject = (thing) => thing instanceof core_AxiosHeaders ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, prop, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({caseless}, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, prop , caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, prop , caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a, prop , caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b , prop) => mergeDeepProperties(headersToObject(a), headersToObject(b),prop, true)
  };

  utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/resolveConfig.js









/* harmony default export */ var resolveConfig = ((config) => {
  const newConfig = mergeConfig({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = core_AxiosHeaders.from(headers);

  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (utils.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
});


;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/xhr.js











const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/* harmony default export */ var xhr = (isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = core_AxiosHeaders.from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = core_AxiosHeaders.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new core_AxiosError('Request aborted', core_AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new core_AxiosError('Network Error', core_AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || defaults_transitional;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new core_AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? core_AxiosError.ETIMEDOUT : core_AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new cancel_CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(_config.url);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new core_AxiosError('Unsupported protocol ' + protocol + ':', core_AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/composeSignals.js




const composeSignals = (signals, timeout) => {
  const {length} = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof core_AxiosError ? err : new cancel_CanceledError(err instanceof Error ? err.message : err));
      }
    }

    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new core_AxiosError(`timeout ${timeout} of ms exceeded`, core_AxiosError.ETIMEDOUT))
    }, timeout)

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    }

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = () => utils.asap(unsubscribe);

    return signal;
  }
}

/* harmony default export */ var helpers_composeSignals = (composeSignals);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/trackStream.js

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
}

const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
}

const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }

  const reader = stream.getReader();
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
}

const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  }

  return new ReadableStream({
    async pull(controller) {
      try {
        const {done, value} = await iterator.next();

        if (done) {
         _onFinish();
          controller.close();
          return;
        }

        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/fetch.js










const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false
  }
}

const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;

  const hasContentType = new Request(platform.origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
});

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported &&
  test(() => utils.isReadableStream(new Response('').body));


const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = utils.isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new core_AxiosError(`Response type '${type}' is not supported`, core_AxiosError.ERR_NOT_SUPPORT, config);
      })
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(utils.isBlob(body)) {
    return body.size;
  }

  if(utils.isSpecCompliantForm(body)) {
    const _request = new Request(platform.origin, {
      method: 'POST',
      body,
    });
    return (await _request.arrayBuffer()).byteLength;
  }

  if(utils.isArrayBufferView(body) || utils.isArrayBuffer(body)) {
    return body.byteLength;
  }

  if(utils.isURLSearchParams(body)) {
    body = body + '';
  }

  if(utils.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
}

const resolveBodyLength = async (headers, body) => {
  const length = utils.toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
}

/* harmony default export */ var adapters_fetch = (isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = resolveConfig(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let composedSignal = helpers_composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

  let request;

  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
  });

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (utils.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader)
      }

      if (_request.body) {
        const [onProgress, flush] = progressEventDecorator(
          requestContentLength,
          progressEventReducer(asyncDecorator(onUploadProgress))
        );

        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }

    if (!utils.isString(withCredentials)) {
      withCredentials = withCredentials ? 'include' : 'omit';
    }

    // Cloudflare Workers throws when credentials are defined
    // see https://github.com/cloudflare/workerd/issues/902
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : undefined
    });

    let response = await fetch(request);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = utils.toFiniteNumber(response.headers.get('content-length'));

      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
        responseContentLength,
        progressEventReducer(asyncDecorator(onDownloadProgress), true)
      ) || [];

      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[utils.findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && unsubscribe && unsubscribe();

    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: core_AxiosHeaders.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      })
    })
  } catch (err) {
    unsubscribe && unsubscribe();

    if (err && err.name === 'TypeError' && /Load failed|fetch/i.test(err.message)) {
      throw Object.assign(
        new core_AxiosError('Network Error', core_AxiosError.ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw core_AxiosError.from(err, err && err.code, config, request);
  }
}));



;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/adapters.js






const knownAdapters = {
  http: helpers_null,
  xhr: xhr,
  fetch: adapters_fetch
}

utils.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => utils.isFunction(adapter) || adapter === null || adapter === false;

/* harmony default export */ var adapters = ({
  getAdapter: (adapters) => {
    adapters = utils.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new core_AxiosError(`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new core_AxiosError(
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/dispatchRequest.js









/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new cancel_CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = core_AxiosHeaders.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || lib_defaults.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = core_AxiosHeaders.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = core_AxiosHeaders.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/env/data.js
const VERSION = "1.9.0";
;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/validator.js





const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new core_AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        core_AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

validators.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    // eslint-disable-next-line no-console
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  }
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new core_AxiosError('options must be an object', core_AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new core_AxiosError('option ' + opt + ' must be ' + result, core_AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new core_AxiosError('Unknown option ' + opt, core_AxiosError.ERR_BAD_OPTION);
    }
  }
}

/* harmony default export */ var validator = ({
  assertOptions,
  validators
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/Axios.js











const Axios_validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new core_InterceptorManager(),
      response: new core_InterceptorManager()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};

        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: Axios_validators.transitional(Axios_validators.boolean),
        forcedJSONParsing: Axios_validators.transitional(Axios_validators.boolean),
        clarifyTimeoutError: Axios_validators.transitional(Axios_validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        }
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: Axios_validators.function,
          serialize: Axios_validators.function
        }, true);
      }
    }

    // Set config.allowAbsoluteUrls
    if (config.allowAbsoluteUrls !== undefined) {
      // do nothing
    } else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }

    validator.assertOptions(config, {
      baseUrl: Axios_validators.spelling('baseURL'),
      withXsrfToken: Axios_validators.spelling('withXSRFToken')
    }, true);

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = core_AxiosHeaders.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/* harmony default export */ var core_Axios = (Axios);

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/CancelToken.js




/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new cancel_CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

/* harmony default export */ var cancel_CancelToken = (CancelToken);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/spread.js


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isAxiosError.js




/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/HttpStatusCode.js
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

/* harmony default export */ var helpers_HttpStatusCode = (HttpStatusCode);

;// CONCATENATED MODULE: ./node_modules/axios/lib/axios.js




















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new core_Axios(defaultConfig);
  const instance = bind(core_Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, core_Axios.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(lib_defaults);

// Expose Axios class to allow class inheritance
axios.Axios = core_Axios;

// Expose Cancel & CancelToken
axios.CanceledError = cancel_CanceledError;
axios.CancelToken = cancel_CancelToken;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = helpers_toFormData;

// Expose AxiosError class
axios.AxiosError = core_AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = core_AxiosHeaders;

axios.formToJSON = thing => helpers_formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = helpers_HttpStatusCode;

axios.default = axios;

// this module should only have a default export
/* harmony default export */ var lib_axios = (axios);

;// CONCATENATED MODULE: ./node_modules/dompurify/dist/purify.es.mjs
/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */

const {
  entries,
  setPrototypeOf,
  isFrozen,
  getPrototypeOf: purify_es_getPrototypeOf,
  getOwnPropertyDescriptor
} = Object;
let {
  freeze,
  seal,
  create
} = Object; // eslint-disable-line import/no-mutable-exports
let {
  apply,
  construct
} = typeof Reflect !== 'undefined' && Reflect;
if (!freeze) {
  freeze = function freeze(x) {
    return x;
  };
}
if (!seal) {
  seal = function seal(x) {
    return x;
  };
}
if (!apply) {
  apply = function apply(fun, thisValue, args) {
    return fun.apply(thisValue, args);
  };
}
if (!construct) {
  construct = function construct(Func, args) {
    return new Func(...args);
  };
}
const arrayForEach = unapply(Array.prototype.forEach);
const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const arraySplice = unapply(Array.prototype.splice);
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
/**
 * Creates a new function that calls the given function with a specified thisArg and arguments.
 *
 * @param func - The function to be wrapped and called.
 * @returns A new function that calls the given function with a specified thisArg and arguments.
 */
function unapply(func) {
  return function (thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return apply(func, thisArg, args);
  };
}
/**
 * Creates a new function that constructs an instance of the given constructor function with the provided arguments.
 *
 * @param func - The constructor function to be wrapped and called.
 * @returns A new function that constructs an instance of the given constructor function with the provided arguments.
 */
function unconstruct(func) {
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return construct(func, args);
  };
}
/**
 * Add properties to a lookup table
 *
 * @param set - The set to which elements will be added.
 * @param array - The array containing elements to be added to the set.
 * @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
 * @returns The modified set with added elements.
 */
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    // Make 'in' and truthy checks like Boolean(set.constructor)
    // independent of any properties defined on Object.prototype.
    // Prevent prototype setters from intercepting set as a this value.
    setPrototypeOf(set, null);
  }
  let l = array.length;
  while (l--) {
    let element = array[l];
    if (typeof element === 'string') {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        // Config presets (e.g. tags.js, attrs.js) are immutable.
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
/**
 * Clean up an array to harden against CSPP
 *
 * @param array - The array to be cleaned.
 * @returns The cleaned version of the array
 */
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
/**
 * Shallow clone an object
 *
 * @param object - The object to be cloned.
 * @returns A new object that copies the original.
 */
function clone(object) {
  const newObject = create(null);
  for (const [property, value] of entries(object)) {
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (Array.isArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === 'object' && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
/**
 * This method automatically checks if the prop is function or getter and behaves accordingly.
 *
 * @param object - The object to look up the getter function in its prototype chain.
 * @param prop - The property name for which to find the getter function.
 * @returns The getter function found in the prototype chain or a fallback function.
 */
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === 'function') {
        return unapply(desc.value);
      }
    }
    object = purify_es_getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}

const html$1 = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);
const svg$1 = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);
const svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);
// List of SVG elements that are disallowed by default.
// We still need to know them so that we can do namespace
// checks properly in case one wants to add them to
// allow-list.
const svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);
const mathMl$1 = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'mprescripts']);
// Similarly to SVG, we want to know all MathML elements,
// even those that we disallow by default.
const mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);
const purify_es_text = freeze(['#text']);

const html = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'nonce', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'popover', 'popovertarget', 'popovertargetaction', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'wrap', 'xmlns', 'slot']);
const svg = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'amplitude', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'exponent', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'intercept', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'slope', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'tablevalues', 'targetx', 'targety', 'transform', 'transform-origin', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);
const mathMl = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);
const xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

// eslint-disable-next-line unicorn/better-regex
const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
const TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm); // eslint-disable-line unicorn/better-regex
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/); // eslint-disable-line no-useless-escape
const ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
);
const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
);
const DOCTYPE_NAME = seal(/^html$/i);
const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);

var EXPRESSIONS = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ARIA_ATTR: ARIA_ATTR,
  ATTR_WHITESPACE: ATTR_WHITESPACE,
  CUSTOM_ELEMENT: CUSTOM_ELEMENT,
  DATA_ATTR: DATA_ATTR,
  DOCTYPE_NAME: DOCTYPE_NAME,
  ERB_EXPR: ERB_EXPR,
  IS_ALLOWED_URI: IS_ALLOWED_URI,
  IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA,
  MUSTACHE_EXPR: MUSTACHE_EXPR,
  TMPLIT_EXPR: TMPLIT_EXPR
});

/* eslint-disable @typescript-eslint/indent */
// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
const NODE_TYPE = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12 // Deprecated
};
const getGlobal = function getGlobal() {
  return typeof window === 'undefined' ? null : window;
};
/**
 * Creates a no-op policy for internal use only.
 * Don't export this function outside this module!
 * @param trustedTypes The policy factory.
 * @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
 * @return The policy created (or null, if Trusted Types
 * are not supported or creating the policy failed).
 */
const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
    return null;
  }
  // Allow the callers to control the unique policy name
  // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
  // Policy creation with duplicate names throws in Trusted Types.
  let suffix = null;
  const ATTR_NAME = 'data-tt-policy-suffix';
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = 'dompurify' + (suffix ? '#' + suffix : '');
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html) {
        return html;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_) {
    // Policy creation failed (most likely another DOMPurify script has
    // already run). Skip creating the policy, as this will only cause errors
    // if TT are enforced.
    console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
    return null;
  }
};
const _createHooksMap = function _createHooksMap() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function createDOMPurify() {
  let window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();
  const DOMPurify = root => createDOMPurify(root);
  DOMPurify.version = '3.2.6';
  DOMPurify.removed = [];
  if (!window || !window.document || window.document.nodeType !== NODE_TYPE.document || !window.Element) {
    // Not running in a browser, provide a factory function
    // so that you can pass your own Window
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let {
    document
  } = window;
  const originalDocument = document;
  const currentScript = originalDocument.currentScript;
  const {
    DocumentFragment,
    HTMLTemplateElement,
    Node,
    Element,
    NodeFilter,
    NamedNodeMap = window.NamedNodeMap || window.MozNamedAttrMap,
    HTMLFormElement,
    DOMParser,
    trustedTypes
  } = window;
  const ElementPrototype = Element.prototype;
  const cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
  const remove = lookupGetter(ElementPrototype, 'remove');
  const getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
  const getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
  const getParentNode = lookupGetter(ElementPrototype, 'parentNode');
  // As per issue #47, the web-components registry is inherited by a
  // new document created via createHTMLDocument. As per the spec
  // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
  // a new empty registry is used when creating a template contents owner
  // document, so we use that as our parent document to ensure nothing
  // is inherited.
  if (typeof HTMLTemplateElement === 'function') {
    const template = document.createElement('template');
    if (template.content && template.content.ownerDocument) {
      document = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = '';
  const {
    implementation,
    createNodeIterator,
    createDocumentFragment,
    getElementsByTagName
  } = document;
  const {
    importNode
  } = originalDocument;
  let hooks = _createHooksMap();
  /**
   * Expose whether this browser supports running the full DOMPurify.
   */
  DOMPurify.isSupported = typeof entries === 'function' && typeof getParentNode === 'function' && implementation && implementation.createHTMLDocument !== undefined;
  const {
    MUSTACHE_EXPR,
    ERB_EXPR,
    TMPLIT_EXPR,
    DATA_ATTR,
    ARIA_ATTR,
    IS_SCRIPT_OR_DATA,
    ATTR_WHITESPACE,
    CUSTOM_ELEMENT
  } = EXPRESSIONS;
  let {
    IS_ALLOWED_URI: IS_ALLOWED_URI$1
  } = EXPRESSIONS;
  /**
   * We consider the elements and attributes below to be safe. Ideally
   * don't add any new ones but feel free to remove unwanted ones.
   */
  /* allowed element names */
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...purify_es_text]);
  /* Allowed attribute names */
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  /*
   * Configure how DOMPurify should handle custom elements and their attributes as well as customized built-in elements.
   * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
   * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
   * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
   */
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
  let FORBID_TAGS = null;
  /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
  let FORBID_ATTR = null;
  /* Decide if ARIA attributes are okay */
  let ALLOW_ARIA_ATTR = true;
  /* Decide if custom data attributes are okay */
  let ALLOW_DATA_ATTR = true;
  /* Decide if unknown protocols are okay */
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  /* Decide if self-closing tags in attributes are allowed.
   * Usually removed due to a mXSS issue in jQuery 3.0 */
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  /* Output should be safe for common template engines.
   * This means, DOMPurify removes data attributes, mustaches and ERB
   */
  let SAFE_FOR_TEMPLATES = false;
  /* Output should be safe even for XML used within HTML and alike.
   * This means, DOMPurify removes comments when containing risky content.
   */
  let SAFE_FOR_XML = true;
  /* Decide if document with <html>... should be returned */
  let WHOLE_DOCUMENT = false;
  /* Track whether config is already set on this instance of DOMPurify. */
  let SET_CONFIG = false;
  /* Decide if all elements (e.g. style, script) must be children of
   * document.body. By default, browsers might move them to document.head */
  let FORCE_BODY = false;
  /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
   * string (or a TrustedHTML object if Trusted Types are supported).
   * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
   */
  let RETURN_DOM = false;
  /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
   * string  (or a TrustedHTML object if Trusted Types are supported) */
  let RETURN_DOM_FRAGMENT = false;
  /* Try to return a Trusted Type object instead of a string, return a string in
   * case Trusted Types are not supported  */
  let RETURN_TRUSTED_TYPE = false;
  /* Output should be free from DOM clobbering attacks?
   * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
   */
  let SANITIZE_DOM = true;
  /* Achieve full DOM Clobbering protection by isolating the namespace of named
   * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
   *
   * HTML/DOM spec rules that enable DOM Clobbering:
   *   - Named Access on Window (§7.3.3)
   *   - DOM Tree Accessors (§3.1.5)
   *   - Form Element Parent-Child Relations (§4.10.3)
   *   - Iframe srcdoc / Nested WindowProxies (§4.8.5)
   *   - HTMLCollection (§4.2.10.2)
   *
   * Namespace isolation is implemented by prefixing `id` and `name` attributes
   * with a constant string, i.e., `user-content-`
   */
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = 'user-content-';
  /* Keep element content when removing element? */
  let KEEP_CONTENT = true;
  /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
   * of importing it into a new Document and returning a sanitized copy */
  let IN_PLACE = false;
  /* Allow usage of profiles like html, svg and mathMl */
  let USE_PROFILES = {};
  /* Tags to ignore content of when KEEP_CONTENT is true */
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);
  /* Tags that are safe for data: URIs */
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
  /* Attributes safe for values like "javascript:" */
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);
  const MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
  /* Document namespace */
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  /* Allowed XHTML+XML namespaces */
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
  let HTML_INTEGRATION_POINTS = addToSet({}, ['annotation-xml']);
  // Certain elements are allowed in both SVG and HTML
  // namespace. We need to specify them explicitly
  // so that they don't get erroneously deleted from
  // HTML namespace.
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);
  /* Parsing of strict XHTML documents */
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
  const DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
  let transformCaseFunc = null;
  /* Keep a reference to config to pass to hooks */
  let CONFIG = null;
  /* Ideally, do not touch anything below this line */
  /* ______________________________________________ */
  const formElement = document.createElement('form');
  const isRegexOrFunction = function isRegexOrFunction(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  /**
   * _parseConfig
   *
   * @param cfg optional config literal
   */
  // eslint-disable-next-line complexity
  const _parseConfig = function _parseConfig() {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    /* Shield configuration object from tampering */
    if (!cfg || typeof cfg !== 'object') {
      cfg = {};
    }
    /* Shield configuration object from prototype pollution */
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE =
    // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.
    transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? stringToString : stringToLowerCase;
    /* Set configuration parameters */
    ALLOWED_TAGS = objectHasOwnProperty(cfg, 'ALLOWED_TAGS') ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = objectHasOwnProperty(cfg, 'ALLOWED_ATTR') ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, 'ALLOWED_NAMESPACES') ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, 'ADD_URI_SAFE_ATTR') ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = objectHasOwnProperty(cfg, 'ADD_DATA_URI_TAGS') ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = objectHasOwnProperty(cfg, 'FORBID_CONTENTS') ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = objectHasOwnProperty(cfg, 'FORBID_TAGS') ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
    FORBID_ATTR = objectHasOwnProperty(cfg, 'FORBID_ATTR') ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
    USE_PROFILES = objectHasOwnProperty(cfg, 'USE_PROFILES') ? cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false; // Default true
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false; // Default true
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
    RETURN_DOM = cfg.RETURN_DOM || false; // Default false
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
    FORCE_BODY = cfg.FORCE_BODY || false; // Default false
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
    IN_PLACE = cfg.IN_PLACE || false; // Default false
    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
    HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
    CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === 'boolean') {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
    }
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    /* Parse profile info */
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, purify_es_text);
      ALLOWED_ATTR = [];
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    /* Merge configuration parameters */
    if (cfg.ADD_TAGS) {
      if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
        ALLOWED_TAGS = clone(ALLOWED_TAGS);
      }
      addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
    }
    if (cfg.ADD_ATTR) {
      if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
        ALLOWED_ATTR = clone(ALLOWED_ATTR);
      }
      addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
    }
    if (cfg.ADD_URI_SAFE_ATTR) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (cfg.FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    /* Add #text in case KEEP_CONTENT is set to true */
    if (KEEP_CONTENT) {
      ALLOWED_TAGS['#text'] = true;
    }
    /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
    }
    /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ['tbody']);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      // Overwrite existing TrustedTypes policy.
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      // Sign local variables required by `sanitize`.
      emptyHTML = trustedTypesPolicy.createHTML('');
    } else {
      // Uninitialized policy, attempt to initialize the internal dompurify policy.
      if (trustedTypesPolicy === undefined) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      }
      // If creating the internal policy succeeded sign internal variables.
      if (trustedTypesPolicy !== null && typeof emptyHTML === 'string') {
        emptyHTML = trustedTypesPolicy.createHTML('');
      }
    }
    // Prevent further manipulation of configuration.
    // Not available in IE8, Safari 5, etc.
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  /* Keep track of all possible SVG and MathML tags
   * so that we can perform the namespace checks
   * correctly. */
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  /**
   * @param element a DOM element whose namespace is being checked
   * @returns Return false if the element has a
   *  namespace that a spec-compliant parser would never
   *  return. Return true otherwise.
   */
  const _checkValidNamespace = function _checkValidNamespace(element) {
    let parent = getParentNode(element);
    // In JSDOM, if we're inside shadow DOM, then parentNode
    // can be null. We just simulate parent in this case.
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: 'template'
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      // The only way to switch from HTML namespace to SVG
      // is via <svg>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'svg';
      }
      // The only way to switch from MathML to SVG is via`
      // svg if parent is either <annotation-xml> or MathML
      // text integration points.
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      // We only allow elements that are defined in SVG
      // spec. All others are disallowed in SVG namespace.
      return Boolean(ALL_SVG_TAGS[tagName]);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      // The only way to switch from HTML namespace to MathML
      // is via <math>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'math';
      }
      // The only way to switch from SVG to MathML is via
      // <math> and HTML integration points
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
      }
      // We only allow elements that are defined in MathML
      // spec. All others are disallowed in MathML namespace.
      return Boolean(ALL_MATHML_TAGS[tagName]);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      // The only way to switch from SVG to HTML is via
      // HTML integration points, and from MathML to HTML
      // is via MathML text integration points
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      // We disallow tags that are specific for MathML
      // or SVG and should never appear in HTML namespace
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    }
    // For XHTML and XML documents that support custom namespaces
    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    // The code should never reach this place (this means
    // that the element somehow got namespace that is not
    // HTML, SVG, MathML or allowed via ALLOWED_NAMESPACES).
    // Return false just in case.
    return false;
  };
  /**
   * _forceRemove
   *
   * @param node a DOM node
   */
  const _forceRemove = function _forceRemove(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      // eslint-disable-next-line unicorn/prefer-dom-node-remove
      getParentNode(node).removeChild(node);
    } catch (_) {
      remove(node);
    }
  };
  /**
   * _removeAttribute
   *
   * @param name an Attribute name
   * @param element a DOM node
   */
  const _removeAttribute = function _removeAttribute(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    // We void attribute values for unremovable "is" attributes
    if (name === 'is') {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_) {}
      } else {
        try {
          element.setAttribute(name, '');
        } catch (_) {}
      }
    }
  };
  /**
   * _initDocument
   *
   * @param dirty - a string of dirty markup
   * @return a DOM, filled with the dirty markup
   */
  const _initDocument = function _initDocument(dirty) {
    /* Create a HTML document */
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = '<remove></remove>' + dirty;
    } else {
      /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && NAMESPACE === HTML_NAMESPACE) {
      // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
    }
    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    /*
     * Use the DOMParser API by default, fallback later if needs be
     * DOMParser not work for svg when has multiple root element.
     */
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {}
    }
    /* Use createHTMLDocument in case DOMParser is not available */
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, 'template', null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_) {
        // Syntax error if dirtyPayload is invalid xml
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    /* Work on whole document or just its body */
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  /**
   * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
   *
   * @param root The root element or node to start traversing on.
   * @return The created NodeIterator
   */
  const _createNodeIterator = function _createNodeIterator(root) {
    return createNodeIterator.call(root.ownerDocument || root, root,
    // eslint-disable-next-line no-bitwise
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
  };
  /**
   * _isClobbered
   *
   * @param element element to check for clobbering attacks
   * @return true if clobbered, false if safe
   */
  const _isClobbered = function _isClobbered(element) {
    return element instanceof HTMLFormElement && (typeof element.nodeName !== 'string' || typeof element.textContent !== 'string' || typeof element.removeChild !== 'function' || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== 'function' || typeof element.setAttribute !== 'function' || typeof element.namespaceURI !== 'string' || typeof element.insertBefore !== 'function' || typeof element.hasChildNodes !== 'function');
  };
  /**
   * Checks whether the given object is a DOM node.
   *
   * @param value object to check whether it's a DOM node
   * @return true is object is a DOM node
   */
  const _isNode = function _isNode(value) {
    return typeof Node === 'function' && value instanceof Node;
  };
  function _executeHooks(hooks, currentNode, data) {
    arrayForEach(hooks, hook => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  /**
   * _sanitizeElements
   *
   * @protect nodeName
   * @protect textContent
   * @protect removeChild
   * @param currentNode to check for permission to exist
   * @return true if node was killed, false if left alive
   */
  const _sanitizeElements = function _sanitizeElements(currentNode) {
    let content = null;
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    /* Check if element is clobbered or can clobber */
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Now let's check the element's type and name */
    const tagName = transformCaseFunc(currentNode.nodeName);
    /* Execute a hook if present */
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    /* Detect mXSS attempts abusing namespace confusion */
    if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove any occurrence of processing instructions */
    if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove any kind of possibly harmful comments */
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove element if anything forbids its presence */
    if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
      /* Check if we have a custom element to handle */
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      /* Keep content except for bad-listed elements */
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode) || currentNode.parentNode;
        const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const childClone = cloneNode(childNodes[i], true);
            childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
            parentNode.insertBefore(childClone, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    }
    /* Check whether element has a valid namespace */
    if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Make sure that older browsers don't get fallback-tag mXSS */
    if ((tagName === 'noscript' || tagName === 'noembed' || tagName === 'noframes') && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Sanitize element content to be template-safe */
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      /* Get the element's text content */
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
        content = stringReplace(content, expr, ' ');
      });
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  /**
   * _isValidAttribute
   *
   * @param lcTag Lowercase tag name of containing element.
   * @param lcName Lowercase attribute name.
   * @param value Attribute value.
   * @return Returns true if `value` is valid, otherwise false.
   */
  // eslint-disable-next-line complexity
  const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
    /* Make sure attribute cannot clobber */
    if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
      return false;
    }
    /* Allow valid data-* attributes: At least one character after "-"
        (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
        XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
        We don't need to check the value; it's always URI safe. */
    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if (
      // First condition does a very basic check if a) it's basically a valid custom element tagname AND
      // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
      _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) ||
      // Alternative, second condition checks if it's an `is`-attribute, AND
      // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      lcName === 'is' && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ; else {
        return false;
      }
      /* Check value is safe. First, is attr inert? If so, is safe */
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if (value) {
      return false;
    } else ;
    return true;
  };
  /**
   * _isBasicCustomElement
   * checks if at least one dash is included in tagName, and it's not the first char
   * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
   *
   * @param tagName name of the tag of the node to sanitize
   * @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
   */
  const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
    return tagName !== 'annotation-xml' && stringMatch(tagName, CUSTOM_ELEMENT);
  };
  /**
   * _sanitizeAttributes
   *
   * @protect attributes
   * @protect nodeName
   * @protect removeAttribute
   * @protect setAttribute
   *
   * @param currentNode to sanitize
   */
  const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const {
      attributes
    } = currentNode;
    /* Check if we have attributes; if not we might have a text node */
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    const hookEvent = {
      attrName: '',
      attrValue: '',
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: undefined
    };
    let l = attributes.length;
    /* Go backwards over all attributes; safely remove bad ones */
    while (l--) {
      const attr = attributes[l];
      const {
        name,
        namespaceURI,
        value: attrValue
      } = attr;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === 'value' ? initValue : stringTrim(initValue);
      /* Execute a hook if present */
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      /* Full DOM Clobbering protection via namespace isolation,
       * Prefix id and name attributes with `user-content-`
       */
      if (SANITIZE_NAMED_PROPS && (lcName === 'id' || lcName === 'name')) {
        // Remove the attribute with this value
        _removeAttribute(name, currentNode);
        // Prefix the value and later re-create the attribute with the sanitized value
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      /* Work around a security issue with comments inside attributes */
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Did the hooks approve of the attribute? */
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      /* Did the hooks approve of the attribute? */
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Work around a security issue in jQuery 3.0 */
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Sanitize attribute content to be template-safe */
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
          value = stringReplace(value, expr, ' ');
        });
      }
      /* Is `value` valid for this attribute? */
      const lcTag = transformCaseFunc(currentNode.nodeName);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Handle attributes that require Trusted Types */
      if (trustedTypesPolicy && typeof trustedTypes === 'object' && typeof trustedTypes.getAttributeType === 'function') {
        if (namespaceURI) ; else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case 'TrustedHTML':
              {
                value = trustedTypesPolicy.createHTML(value);
                break;
              }
            case 'TrustedScriptURL':
              {
                value = trustedTypesPolicy.createScriptURL(value);
                break;
              }
          }
        }
      }
      /* Handle invalid data-* attribute set by try-catching it */
      if (value !== initValue) {
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_) {
          _removeAttribute(name, currentNode);
        }
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  /**
   * _sanitizeShadowDOM
   *
   * @param fragment to iterate over recursively
   */
  const _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      /* Execute a hook if present */
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      /* Sanitize tags and elements */
      _sanitizeElements(shadowNode);
      /* Check attributes next */
      _sanitizeAttributes(shadowNode);
      /* Deep shadow DOM detected */
      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(shadowNode.content);
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  // eslint-disable-next-line complexity
  DOMPurify.sanitize = function (dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    /* Make sure we have a string to sanitize.
      DO NOT return early, as this will return the wrong type if
      the user has requested a DOM object rather than a string */
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = '<!-->';
    }
    /* Stringify, in case dirty is an object */
    if (typeof dirty !== 'string' && !_isNode(dirty)) {
      if (typeof dirty.toString === 'function') {
        dirty = dirty.toString();
        if (typeof dirty !== 'string') {
          throw typeErrorCreate('dirty is not a string, aborting');
        }
      } else {
        throw typeErrorCreate('toString is not a function');
      }
    }
    /* Return dirty HTML if DOMPurify cannot run */
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    /* Assign config vars */
    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    /* Clean up removed elements */
    DOMPurify.removed = [];
    /* Check if dirty is correctly typed for IN_PLACE */
    if (typeof dirty === 'string') {
      IN_PLACE = false;
    }
    if (IN_PLACE) {
      /* Do some early pre-sanitization to avoid unsafe root nodes */
      if (dirty.nodeName) {
        const tagName = transformCaseFunc(dirty.nodeName);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
        }
      }
    } else if (dirty instanceof Node) {
      /* If dirty is a DOM element, append to an empty document to avoid
         elements being stripped by the parser */
      body = _initDocument('<!---->');
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === 'BODY') {
        /* Node is already a body, use as is */
        body = importedNode;
      } else if (importedNode.nodeName === 'HTML') {
        body = importedNode;
      } else {
        // eslint-disable-next-line unicorn/prefer-dom-node-append
        body.appendChild(importedNode);
      }
    } else {
      /* Exit directly if we have nothing to do */
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT &&
      // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf('<') === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      /* Initialize the document to work on */
      body = _initDocument(dirty);
      /* Check we have a DOM node from the data */
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
      }
    }
    /* Remove first element node (ours) if FORCE_BODY is set */
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    /* Get node iterator */
    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
    /* Now start iterating over the created document */
    while (currentNode = nodeIterator.nextNode()) {
      /* Sanitize tags and elements */
      _sanitizeElements(currentNode);
      /* Check attributes next */
      _sanitizeAttributes(currentNode);
      /* Shadow DOM detected, sanitize it */
      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(currentNode.content);
      }
    }
    /* If we sanitized `dirty` in-place, return it. */
    if (IN_PLACE) {
      return dirty;
    }
    /* Return sanitized string or DOM */
    if (RETURN_DOM) {
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          // eslint-disable-next-line unicorn/prefer-dom-node-append
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        /*
          AdoptNode() is not used because internal state is not reset
          (e.g. the past names map of a HTMLFormElement), this is safe
          in theory but we would rather not risk another attack vector.
          The state that is cloned by importNode() is explicitly defined
          by the specs.
        */
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    /* Serialize doctype if allowed */
    if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
    }
    /* Sanitize final string template-safe */
    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
        serializedHTML = stringReplace(serializedHTML, expr, ' ');
      });
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function () {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
  };
  DOMPurify.clearConfig = function () {
    CONFIG = null;
    SET_CONFIG = false;
  };
  DOMPurify.isValidAttribute = function (tag, attr, value) {
    /* Initialize shared config vars if necessary. */
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function (entryPoint, hookFunction) {
    if (typeof hookFunction !== 'function') {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function (entryPoint, hookFunction) {
    if (hookFunction !== undefined) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? undefined : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function (entryPoint) {
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function () {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();


//# sourceMappingURL=purify.es.mjs.map

// EXTERNAL MODULE: ./node_modules/crypto-js/md5.js
var md5 = __webpack_require__(214);
var md5_default = /*#__PURE__*/__webpack_require__.n(md5);
;// CONCATENATED MODULE: ./src/frontend/js/functions/api.js

var _alm_localize = alm_localize,
  rest_api = _alm_localize.rest_api,
  rest_nonce = _alm_localize.rest_nonce;

/*
 * Create a Api object with Axios and configure it for the WordPress Rest API.
 *
 * @see https://axios-http.com/docs/instance
 */
var api = lib_axios.create({
  baseURL: rest_api,
  headers: {
    'content-type': 'application/json',
    'X-WP-Nonce': rest_nonce
  }
});
;// CONCATENATED MODULE: ./src/frontend/js/functions/getButtonURL.js
/**
 * Get the URL for Load More button.
 *
 * @param {Object} alm The Ajax Load More object.
 * @param {string} rel The type of load more, `next` or `previous`.
 * @since 5.4.0
 */
function getButtonURL(alm) {
  var _button;
  var rel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'next';
  if (!alm || !alm.trigger) {
    return false;
  }
  var button = alm.trigger.querySelector('.alm-load-more-btn');
  if (rel === 'prev') {
    button = document.querySelector('.alm-load-more-btn--prev');
  }
  return ((_button = button) === null || _button === void 0 || (_button = _button.dataset) === null || _button === void 0 ? void 0 : _button.url) || '';
}

/**
 * Set button dataset attributes.
 *
 * @param {Element} button The HTML element.
 * @param {number}  page   The current page number.
 * @param {string}  url    The URL for updating.
 */
function setButtonAtts(button, page, url) {
  if (!button || page === 0) {
    return;
  }
  if ((button === null || button === void 0 ? void 0 : button.rel) === 'prev') {
    button.href = url;
  }

  // Set page & URL attributes.
  button.dataset.page = page;
  button.dataset.url = url ? url : '';
}
;// CONCATENATED MODULE: ./src/frontend/js/addons/cache.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }




/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
function cacheCreateParams(alm) {
  var _listing$dataset;
  var listing = alm.listing;
  alm.addons.cache = (listing === null || listing === void 0 || (_listing$dataset = listing.dataset) === null || _listing$dataset === void 0 ? void 0 : _listing$dataset.cache) === 'true';
  if (alm.addons.cache) {
    alm.addons.cache_id = listing.dataset.cacheId;
    alm.addons.cache_path = listing.dataset.cachePath;
    alm.addons.cache_logged_in = listing.dataset.cacheLoggedIn ? listing.dataset.cacheLoggedIn : false;
  }
  return alm;
}

/**
 * Create unique cache slug from query params.
 *
 * @param {Object} alm  The ALM object.
 * @param {Object} data The data object.
 * @return {string}     The cache file slug.
 */
function getCacheSlug(alm, data) {
  var addons = alm.addons,
    pagePrev = alm.pagePrev,
    page = alm.page,
    _alm$rel = alm.rel,
    rel = _alm$rel === void 0 ? 'next' : _alm$rel;
  if (addons.nextpage) {
    // Nextpage.
    return "page-".concat(page + addons.nextpage_startpage);
  } else if (addons.single_post) {
    // Single Post.
    return addons.single_post_id;
  } else if (addons.queryloop) {
    // Query Loop, use the button URL.
    return md5_default()(JSON.stringify(getButtonURL(alm, alm.rel))).toString();
  } else if (addons.woocommerce || addons.elementor) {
    // WooCommerce || Elementor.
    return rel === 'prev' ? "page-".concat(pagePrev) : "page-".concat(page + 1);
  }
  return md5_default()(JSON.stringify(data)).toString(); // Standard.
}

/**
 * Create a cache file.
 *
 * @param {Object} alm  The ALM object.
 * @param {string} data Content to cache.
 * @param {string} name The cache slug
 * @since 5.3.1
 */
function createCache(_x, _x2, _x3) {
  return _createCache.apply(this, arguments);
}

/**
 * Get cache data file.
 *
 * @param {Object} alm    The ALM object.
 * @param {Object} params Query params.
 * @return {Promise}      Cache data or false.
 */
function _createCache() {
  _createCache = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(alm, data, name) {
    var _data$html, html, _data$meta, meta, params, res;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _data$html = data.html, html = _data$html === void 0 ? '' : _data$html, _data$meta = data.meta, meta = _data$meta === void 0 ? {} : _data$meta;
          if (!(!html || !alm.addons.cache)) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return");
        case 3:
          params = {
            cache_id: alm.addons.cache_id,
            cache_logged_in: alm.addons.cache_logged_in,
            canonical_url: alm.canonical_url,
            name: name,
            html: html.trim(),
            postcount: meta.postcount,
            totalposts: meta.totalposts
          }; // Create the cache file via REST API.
          _context.next = 6;
          return api.post('ajax-load-more/cache/create', params);
        case 6:
          res = _context.sent;
          if (res.status === 200 && res.data && res.data.success) {
            console.log(res.data.msg); // eslint-disable-line no-console
          }
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _createCache.apply(this, arguments);
}
function getCache(_x4, _x5) {
  return _getCache.apply(this, arguments);
}
function _getCache() {
  _getCache = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(alm, params) {
    var restParams, res;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!(!alm.addons.cache || alm.addons.cache && alm.addons.cache_logged_in)) {
            _context2.next = 2;
            break;
          }
          return _context2.abrupt("return", false);
        case 2:
          restParams = {
            id: alm.addons.cache_id,
            name: params.cache_slug
          };
          _context2.next = 5;
          return api.get('ajax-load-more/cache/get', {
            params: restParams
          });
        case 5:
          res = _context2.sent;
          if (!(res.status === 200 && res.data)) {
            _context2.next = 8;
            break;
          }
          return _context2.abrupt("return", res.data);
        case 8:
          return _context2.abrupt("return", false);
        case 9:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _getCache.apply(this, arguments);
}
;// CONCATENATED MODULE: ./src/frontend/js/addons/call-to-actions.js
/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
function ctaCreateParams(alm) {
  var _listing$dataset;
  var listing = alm.listing;
  alm.addons.cta = (listing === null || listing === void 0 || (_listing$dataset = listing.dataset) === null || _listing$dataset === void 0 ? void 0 : _listing$dataset.cta) === 'true';
  if (alm.addons.cta) {
    alm.addons.cta_position = listing.dataset.ctaPosition;
    if (listing.dataset.ctaTemplate) {
      alm.addons.cta_template = listing.dataset.ctaTemplate;
    }
    alm.addons.cta_repeater = listing.dataset.ctaRepeater;
    alm.addons.cta_theme_repeater = listing.dataset.ctaThemeRepeater;
  }
  return alm;
}
;// CONCATENATED MODULE: ./src/frontend/js/addons/comments.js
/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
function commentsCreateParams(alm) {
  var _listing$dataset;
  var listing = alm.listing;
  alm.addons.comments = (listing === null || listing === void 0 || (_listing$dataset = listing.dataset) === null || _listing$dataset === void 0 ? void 0 : _listing$dataset.comments) === 'true';
  if (alm.addons.comments) {
    alm.addons.comments_post_id = listing.dataset.comments_post_id;
    alm.addons.comments_per_page = listing.dataset.comments_per_page;
    alm.addons.comments_per_page = alm.addons.comments_per_page === undefined ? '5' : alm.addons.comments_per_page;
    alm.addons.comments_type = listing.dataset.comments_type;
    alm.addons.comments_style = listing.dataset.comments_style;
    alm.addons.comments_template = listing.dataset.comments_template;
    alm.addons.comments_callback = listing.dataset.comments_callback;
  }
  return alm;
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/constants.js
var EXCLUDED_NODES = ['#text', '#comment'];
var API_DATA_SHAPE = {
  html: '',
  meta: {
    postcount: 0,
    totalposts: 0
  }
};
;// CONCATENATED MODULE: ./src/frontend/js/functions/dispatchScrollEvent.js
/**
 * Dispatch a window scroll event.
 *
 * @param {boolean} delay Should this be delayed.
 * @since 5.5
 */
function dispatchScrollEvent() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  if (typeof Event === 'function') {
    setTimeout(function () {
      window.dispatchEvent(new CustomEvent('scroll'));
    }, delay ? 150 : 1);
  }
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/setContentParams.js
/**
 * Set accessibility attributes on the containers.
 *
 * @param {Element} container  The container element.
 * @param {Element} almListing The Ajax Load More container.
 */
function setContentContainersParams(container, almListing) {
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('aria-atomic', 'true');
  almListing.removeAttribute('aria-live');
  almListing.removeAttribute('aria-atomic');
}
;// CONCATENATED MODULE: ./src/frontend/js/modules/lazyImages.js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Lazy load images helper.
 * When a plugin or 3rd party script has hooked into WP Post Thumbnails to provide a lazy load solution, images will not load via Ajax.
 * This helper provides a fix by grabbing the dataset value and making it the src.
 *
 * @param {Object} alm The Ajax Load More object.
 */
function lazyImages(alm) {
  var lazy_images = alm.lazy_images,
    last_loaded = alm.last_loaded;
  if (lazy_images && last_loaded !== null && last_loaded !== void 0 && last_loaded.length) {
    last_loaded.forEach(function (item) {
      lazyImagesReplace(item);
    });
  }
}

/**
 * Loop all images in container and replace the src.
 *
 * @param {HTMLElement} container The element HTML.
 */
function lazyImagesReplace(container) {
  var images = container.querySelectorAll('img');
  if (images) {
    // Loop all images.
    _toConsumableArray(images).forEach(function (image) {
      if (image) {
        replaceSrc(image);
      }
    });
  }
}

/**
 * Replace the image src with the value from data-src attributes.
 *
 * @param {HTMLElement} img The HTML image element.
 */
function replaceSrc(img) {
  var _img$dataset, _img$dataset2, _img$dataset3, _img$dataset4;
  if (!img) {
    return;
  }
  if (img !== null && img !== void 0 && (_img$dataset = img.dataset) !== null && _img$dataset !== void 0 && _img$dataset.src) {
    img.src = img.dataset.src;
  }
  if (img !== null && img !== void 0 && (_img$dataset2 = img.dataset) !== null && _img$dataset2 !== void 0 && _img$dataset2.srcset) {
    img.srcset = img.dataset.srcset;
  }
  // Blocksy Pro.
  // @see https://creativethemes.com/blocksy
  if (img !== null && img !== void 0 && (_img$dataset3 = img.dataset) !== null && _img$dataset3 !== void 0 && _img$dataset3.ctLazy) {
    img.src = img.dataset.ctLazy;
  }
  if (img !== null && img !== void 0 && (_img$dataset4 = img.dataset) !== null && _img$dataset4 !== void 0 && _img$dataset4.ctLazySet) {
    img.srcset = img.dataset.ctLazySet;
  }
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/srcsetPolyfill.js
/**
 * A srcset polyfill to get Masonry and ImagesLoaded working with Safari and Firefox.
 *
 * @param {HTMLElement} container Container HTML element.
 * @param {string}      ua        The user-agent string.
 * @since 5.0.2
 */
function srcsetPolyfill() {
  var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var ua = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  if (!container) {
    return false; // Exit if no container.
  }

  // Exit if useragent is Chrome, Safari or Windows.
  if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') !== -1 || ua.indexOf('Firefox') > -1 || ua.indexOf('Windows') > -1) {
    return false;
  }

  // Get all images.
  var imgs = container.querySelectorAll('img[srcset]:not(.alm-loaded)');

  // Loop images.
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    img.classList.add('alm-loaded');
    img.outerHTML = img.outerHTML;
  }
}
;// CONCATENATED MODULE: ./src/frontend/js/modules/loadImage.js


var imagesLoaded = __webpack_require__(564);

/**
 * Load the image with imagesLoaded
 *
 * @param {Element} container     The HTML container.
 * @param {Element} item          The element to load.
 * @param {string}  ua            Browser user-agent.
 * @param {string}  rel           The loading direction, next or prev.
 * @param {boolean} waitForImages Wait for images to load before loading next item.
 */
function loadImage(container, item, ua) {
  var rel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'next';
  var waitForImages = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  /**
   * Append item to container.
   */
  function appendImage() {
    if (rel === 'prev') {
      container.insertBefore(item, container.childNodes[0]);
    } else {
      container.appendChild(item);
    }
    lazyImagesReplace(item); // Lazy load image fix.
    srcsetPolyfill(item, ua); // Safari/Firefox polyfills.
  }

  return new Promise(function (resolve) {
    item.style.transition = 'all 0.25s ease'; // Add CSS transition to each item.

    if (waitForImages) {
      imagesLoaded(item, function () {
        appendImage();
        resolve(true); // Send Promise callback
      });
    } else {
      appendImage();
      resolve(true); // Send Promise callback
    }
  });
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/setFocus.js
/**
 * Set user focus to improve accessibility after load events.
 *
 * @param {Object}  alm       ALM object.
 * @param {Element} element   The element to focus on.
 * @param {number}  total     The total number of posts returned.
 * @param {boolean} filtering Is this a filtering event.
 * @since 5.1
 */
function setFocus(alm) {
  var _alm_localize;
  var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var total = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var filtering = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (!((_alm_localize = alm_localize) !== null && _alm_localize !== void 0 && _alm_localize.a11y_focus) || !element) {
    return;
  }

  // WooCommerce||ELementor Add-ons.
  if (alm.addons.woocommerce || alm.addons.elementor) {
    moveFocus(false, false, element, false);
    return;
  }
  if (total < 1) {
    return; // Exit if no posts returned.
  }

  if (alm.addons.paging) {
    // Paging.
    moveFocus(alm.init, alm.addons.preloaded, alm.listing, filtering);
  } else if (alm.addons.single_post || alm.addons.nextpage) {
    // Single Posts || Next Page - Set `init` to false to trigger focus.
    moveFocus(false, alm.addons.preloaded, element, filtering);
  } else {
    // Standard.
    moveFocus(alm.init, alm.addons.preloaded, element, filtering);
  }
}

/**
 * Move user focus to latest elements that have been loaded.
 *
 * @param {boolean} init      Initial run true or false.
 * @param {string}  preloaded Preloaded true or false.
 * @param {Element} element   The container HTML element.
 * @param {boolean} filtering Filtering true or false.
 * @since 5.1
 */

function moveFocus() {
  var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var preloaded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'false';
  var element = arguments.length > 2 ? arguments[2] : undefined;
  var filtering = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (!filtering) {
    if ((init || !element) && preloaded !== 'true') {
      return; // Exit if first run
    }
  }

  element.setAttribute('tabIndex', '-1'); // Set tabIndex.
  element.style.outline = 'none'; // Set element outline.

  // Add slight delay for elements to settle into DOM.
  setTimeout(function () {
    element.focus({
      preventScroll: true
    });
  }, 25);
}
;// CONCATENATED MODULE: ./src/frontend/js/modules/loadItems.js
function loadItems_typeof(o) { "@babel/helpers - typeof"; return loadItems_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, loadItems_typeof(o); }
function loadItems_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ loadItems_regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == loadItems_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(loadItems_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function loadItems_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function loadItems_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { loadItems_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { loadItems_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



/**
 * Load all items after Ajax request.
 *
 * Note: The function is used with WooCommerce and Elementor add-ons.
 *
 * @param {HTMLElement} container     The HTML container.
 * @param {Array}       items         Array of items.
 * @param {Object}      alm           The ALM object.
 * @param {boolean}     waitForImages Wait for images to load before loading next item.
 */
function loadItems(container, items, alm) {
  var waitForImages = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  return new Promise(function (resolve) {
    var _alm$rel = alm.rel,
      rel = _alm$rel === void 0 ? 'next' : _alm$rel;
    var total = items.length;
    var index = 0;
    var count = 1;

    // Reverse items array if rel is 'prev'.
    items = rel === 'prev' ? items.reverse() : items;
    function loadItem() {
      if (count <= total) {
        loadItems_asyncToGenerator( /*#__PURE__*/loadItems_regeneratorRuntime().mark(function _callee() {
          return loadItems_regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                items[index].style.opacity = 0;
                _context.next = 3;
                return loadImage(container, items[index], alm.ua, rel, waitForImages);
              case 3:
                count++;
                index++;
                loadItem();
              case 6:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }))()["catch"](function () {
          console.warn('There was an error loading the items.');
        });
      } else {
        // Delay for effect only
        setTimeout(function () {
          items.map(function (item) {
            item.style.opacity = 1;
            return item;
          });
          if (items[0]) {
            var focusItem = rel === 'prev' ? items[items.length - 1] : items[0]; // Get the item to focus.
            setFocus(alm, focusItem, null, false); // Set the focus.
          }
        }, 25);
        resolve(true);
      }
    }
    loadItem();
  });
}
;// CONCATENATED MODULE: ./src/frontend/js/modules/loadPrevious.js
/**
 * Create a Load Previous button.
 *
 * @param {Object} alm       The Ajax Load More object.
 * @param {Object} container The container element.
 * @param {number} page      The previous page number.
 * @param {string} url       The previous page url.
 * @param {string} label     The label for the button.
 * @since 5.5.0
 */
function createLoadPreviousButton(alm, container) {
  var page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var url = arguments.length > 3 ? arguments[3] : undefined;
  var label = arguments.length > 4 ? arguments[4] : undefined;
  if (!label) {
    return;
  }

  // Create wrapper.
  var btnWrap = document.createElement('div');
  btnWrap.classList.add('alm-btn-wrap--prev');

  // Create button.
  var button = document.createElement('a');
  button.href = url;
  button.innerHTML = label;
  button.setAttribute('rel', 'prev');
  button.dataset.page = page;
  button.dataset.url = url;
  button.setAttribute('class', "alm-load-more-btn alm-load-more-btn--prev ".concat(alm.loading_style));

  // Click event.
  button.addEventListener('click', function (e) {
    alm.AjaxLoadMore.prevClick(e);
  });

  // Set alm previous button to this button.
  alm.AjaxLoadMore.setPreviousButton(button);

  // Append button to wrap.
  btnWrap.appendChild(button);

  // Get parent element.
  var parent = container.parentNode;

  // Append button before container.
  parent.insertBefore(btnWrap, container);
}
;// CONCATENATED MODULE: ./src/frontend/js/addons/elementor.js
function elementor_typeof(o) { "@babel/helpers - typeof"; return elementor_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, elementor_typeof(o); }
function elementor_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ elementor_regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == elementor_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(elementor_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function elementor_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function elementor_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { elementor_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { elementor_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }









/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
function elementorCreateParams(alm) {
  var _alm = alm,
    listing = _alm.listing;
  alm.addons.elementor = listing.dataset.elementor === 'posts' && listing.dataset.elementorSettings;
  if (alm.addons.elementor) {
    alm.addons.elementor_type = 'posts';
    alm.addons.elementor_settings = JSON.parse(alm.listing.dataset.elementorSettings);

    // Parse Container Settings
    alm.addons.elementor_target = alm.addons.elementor_settings.target;
    alm.addons.elementor_element = alm.addons.elementor_settings.target ? document.querySelector(".elementor-element ".concat(alm.addons.elementor_settings.target)) : '';
    alm.addons.elementor_widget = elementorGetWidgetType(alm.addons.elementor_element);

    // Masonry
    alm = setElementorClasses(alm, alm.addons.elementor_widget);

    // Pagination Element
    alm.addons.elementor_controls = alm.addons.elementor_settings.controls;
    alm.addons.elementor_controls = alm.addons.elementor_controls === 'true' ? true : false;
    alm.addons.elementor_scrolltop = parseInt(alm.addons.elementor_settings.scrolltop);
    alm.addons.elementor_prev_label = alm.addons.elementor_settings.prev_label || '';

    // Get next page URL.
    alm.addons.elementor_next_page = elementorGetPagedURL(alm, alm.addons.elementor_element);
    alm.addons.elementor_prev_page = elementorGetPagedURL(alm, alm.addons.elementor_element, 'prev');

    // Get the max pages.
    alm.addons.elementor_max_pages = alm.addons.elementor_element.querySelector('.e-load-more-anchor');
    alm.addons.elementor_max_pages = alm.addons.elementor_max_pages ? parseInt(alm.addons.elementor_max_pages.dataset.maxPage) : 999;
    alm.addons.elementor_paged = alm.addons.elementor_settings.paged ? parseInt(alm.addons.elementor_settings.paged) : 1;
    alm.page = parseInt(alm.page) + alm.addons.elementor_paged;

    // Masonry
    alm = parseMasonryConfig(alm);
    if (!alm.addons.elementor_element) {
      console.warn("Ajax Load More: Unable to locate Elementor Widget. Are you sure you've set up your target parameter correctly?");
    }
    if (!alm.addons.elementor_next_page) {
      console.warn('Ajax Load More: Unable to locate Elementor pagination. There are either no results or Ajax Load More is unable to locate the pagination widget?');
    }
  }
  return alm;
}

/**
 * Set up the instance on Elementor
 *
 * @param {Object} alm
 */
function elementorInit(alm) {
  var addons = alm.addons;
  if (!addons.elementor || !addons.elementor_type || !addons.elementor_type === 'posts') {
    return false;
  }
  var container = addons.elementor_element;
  if (!container) {
    return false;
  }
  alm.button.dataset.page = addons.elementor_paged; // Set button data attributes

  // Set button URL
  var nextPage = addons.elementor_next_page;
  alm.button.dataset.url = nextPage ? nextPage : '';

  // Set attributes on containers.
  setContentContainersParams(container, alm.listing);

  // Set data attributes on first item.
  var item = container.querySelector(".".concat(addons.elementor_item_class)); // Get first item
  if (item) {
    item.classList.add('alm-elementor');
    item.dataset.url = window.location;
    item.dataset.page = addons.elementor_paged;
    item.dataset.pageTitle = document.title;
  }

  // Paged URL: Create previous button.
  if (addons.elementor_paged > 1 && addons.elementor_prev_page && addons.elementor_prev_label) {
    createLoadPreviousButton(alm, container, addons.elementor_paged, addons.elementor_prev_page, addons.elementor_prev_label);
  }

  // Masonry Window Resize. Delay for masonry to be added via Elementor.
  if (addons.elementor_masonry) {
    var resizeTimeout;
    setTimeout(function () {
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
          positionMasonryItems(alm, ".".concat(addons.elementor_container_class), ".".concat(addons.elementor_item_class));
        }, 100);
      });
    }, 250);
  }
}

/**
 * Get the content, title and results text from the Ajax response.
 *
 * @param {Object} alm        The alm object.
 * @param {string} url        The request URL.
 * @param {Object} response   Query response.
 * @param {string} cache_slug The cache slug.
 * @return {Object}           Results data.
 */
function elementorGetContent(alm, url, response, cache_slug) {
  var data = API_DATA_SHAPE;
  var status = response.status,
    resData = response.data;
  if (status !== 200 || !resData) {
    return data; // Bail early if response is not OK or empty.
  }

  var addons = alm.addons,
    page = alm.page,
    button = alm.button,
    buttonPrev = alm.buttonPrev,
    rel = alm.rel;
  var elementor_target = addons.elementor_target,
    elementor_container_class = addons.elementor_container_class,
    elementor_item_class = addons.elementor_item_class;

  // Create temp div to hold response data.
  var content = document.createElement('div');
  content.innerHTML = resData;

  // Set button state & URL.
  if (rel === 'prev' && buttonPrev) {
    var prevURL = elementorGetPagedURL(alm, content, 'prev');
    if (prevURL) {
      setButtonAtts(buttonPrev, page - 1, prevURL);
    } else {
      alm.AjaxLoadMore.triggerDonePrev();
    }
  } else {
    var nextURL = elementorGetPagedURL(alm, content);
    if (nextURL) {
      setButtonAtts(button, page + 1, nextURL);
    } else {
      alm.AjaxLoadMore.triggerDone();
    }
  }

  // Get Page Title
  var title = content.querySelector('title').innerHTML;
  data.pageTitle = title;

  // Get Elementor container.
  var container = content.querySelector("".concat(elementor_target, " .").concat(elementor_container_class));
  if (!container) {
    console.warn("Ajax Load More Elementor: Unable to find Elementor container element.");
    return data;
  }

  // Get the first item and append data attributes.
  var item = container ? container.querySelector(".".concat(elementor_item_class)) : null;
  if (item) {
    item.classList.add('alm-elementor');
    item.dataset.url = url;
    item.dataset.page = rel === 'next' ? page + 1 : page - 1;
    item.dataset.pageTitle = title;
  }

  // Count the number of returned items.
  var items = container.querySelectorAll(".".concat(elementor_item_class));
  if (items) {
    // Set the html to the elementor container data.
    data.html = container ? container.innerHTML : '';
    data.meta.postcount = items.length;
    data.meta.totalposts = items.length;
    createCache(alm, data, cache_slug); // Create cache file.
  }

  return data;
}

/**
 * Core ALM Elementor loader.
 *
 * @param {HTMLElement} content The HTML data.
 * @param {Object}      alm     The alm object.
 */
function elementor(content, alm) {
  if (!content || !alm) {
    alm.AjaxLoadMore.triggerDone();
    return false;
  }
  return new Promise(function (resolve) {
    var addons = alm.addons;
    var container = alm.addons.elementor_element.querySelector(".".concat(addons.elementor_container_class)); // Get post container
    var items = content.querySelectorAll(".".concat(addons.elementor_item_class)); // Get all items in container

    if (container && items) {
      var ElementorItems = Array.prototype.slice.call(items); // Convert NodeList to Array

      // Trigger almElementorLoaded callback.
      if (typeof almElementorLoaded === 'function') {
        window.almElementorLoaded(ElementorItems);
      }

      // Load the items.
      elementor_asyncToGenerator( /*#__PURE__*/elementor_regeneratorRuntime().mark(function _callee() {
        return elementor_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return loadItems(container, ElementorItems, alm);
            case 2:
              if (addons.elementor_masonry) {
                setTimeout(function () {
                  positionMasonryItems(alm, ".".concat(addons.elementor_container_class), ".".concat(addons.elementor_item_class));
                }, 125);
              }
              resolve(true);
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))()["catch"](function (e) {
        console.warn(e, 'There was an error with Elementor'); // eslint-disable-line no-console
      });
    } else {
      resolve(false);
    }
  });
}

/**
 * Elementor loaded and dispatch actions.
 *
 * @param {Object} alm The alm object.
 */
function elementorLoaded(alm) {
  var page = alm.page,
    AjaxLoadMore = alm.AjaxLoadMore,
    addons = alm.addons;
  var nextPage = page + 1;
  var elementor_max_pages = addons.elementor_max_pages;
  lazyImages(alm); // Lazy load images if necessary.

  if (typeof almComplete === 'function' && alm.transition !== 'masonry') {
    window.almComplete(alm); // Trigger almComplete.
  }

  AjaxLoadMore.transitionEnd(); // End transitions.

  if (nextPage >= elementor_max_pages) {
    AjaxLoadMore.triggerDone(); // ALM Done.
  }

  dispatchScrollEvent();
}

/**
 * Set the required classnames for parsing data and injecting content into the Elementor listing
 *
 * @param {Object} alm  The alm object.
 * @param {string} type The Elementor type.
 * @return {Object}     The modified object.
 */
function setElementorClasses(alm) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'posts';
  // Get the items based on the Elementor type.
  alm.addons.elementor_container_class = alm.addons.elementor_settings.container_class; // Container class

  switch (type) {
    case 'woocommerce':
      alm.addons.elementor_item_class = alm.addons.elementor_settings.woo_item_class; // item class.
      alm.addons.elementor_pagination_class = ".".concat(alm.addons.elementor_settings.woo_pagination_class); // Pagination class.
      break;
    case 'loop-grid':
      alm.addons.elementor_item_class = alm.addons.elementor_settings.loop_grid_item_class; // item class.
      alm.addons.elementor_pagination_class = ".".concat(alm.addons.elementor_settings.loop_grid_pagination_class); // Pagination class.
      break;
    default:
      alm.addons.elementor_item_class = alm.addons.elementor_settings.posts_item_class; // item class.
      alm.addons.elementor_pagination_class = ".".concat(alm.addons.elementor_settings.posts_pagination_class); // Pagination class.
      break;
  }
  return alm;
}

/**
 * Parse Masonry Settings from Elementor Data atts
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
function parseMasonryConfig(alm) {
  var _target$dataset;
  var addons = alm.addons;
  if (!addons.elementor_element) {
    return alm; // Exit if not found.
  }

  var target = addons.elementor_element;
  var settings = target !== null && target !== void 0 && (_target$dataset = target.dataset) !== null && _target$dataset !== void 0 && _target$dataset.settings ? JSON.parse(target.dataset.settings) : '';
  if (!settings) {
    return alm; // Exit if not found.
  }

  addons.elementor_masonry = settings.hasOwnProperty('cards_masonry') || settings.hasOwnProperty('classic_masonry') || settings.hasOwnProperty('masonry');
  if (addons.elementor_masonry) {
    var _settings$cards_row_g, _settings$row_gap;
    addons.elementor_masonry_columns = parseInt(settings === null || settings === void 0 ? void 0 : settings.cards_columns) || parseInt(settings === null || settings === void 0 ? void 0 : settings.classic_columns) || parseInt(settings === null || settings === void 0 ? void 0 : settings.columns);
    addons.elementor_masonry_columns_mobile = parseInt(settings === null || settings === void 0 ? void 0 : settings.cards_columns_mobile) || parseInt(settings === null || settings === void 0 ? void 0 : settings.classic_columns_mobile) || parseInt(settings === null || settings === void 0 ? void 0 : settings.columns_mobile);
    addons.elementor_masonry_columns_tablet = parseInt(settings === null || settings === void 0 ? void 0 : settings.cards_columns_tablet) || parseInt(settings === null || settings === void 0 ? void 0 : settings.classic_columns_tablet) || parseInt(settings === null || settings === void 0 ? void 0 : settings.columns_tablet);
    addons.elementor_masonry_gap = parseInt(settings === null || settings === void 0 || (_settings$cards_row_g = settings.cards_row_gap) === null || _settings$cards_row_g === void 0 ? void 0 : _settings$cards_row_g.size) || parseInt(settings === null || settings === void 0 || (_settings$row_gap = settings.row_gap) === null || _settings$row_gap === void 0 ? void 0 : _settings$row_gap.size);
  }
  return alm;
}

/**
 * Position Elementor Masonry Items
 *
 * @param {Object} alm             The alm object.
 * @param {string} container_class The container classname.
 * @param {string} item_class      The item classname.
 */
function positionMasonryItems(alm, container_class, item_class) {
  var heights = [];

  // Get Elementor Settings
  var columnsCount = alm.addons.elementor_masonry_columns;
  var columnsCountTablet = alm.addons.elementor_masonry_columns_tablet;
  var columnsCountMobile = alm.addons.elementor_masonry_columns_mobile;
  var verticalSpaceBetween = alm.addons.elementor_masonry_gap;
  var columns = columnsCount;

  // Get Elementor Breakpoints
  var breakpoints = window.elementorFrontendConfig && window.elementorFrontendConfig.breakpoints ? window.elementorFrontendConfig.breakpoints : 0;
  var windowW = window.innerWidth;

  // Set Columns
  if (windowW > breakpoints.lg) {
    columns = columnsCount;
  } else if (windowW > breakpoints.md) {
    columns = columnsCountTablet;
  } else {
    columns = columnsCountMobile;
  }

  // Get Containers
  var container = document.querySelector(container_class);
  if (!container) {
    return false;
  }
  var items = container.querySelectorAll(item_class);
  if (!items) {
    return false;
  }

  // Loop items
  items.forEach(function (item, index) {
    var row = Math.floor(index / columns);
    var itemHeight = item.getBoundingClientRect().height + verticalSpaceBetween;
    if (row) {
      var itemPosition = jQuery(item).position();
      var indexAtRow = index % columns;
      var pullHeight = Math.round(itemPosition.top) - heights[indexAtRow];
      pullHeight *= -1;
      item.style.marginTop = "".concat(Math.round(pullHeight), "px");
      heights[indexAtRow] += itemHeight;
    } else {
      heights.push(itemHeight);
    }
  });
}

/**
 * Determine the type of elementor widget (woocommerce || posts)
 *
 * @param {HTMLElement} target The target element.
 * @return {string}            The Elementor type.
 */
function elementorGetWidgetType(target) {
  if (!target) {
    return false;
  }

  // Get Elementor type based on container class.
  if (target.classList.contains('elementor-wc-products')) {
    return 'woocommerce';
  } else if (target.classList.contains('elementor-widget-loop-grid')) {
    return 'loop-grid';
  }
  return 'posts';
}

/**
 * Get the pagination container for the Elementor pagination.
 *
 * @param {Object}  alm     The alm object.
 * @param {Element} content The HTML content to search.
 * @param {string}  dir     the direction, next of prev.
 * @return {HTMLElement}    The pagination element.
 */
function elementorGetPagedURL(alm, content) {
  var _addons$elementor_set, _element$querySelecto;
  var dir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'next';
  var _alm$addons = alm.addons,
    addons = _alm$addons === void 0 ? {} : _alm$addons;

  // Locate the pagination container.
  var element = (content === null || content === void 0 ? void 0 : content.querySelector(addons === null || addons === void 0 ? void 0 : addons.elementor_pagination_class)) || (content === null || content === void 0 ? void 0 : content.querySelector(".".concat(addons === null || addons === void 0 || (_addons$elementor_set = addons.elementor_settings) === null || _addons$elementor_set === void 0 ? void 0 : _addons$elementor_set.pagination_class)));

  // Get URL from the pagination element.
  var page = element === null || element === void 0 || (_element$querySelecto = element.querySelector("a.".concat(dir))) === null || _element$querySelecto === void 0 ? void 0 : _element$querySelecto.href;

  // Return the paged URL element.
  return page ? page : false;
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/getParameterByName.js
/**
 * Return a query param by name.
 *
 * @param {string} name The query param name.
 * @param {string} url  The URL.
 * @return {string}     The query param value.
 */
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  var results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/getQueryVariable.js
/**
 * Get a query variable from location querystring
 *
 * @param {string} variable
 * @since 5.3.4
 */
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return false;
}
;// CONCATENATED MODULE: ./src/frontend/js/addons/filters.js



/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
function filtersCreateParams(alm) {
  var _alm$listing;
  var listing = alm.listing;
  alm.addons.filters = (alm === null || alm === void 0 || (_alm$listing = alm.listing) === null || _alm$listing === void 0 || (_alm$listing = _alm$listing.dataset) === null || _alm$listing === void 0 ? void 0 : _alm$listing.filters) === 'true';
  if (alm.addons.filters) {
    alm.addons.filters_url = listing.dataset.filtersUrl === 'true';
    alm.addons.filters_target = listing.dataset.filtersTarget ? listing.dataset.filtersTarget : false;
    alm.addons.filters_paging = listing.dataset.filtersPaging === 'true';
    alm.addons.filters_scroll = listing.dataset.filtersScroll === 'true';
    alm.addons.filters_scrolltop = listing.dataset.filtersScrolltop ? listing.dataset.filtersScrolltop : '30';
    alm.addons.filters_debug = listing.dataset.filtersDebug;
    alm.facets = listing.dataset.facets === 'true';

    // Display warning when `filters_target` parameter is missing.
    if (!alm.addons.filters_target) {
      console.warn('Ajax Load More: Unable to locate a target for Filters. Make sure you set a target parameter in the core Ajax Load More shortcode - e.g. [ajax_load_more filters="true" target="filters"]');
    }

    // Parse querystring value for pg.
    var page = getParameterByName('pg');
    alm.addons.filters_startpage = page !== null ? parseInt(page) : 0;

    // Handle a paged URL with filters.
    if (alm.addons.filters_startpage > 0) {
      if (alm.addons.paging) {
        // Paging add-on: Set current page value.
        alm.page = alm.addons.filters_startpage - 1;
      } else {
        // Set posts_per_page value to load all required posts.
        alm.posts_per_page = alm.posts_per_page * alm.addons.filters_startpage;
        alm.paged = true;
      }
    }
  }
  return alm;
}

/**
 * Create data attributes for a Filters item.
 *
 * @param {Object}      alm     The ALM object.
 * @param {HTMLElement} element The element HTML node.
 * @param {number}      pagenum The current page number.
 * @return {HTMLElement}        Modified HTML element.
 */
function addFiltersAttributes(alm, element, pagenum) {
  var canonical_url = alm.canonical_url;
  var querystring = window.location.search;
  element.classList.add('alm-filters');
  element.dataset.page = pagenum;
  if (pagenum > 1) {
    element.dataset.url = canonical_url + buildFilterURL(alm, querystring, pagenum);
  } else {
    element.dataset.url = canonical_url + buildFilterURL(alm, querystring, 0);
  }
  return element;
}

/**
 * Parse a filter querystring for returning caches directories.
 *
 * @param {string} path The URL path.
 * @since 5.3.1
 */
function parseQuerystring(path) {
  // Get querystring
  var query = window.location.search.substring(1);
  var obj = '';
  var cache_dir = '';

  // Parse querystring into object
  if (query) {
    obj = JSON.parse('{"' + query.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) {
      // Replace + with - in URL
      return key === '' ? value : decodeURIComponent(value.replace(/\+/g, '-'));
    });

    // Remove the following properties from the object as they should not be included in the cache ID

    if (obj.pg) {
      // `pg` object prop
      delete obj.pg;
    }
    if (obj.auto) {
      // `auto` object prop
      delete obj.auto;
    }
  }
  if (obj) {
    cache_dir += '/';
    Object.keys(obj).forEach(function (key, index) {
      cache_dir += index > 0 ? '--' : '';
      cache_dir += "".concat(key, "--").concat(obj[key]);
    });
  }
  return path + cache_dir;
}

/**
 * Build new paging URL for filters.
 *
 * @param {Object} alm         The ALM object.
 * @param {string} querystring The current querystring.
 * @param {number} page        The page number.
 * @return {string}            The querystring.
 * @since 5.3.5
 */
function buildFilterURL(alm) {
  var querystring = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var qs = querystring;
  if (alm.addons.filters_paging) {
    if (page > 1) {
      // Paged
      if (qs) {
        // If already has `pg` in querystring
        if (getQueryVariable('pg')) {
          qs = querystring.replace(/(pg=)[^\&]+/, '$1' + page);
        } else {
          qs = querystring + '&pg=' + page;
        }
      } else {
        qs = '?pg=' + page;
      }
    } else {
      // Not Paged
      qs = querystring.replace(/(pg=)[^\&]+/, '');
      qs = qs === '?' ? '' : qs; // Remove `?` if only symbol in querystring
      qs = qs[qs.length - 1] === '&' ? qs.slice(0, -1) : qs; // Remove trailing `&` symbols
    }
  }

  return qs;
}
;// CONCATENATED MODULE: ./src/frontend/js/addons/next-page.js
/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
function nextpageCreateParams(alm) {
  var _listing$dataset;
  var listing = alm.listing;
  alm.addons.nextpage = (listing === null || listing === void 0 || (_listing$dataset = listing.dataset) === null || _listing$dataset === void 0 ? void 0 : _listing$dataset.nextpage) === 'true';
  if (alm.addons.nextpage) {
    alm.addons.nextpage_urls = listing.dataset.nextpageUrls === undefined ? 'true' : listing.dataset.nextpageUrls;
    alm.addons.nextpage_scroll = listing.dataset.nextpageScroll === undefined ? 'false:30' : listing.dataset.nextpageScroll;
    alm.addons.nextpage_post_id = listing.dataset.nextpagePostId ? listing.dataset.nextpagePostId : false;
    alm.addons.nextpage_startpage = listing.dataset.nextpageStartpage ? parseInt(listing.dataset.nextpageStartpage) : 1;
    alm.addons.nextpage_title_template = listing.dataset.nextpageTitleTemplate;
    alm.addons.nextpage_postTitle = alm.listing.dataset.nextpagePostTitle;

    // Set default fallbacks.
    alm.posts_per_page = 1;
    alm.orginal_posts_per_page = 1;
    if (!alm.addons.nextpage_post_id) {
      alm.addons.nextpage = false;
    }
    if (alm.addons.nextpage_startpage > 1) {
      alm.paged = true;
    }
  }
  return alm;
}
;// CONCATENATED MODULE: ./src/frontend/js/modules/insertScript.js
/**
 * Search nodes for <script/> tags and run scripts.
 * Scripts cannot run with appendChild or innerHTML so this is necessary to function.
 *
 * @since 5.0
 */
var insertScript = {
  /**
   * Initiate the script insertion.
   *
   * @param {Array} nodes The HTML nodes.
   */
  init: function init(nodes) {
    var _this = this;
    if (!(nodes !== null && nodes !== void 0 && nodes.length)) {
      return false;
    }
    nodes.forEach(function (node) {
      _this.check(node);
    });
  },
  /**
   * Parse HTML node from script.
   *
   * @param {HTMLElement} node The HTML node/element.
   * @return {HTMLElement}     The modified HTML node.
   */
  check: function check(node) {
    if (this.isScript(node) === true) {
      node.parentNode.replaceChild(this.clone(node), node);
    } else {
      var i = 0;
      var children = node.childNodes;
      if (children === undefined) {
        var parser = new DOMParser();
        var data = parser.parseFromString(node, 'text/html');
        if (data) {
          children = data.body.childNodes;
        }
      }
      while (i < children.length) {
        this.replace(children[i++]);
      }
    }
    return node;
  },
  /**
   * Replace the script tag with a clone.
   *
   * @param {HTMLElement} node The HTML node/element.
   * @return {HTMLElement}     The modified node.
   */
  replace: function replace(node) {
    if (this.isScript(node) === true) {
      node.parentNode.replaceChild(this.clone(node), node);
    } else {
      var i = 0;
      var children = node.childNodes;
      while (i < children.length) {
        this.replace(children[i++]);
      }
    }
    return node;
  },
  /**
   * Clone the tag.
   *
   * @param {HTMLElement} node The HTML node/element.
   * @return {HTMLElement}     The cloned node.
   */
  clone: function clone(node) {
    var script = document.createElement('script');
    script.text = node.innerHTML;
    for (var i = node.attributes.length - 1; i >= 0; i--) {
      script.setAttribute(node.attributes[i].name, node.attributes[i].value);
    }
    return script;
  },
  /**
   * Is the node a script tag.
   *
   * @param {HTMLElement} node The html node.
   */
  isScript: function isScript(node) {
    return node.tagName === 'SCRIPT';
  }
};
/* harmony default export */ var modules_insertScript = (insertScript);
;// CONCATENATED MODULE: ./src/frontend/js/addons/paging.js


/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
function pagingCreateParams(alm) {
  var listing = alm.listing,
    container_type = alm.container_type;
  alm.addons.paging = listing.dataset.paging === 'true';
  if (alm.addons.paging) {
    alm.addons.paging_init = true;
    alm.addons.paging_controls = listing.dataset.pagingControls === 'true';
    alm.addons.paging_show_at_most = listing.dataset.pagingShowAtMost ? parseInt(listing.dataset.pagingShowAtMost) : 6;
    alm.addons.paging_classes = listing.dataset.pagingClasses;
    alm.addons.paging_first_label = listing.dataset.pagingFirstLabel;
    alm.addons.paging_previous_label = listing.dataset.pagingPreviousLabel;
    alm.addons.paging_next_label = listing.dataset.pagingNextLabel;
    alm.addons.paging_last_label = listing.dataset.pagingLastLabel;
    alm.addons.paging_scroll = listing.dataset.pagingScroll ? listing.dataset.pagingScroll : false;
    alm.addons.paging_scrolltop = listing.dataset.pagingScrolltop ? parseInt(listing.dataset.pagingScrolltop) : 100;
    alm.addons.paging_container = container_type === 'table' ? listing : listing.querySelector('.alm-paging-content');
    alm.pause = alm.addons.preloaded ? true : alm.pause; // If preloaded, pause ALM.
  }

  return alm;
}

/**
 * Function dispatched after paging content has been loaded.
 *
 * @param {Object}  alm              The alm object.
 * @param {boolean} alm_is_filtering Is ALM filtering.
 * @param {boolean} init             Is first run.
 */
function pagingComplete(alm) {
  var alm_is_filtering = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var init = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var main = alm.main,
    AjaxLoadMore = alm.AjaxLoadMore,
    last_loaded = alm.last_loaded;
  main.classList.remove('alm-loading');
  AjaxLoadMore.triggerAddons(alm);
  if (init) {
    if (typeof almPagingComplete === 'function') {
      window.almPagingComplete();
    }
  } else {
    // Dispatch almOnPagingComplete callback when not alm.init.
    if (typeof almOnPagingComplete === 'function') {
      window.almOnPagingComplete(alm); // Callback: Paging Add-on Complete.
    }
  }

  if (alm_is_filtering && alm.addons.filters && typeof almFiltersAddonComplete === 'function') {
    window.almFiltersAddonComplete(main); // Callback: Filters Add-on Complete
  }

  if (typeof almComplete === 'function') {
    window.almComplete(alm); // Callback: ALM Complete
  }

  // Trigger <script /> tags in templates.
  modules_insertScript.init(last_loaded);
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/stripEmptyNodes.js


/**
 * Remove empty HTML nodes from array of nodes.
 * Filter out nodes by nodeName.
 *
 * @param {Array} nodes Array of HTML nodes
 * @return {Array} The filtered array of HTML nodes
 * @since 5.1.3
 */
var stripEmptyNodes = function stripEmptyNodes() {
  var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return (nodes === null || nodes === void 0 ? void 0 : nodes.length) && nodes.filter(function (node) {
    return EXCLUDED_NODES.indexOf(node.nodeName.toLowerCase()) === -1;
  });
};
/* harmony default export */ var functions_stripEmptyNodes = (stripEmptyNodes);
;// CONCATENATED MODULE: ./src/frontend/js/addons/seo.js
/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
function seoCreateParams(alm) {
  var _alm$listing;
  var listing = alm.listing;
  alm.addons.seo = listing.dataset.seo === 'true';
  if (alm.addons.seo) {
    alm.addons.seo_offset = listing.dataset.seoOffset || false;
    alm.addons.seo_permalink = listing.dataset.seoPermalink;
    alm.addons.seo_trailing_slash = listing.dataset.seoTrailingSlash === 'false' ? '' : '/';
    alm.addons.seo_leading_slash = listing.dataset.seoLeadingSlash === 'true' ? '/' : '';
    if (alm.addons.seo_offset === 'true') {
      alm.offset = alm.posts_per_page;
    }
  }
  alm.start_page = (alm === null || alm === void 0 || (_alm$listing = alm.listing) === null || _alm$listing === void 0 || (_alm$listing = _alm$listing.dataset) === null || _alm$listing === void 0 ? void 0 : _alm$listing.seoStartPage) || 0;
  if (alm.start_page) {
    alm.start_page = parseInt(alm.start_page);
    alm.addons.seo_scroll = listing.dataset.seoScroll;
    alm.addons.seo_scrolltop = listing.dataset.seoScrolltop;
    alm.addons.seo_controls = listing.dataset.seoControls;
    alm.paged = false;
    if (alm.start_page > 1) {
      alm.paged = true;
      if (alm.addons.paging) {
        // Paging add-on: Set current page value.
        alm.page = alm.start_page - 1;
      } else {
        // Set posts_per_page value to load all required posts.
        alm.posts_per_page = alm.start_page * alm.posts_per_page;
      }
    }
  } else {
    alm.start_page = 1;
  }
  return alm;
}

/**
 * Create data attributes for an SEO item.
 *
 * @param {Object}      alm        The ALM object.
 * @param {HTMLElement} element    The element HTML node.
 * @param {number}      pagenum    The current page number.
 * @param {boolean}     skipOffset Skip the SEO offset check.
 * @return {HTMLElement}           Modified HTML element.
 */
function addSEOAttributes(alm, element, pagenum) {
  var skipOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var addons = alm.addons,
    canonical_url = alm.canonical_url;
  var _alm_localize = alm_localize,
    _alm_localize$retain_ = _alm_localize.retain_querystring,
    retain_querystring = _alm_localize$retain_ === void 0 ? true : _alm_localize$retain_;
  var querystring = retain_querystring || alm.init ? window.location.search : '';
  pagenum = !skipOffset ? getSEOPageNum(addons === null || addons === void 0 ? void 0 : addons.seo_offset, pagenum) : pagenum;
  element.classList.add('alm-seo');
  element.dataset.page = pagenum;
  if (addons.seo_permalink === 'default') {
    // Default Permalinks
    if (pagenum > 1) {
      element.dataset.url = "".concat(canonical_url).concat(querystring, "&paged=").concat(pagenum);
    } else {
      element.dataset.url = "".concat(canonical_url).concat(querystring);
    }
  } else {
    // Pretty Permalinks
    if (pagenum > 1) {
      element.dataset.url = "".concat(canonical_url).concat(addons.seo_leading_slash, "page/").concat(pagenum).concat(addons.seo_trailing_slash).concat(querystring);
    } else {
      element.dataset.url = "".concat(canonical_url).concat(querystring);
    }
  }
  return element;
}

/**
 * Get the current page number.
 *
 * @param {string} seo_offset Is this an SEO offset.
 * @param {number} page       The page number,
 * @return {number}           The page number.
 */
function getSEOPageNum(seo_offset, page) {
  return seo_offset === 'true' ? parseInt(page) + 1 : parseInt(page);
}

/**
 * Create div to hold offset values for SEO.
 *
 * @param {Object} alm The ALM object.
 */
function createSEOOffset(alm) {
  var offsetDiv = document.createElement('div');
  // Add data attributes.
  offsetDiv = addSEOAttributes(alm, offsetDiv, 1, true);

  // Insert into ALM container.
  alm.main.insertBefore(offsetDiv, alm.listing);
}
;// CONCATENATED MODULE: ./src/frontend/js/addons/preloaded.js
function preloaded_toConsumableArray(arr) { return preloaded_arrayWithoutHoles(arr) || preloaded_iterableToArray(arr) || preloaded_unsupportedIterableToArray(arr) || preloaded_nonIterableSpread(); }
function preloaded_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function preloaded_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return preloaded_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return preloaded_arrayLikeToArray(o, minLen); }
function preloaded_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function preloaded_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return preloaded_arrayLikeToArray(arr); }
function preloaded_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }




/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
function preloadedCreateParams(alm) {
  var _listing$dataset;
  var listing = alm.listing,
    addons = alm.addons;
  alm.addons.preloaded = listing.dataset.preloaded === 'true';
  alm.addons.preloaded_amount = listing !== null && listing !== void 0 && (_listing$dataset = listing.dataset) !== null && _listing$dataset !== void 0 && _listing$dataset.preloadedAmount ? parseInt(listing.dataset.preloadedAmount) : alm.posts_per_page;
  if (!alm.addons.preloaded) {
    alm.addons.preloaded_amount = 0;
  }
  if (addons.preloaded) {
    if (alm !== null && alm !== void 0 && alm.localize) {
      // Disable ALM if total_posts is equal to or less than preloaded_amount.
      var _alm$localize$total_p = alm.localize.total_posts,
        total_posts = _alm$localize$total_p === void 0 ? 0 : _alm$localize$total_p;
      if (parseInt(total_posts) <= addons.preloaded_amount) {
        alm.addons.preloaded_total_posts = parseInt(total_posts);
        alm.disable_ajax = true;
      }
    }
  }
  return alm;
}

/**
 * Set parameters on HTML elements for preloaded results.
 *
 * @param {Object} alm The ALM object.
 * @since 7.0.0
 */
function setPreloadedParams(alm) {
  var addons = alm.addons,
    listing = alm.listing;
  if (addons.paging) {
    return; // Exit if paging.
  }

  // Parse preloaded data into array of HTML elements.
  var data = functions_stripEmptyNodes(preloaded_toConsumableArray(listing === null || listing === void 0 ? void 0 : listing.childNodes));

  // Get first element in the data array.
  var firstElement = data !== null && data !== void 0 && data.length && data[0] ? data[0] : false;
  if (firstElement) {
    if (addons !== null && addons !== void 0 && addons.seo) {
      addSEOAttributes(alm, firstElement, 1);
    }
    if (addons !== null && addons !== void 0 && addons.filters) {
      addFiltersAttributes(alm, firstElement, 1);
    }
  }
}
;// CONCATENATED MODULE: ./src/frontend/js/addons/query-loop.js
function query_loop_typeof(o) { "@babel/helpers - typeof"; return query_loop_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, query_loop_typeof(o); }
function query_loop_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ query_loop_regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == query_loop_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(query_loop_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function query_loop_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function query_loop_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { query_loop_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { query_loop_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }








/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object|null}    The modified object.
 */
function queryLoopCreateParams(alm) {
  var main = alm.main;
  var blockClassname = 'wp-block-query';

  // Get the parent container.
  var container = main.closest(".".concat(blockClassname));

  // If parent is not a .wp-block-query, return alm.
  if (!container) {
    return alm;
  }

  // Pluck the queryId from the config.
  var _getQueryLoopConfig = getQueryLoopConfig(container),
    _getQueryLoopConfig$q = _getQueryLoopConfig.queryId,
    queryId = _getQueryLoopConfig$q === void 0 ? false : _getQueryLoopConfig$q,
    _getQueryLoopConfig$p = _getQueryLoopConfig.paged,
    paged = _getQueryLoopConfig$p === void 0 ? 1 : _getQueryLoopConfig$p;
  if (!queryId) {
    console.warn('Ajax Load More: Unable to locate Query Loop ID.');
    return alm;
  }
  alm.addons.queryloop = true;
  alm.addons.queryloopId = queryId;
  alm.addons.queryloop_settings = {
    container: container,
    firstEl: container.querySelector('.wp-block-post'),
    classes: {
      container: ".".concat(container.className.replace(/ /g, '.')),
      listing: '.wp-block-post-template',
      element: '.wp-block-post'
    }
  };
  alm.page = parseInt(paged);
  alm.pause = 'true'; // Pause ALM by default.
  return alm;
}
/**
 * Init the Query Loop functionality.
 * @param {Object} alm The alm object.
 */
function queryLoopInit(alm) {
  var _alm$addons$queryloop = alm.addons.queryloop_settings,
    queryloop_settings = _alm$addons$queryloop === void 0 ? {} : _alm$addons$queryloop;
  var _queryloop_settings$c = queryloop_settings.container,
    container = _queryloop_settings$c === void 0 ? '' : _queryloop_settings$c,
    first = queryloop_settings.firstEl;
  var _getQueryLoopConfig2 = getQueryLoopConfig(container),
    _getQueryLoopConfig2$ = _getQueryLoopConfig2.paged,
    paged = _getQueryLoopConfig2$ === void 0 ? 1 : _getQueryLoopConfig2$,
    prev = _getQueryLoopConfig2.prev;

  // Create Load Previous button.
  if (container && paged > 1 && prev) {
    var _alm$prev_button_labe;
    createLoadPreviousButton(alm, container, paged - 1, prev, alm === null || alm === void 0 || (_alm$prev_button_labe = alm.prev_button_labels) === null || _alm$prev_button_labe === void 0 ? void 0 : _alm$prev_button_labe["default"]);
  }

  // Config first element in list.
  if (first) {
    first.classList.add('alm-query-loop');
    first.dataset.url = window.location.href;
    first.dataset.page = alm.page;
    first.dataset.title = document.querySelector('title').innerHTML;
  }

  // Set button URLs.
  setButtonURLs(alm);

  // Attach scroll events.
  if (alm.urls) {
    window.addEventListener('touchstart', onScroll);
    window.addEventListener('scroll', onScroll);
  }
}

/**
 * Set the button URLs.
 *
 * @param {Object}      alm     The alm object.
 * @param {HTMLElement} element The element to search.
 */
function setButtonURLs(alm) {
  var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var rel = alm.rel,
    button = alm.button,
    buttonPrev = alm.buttonPrev,
    page = alm.page,
    _alm$pagePrev = alm.pagePrev,
    pagePrev = _alm$pagePrev === void 0 ? 1 : _alm$pagePrev;
  var _getQueryLoopConfig3 = getQueryLoopConfig(element),
    _getQueryLoopConfig3$ = _getQueryLoopConfig3.next,
    next = _getQueryLoopConfig3$ === void 0 ? '' : _getQueryLoopConfig3$,
    _getQueryLoopConfig3$2 = _getQueryLoopConfig3.prev,
    prev = _getQueryLoopConfig3$2 === void 0 ? '' : _getQueryLoopConfig3$2;

  // Set button state & URL.
  if (rel === 'prev' && buttonPrev) {
    if (prev) {
      setButtonAtts(buttonPrev, pagePrev - 1, prev);
    } else {
      alm.AjaxLoadMore.triggerDonePrev();
    }
  } else {
    if (next) {
      setButtonAtts(button, page + 1, next);
    } else {
      alm.AjaxLoadMore.triggerDone();
    }
  }
}

/**
 * Get the content, title and results text from the Ajax response.
 *
 * @param {Object} alm        The alm object.
 * @param {string} url        The request URL.
 * @param {Object} response   Query response.
 * @param {string} cache_slug The cache slug.
 * @return {Object}           Results data.
 */
function queryLoopGetContent(alm, url, response, cache_slug) {
  var _queryloop_settings$c2, _queryloop_settings$c3, _queryloop_settings$c4, _queryloop_settings$c5;
  var data = API_DATA_SHAPE;
  var status = response.status,
    resData = response.data;
  if (status !== 200 || !resData) {
    return data; // Bail early if response is not OK or empty.
  }

  var addons = alm.addons,
    canonical_url = alm.canonical_url;
  var _addons$queryloop_set = addons.queryloop_settings,
    queryloop_settings = _addons$queryloop_set === void 0 ? {} : _addons$queryloop_set;

  // Create temp div to hold response data.
  var content = document.createElement('div');
  content.innerHTML = resData;

  // Get container.
  var container = content === null || content === void 0 ? void 0 : content.querySelector("".concat(queryloop_settings === null || queryloop_settings === void 0 || (_queryloop_settings$c2 = queryloop_settings.classes) === null || _queryloop_settings$c2 === void 0 ? void 0 : _queryloop_settings$c2.container, " ").concat(queryloop_settings === null || queryloop_settings === void 0 || (_queryloop_settings$c3 = queryloop_settings.classes) === null || _queryloop_settings$c3 === void 0 ? void 0 : _queryloop_settings$c3.listing));
  if (!container) {
    console.warn('Ajax Load More: Unable to locate Query Loop container.');
    return data;
  }

  // Get the first item and append data attributes.
  var item = container ? container.querySelector(queryloop_settings === null || queryloop_settings === void 0 || (_queryloop_settings$c4 = queryloop_settings.classes) === null || _queryloop_settings$c4 === void 0 ? void 0 : _queryloop_settings$c4.element) : null;
  if (item) {
    // Get current page from config settings.
    var _getQueryLoopConfig4 = getQueryLoopConfig(content),
      _getQueryLoopConfig4$ = _getQueryLoopConfig4.paged,
      paged = _getQueryLoopConfig4$ === void 0 ? 1 : _getQueryLoopConfig4$;
    item.classList.add('alm-query-loop');
    item.dataset.url = paged > 1 ? url : canonical_url;
    item.dataset.page = paged;
    item.dataset.title = content.querySelector('title').innerHTML;
  }

  // Count the number of returned items.
  var items = container.querySelectorAll(queryloop_settings === null || queryloop_settings === void 0 || (_queryloop_settings$c5 = queryloop_settings.classes) === null || _queryloop_settings$c5 === void 0 ? void 0 : _queryloop_settings$c5.element);
  if (items) {
    // Set the html to the elementor container data.
    data.html = container ? container.innerHTML : '';
    data.meta.postcount = items.length;
    data.meta.totalposts = items.length;

    // Create cache file.
    createCache(alm, data, cache_slug);
  }

  // Set the button URLs.
  alm.page = alm.page + 1;
  setButtonURLs(alm, content);
  return data;
}

/**
 * Core ALM Query Loop loader.
 *
 * @param {HTMLElement} content The HTML data.
 * @param {Object}      alm     The alm object.
 */
function queryLoop(content, alm) {
  if (!content || !alm) {
    alm.AjaxLoadMore.triggerDone();
    return false;
  }
  return new Promise(function (resolve) {
    var _queryloop_settings$c6, _queryloop_settings$c7;
    var addons = alm.addons;
    var _addons$queryloop_set2 = addons.queryloop_settings,
      queryloop_settings = _addons$queryloop_set2 === void 0 ? {} : _addons$queryloop_set2;

    // Get post listing container.
    var container = queryloop_settings === null || queryloop_settings === void 0 || (_queryloop_settings$c6 = queryloop_settings.container) === null || _queryloop_settings$c6 === void 0 ? void 0 : _queryloop_settings$c6.querySelector("".concat(queryloop_settings.classes.listing));

    // Get all individual items in Ajax response.
    var items = content.querySelectorAll("".concat(queryloop_settings === null || queryloop_settings === void 0 || (_queryloop_settings$c7 = queryloop_settings.classes) === null || _queryloop_settings$c7 === void 0 ? void 0 : _queryloop_settings$c7.element));
    if (container && items) {
      var queryloopItems = Array.prototype.slice.call(items); // Convert NodeList to Array

      // Trigger almqueryLoopLoaded callback.
      if (typeof almqueryLoopLoaded === 'function') {
        window.almqueryLoopLoaded(queryloopItems);
      }

      // Load the items.
      query_loop_asyncToGenerator( /*#__PURE__*/query_loop_regeneratorRuntime().mark(function _callee() {
        return query_loop_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return loadItems(container, queryloopItems, alm);
            case 2:
              resolve(true);
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))()["catch"](function (e) {
        console.warn(e, 'There was an error with Query Loop'); // eslint-disable-line no-console
      });
    } else {
      resolve(false);
    }
  });
}

/**
 * Query Loop loaded and dispatch actions.
 *
 * @param {Object} alm The alm object.
 */
function queryLoopLoaded(alm) {
  var AjaxLoadMore = alm.AjaxLoadMore;
  lazyImages(alm); // Lazy load images if necessary.

  if (typeof almComplete === 'function' && alm.transition !== 'masonry') {
    window.almComplete(alm); // Trigger almComplete.
  }

  AjaxLoadMore.transitionEnd(); // End transitions.
  dispatchScrollEvent();
}

/**
 * Get the `<pre/>` config element.
 *
 * @param {HTMLElement} element The element to search.
 * @return {Object|void}        The config object.
 */
function getQueryLoopConfig(element) {
  var raw = element === null || element === void 0 ? void 0 : element.querySelector('pre[data-rel="ajax-load-more"]');
  if (!raw) {
    return {};
  }
  return JSON.parse(raw === null || raw === void 0 ? void 0 : raw.innerHTML);
}

/**
 * Scroll and touchstart events.
 *
 * @since 2.0
 */
function onScroll() {
  var scrollTop = window.scrollY;
  var disabled = false;
  if (!disabled) {
    var _posts$;
    // Get all elements.
    var posts = document.querySelectorAll('.alm-query-loop');
    if (!posts) {
      return;
    }
    var first = (_posts$ = posts[0]) === null || _posts$ === void 0 || (_posts$ = _posts$.dataset) === null || _posts$ === void 0 ? void 0 : _posts$.url;

    // Get container scroll position
    var fromTop = scrollTop;

    // Loop all posts
    var current = Array.prototype.filter.call(posts, function (n) {
      var divOffset = ajaxloadmore.getOffset(n);
      if (divOffset.top < fromTop) {
        return n;
      }
    });

    // Get the data attributes of the current element.
    var currentPost = current[current.length - 1];
    var title = currentPost ? currentPost.dataset.title : '';
    var permalink = currentPost ? currentPost.dataset.url : '';
    var url = permalink || first;
    if (window.location.href !== url) {
      // Set URL if current post doesn't match the browser URL.
      setURL(title, url);
    }
  }
}

/**
 * Set the URL in the browser.
 *
 * @param {string} title     Page title.
 * @param {string} permalink The permalink.
 */
function setURL(title, permalink) {
  var state = {
    permalink: permalink,
    title: title
  };
  history.replaceState(state, title, permalink);
}
;// CONCATENATED MODULE: ./src/frontend/js/addons/singleposts.js



/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
function singlepostsCreateParams(alm) {
  var _listing$dataset;
  var listing = alm.listing;
  alm.addons.single_post = (listing === null || listing === void 0 || (_listing$dataset = listing.dataset) === null || _listing$dataset === void 0 ? void 0 : _listing$dataset.singlePost) === 'true';
  if (alm.addons.single_post) {
    alm.addons.single_post_id = listing.dataset.singlePostId;
    alm.addons.single_post_query = listing.dataset.singlePostQuery;
    alm.addons.single_post_order = listing.dataset.singlePostOrder === undefined ? 'previous' : listing.dataset.singlePostOrder;
    alm.addons.single_post_init_id = listing.dataset.singlePostId;
    alm.addons.single_post_taxonomy = listing.dataset.singlePostTaxonomy === undefined ? '' : listing.dataset.singlePostTaxonomy;
    alm.addons.single_post_excluded_terms = listing.dataset.singlePostExcludedTerms === undefined ? '' : listing.dataset.singlePostExcludedTerms;
    alm.addons.single_post_progress_bar = listing.dataset.singlePostProgressBar === undefined ? '' : listing.dataset.singlePostProgressBar;
    alm.addons.single_post_target = listing.dataset.singlePostTarget === undefined ? '' : listing.dataset.singlePostTarget;
    alm.addons.single_post_preview = listing.dataset.singlePostPreview === undefined ? false : true;

    // Post Preview. Does this even work?
    if (alm.addons.single_post_preview) {
      var singlePostPreviewData = listing.dataset.singlePostPreview.split(':');
      alm.addons.single_post_preview_data = {
        button_label: singlePostPreviewData[0] ? singlePostPreviewData[0] : 'Continue Reading',
        height: singlePostPreviewData[1] ? singlePostPreviewData[1] : 500,
        element: singlePostPreviewData[2] ? singlePostPreviewData[2] : 'default',
        className: 'alm-single-post--preview'
      };
    }
    if (alm.addons.single_post_id === undefined) {
      alm.addons.single_post_id = '';
      alm.addons.single_post_init_id = '';
    }

    // Set default fallbacks.
    alm.addons.single_post_permalink = '';
    alm.addons.single_post_title = '';
    alm.addons.single_post_slug = '';
    alm.addons.single_post_cache = false;
    alm.addons.single_post_title_template = listing.dataset.singlePostTitleTemplate;
    alm.addons.single_post_siteTitle = listing.dataset.singlePostSiteTitle;
    alm.addons.single_post_siteTagline = listing.dataset.singlePostSiteTagline;
    alm.addons.single_post_scroll = listing.dataset.singlePostScroll;
    alm.addons.single_post_scroll_speed = listing.dataset.singlePostScrollSpeed;
    alm.addons.single_post_scroll_top = listing.dataset.singlePostScrolltop;
    alm.addons.single_post_controls = listing.dataset.singlePostControls;
  }
  return alm;
}

/**
 * Create the HTML for loading Single Posts.
 *
 * @param {Object} alm        The alm object.
 * @param {Object} response   Query response.
 * @param {string} cache_slug The cache slug.
 * @return {Object}           Results data.
 * @since 5.1.8.1
 */
function singlepostsHTML(alm, response, cache_slug) {
  var _window;
  var data = API_DATA_SHAPE;
  var status = response.status,
    resData = response.data;
  var _alm$addons = alm.addons,
    single_post_target = _alm$addons.single_post_target,
    single_post_id = _alm$addons.single_post_id; // Get target elements.

  if (status !== 200 || !resData || !single_post_target) {
    return data; // Bail early if response is not OK or empty.
  }

  // Create temp div to hold response data.
  var div = document.createElement('div');
  div.innerHTML = resData;

  // Get target element.
  var html = div.querySelector(single_post_target);
  if (!html) {
    console.warn("Ajax Load More: Unable to find ".concat(single_post_target, " element."));
    return data;
  }

  // Get any custom target elements.
  if ((_window = window) !== null && _window !== void 0 && _window.almSinglePostsCustomElements) {
    var _window2;
    var customElements = singlepostsGetCustomElements(div, (_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.almSinglePostsCustomElements, single_post_id);
    if (customElements) {
      // Get first element in HTML.
      var target = html.querySelector('article, section, div');
      if (target) {
        target.appendChild(customElements);
      }
    }
  }
  data.html = html.innerHTML;
  data.meta = {
    postcount: 1,
    totalposts: 1
  };
  createCache(alm, data, cache_slug); // Create cache file.
  return data;
}

/**
 * Find nested Next Page instance and prepend first element to the returned HTML.
 *
 * @param {Element} html The wrapper element.
 * @return {Element}     The modified element.
 */
function getNestedNextPageElement(html) {
  var nextpageElement = html.querySelector('.ajax-load-more-wrap .alm-nextpage');
  if (!nextpageElement) {
    return html;
  }

  // Clone the nextpage element and clear the contents.
  var clone = nextpageElement.cloneNode(true);
  clone.innerHTML = '';

  // Insert the clone before the first child.
  html.insertBefore(clone, html.querySelector(':first-child'));
  return html;
}

/**
 * Collect custom target elements and append them to the returned HTML.
 * This function is useful to get elements from outside the ALM target and bring them into the returned HTML.
 * Useful for when CSS or JS may be loaded in the <head/> and we need it brought into the HTML for Single Posts.
 *
 * e.g. window.almSinglePostsCustomElements = ['#woocommerce-inline-inline-css', '#wc-block-style-css'];
 *
 * @param {HTMLElement}   content        The HTML element.
 * @param {Array}         customElements The elements to search for in content.
 * @param {string|number} id             The Post ID.
 * @return {HTMLElement}                 The HTML elements.
 */
function singlepostsGetCustomElements() {
  var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var customElements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var id = arguments.length > 2 ? arguments[2] : undefined;
  if (!content || !customElements) {
    return container; // Exit if empty.
  }

  // Create container element if if doesn't exist.
  var container = document.createElement('div');
  container.classList.add('alm-custom-elements');
  container.dataset.id = id;

  // Convert customElements to an Array.
  customElements = !Array.isArray(customElements) ? [customElements] : customElements;

  // Loop Array to extract elements and append to container.
  for (var i = 0; i < customElements.length; i++) {
    var element = content.querySelector(customElements[i]);
    if (element) {
      element.classList.add('alm-custom-element');
      container.appendChild(element);
    }
  }
  return container;
}

/**
 * Create data attributes for a Single Post item.
 *
 * @param {Object}  alm     The ALM object.
 * @param {Element} element The elements HTML element to add data params.
 * @return {Array}          Modified HTML element.
 */
function addSinglePostsAttributes(alm, element) {
  if (!element) {
    return [];
  }
  var page = alm.page,
    addons = alm.addons;
  var _alm_localize = alm_localize,
    _alm_localize$retain_ = _alm_localize.retain_querystring,
    retain_querystring = _alm_localize$retain_ === void 0 ? true : _alm_localize$retain_;
  var querystring = retain_querystring ? window.location.search : '';
  element.setAttribute('class', "alm-single-post post-".concat(addons.single_post_id));
  element.dataset.id = addons.single_post_id;
  element.dataset.url = "".concat(addons.single_post_permalink).concat(querystring);
  element.dataset.page = addons.single_post_target ? parseInt(page) + 1 : page;
  element.dataset.title = addons.single_post_title;
  return element;
}
;// CONCATENATED MODULE: ./src/frontend/js/addons/woocommerce.js
function woocommerce_typeof(o) { "@babel/helpers - typeof"; return woocommerce_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, woocommerce_typeof(o); }
function woocommerce_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ woocommerce_regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == woocommerce_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(woocommerce_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function woocommerce_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function woocommerce_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { woocommerce_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { woocommerce_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }










/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
function wooCreateParams(alm) {
  var _listing$dataset;
  var listing = alm.listing,
    addons = alm.addons;
  alm.addons.woocommerce = (listing === null || listing === void 0 || (_listing$dataset = listing.dataset) === null || _listing$dataset === void 0 ? void 0 : _listing$dataset.woo) === 'true';
  if (alm.addons.woocommerce && listing.dataset.wooSettings) {
    var _addons$woocommerce_s;
    alm.addons.woocommerce_settings = JSON.parse(listing.dataset.wooSettings);
    alm.addons.woocommerce_settings.results_text = document.querySelectorAll(addons === null || addons === void 0 || (_addons$woocommerce_s = addons.woocommerce_settings) === null || _addons$woocommerce_s === void 0 ? void 0 : _addons$woocommerce_s.results); // Add Results Text
    alm.page = parseInt(alm.page) + parseInt(addons.woocommerce_settings.paged);
  }
  return alm;
}

/**
 * Set up instance of ALM WooCommerce
 *
 * @param {Object} alm ALM object.
 * @since 5.3.0
 */
function wooInit(alm) {
  if (!alm || !alm.addons.woocommerce) {
    return false;
  }
  var container = document.querySelector(alm.addons.woocommerce_settings.container); // Get `ul.products`
  if (!container) {
    console.warn('ALM WooCommerce: Unable to locate container element. Get more information -> https://connekthq.com/plugins/ajax-load-more/docs/add-ons/woocommerce/#alm_woocommerce_container');
    return;
  }
  alm.button.dataset.page = alm.addons.woocommerce_settings.paged + 1; // Page

  // Get upcoming URL.
  var nextPage = alm.addons.woocommerce_settings.paged_urls[alm.addons.woocommerce_settings.paged];
  if (nextPage) {
    alm.button.dataset.url = nextPage;
  } else {
    alm.button.dataset.url = '';
  }
  var count = countContainers(alm.addons.woocommerce_settings.container);
  var page = alm.addons.woocommerce_settings.paged;
  if (count > 1) {
    // Display warning if multiple containers were found.
    console.warn('ALM WooCommerce: Multiple containers with the same classname or ID found. The WooCommerce add-on requires a single container to be defined. Get more information -> https://connekthq.com/plugins/ajax-load-more/docs/add-ons/woocommerce/');
  }

  // Set attributes on containers.
  setContentContainersParams(container, alm.listing);

  // Set data attributes on first item.
  var item = container.querySelector(alm.addons.woocommerce_settings.products); // Get first `.product` item
  if (item) {
    item.classList.add('alm-woocommerce');
    item.dataset.url = alm.addons.woocommerce_settings.paged_urls[alm.addons.woocommerce_settings.paged - 1];
    item.dataset.page = alm.page;
    item.dataset.pageTitle = document.title;
  } else {
    console.warn('ALM WooCommerce: Unable to locate products. Get more information -> https://connekthq.com/plugins/ajax-load-more/docs/add-ons/woocommerce/#alm_woocommerce_products');
  }

  // Paged URL: Create previous button.
  if (page > 1 && alm.addons.woocommerce_settings.settings.previous_products) {
    var prevURL = alm.addons.woocommerce_settings.paged_urls[page - 2];
    var label = alm.addons.woocommerce_settings.settings.previous_products;
    createLoadPreviousButton(alm, container, page - 1, prevURL, label);
  }
}

/**
 * Core ALM WooCommerce product loader
 *
 * @param {Element} content WooCommerce content container.
 * @param {Object}  alm     ALM object.
 * @since 5.3.0
 */
function woocommerce(content, alm) {
  if (!content || !alm) {
    return false;
  }
  return new Promise(function (resolve) {
    var _alm$addons$woocommer = alm.addons.woocommerce_settings,
      woocommerce_settings = _alm$addons$woocommer === void 0 ? {} : _alm$addons$woocommer;
    var _woocommerce_settings = woocommerce_settings.settings,
      settings = _woocommerce_settings === void 0 ? {} : _woocommerce_settings;
    var container = document.querySelector(woocommerce_settings.container); // Get `ul.products`
    var products = content.querySelectorAll(woocommerce_settings.products); // Get all `.products`
    var waitForImages = settings && settings.images_loaded === 'true' ? true : false;
    if (container && products) {
      var wooProducts = Array.prototype.slice.call(products); // Convert NodeList to Array.

      // Load the items.
      woocommerce_asyncToGenerator( /*#__PURE__*/woocommerce_regeneratorRuntime().mark(function _callee() {
        return woocommerce_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return loadItems(container, wooProducts, alm, waitForImages);
            case 2:
              resolve(true);
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))()["catch"](function (e) {
        console.warn(e, 'There was an error with WooCommerce'); // eslint-disable-line no-console
      });

      // Trigger almWooCommerceLoaded callback.
      if (typeof almWooCommerceLoaded === 'function') {
        window.almWooCommerceLoaded(products);
      }
    }
  });
}

/**
 * Get the content, title and results from the Ajax request.
 *
 * @param {Object} alm        The alm object.
 * @param {string} url        The request URL.
 * @param {Object} response   Query response.
 * @param {string} cache_slug The cache slug.
 * @return {Object}           Results data.
 * @since 5.3.0
 */
function wooGetContent(alm, url, response, cache_slug) {
  var data = API_DATA_SHAPE;
  var status = response.status,
    resData = response.data;
  if (status !== 200 || !resData) {
    return data; // Bail early if response is not OK or empty.
  }

  var addons = alm.addons,
    pagePrev = alm.pagePrev,
    _alm$rel = alm.rel,
    rel = _alm$rel === void 0 ? 'next' : _alm$rel,
    page = alm.page,
    localize = alm.localize;
  var total_posts = localize.total_posts;
  var _addons$woocommerce_s2 = addons.woocommerce_settings,
    woocommerce_settings = _addons$woocommerce_s2 === void 0 ? {} : _addons$woocommerce_s2;

  // Get the page number.
  var currentPage = rel === 'prev' ? pagePrev : page + 1;

  // Create temp div to hold response data.
  var content = document.createElement('div');
  content.innerHTML = resData;

  // Get Page Title
  var title = content.querySelector('title').innerHTML;
  data.pageTitle = title;

  // Get WooCommerce products container.
  var container = content.querySelector(woocommerce_settings.container);
  if (!container) {
    console.warn("Ajax Load More WooCommerce: Unable to find WooCommerce ".concat(woocommerce_settings.container, " element."));
    return data;
  }

  // Get the first item and append data attributes.
  var item = container ? container.querySelector(woocommerce_settings.products) : null;
  if (item) {
    item.classList.add('alm-woocommerce');
    item.dataset.url = url;
    item.dataset.page = currentPage;
    item.dataset.pageTitle = title;
  }

  // Count the number of returned items.
  var items = container.querySelectorAll(woocommerce_settings.products);
  if (items) {
    // Set the html to the elementor container data.
    data.html = container ? container.innerHTML : '';
    data.meta.postcount = items.length;
    data.meta.totalposts = total_posts;
    createCache(alm, data, cache_slug); // Create cache file.
  }

  // Results Text
  almWooCommerceResultsText(content, alm);
  return data;
}

/**
 * Handle WooCommerce loaded functionality and dispatch actions.
 *
 * @param {Object} alm ALM object.
 * @since 5.5.0
 */
function woocommerceLoaded(alm) {
  var addons = alm.addons;
  var nextPageNum = alm.page + 2;
  var nextPage = addons.woocommerce_settings.paged_urls[nextPageNum - 1]; // Get URL.

  // Set button state & URL.
  if (alm.rel === 'prev' && alm.buttonPrev) {
    var prevPage = addons.woocommerce_settings.paged_urls[alm.pagePrev - 2];
    setButtonAtts(alm.buttonPrev, parseInt(alm.pagePrev) - 1, prevPage);
  } else {
    setButtonAtts(alm.button, nextPageNum, nextPage);
  }

  // Lazy load images if necessary.
  lazyImages(alm);

  // Trigger almComplete.
  if (typeof almComplete === 'function' && alm.transition !== 'masonry') {
    window.almComplete(alm);
  }

  // End transitions.
  alm.AjaxLoadMore.transitionEnd();

  // ALM Done.
  if (alm.rel === 'prev' && alm.pagePrev <= 1) {
    alm.AjaxLoadMore.triggerDonePrev();
  }
  if (alm.rel === 'next' && nextPageNum > parseInt(alm.addons.woocommerce_settings.pages)) {
    alm.AjaxLoadMore.triggerDone();
  }
  dispatchScrollEvent();
}

/**
 * Reset a WooCommerce Instance by hitting the updated site URL.
 *
 * @since 5.3.8
 */
function wooReset() {
  return new Promise(function (resolve) {
    var url = window.location;
    lib_axios.get(url).then(function (response) {
      if (response.status === 200 && response.data) {
        var div = document.createElement('div');
        div.innerHTML = response.data; // Add data to div

        var alm = div.querySelector('.ajax-load-more-wrap .alm-listing[data-woo="true"]'); // Get ALM instance
        var settings = alm ? alm.dataset.wooSettings : ''; // Get settings data
        resolve(settings);
      } else {
        resolve(false);
      }
    })["catch"](function () {
      resolve(false);
    });
  });
}

/**
 * Set results text for WooCommerce Add-on.
 *
 * @param {Element} target The target HTML element.
 * @param {Object}  alm    ALM object.
 * @since 5.3
 */
function almWooCommerceResultsText() {
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var alm = arguments.length > 1 ? arguments[1] : undefined;
  if (target && alm && alm.addons.woocommerce_settings.results_text) {
    var currentResults = target.querySelector(alm.addons.woocommerce_settings.results);
    if (alm.addons.woocommerce_settings.results_text) {
      //let link = alm.addons.woocommerce_settings.settings.previous_page_link;
      //let label = alm.addons.woocommerce_settings.settings.previous_page_label;
      //let sep = alm.addons.woocommerce_settings.settings.previous_page_sep;
      alm.addons.woocommerce_settings.results_text.forEach(function (element) {
        element.innerHTML = currentResults.innerHTML;
        // if (link && label) {
        // 	element.innerHTML = returnButton(currentResults, link, label, sep);
        // } else {
        // 	element.innerHTML = currentResults.innerHTML;
        // }
      });
    }
  }
}

/**
 * Initiate Results text.
 *
 * @param {Object} alm ALM object.
 * @since 5.3
 * @deprecated 5.5
 */
function almWooCommerceResultsTextInit(alm) {
  if (alm && alm.addons.woocommerce_settings.results_text) {
    var results = document.querySelectorAll(alm.addons.woocommerce_settings.results);
    if (results.length < 1) {
      return false;
    }
    var link = alm.addons.woocommerce_settings.settings.previous_page_link;
    var label = alm.addons.woocommerce_settings.settings.previous_page_label;
    var sep = alm.addons.woocommerce_settings.settings.previous_page_sep;
    // Loop all result text elements
    results.forEach(function (element) {
      if (link && label) {
        element.innerHTML = returnButton(element, link, label, sep);
      }
    });
  }
}

/**
 * Create button text for returning to the first page
 *
 * @param {Element} text      The button text.
 * @param {string}  link      Link URL.
 * @param {string}  label     Button label.
 * @param {string}  seperator HTML separator.
 */
function returnButton(text, link, label, seperator) {
  var button = " ".concat(seperator, " <a href=\"").concat(link, "\">").concat(label, "</a>");
  return text.innerHTML + button;
}

/**
 * Get total count of WooCommerce containers.
 *
 * @param {string} container The container class.
 * @return {number}          The total number of containers.
 */
function countContainers(container) {
  if (!container) {
    return 0;
  }
  var containers = document.querySelectorAll(container); // Get all containers.
  if (!containers) {
    return 0;
  }
  return containers.length;
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/displayResults.js



var displayResults_imagesLoaded = __webpack_require__(564);

/**
 * Append and display Ajax results to the ALM container.
 *
 * @param {Object} alm   The ALM object.
 * @param {Array}  nodes The HTML nodes to append.
 * @return {Promise}     The Promise object.
 */
function displayResults(alm, nodes) {
  var container = alm.listing,
    transition = alm.transition,
    speed = alm.speed,
    images_loaded = alm.images_loaded;
  return new Promise(function (resolve) {
    if (!container || !nodes) {
      resolve(true);
      return;
    }
    var useTransition = transition === 'fade' ? true : false;

    // Add each node to the alm listing container.
    nodes.forEach(function (node) {
      var nodeName = node.nodeName.toLowerCase();
      if (useTransition || images_loaded) {
        node.style.opacity = 0;
        if (useTransition) {
          node.style.transition = "all ".concat(speed, "ms ease");
        }
      }

      /**
       * Do not append elements that are not actual element nodes (i.e. #text node).
       * Add item if not in exclude array.
       */
      if (EXCLUDED_NODES.indexOf(nodeName) === -1) {
        container.appendChild(node);
      }
    });

    // Run srcSet polyfill.
    srcsetPolyfill(container, alm.ua);

    // Lazy load images.
    lazyImages(alm);

    // Display the results.
    if (images_loaded) {
      displayResults_imagesLoaded(container, function () {
        display(alm, nodes, useTransition);
      });
    } else {
      display(alm, nodes, useTransition);
    }
    resolve(true);
  });
}

/**
 * Append and display Ajax results to the Paging container.
 *
 * @param {Object} alm   The ALM object.
 * @param {Array}  nodes The HTML nodes to append.
 * @return {Promise}     The Promise object.
 */
function displayPagingResults(alm, nodes) {
  var addons = alm.addons;
  var container = addons.paging_container;
  return new Promise(function (resolve) {
    if (!container || !nodes) {
      resolve(true);
      return;
    }

    // Clear contents of Paging container.
    container.style.opacity = 0;
    container.innerHTML = '';

    // Add each node to the paging container.
    nodes.forEach(function (node) {
      var nodeName = node.nodeName.toLowerCase();
      /**
       * Do not append elements that are not actual element nodes (i.e. #text node).
       * Add item if not in exclude array.
       */
      if (EXCLUDED_NODES.indexOf(nodeName) === -1) {
        container.appendChild(node);
      }
    });

    // Run srcSet polyfill.
    srcsetPolyfill(container, alm.ua);

    // Lazy load images.
    lazyImages(alm);
    resolve(true);
  });
}

/**
 * Display the loaded results via CSS transition.
 *
 * @param {Object}  alm           The ALM object.
 * @param {Array}   nodes         The HTML nodes to append.
 * @param {boolean} useTransition Use CSS transition.
 */
function display(alm, nodes) {
  var useTransition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var delay = alm.transition_delay,
    images_loaded = alm.images_loaded;
  var offset = useTransition ? parseInt(delay) : 0; // Delay offset timing.

  if (nodes) {
    setTimeout(function () {
      if (useTransition || images_loaded) {
        nodes.forEach(function (node, index) {
          setTimeout(function () {
            node.style.opacity = 1;
          }, index * offset);
        });
      }
      alm.AjaxLoadMore.transitionEnd();
    }, 50);
  }
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/formatHTML.js
function formatHTML_toConsumableArray(arr) { return formatHTML_arrayWithoutHoles(arr) || formatHTML_iterableToArray(arr) || formatHTML_unsupportedIterableToArray(arr) || formatHTML_nonIterableSpread(); }
function formatHTML_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function formatHTML_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return formatHTML_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return formatHTML_arrayLikeToArray(o, minLen); }
function formatHTML_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function formatHTML_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return formatHTML_arrayLikeToArray(arr); }
function formatHTML_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }





/**
 * Create data attributes for Single Posts, SEO and Filter paged results.
 *
 * @param {Object} alm      The ALM object.
 * @param {Array}  elements The element HTML nodes.
 * @return {Array}          The modified elements.
 * @since 7.0.0
 */
function formatHTML(alm, elements) {
  var _elements;
  if (!((_elements = elements) !== null && _elements !== void 0 && _elements.length)) {
    return [];
  }
  var addons = alm.addons,
    page = alm.page,
    posts_per_page = alm.posts_per_page,
    init = alm.init,
    start_page = alm.start_page,
    container_type = alm.container_type;

  // Single Posts.
  if (addons !== null && addons !== void 0 && addons.single_post) {
    var singleWrap = document.createElement('div');
    singleWrap.innerHTML = alm.html;
    singleWrap = addSinglePostsAttributes(alm, singleWrap);
    singleWrap = getNestedNextPageElement(singleWrap);

    // Single Post Preview.
    if (addons !== null && addons !== void 0 && addons.single_post_preview && addons !== null && addons !== void 0 && addons.single_post_preview_data && typeof almSinglePostCreatePreview === 'function') {
      var singlePreview = almSinglePostCreatePreview(singleWrap, addons.single_post_id, addons.single_post_preview_data);
      if (singlePreview) {
        singleWrap.replaceChildren(singlePreview);
      }
    }
    alm.last_loaded = [singleWrap];
    return [singleWrap];
  }

  // Exit if not SEO or Filters.
  if (!(addons !== null && addons !== void 0 && addons.seo) && !(addons !== null && addons !== void 0 && addons.filters)) {
    return elements;
  }
  var current = parseInt(page) + 1;
  current = addons !== null && addons !== void 0 && addons.preloaded ? current + 1 : current;

  // If init and SEO or Filter start_page, set pagenum to 1.
  if (init && (parseInt(start_page) > 1 || (addons === null || addons === void 0 ? void 0 : addons.filters_startpage) > 1)) {
    current = 1;
  }

  // Call to Action add-on: Add 1 if CTA is true.
  var per_page = addons !== null && addons !== void 0 && addons.cta ? parseInt(posts_per_page) + 1 : parseInt(posts_per_page);

  // If table, format the return data.
  if (container_type === 'table') {
    elements = formatTable(elements);
  }

  /**
   * Split elements array into individual pages.
   */
  var pages = [];
  for (var i = 0; i < ((_elements2 = elements) === null || _elements2 === void 0 ? void 0 : _elements2.length); i += per_page) {
    var _elements2;
    pages.push(elements.slice(i, per_page + i));
  }

  /**
   * Loop pages and modify first element in return data.
   */
  if (pages) {
    for (var _i = 0; _i < pages.length; _i++) {
      var index = _i > 0 ? _i * per_page : 0;
      if (elements[index]) {
        if (addons !== null && addons !== void 0 && addons.seo) {
          elements[index] = addSEOAttributes(alm, elements[index], _i + current);
        }
        if (addons !== null && addons !== void 0 && addons.filters) {
          elements[index] = addFiltersAttributes(alm, elements[index], _i + current);
        }
      }
    }
  }
  return elements;
}

/**
 * Format return table data.
 *
 * @param {Array} elements The element HTML nodes.
 * @return {Array}         The modified elements.
 */
function formatTable() {
  var _elements3;
  var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  if (!elements) {
    return [];
  }
  var tableChildren = (_elements3 = elements) !== null && _elements3 !== void 0 && _elements3.length ? elements[0].childNodes : [];
  if (tableChildren) {
    elements = functions_stripEmptyNodes(formatHTML_toConsumableArray(tableChildren));
  }
  return elements;
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/getScrollPercentage.js
/**
 * Get the scroll distance in pixels from a percentage.
 *
 * @param {Object} alm The Ajax Load More object.
 * @return {number}    The new distance.
 * @since 5.2
 */
function getScrollPercentage(alm) {
  if (!alm) {
    return false;
  }
  var is_negative = alm.scroll_distance_orig.toString().indexOf('-') === -1 ? false : true; // Is this a negative number
  var raw_distance = alm.scroll_distance_orig.toString().replace('-', '').replace('%', ''); // Remove - and perc
  var wh = alm.window.innerHeight; // window height
  var height = Math.floor(wh / 100 * parseInt(raw_distance)); // Do math to get distance
  var newdistance = is_negative ? "-".concat(height) : height; // Set the distance

  return parseInt(newdistance);
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/getTotals.js
/**
 * Get the total posts remaining in the current query by ALM instance ID.
 * Note: Uses localized ALM variables.
 *
 * @see https://github.com/dcooney/wordpress-ajax-load-more/blob/main/core/classes/class-alm-localize.php
 * @param {string} type The type of total to retrieve.
 * @param {string} id   An optional Ajax Load More ID.
 * @return {number}     A total post count.
 */
function getTotals(type) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  // Get the ALM localized variable name.
  var localize_var = id ? "ajax_load_more_".concat(id.replace(/-/g, '_'), "_vars") : 'ajax_load_more_vars';

  // Get the localized value from the window object.
  var localized = window[localize_var];
  if (!localized) {
    return null;
  }

  // Deconstruct the object.
  var total_posts = localized.total_posts,
    post_count = localized.post_count,
    page = localized.page,
    pages = localized.pages;
  switch (type) {
    case 'total_posts':
      return total_posts ? parseInt(total_posts) : '';
    case 'post_count':
      return post_count ? parseInt(post_count) : '';
    case 'page':
      return page ? parseInt(page) : '';
    case 'pages':
      return pages ? parseInt(pages) : '';
    case 'remaining':
      if (!total_posts || !post_count) {
        return '';
      }
      return parseInt(total_posts) - parseInt(post_count);
  }
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/noResults.js
/**
 * Set the results text if required.
 *
 * @param {Element} element Target HTML element
 * @param {string}  html    Text as HTML to display.
 * @since 5.1
 */
function noResults(element) {
  var html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  if (!html || !element) {
    return; // Exit if empty.
  }

  // Remove empty <p/> tags.
  html = html.replace(/(<p><\/p>)+/g, '');

  // Is this a paging instance.
  var paging = element === null || element === void 0 ? void 0 : element.querySelector('.alm-paging-content');
  if (paging) {
    paging.innerHTML = html;
  } else {
    element.innerHTML = html;
  }
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/parsers.js
function parsers_toConsumableArray(arr) { return parsers_arrayWithoutHoles(arr) || parsers_iterableToArray(arr) || parsers_unsupportedIterableToArray(arr) || parsers_nonIterableSpread(); }
function parsers_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function parsers_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return parsers_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return parsers_arrayLikeToArray(o, minLen); }
function parsers_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function parsers_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return parsers_arrayLikeToArray(arr); }
function parsers_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }


/**
 * Convert a plain text string into an array of HTML nodes.
 *
 * @param {string} html The HTML string
 * @param {string} type The element type.
 * @return {Array}      The HTML nodes as an array.
 * @since 5.0
 */
function domParser() {
  var _data$body;
  var html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text/html';
  if (!html) {
    return [];
  }
  var parser = new DOMParser();
  var data = parser.parseFromString(html, type);
  var nodes = data === null || data === void 0 || (_data$body = data.body) === null || _data$body === void 0 ? void 0 : _data$body.childNodes;
  return nodes ? functions_stripEmptyNodes(parsers_toConsumableArray(nodes)) : [];
}

/**
 * Convert retun table data into an array of HTML elements.
 *
 * @param {string} html Plain text HTML.
 * @return {Array}      Array of HTML elements.
 * @since 5.0
 */
function tableParser() {
  var html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (!html) {
    return [];
  }
  // Create table element and add results to table body.
  var tbody = document.createElement('tbody');
  tbody.innerHTML = html;
  return [tbody];
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/queryParams.js


/**
 * Build the data object to send with the Ajax request.
 *
 * @param {Object} alm       The ALM object.
 * @param {string} queryType The query type.
 * @return {Object}          The data object.
 * @since 3.6
 */
function getAjaxParams(alm, queryType) {
  var addons = alm.addons,
    extensions = alm.extensions;

  // Defaults
  var data = {
    action: 'alm_get_posts',
    query_type: queryType,
    id: alm.id,
    post_id: parseInt(alm.post_id),
    slug: alm.slug,
    canonical_url: encodeURIComponent(alm.canonical_url),
    posts_per_page: parseInt(alm.posts_per_page),
    page: parseInt(alm.page),
    offset: parseInt(alm.offset),
    post_type: alm.post_type,
    repeater: alm.repeater,
    seo_start_page: alm.start_page
  };

  // Addons & Extensions

  if (extensions.acf) {
    data.acf = getTypeParams(alm, 'acf');
    if (extensions.acf_field_type !== 'relationship') {
      data.action = 'alm_acf';
    }
  }
  if (addons.comments) {
    data.comments = getTypeParams(alm, 'comments');
    data.posts_per_page = addons.comments_per_page;
    data.action = 'alm_comments';
  }
  if (addons.cta) {
    data.cta = getTypeParams(alm, 'cta');
  }
  if (addons.filters) {
    data.filters = addons.filters;
    data.filters_startpage = addons.filters_startpage;
    data.filters_target = addons.filters_target;
    data.facets = alm.facets;
  }
  if (addons.nextpage) {
    data.nextpage = getTypeParams(alm, 'nextpage');
    data.action = 'alm_nextpage';
  }
  if (addons.paging) {
    data.paging = addons.paging;
  }
  if (addons.preloaded) {
    data.preloaded = addons.preloaded;
    data.preloaded_amount = parseInt(addons.preloaded_amount);
  }
  if (addons.single_post) {
    data.single_post = getTypeParams(alm, 'single_post');
  }
  if (extensions.term_query) {
    data.term_query = getTypeParams(alm, 'term_query');
    data.action = 'alm_get_terms';
  }
  if (alm.extensions.users) {
    data.users = getTypeParams(alm, 'users');
    data.action = 'alm_users';
  }
  if (alm.theme_repeater) {
    data.theme_repeater = alm.theme_repeater;
  }

  // Query data params from ALM HTML element.
  if (alm.listing.dataset.lang) {
    data.lang = alm.listing.dataset.lang;
  }
  if (alm.listing.dataset.stickyPosts) {
    data.sticky_posts = alm.listing.dataset.stickyPosts;
  }
  if (alm.listing.dataset.postFormat) {
    data.post_format = alm.listing.dataset.postFormat;
  }
  if (alm.listing.dataset.category) {
    data.category = alm.listing.dataset.category;
  }
  if (alm.listing.dataset.categoryAnd) {
    data.category__and = alm.listing.dataset.categoryAnd;
  }
  if (alm.listing.dataset.categoryNotIn) {
    data.category__not_in = alm.listing.dataset.categoryNotIn;
  }
  if (alm.listing.dataset.tag) {
    data.tag = alm.listing.dataset.tag;
  }
  if (alm.listing.dataset.tagAnd) {
    data.tag__and = alm.listing.dataset.tagAnd;
  }
  if (alm.listing.dataset.tagNotIn) {
    data.tag__not_in = alm.listing.dataset.tagNotIn;
  }
  if (alm.listing.dataset.taxonomy) {
    data.taxonomy = alm.listing.dataset.taxonomy;
  }
  if (alm.listing.dataset.taxonomyTerms) {
    data.taxonomy_terms = alm.listing.dataset.taxonomyTerms;
  }
  if (alm.listing.dataset.taxonomyOperator) {
    data.taxonomy_operator = alm.listing.dataset.taxonomyOperator;
  }
  if (alm.listing.dataset.taxonomyIncludeChildren) {
    data.taxonomy_include_children = alm.listing.dataset.taxonomyIncludeChildren;
  }
  if (alm.listing.dataset.taxonomyRelation) {
    data.taxonomy_relation = alm.listing.dataset.taxonomyRelation;
  }
  if (alm.listing.dataset.sortKey) {
    data.sort_key = alm.listing.dataset.sortKey;
  }
  if (alm.listing.dataset.metaKey) {
    data.meta_key = alm.listing.dataset.metaKey;
  }
  if (alm.listing.dataset.metaValue) {
    data.meta_value = alm.listing.dataset.metaValue;
  }
  if (alm.listing.dataset.metaCompare) {
    data.meta_compare = alm.listing.dataset.metaCompare;
  }
  if (alm.listing.dataset.metaRelation) {
    data.meta_relation = alm.listing.dataset.metaRelation;
  }
  if (alm.listing.dataset.metaType) {
    data.meta_type = alm.listing.dataset.metaType;
  }
  if (alm.listing.dataset.dateQuery) {
    data.date_query = alm.listing.dataset.dateQuery;
  }
  if (alm.listing.dataset.dateQueryAfter) {
    data.date_query_after = alm.listing.dataset.dateQueryAfter;
  }
  if (alm.listing.dataset.dateQueryBefore) {
    data.date_query_before = alm.listing.dataset.dateQueryBefore;
  }
  if (alm.listing.dataset.dateQueryColumn) {
    data.date_query_column = alm.listing.dataset.dateQueryColumn;
  }
  if (alm.listing.dataset.dateQueryCompare) {
    data.date_query_compare = alm.listing.dataset.dateQueryCompare;
  }
  if (alm.listing.dataset.dateQueryInclusive) {
    data.date_query_inclusive = alm.listing.dataset.dateQueryInclusive;
  }
  if (alm.listing.dataset.dateQueryRelation) {
    data.date_query_relation = alm.listing.dataset.dateQueryRelation;
  }
  if (alm.listing.dataset.author) {
    data.author = alm.listing.dataset.author;
  }
  if (alm.listing.dataset.year) {
    data.year = alm.listing.dataset.year;
  }
  if (alm.listing.dataset.month) {
    data.month = alm.listing.dataset.month;
  }
  if (alm.listing.dataset.day) {
    data.day = alm.listing.dataset.day;
  }
  if (alm.listing.dataset.order) {
    data.order = alm.listing.dataset.order;
  }
  if (alm.listing.dataset.orderby) {
    data.orderby = alm.listing.dataset.orderby;
  }
  if (alm.listing.dataset.postStatus) {
    data.post_status = alm.listing.dataset.postStatus;
  }
  if (alm.listing.dataset.postIn) {
    data.post__in = alm.listing.dataset.postIn;
  }
  if (alm.listing.dataset.postNotIn) {
    data.post__not_in = alm.listing.dataset.postNotIn;
  }
  if (alm.listing.dataset.exclude) {
    data.exclude = alm.listing.dataset.exclude;
  }
  if (alm.listing.dataset.search) {
    data.search = alm.listing.dataset.search;
  }
  if (alm.listing.dataset.s) {
    data.search = alm.listing.dataset.s;
  }
  if (alm.listing.dataset.customArgs) {
    data.custom_args = alm.listing.dataset.customArgs;
  }
  if (alm.listing.dataset.vars) {
    data.vars = alm.listing.dataset.vars;
  }

  // Cache Params

  if (addons.cache) {
    data.cache_id = addons.cache_id;
    data.cache_logged_in = addons.cache_logged_in;
    data.cache_slug = getCacheSlug(alm, data);
  }
  return data;
}

/**
 * Build the query params for content types.
 *
 * @param {Object} alm  The ALM object.
 * @param {string} type The query type.
 * @return {Object}     The query params.
 */
function getTypeParams(alm, type) {
  var addons = alm.addons,
    extensions = alm.extensions;
  switch (type) {
    case 'acf':
      return {
        acf: 'true',
        post_id: extensions.acf_post_id,
        field_type: extensions.acf_field_type,
        field_name: extensions.acf_field_name,
        parent_field_name: extensions.acf_parent_field_name,
        row_index: extensions.acf_row_index
      };
    case 'comments':
      return {
        comments: 'true',
        post_id: addons.comments_post_id,
        per_page: addons.comments_per_page,
        type: addons.comments_type,
        style: addons.comments_style,
        template: addons.comments_template,
        callback: addons.comments_callback
      };
    case 'cta':
      return {
        cta: 'true',
        cta_position: addons.cta_position,
        cta_repeater: addons.cta_repeater,
        cta_theme_repeater: addons.cta_theme_repeater,
        cta_template: addons.cta_template
      };
    case 'nextpage':
      return {
        nextpage: 'true',
        urls: addons.nextpage_urls,
        scroll: addons.nextpage_scroll,
        post_id: addons.nextpage_post_id,
        startpage: addons.nextpage_startpage,
        nested: alm.nested
      };
    case 'single_post':
      return {
        single_post: 'true',
        id: addons.single_post_id,
        slug: addons.single_post_slug
      };
    case 'term_query':
      return {
        term_query: 'true',
        taxonomy: extensions.term_query_taxonomy,
        hide_empty: extensions.term_query_hide_empty,
        number: extensions.term_query_number
      };
    case 'users':
      return {
        users: 'true',
        role: alm.listing.dataset.usersRole,
        include: alm.listing.dataset.usersInclude,
        exclude: alm.listing.dataset.usersExclude,
        per_page: alm.posts_per_page,
        order: alm.listing.dataset.usersOrder,
        orderby: alm.listing.dataset.usersOrderby
      };
  }
}

/**
 * Build the REST API data object to send with REST API request.
 *
 * @param {Object} alm The ALM object.
 * @return {Object}    The data object.
 * @since 3.6
 */
function getRestAPIParams(alm) {
  var data = {
    id: alm.id,
    post_id: parseInt(alm.post_id),
    posts_per_page: alm.posts_per_page,
    page: alm.page,
    offset: alm.offset,
    slug: alm.slug,
    canonical_url: encodeURIComponent(alm.canonical_url),
    post_type: alm.post_type,
    post_format: alm.listing.dataset.postFormat,
    category: alm.listing.dataset.category,
    category__not_in: alm.listing.dataset.categoryNotIn,
    tag: alm.listing.dataset.tag,
    tag__not_in: alm.listing.dataset.tagNotIn,
    taxonomy: alm.listing.dataset.taxonomy,
    taxonomy_terms: alm.listing.dataset.taxonomyTerms,
    taxonomy_operator: alm.listing.dataset.taxonomyOperator,
    taxonomy_relation: alm.listing.dataset.taxonomyRelation,
    meta_key: alm.listing.dataset.metaKey,
    meta_value: alm.listing.dataset.metaValue,
    meta_compare: alm.listing.dataset.metaCompare,
    meta_relation: alm.listing.dataset.metaRelation,
    meta_type: alm.listing.dataset.metaType,
    date_query: alm.listing.dataset.dateQuery,
    date_query_after: alm.listing.dataset.dateQueryAfter,
    date_query_before: alm.listing.dataset.dateQueryBefore,
    date_query_column: alm.listing.dataset.dateQueryColumn,
    date_query_compare: alm.listing.dataset.dateQueryCompare,
    date_query_inclusive: alm.listing.dataset.dateQueryInclusive,
    date_query_relation: alm.listing.dataset.dateQueryRelation,
    author: alm.listing.dataset.author,
    year: alm.listing.dataset.year,
    month: alm.listing.dataset.month,
    day: alm.listing.dataset.day,
    post_status: alm.listing.dataset.postStatus,
    order: alm.listing.dataset.order,
    orderby: alm.listing.dataset.orderby,
    post__in: alm.listing.dataset.postIn,
    post__not_in: alm.listing.dataset.postNotIn,
    search: alm.listing.dataset.search,
    s: alm.listing.dataset.s,
    custom_args: alm.listing.dataset.customArgs,
    vars: alm.listing.dataset.vars,
    lang: alm.lang,
    preloaded: alm.addons.preloaded,
    preloaded_amount: alm.addons.preloaded_amount,
    seo_start_page: alm.start_page
  };
  return data;
}
;// CONCATENATED MODULE: ./src/frontend/js/functions/windowResize.js
/**
 * Trigger a window resize browser function.
 *
 * @since 5.3.1
 */
function triggerWindowResize() {
  if (typeof Event === 'function') {
    // Modern browsers.
    window.dispatchEvent(new Event('resize'));
  } else {
    // Executed on old browsers and especially IE.
    var resizeEvent = window.document.createEvent('UIEvents');
    resizeEvent.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(resizeEvent);
  }
}
;// CONCATENATED MODULE: ./src/frontend/js/modules/almDebug.js
/**
 * Display Ajax Load More debug results.
 *
 * @see https://connekthq.com/plugins/ajax-load-more/docs/filter-hooks/#alm_debug
 * @param {Object} alm ALM object.
 * @since 5.1.6
 */
function almDebug(alm) {
  if (alm && alm.debug) {
    var obj = {
      query: alm.debug,
      localize: alm.localize
    };
    console.log('ALM Debug:', obj); // eslint-disable-line no-console
  }
}
;// CONCATENATED MODULE: ./src/frontend/js/modules/fade.js
/**
 * Fade element in.
 *
 * @param {HTMLElement} element The HTML element to fade in.
 * @param {number}      speed   The transition speed.
 * @return {Promise}            The Promise object.
 */
var almFadeIn = function almFadeIn(element, speed) {
  return new Promise(function (resolve) {
    if (speed === 0) {
      element.style.opacity = 1;
      element.style.height = 'auto';
      resolve(true);
    } else {
      speed = speed / 10;
      var op = 0; // initial opacity
      var timer = setInterval(function () {
        if (op > 0.9) {
          element.style.opacity = 1;
          resolve(true);
          clearInterval(timer);
        }
        element.style.opacity = op;
        op += 0.1;
      }, speed);
      element.style.height = 'auto';
    }
  });
};

/**
 * Fade element out.
 *
 * @param {HTMLElement} element The HTML element to fade out.
 * @param {number}      speed   The transition speed.
 * @return {Promise}            The Promise object.
 */
var almFadeOut = function almFadeOut(element, speed) {
  return new Promise(function (resolve) {
    speed = speed / 10;
    element.style.opacity = 0.5;
    var fadeEffect = setInterval(function () {
      if (element.style.opacity < 0.1) {
        element.style.opacity = 0;
        clearInterval(fadeEffect);
        resolve(true);
      } else {
        element.style.opacity -= 0.1;
      }
    }, speed);
  });
};
;// CONCATENATED MODULE: ./src/frontend/js/modules/tableofcontents.js



/**
 * Create a numbered table of contents navigation.
 *
 * @param {Object}  alm            The alm object.
 * @param {boolean} init           Init boolean.
 * @param {boolean} from_preloaded Preloaded boolean.
 * @since 5.2
 */
function tableOfContents(alm) {
  var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var from_preloaded = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var totalPosts = alm.localize && alm.localize.post_count ? parseInt(alm.localize.post_count) : 0;

  // eslint-disable-next-line eqeqeq
  if (totalPosts == 0 && !alm.addons.single_post) {
    // Exit if zero posts and not single posts
    return false;
  }
  if (alm && alm.tableofcontents && alm.transition !== 'masonry') {
    var offset = alm.tableofcontents.dataset.offset ? parseInt(alm.tableofcontents.dataset.offset) : 30;
    var startPage = alm.start_page ? parseInt(alm.start_page) : 0;
    var filterStartPage = alm.addons.filters_startpage ? parseInt(alm.addons.filters_startpage) : 0;
    var nextpageStartPage = alm.addons.nextpage_startpage ? parseInt(alm.addons.nextpage_startpage) : 0;
    var page = parseInt(alm.page);
    var preloaded = alm.addons.preloaded ? true : false;

    // Exit if Paging or Next Page
    if (alm.addons.paging || alm.addons.nextpage) {
      return false;
    }

    // Init.
    if (init) {
      setTimeout(function () {
        // Paged results
        if (alm.addons.seo && startPage > 1 || alm.addons.filters && filterStartPage > 1 || alm.addons.nextpage && nextpageStartPage > 1) {
          // SEO
          if (alm.addons.seo && startPage > 1) {
            for (var i = 0; i < startPage; i++) {
              createTOCButton(alm, i, offset);
            }
          }
          // Filters
          if (alm.addons.filters && filterStartPage > 1) {
            for (var _i = 0; _i < filterStartPage; _i++) {
              createTOCButton(alm, _i, offset);
            }
          }
          // Nextpage
          if (alm.addons.nextpage && nextpageStartPage > 1) {
            for (var _i2 = 0; _i2 < nextpageStartPage; _i2++) {
              createTOCButton(alm, _i2, offset);
            }
          }
        } else {
          if (!from_preloaded && preloaded) {
            page = page + 1;
          }
          createTOCButton(alm, page, offset);
        }
      }, 100);
    } else {
      // Preloaded
      if (preloaded) {
        if (alm.addons.seo && startPage > 0) {
          page = page;
        } else if (alm.addons.filters && filterStartPage > 0) {
          page = page;
        } else {
          page = page + 1;
        }
      }
      createTOCButton(alm, page, offset);
    }
  }
}

/**
 * Clear table of contents.
 */
function clearTOC() {
  var toc = document.querySelector('.alm-toc');
  if (toc) {
    toc.innerHTML = '';
  }
}

/**
 * Create Standard Page Button.
 *
 * @param {Object} alm    The alm object.
 * @param {string} page   Current page.
 * @param {number} offset The page offset.
 */
function createTOCButton(alm, page, offset) {
  if (!alm.tableofcontents) {
    return false;
  }
  page = parseInt(page);
  var posts_per_page = parseInt(alm.posts_per_page);

  // Create button.
  var button = document.createElement('button');
  button.type = 'button';
  button.innerHTML = getTOCLabel(alm, page + 1);
  button.dataset.page = alm.addons.single_post_target && alm.init ? page - 1 : page + 1;
  button.dataset.target = (page + 1) * posts_per_page - posts_per_page + 1;

  // Add button to TOC.
  alm.tableofcontents.appendChild(button);

  // Click event listener.
  button.addEventListener('click', function () {
    var current = this.dataset.page;
    var target = this.dataset.target;

    // Get all listing children.
    var children = alm.listing.children;

    // Find element.
    var element = children[target - 1];

    // Next Page.
    if (alm.addons.nextpage) {
      element = document.querySelector(".alm-nextpage[data-page=\"".concat(current, "\"]"));
    }
    // Single Posts.
    if (alm.addons.single_post_target) {
      element = document.querySelector(".alm-single-post[data-page=\"".concat(current, "\"]"));
    }
    if (!element) {
      return; // Exit if no target.
    }

    var top = typeof getOffset === 'function' ? getOffset(element).top : element.offsetTop;
    almScroll(top - offset);
    setTimeout(function () {
      setFocus(alm, element, target, false);
    }, 500);
  });
}

/**
 * Get Button Label.
 *
 * @param {Object} alm  The alm object.
 * @param {string} page The current page.
 * @return {string}     The Label.
 */
function getTOCLabel(alm, page) {
  var label = page;

  // Single Posts
  if (alm.addons.single_post) {
    var thePage = page - 1;
    var element;
    if (alm.addons.single_post_target) {
      // Special functionality for Single Post with a loading target type
      if (alm.init) {
        thePage = thePage;
      } else {
        thePage = thePage + 1;
      }
      var posts = document.querySelectorAll(".alm-single-post");
      if (posts) {
        element = posts[thePage];
      }
    } else {
      element = document.querySelector(".alm-single-post[data-page=".concat(page - 1, "]"));
    }
    label = element ? element.dataset.title : label;
  }

  // Dynamic function name.
  var funcName = "almTOCLabel_".concat(alm.id);
  if (typeof window[funcName] === 'function') {
    label = window[funcName](page, label);
  }
  return label;
}
;// CONCATENATED MODULE: ./src/frontend/js/modules/filtering.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || filtering_unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function filtering_toConsumableArray(arr) { return filtering_arrayWithoutHoles(arr) || filtering_iterableToArray(arr) || filtering_unsupportedIterableToArray(arr) || filtering_nonIterableSpread(); }
function filtering_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function filtering_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return filtering_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return filtering_arrayLikeToArray(o, minLen); }
function filtering_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function filtering_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return filtering_arrayLikeToArray(arr); }
function filtering_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }



/**
 * Filter an Ajax Load More instance.
 *
 * @param {string} transition Transition type.
 * @param {number} speed      Transition speed.
 * @param {Object} data       Data object.
 * @param {string} type       Type of filter.
 * @since 2.6.1
 */
function almFilter(transition) {
  var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
  var data = arguments.length > 2 ? arguments[2] : undefined;
  var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'filter';
  if (data.target) {
    // Target has been specified.
    var alm = document.querySelectorAll('.ajax-load-more-wrap[data-id="' + data.target.toLowerCase() + '"]');
    if (alm) {
      alm.forEach(function (element) {
        almFilterTransition(transition, speed, data, type, element);
      });
    }
  } else {
    // Target not specified.
    var _alm = document.querySelectorAll('.ajax-load-more-wrap');
    if (_alm) {
      _alm.forEach(function (element) {
        almFilterTransition(transition, speed, data, type, element);
      });
    }
  }
  clearTOC(); // Clear table of contents if required
}

/**
 * Transition Ajax Load More
 *
 * @param {string}  transition Transition type.
 * @param {number}  speed      Transition speed.
 * @param {Object}  data       Data object.
 * @param {string}  type       Type of filter.
 * @param {Element} element    Target element.
 * @since 2.13.1
 */
function almFilterTransition(transition, speed, data, type, element) {
  if (transition === 'fade' || transition === 'masonry') {
    // Fade, Masonry transition

    switch (type) {
      case 'filter':
        element.classList.add('alm-is-filtering');
        almFadeOut(element, speed);
        break;
    }

    // Move to next function
    setTimeout(function () {
      almCompleteFilterTransition(speed, data, type, element);
    }, speed);
  } else {
    // No transition
    element.classList.add('alm-is-filtering');
    almCompleteFilterTransition(speed, data, type, element);
  }
}

/**
 * Complete the filter transition.
 *
 * @param {number}  speed   Transition speed.
 * @param {Object}  data    Data object.
 * @param {string}  type    Type of filter.
 * @param {Element} element Target element.
 * @since 3.3
 */
function almCompleteFilterTransition(speed, data, type, element) {
  var btnWrap = element.querySelector('.alm-btn-wrap'); // Get `.alm-btn-wrap` element
  var listing = element.querySelectorAll('.alm-listing'); // Get `.alm-listing` element

  if (!listing || !btnWrap) {
    // Exit if elements doesn't exist.
    return false;
  }

  // Loop over all .alm-listing divs and clear HTML.
  filtering_toConsumableArray(listing).forEach(function (element) {
    // Is this a paging instance.
    var paging = element.querySelector('.alm-paging-content');
    if (paging) {
      paging.innerHTML = '';
    } else {
      element.innerHTML = '';
    }
  });

  // Get Load More button
  var button = btnWrap.querySelector('.alm-load-more-btn');
  if (button) {
    button.classList.remove('done'); // Reset Button
  }

  // Clear paging navigation
  var paging = btnWrap.querySelector('.alm-paging');
  if (paging) {
    paging.style.opacity = 0;
  }

  // Reset Preloaded Amount
  data.preloadedAmount = 0;

  // Dispatch Filters
  almSetFilters(speed, data, type, element);
}

/**
 * Set filter parameters on .alm-listing element.
 *
 * @param {number}  speed   Transition speed.
 * @param {Object}  data    Data object.
 * @param {string}  type    Type of filter.
 * @param {Element} element Target element.
 * @since 2.6.1
 */
function almSetFilters(speed, data, type, element) {
  // Get `alm-listing` container.
  var listing = element.querySelector('.alm-listing') || element.querySelector('.alm-comments');
  if (!listing) {
    return false;
  }
  switch (type) {
    case 'filter':
      // Update data attributes
      for (var _i = 0, _Object$entries = Object.entries(data); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
        // Convert camelCase data atts back to dashes (-).
        key = key.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
        listing.setAttribute('data-' + key, value);
      }
      almCleanFilterData(listing, data); // Cleanup Filters data

      // Fade ALM back (Filters only)
      almFadeIn(element, speed);
      break;
  }

  // Re-initiate Ajax Load More.
  var target = '';
  if (data.target) {
    // Target has been specified
    target = document.querySelector('.ajax-load-more-wrap[data-id="' + data.target + '"]');
    if (target) {
      window.almInit(target);
    }
  } else {
    // Target not specified
    target = document.querySelector('.ajax-load-more-wrap');
    if (target) {
      window.almInit(target);
    }
  }
  switch (type) {
    case 'filter':
      // Filters Complete (not the add-on).
      if (typeof almFilterComplete === 'function') {
        almFilterComplete();
      }
      break;
  }
}

/**
 * Clean up Taxonomy and Meta Query data from filters.
 *
 * @param {HTMLElement} listing The alm-listing container.
 * @param {Object}      data    The data object containing filter parameters.
 */
function almCleanFilterData(listing, data) {
  // If taxonomy is empty, remove taxonomy-related data attributes.
  if (data && data.taxonomy === '') {
    delete listing.dataset.taxonomy;
    if (listing.dataset.taxonomyTerms) {
      delete listing.dataset.taxonomy;
      delete listing.dataset.taxonomyTerms;
      delete listing.dataset.taxonomyOperator;
      delete listing.dataset.taxonomyIncludeChildren;
    }
  }

  // If metaKey is empty, remove meta-related data attributes.
  if (data && data.metaKey === '') {
    delete listing.dataset.metaKey;
    if (listing.dataset.metaValue) {
      delete listing.dataset.metaValue;
      delete listing.dataset.metaType;
      delete listing.dataset.metaCompare;
    }
  }
}
;// CONCATENATED MODULE: ./src/frontend/js/modules/masonry.js
function masonry_typeof(o) { "@babel/helpers - typeof"; return masonry_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, masonry_typeof(o); }
function masonry_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ masonry_regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == masonry_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(masonry_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function masonry_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function masonry_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { masonry_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { masonry_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var masonry_imagesLoaded = __webpack_require__(564);

/**
 * Function to trigger built-in Ajax Load More Masonry.
 *
 * @param {Object}  alm       ALM object.
 * @param {boolean} init      Initial run true or false.
 * @param {boolean} filtering Is this a filtering event.
 * @since 3.1
 */
function almMasonry(alm, init, filtering) {
  if (!alm.masonry) {
    console.warn('Ajax Load More: Unable to locate Masonry settings.');
  }
  var container = alm.listing,
    last_loaded = alm.last_loaded,
    speed = alm.speed;
  return new Promise(function (resolve) {
    var _alm$masonry;
    var selector = alm.masonry.selector;
    var animation = alm.masonry.animation;
    var horizontalOrder = (alm === null || alm === void 0 || (_alm$masonry = alm.masonry) === null || _alm$masonry === void 0 ? void 0 : _alm$masonry.horizontalorder) === 'true' ? true : false;
    var masonry_init = alm.masonry.init;
    var columnWidth = alm.masonry.columnwidth;
    var duration = (speed + 100) / 1000 + 's'; // Add 100 for some delay
    var hidden = 'scale(0.5)';
    var visible = 'scale(1)';
    if (animation === 'zoom-out') {
      hidden = 'translateY(-20px) scale(1.25)';
      visible = 'translateY(0) scale(1)';
    }
    if (animation === 'slide-up') {
      hidden = 'translateY(50px)';
      visible = 'translateY(0)';
    }
    if (animation === 'slide-down') {
      hidden = 'translateY(-50px)';
      visible = 'translateY(0)';
    }
    if (animation === 'none') {
      hidden = 'translateY(0)';
      visible = 'translateY(0)';
    }

    // columnWidth
    if (columnWidth) {
      if (!isNaN(columnWidth)) {
        columnWidth = parseInt(columnWidth); // Check if number.
      }
    } else {
      columnWidth = selector; // No columnWidth, use the selector
    }

    if (!filtering) {
      // First Run.
      if (masonry_init && init) {
        masonry_imagesLoaded(container, function () {
          var _window;
          var defaults = {
            itemSelector: selector,
            transitionDuration: duration,
            columnWidth: columnWidth,
            // eslint-disable-line
            horizontalOrder: horizontalOrder,
            // eslint-disable-line
            hiddenStyle: {
              transform: hidden,
              opacity: 0
            },
            visibleStyle: {
              transform: visible,
              opacity: 1
            }
          };

          // Get custom Masonry options (https://masonry.desandro.com/options.html).
          var alm_masonry_vars = (_window = window) === null || _window === void 0 ? void 0 : _window.alm_masonry_vars;
          if (alm_masonry_vars) {
            Object.keys(alm_masonry_vars).forEach(function (key) {
              // Loop object	to create key:prop
              defaults[key] = alm_masonry_vars[key];
            });
          }

          // Init Masonry, delay to allow time for items to be added to the page.
          setTimeout( /*#__PURE__*/masonry_asyncToGenerator( /*#__PURE__*/masonry_regeneratorRuntime().mark(function _callee() {
            return masonry_regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  alm.msnry = new Masonry(container, defaults);
                  _context.next = 3;
                  return almFadeIn(container.parentNode, 175);
                case 3:
                  resolve(true);
                case 4:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          })), 25);
        });
      } else {
        // Standard / Append content.
        // eslint-disable-next-line no-lonely-if
        if (last_loaded) {
          // ImagesLoaded & appended.
          masonry_imagesLoaded(container, function () {
            setTimeout( /*#__PURE__*/masonry_asyncToGenerator( /*#__PURE__*/masonry_regeneratorRuntime().mark(function _callee2() {
              return masonry_regeneratorRuntime().wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    alm.msnry.appended(last_loaded);
                    resolve(true);
                  case 2:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            })), 25);
          });
        }
      }
    } else {
      // Reset instance.
      container.parentNode.style.opacity = 0;
      almMasonry(alm, true, false);
      resolve(true);
    }
  });
}

/**
 * Set up initial Masonry Configuration.
 *
 * @param {Object} alm ALM Object.
 * @return {Object}    Configuration object.
 */
function almMasonryConfig(alm) {
  alm.masonry = {};
  alm.masonry.init = true;
  if (alm.msnry) {
    // destroy masonry if it currently exists.
    alm.msnry.destroy();
  } else {
    alm.msnry = '';
  }
  var masonry_config = JSON.parse(alm.listing.dataset.masonryConfig);
  if (masonry_config) {
    alm.masonry.selector = masonry_config.selector;
    alm.masonry.columnwidth = masonry_config.columnwidth;
    alm.masonry.animation = masonry_config.animation === '' ? 'standard' : masonry_config.animation;
    alm.masonry.horizontalorder = masonry_config.horizontalorder === '' ? 'true' : masonry_config.horizontalorder;
    alm.images_loaded = true;
    alm.transition_delay = 0;
  } else {
    console.warn('Ajax Load More: Unable to locate Masonry configuration settings.');
  }
  return alm;
}
;// CONCATENATED MODULE: ./src/frontend/js/modules/placeholder.js
function placeholder_typeof(o) { "@babel/helpers - typeof"; return placeholder_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, placeholder_typeof(o); }
function placeholder_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ placeholder_regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == placeholder_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(placeholder_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function placeholder_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function placeholder_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { placeholder_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { placeholder_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


/**
 * Show placeholder div.
 *
 * @param {string} type The direction.
 * @param {Object} alm  The ALM object.
 */
function placeholder() {
  return _placeholder.apply(this, arguments);
}
function _placeholder() {
  _placeholder = placeholder_asyncToGenerator( /*#__PURE__*/placeholder_regeneratorRuntime().mark(function _callee() {
    var type,
      alm,
      placeholder,
      addons,
      rel,
      _args = arguments;
    return placeholder_regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          type = _args.length > 0 && _args[0] !== undefined ? _args[0] : 'show';
          alm = _args.length > 1 ? _args[1] : undefined;
          placeholder = alm.placeholder, addons = alm.addons, rel = alm.rel;
          if (!(!placeholder || addons.paging || rel === 'prev')) {
            _context.next = 5;
            break;
          }
          return _context.abrupt("return", false);
        case 5:
          _context.t0 = type;
          _context.next = _context.t0 === 'hide' ? 8 : 12;
          break;
        case 8:
          _context.next = 10;
          return almFadeOut(placeholder, 175);
        case 10:
          setTimeout(function () {
            placeholder.style.display = 'none';
          }, 75);
          return _context.abrupt("break", 15);
        case 12:
          placeholder.style.display = 'block';
          almFadeIn(placeholder, 175);
          return _context.abrupt("break", 15);
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _placeholder.apply(this, arguments);
}
;// CONCATENATED MODULE: ./src/frontend/js/modules/resultsText.js


/**
 * Set the results text if required.
 *
 * @param {Object} alm  ALM object.
 * @param {string} type Type of results.
 * @since 5.1
 */
function almResultsText(alm) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'standard';
  if (!alm.resultsText || alm.nested === 'true') {
    return false;
  }
  var resultsType = type === 'nextpage' || type === 'woocommerce' ? type : 'standard';
  almGetResultsText(alm, resultsType);
}

/**
 * Get values for showing results text.
 *
 * @param {Object} alm  ALM object.
 * @param {string} type Type of results.
 * @since 4.1
 */
function almGetResultsText(alm) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'standard';
  if (!alm.resultsText || !alm.localize || alm.nested === 'true') {
    return false;
  }
  var page = 0;
  var pages = 0;
  var post_count = 0;
  var total_posts = 0;
  var posts_per_page = alm.orginal_posts_per_page;
  switch (type) {
    // Nextpage
    case 'nextpage':
      page = parseInt(alm.localize.page);
      post_count = page;
      pages = parseInt(alm.localize.total_posts);
      total_posts = parseInt(pages);
      almRenderResultsText(alm.resultsText, page, pages, post_count, total_posts, posts_per_page);
      break;

    // WooCommerce
    case 'woocommerce':
      // Don't do anything
      break;
    default:
      page = getTotals('page', alm.id);
      pages = getTotals('pages', alm.id);
      post_count = getTotals('post_count', alm.id);
      total_posts = getTotals('total_posts', alm.id);
      almRenderResultsText(alm.resultsText, page, pages, post_count, total_posts, posts_per_page);
  }
}

/**
 * Display `Showing {x} of {y} pages` text.
 *
 * @param {Object} alm  ALM object.
 * @param {string} type Type of results.
 * @since 4.1
 */
function almInitResultsText(alm) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'standard';
  if (!alm.resultsText || !alm.localize || alm.nested === 'true') {
    return false;
  }
  var page = 0;
  var pages = Math.ceil(alm.localize.total_posts / alm.orginal_posts_per_page);
  var post_count = parseInt(alm.localize.post_count);
  var total_posts = parseInt(alm.localize.total_posts);
  switch (type) {
    case 'nextpage':
      // Nextpage
      page = alm.addons.nextpage_startpage;
      post_count = page;
      pages = total_posts;
      almRenderResultsText(alm.resultsText, page, total_posts, post_count, total_posts, alm.posts_per_page);
      break;
    case 'preloaded':
      // Preloaded
      page = alm.addons.paging && alm.addons.seo ? alm.start_page + 1 : parseInt(alm.page) + 1;
      almRenderResultsText(alm.resultsText, page, pages, post_count, total_posts, alm.posts_per_page);
      break;
    case 'woocommerce':
      // WooCommerce
      // Don't do anything
      break;
  }
}

/**
 * Render `Showing {x} of {y} results` text.
 *
 * @param {Element} el          The results text HTML element.
 * @param {string}  page        The current page number.
 * @param {string}  pages       The total pages.
 * @param {string}  post_count  Total posts displayed.
 * @param {string}  total_posts Total amount of posts in query.
 * @param {string}  per_page    Total amount of posts per page.
 * @since 4.1
 */
var almRenderResultsText = function almRenderResultsText(el, page, pages, post_count, total_posts, per_page) {
  el.forEach(function (result) {
    pages = parseInt(pages);
    var text = pages > 0 ? alm_localize.results_text : alm_localize.no_results_text;

    // Paging add-on.
    // Start and End values for posts in view.
    var start = page * per_page - per_page + 1;
    var end_val = page * per_page;
    var end = end_val <= total_posts ? end_val : total_posts;
    if (pages > 0) {
      text = text.replace('{num}', "<span class=\"alm-results-num\">".concat(page, "</span>")); // Deprecated
      text = text.replace('{page}', "<span class=\"alm-results-page\">".concat(page, "</span>"));
      text = text.replace('{start}', "<span class=\"alm-results-start\">".concat(start, "</span>"));
      text = text.replace('{end}', "<span class=\"alm-results-start\">".concat(end, "</span>"));
      text = text.replace('{total}', "<span class=\"alm-results-total\">".concat(pages, "</span>")); // Deprecated
      text = text.replace('{pages}', "<span class=\"alm-results-pages\">".concat(pages, "</span>"));
      text = text.replace('{post_count}', "<span class=\"alm-results-post_count\">".concat(post_count, "</span>"));
      text = text.replace('{total_posts}', "<span class=\"alm-results-total_posts\">".concat(total_posts, "</span>"));
      result.innerHTML = text;
    } else {
      result.innerHTML = text;
    }
  });
};
;// CONCATENATED MODULE: ./src/frontend/js/modules/setLocalizedVars.js


/**
 * Set localized variables
 *
 * @param {Object} alm ALM object
 * @since 4.1
 */
function setLocalizedVars(alm) {
  var addons = alm.addons;
  return new Promise(function (resolve) {
    var type = 'standard';
    if (addons.nextpage) {
      // Nextpage
      type = 'nextpage';
      if (addons.paging) {
        alm.AjaxLoadMore.setLocalizedVar('page', parseInt(alm.page) + 1);
      } else {
        alm.AjaxLoadMore.setLocalizedVar('page', parseInt(alm.page) + parseInt(addons.nextpage_startpage) + 1);
      }
    } else if (addons.woocommerce) {
      // WooCommerce
      type = 'woocommerce';
      alm.AjaxLoadMore.setLocalizedVar('page', parseInt(alm.page) + 1);
    } else {
      // Standard ALM.
      var page = parseInt(alm.page) + 1 + (addons.preloaded && !addons.paging ? 1 : 0); // Add 1 page for preloaded.
      alm.AjaxLoadMore.setLocalizedVar('page', parseInt(page));
      var pages = Math.ceil(alm.totalposts / alm.orginal_posts_per_page);
      alm.AjaxLoadMore.setLocalizedVar('pages', parseInt(pages));
    }

    // Total Posts `total_posts`.
    // Only update if !preloaded && !nextpage && !woocommerce
    if (addons.preloaded !== 'true' && !addons.nextpage && !addons.woocommerce) {
      alm.AjaxLoadMore.setLocalizedVar('total_posts', alm.totalposts);
    }

    // Viewing count.
    alm.AjaxLoadMore.setLocalizedVar('post_count', getPostCount(alm));

    // Set Results Text (if required).
    almResultsText(alm, type);
    resolve(true);
  });
}

/**
 * Get total post_count.
 *
 * @param {Object} alm ALM object.
 * @return {number}    Total post count.
 */
function getPostCount(alm) {
  var postcount = alm.postcount,
    addons = alm.addons,
    start_page = alm.start_page;
  var preloaded_amount = addons.preloaded_amount;

  // Construct post count.
  var count = parseInt(postcount) + parseInt(preloaded_amount);
  count = start_page > 1 ? count - parseInt(preloaded_amount) : count; // SEO
  count = addons.filters_startpage > 1 ? count - parseInt(preloaded_amount) : count; // Filters
  count = addons.single_post ? count + 1 : count; // Single Posts
  count = addons.nextpage ? count + 1 : count; // Next Page

  return count;
}
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
// EXTERNAL MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??ruleSet[1].rules[2].use[1]!./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./src/frontend/scss/ajax-load-more.scss
var ajax_load_more = __webpack_require__(792);
var ajax_load_more_default = /*#__PURE__*/__webpack_require__.n(ajax_load_more);
;// CONCATENATED MODULE: ./src/frontend/scss/ajax-load-more.scss

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()((ajax_load_more_default()), options);




       /* harmony default export */ var scss_ajax_load_more = ((ajax_load_more_default()) && (ajax_load_more_default()).locals ? (ajax_load_more_default()).locals : undefined);

;// CONCATENATED MODULE: ./src/frontend/js/ajax-load-more.js
function ajax_load_more_typeof(o) { "@babel/helpers - typeof"; return ajax_load_more_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, ajax_load_more_typeof(o); }
function ajax_load_more_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ ajax_load_more_regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == ajax_load_more_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(ajax_load_more_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function ajax_load_more_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function ajax_load_more_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { ajax_load_more_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { ajax_load_more_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ajax_load_more_toConsumableArray(arr) { return ajax_load_more_arrayWithoutHoles(arr) || ajax_load_more_iterableToArray(arr) || ajax_load_more_unsupportedIterableToArray(arr) || ajax_load_more_nonIterableSpread(); }
function ajax_load_more_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function ajax_load_more_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ajax_load_more_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ajax_load_more_arrayLikeToArray(o, minLen); }
function ajax_load_more_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function ajax_load_more_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return ajax_load_more_arrayLikeToArray(arr); }
function ajax_load_more_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// ALM Modules



































// External packages.
var qs = __webpack_require__(129);
var ajax_load_more_imagesLoaded = __webpack_require__(564);

// Axios Config.
lib_axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
lib_axios.interceptors.request.use(function (config) {
  // Axios Interceptor for nested data objects
  config.paramsSerializer = function (params) {
    // Qs is already included in the Axios package
    return qs.stringify(params, {
      arrayFormat: 'brackets',
      encode: false
    });
  };
  return config;
});

// Global filtering state.
var alm_is_filtering = false;
var isBlockEditor = document.body.classList.contains('wp-admin');

// Start ALM
(function () {
  'use strict';

  /**
   * Initiate Ajax Load More.
   *
   * @param {Element} el    The Ajax Load More DOM element/container.
   * @param {number}  index The current index number of the Ajax Load More instance.
   */
  var ajaxloadmore = function ajaxloadmore(el, index) {
    var _alm_localize, _el$dataset, _alm, _alm2, _alm3, _alm4, _alm5, _alm6, _alm_localize2, _alm7, _alm8, _alm9, _alm10, _alm11, _alm12, _alm13, _alm14, _alm15, _alm16, _alm17, _alm18, _alm19, _alm20, _alm_localize3, _alm21, _alm22, _alm23, _alm24, _alm25, _alm26;
    // Move user to top of page to prevent loading of unnessasry posts
    if (((_alm_localize = alm_localize) === null || _alm_localize === void 0 ? void 0 : _alm_localize.scrolltop) === 'true') {
      window.scrollTo(0, 0);
    }

    // Set ALM Variables
    var alm = this;
    alm.AjaxLoadMore = {};
    alm.addons = {};
    alm.extensions = {};
    alm.integration = {};
    alm.window = window;
    alm.page = 0;
    alm.postcount = 0;
    alm.totalposts = 0;
    alm.proceed = false;
    alm.disable_ajax = false;
    alm.init = true;
    alm.loading = true;
    alm.finished = false;
    alm.timer = null;
    alm.rel = 'next';
    alm.defaults = {};
    alm.ua = window.navigator.userAgent ? window.navigator.userAgent : ''; // Browser User Agent
    alm.vendor = window.navigator.vendor ? window.navigator.vendor : ''; // Browser Vendor

    el.classList.add('alm-' + index); // Add unique classname.
    el.setAttribute('data-alm-id', index); // Add unique data id.

    // The defined or generated ID for the ALM instance.
    alm.master_id = el.dataset.id ? "ajax_load_more_".concat(el.dataset.id) : el.id;
    alm.master_id = alm.master_id.replace(/-/g, '_');

    // Localized <script/> variables.
    alm.localized_var = "".concat(alm.master_id, "_vars");
    alm.localize = window[alm.localized_var];
    if (!alm.localize) {
      window[alm.localized_var] = {}; // Create empty object if not defined.
      alm.localize = window[alm.localized_var];
    }

    // Add ALM object to the global window scope.
    window[alm.master_id] = alm; // e.g. window.ajax_load_more or window.ajax_load_more_{id}

    // ALM Element Containers
    alm.main = el; // Top level DOM element
    alm.listing = el.querySelector('.alm-listing') || el.querySelector('.alm-comments');
    alm.content = alm.listing;
    alm.ajax = el.querySelector('.alm-ajax');
    alm.container_type = alm.listing.dataset.containerType;
    alm.loading_style = alm.listing.dataset.loadingStyle;

    // Instance Params
    alm.canonical_url = el.dataset.canonicalUrl;
    alm.nested = el.dataset.nested ? el.dataset.nested : false;
    alm.is_search = (el === null || el === void 0 || (_el$dataset = el.dataset) === null || _el$dataset === void 0 ? void 0 : _el$dataset.search) === 'true' ? 'true' : false;
    alm.search_value = alm.is_search === 'true' ? alm.slug : ''; // Convert to value of slug for appending to seo url.
    alm.slug = el.dataset.slug;
    alm.post_id = parseInt(el.dataset.postId);
    alm.id = el.dataset.id ? el.dataset.id : '';

    // Shortcode Params

    alm.repeater = ((_alm = alm) === null || _alm === void 0 || (_alm = _alm.listing) === null || _alm === void 0 || (_alm = _alm.dataset) === null || _alm === void 0 ? void 0 : _alm.repeater) || 'default';
    alm.theme_repeater = ((_alm2 = alm) === null || _alm2 === void 0 || (_alm2 = _alm2.listing) === null || _alm2 === void 0 || (_alm2 = _alm2.dataset) === null || _alm2 === void 0 ? void 0 : _alm2.themeRepeater) || false;
    alm.post_type = ((_alm3 = alm) === null || _alm3 === void 0 || (_alm3 = _alm3.listing) === null || _alm3 === void 0 || (_alm3 = _alm3.dataset) === null || _alm3 === void 0 ? void 0 : _alm3.postType) || 'post';
    alm.sticky_posts = ((_alm4 = alm) === null || _alm4 === void 0 || (_alm4 = _alm4.listing) === null || _alm4 === void 0 || (_alm4 = _alm4.dataset) === null || _alm4 === void 0 ? void 0 : _alm4.stickyPosts) || false;
    alm.btnWrap = el.querySelectorAll('.alm-btn-wrap'); // Get all `.alm-button-wrap` divs
    alm.btnWrap = ajax_load_more_toConsumableArray(alm.btnWrap); // Convert NodeList to array
    alm.btnWrap[alm.btnWrap.length - 1].style.visibility = 'visible'; // Get last element (used for nesting)
    alm.trigger = alm.btnWrap[alm.btnWrap.length - 1];
    alm.button = ((_alm5 = alm) === null || _alm5 === void 0 || (_alm5 = _alm5.trigger) === null || _alm5 === void 0 ? void 0 : _alm5.querySelector('button.alm-load-more-btn')) || null;

    // Button Labels.
    alm.button_labels = {
      "default": purify.sanitize((_alm6 = alm) === null || _alm6 === void 0 || (_alm6 = _alm6.listing) === null || _alm6 === void 0 || (_alm6 = _alm6.dataset) === null || _alm6 === void 0 ? void 0 : _alm6.buttonLabel) || purify.sanitize((_alm_localize2 = alm_localize) === null || _alm_localize2 === void 0 ? void 0 : _alm_localize2.button_label),
      loading: purify.sanitize((_alm7 = alm) === null || _alm7 === void 0 || (_alm7 = _alm7.listing) === null || _alm7 === void 0 || (_alm7 = _alm7.dataset) === null || _alm7 === void 0 ? void 0 : _alm7.buttonLoadingLabel) || null,
      done: purify.sanitize((_alm8 = alm) === null || _alm8 === void 0 || (_alm8 = _alm8.listing) === null || _alm8 === void 0 || (_alm8 = _alm8.dataset) === null || _alm8 === void 0 ? void 0 : _alm8.buttonDoneLabel) || null
    };
    alm.prev_button_labels = {
      "default": purify.sanitize((_alm9 = alm) === null || _alm9 === void 0 || (_alm9 = _alm9.listing) === null || _alm9 === void 0 || (_alm9 = _alm9.dataset) === null || _alm9 === void 0 ? void 0 : _alm9.prevButtonLabel),
      loading: purify.sanitize((_alm10 = alm) === null || _alm10 === void 0 || (_alm10 = _alm10.listing) === null || _alm10 === void 0 || (_alm10 = _alm10.dataset) === null || _alm10 === void 0 ? void 0 : _alm10.prevButtonLoadingLabel) || null,
      done: purify.sanitize((_alm11 = alm) === null || _alm11 === void 0 || (_alm11 = _alm11.listing) === null || _alm11 === void 0 || (_alm11 = _alm11.dataset) === null || _alm11 === void 0 ? void 0 : _alm11.prevButtonDoneLabel) || null
    };
    alm.urls = ((_alm12 = alm) === null || _alm12 === void 0 || (_alm12 = _alm12.listing) === null || _alm12 === void 0 || (_alm12 = _alm12.dataset) === null || _alm12 === void 0 ? void 0 : _alm12.urls) === 'false' ? false : true;
    alm.placeholder = alm.main.querySelector('.alm-placeholder') || false;
    alm.scroll_distance = ((_alm13 = alm) === null || _alm13 === void 0 || (_alm13 = _alm13.listing) === null || _alm13 === void 0 ? void 0 : _alm13.dataset.scrollDistance) || 100;
    alm.scroll_container = ((_alm14 = alm) === null || _alm14 === void 0 || (_alm14 = _alm14.listing) === null || _alm14 === void 0 ? void 0 : _alm14.dataset.scrollContainer) || null;
    alm.scroll_direction = ((_alm15 = alm) === null || _alm15 === void 0 || (_alm15 = _alm15.listing) === null || _alm15 === void 0 || (_alm15 = _alm15.dataset) === null || _alm15 === void 0 ? void 0 : _alm15.scrollDirection) || 'vertical';
    alm.max_pages = (_alm16 = alm) !== null && _alm16 !== void 0 && (_alm16 = _alm16.listing) !== null && _alm16 !== void 0 && (_alm16 = _alm16.dataset) !== null && _alm16 !== void 0 && _alm16.maxPages ? parseInt(alm.listing.dataset.maxPages) : 0;
    alm.pause_override = ((_alm17 = alm) === null || _alm17 === void 0 || (_alm17 = _alm17.listing) === null || _alm17 === void 0 || (_alm17 = _alm17.dataset) === null || _alm17 === void 0 ? void 0 : _alm17.pauseOverride) || false; // true | false
    alm.pause = ((_alm18 = alm) === null || _alm18 === void 0 || (_alm18 = _alm18.listing) === null || _alm18 === void 0 || (_alm18 = _alm18.dataset) === null || _alm18 === void 0 ? void 0 : _alm18.pause) || false; // true | false
    alm.transition = ((_alm19 = alm) === null || _alm19 === void 0 || (_alm19 = _alm19.listing) === null || _alm19 === void 0 || (_alm19 = _alm19.dataset) === null || _alm19 === void 0 ? void 0 : _alm19.transition) || 'fade'; // Transition
    alm.transition_delay = ((_alm20 = alm) === null || _alm20 === void 0 || (_alm20 = _alm20.listing) === null || _alm20 === void 0 || (_alm20 = _alm20.dataset) === null || _alm20 === void 0 ? void 0 : _alm20.transitionDelay) || 0;
    alm.speed = (_alm_localize3 = alm_localize) !== null && _alm_localize3 !== void 0 && _alm_localize3.speed ? parseInt(alm_localize.speed) : 250;
    alm.images_loaded = ((_alm21 = alm) === null || _alm21 === void 0 || (_alm21 = _alm21.listing) === null || _alm21 === void 0 || (_alm21 = _alm21.dataset) === null || _alm21 === void 0 ? void 0 : _alm21.imagesLoaded) === 'true';
    alm.destroy_after = (_alm22 = alm) !== null && _alm22 !== void 0 && (_alm22 = _alm22.listing) !== null && _alm22 !== void 0 && (_alm22 = _alm22.dataset) !== null && _alm22 !== void 0 && _alm22.destroyAfter ? parseInt(alm.listing.dataset.destroyAfter) : false;
    alm.lazy_images = ((_alm23 = alm) === null || _alm23 === void 0 || (_alm23 = _alm23.listing.dataset) === null || _alm23 === void 0 ? void 0 : _alm23.lazyImages) === 'true' ? true : false;
    alm.integration.woocommerce = ((_alm24 = alm) === null || _alm24 === void 0 || (_alm24 = _alm24.listing) === null || _alm24 === void 0 || (_alm24 = _alm24.dataset) === null || _alm24 === void 0 ? void 0 : _alm24.woocommerce) === 'true' ? true : false;
    alm.scroll = ((_alm25 = alm) === null || _alm25 === void 0 || (_alm25 = _alm25.listing) === null || _alm25 === void 0 || (_alm25 = _alm25.dataset) === null || _alm25 === void 0 ? void 0 : _alm25.scroll) === 'false' ? false : true;
    alm.orginal_posts_per_page = parseInt(alm.listing.dataset.postsPerPage); // Used for paging add-on
    alm.posts_per_page = parseInt(alm.listing.dataset.postsPerPage);
    alm.offset = (_alm26 = alm) !== null && _alm26 !== void 0 && (_alm26 = _alm26.listing) !== null && _alm26 !== void 0 && (_alm26 = _alm26.dataset) !== null && _alm26 !== void 0 && _alm26.offset ? parseInt(alm.listing.dataset.offset) : 0;
    alm.paged = false;

    // Add-on Shortcode Params

    alm = queryLoopCreateParams(alm); // Query Loop add-on
    alm = elementorCreateParams(alm); // Elementor add-on
    alm = wooCreateParams(alm); // WooCommerce add-on
    alm = cacheCreateParams(alm); // Cache add-on
    alm = ctaCreateParams(alm); // CTA add-on
    alm = nextpageCreateParams(alm); // Nextpage add-on
    alm = singlepostsCreateParams(alm); // Single Posts add-on
    alm = commentsCreateParams(alm); // Comments add-on
    alm = preloadedCreateParams(alm); // Preloaded add-on.
    alm = pagingCreateParams(alm); // Paging add-on.
    alm = filtersCreateParams(alm); // Filters add-on.
    alm = seoCreateParams(alm); // SEO add-on.

    // Extension Shortcode Params

    // Users
    alm.extensions.users = alm.listing.dataset.users === 'true';
    if (alm.extensions.users) {
      // Override paging params for users
      alm.orginal_posts_per_page = parseInt(alm.listing.dataset.usersPerPage);
      alm.posts_per_page = parseInt(alm.listing.dataset.usersPerPage);
    }

    // REST API.
    alm.extensions.restapi = alm.listing.dataset.restapi === 'true';
    if (alm.extensions.restapi) {
      alm.extensions.restapi_base_url = alm.listing.dataset.restapiBaseUrl;
      alm.extensions.restapi_namespace = alm.listing.dataset.restapiNamespace;
      alm.extensions.restapi_endpoint = alm.listing.dataset.restapiEndpoint;
      alm.extensions.restapi_template_id = alm.listing.dataset.restapiTemplateId;
      alm.extensions.restapi_debug = alm.listing.dataset.restapiDebug;
      if (alm.extensions.restapi_template_id === '') {
        alm.extensions.restapi = false;
      }
    }

    // ACF.
    alm.extensions.acf = alm.listing.dataset.acf === 'true' ? true : false;
    if (alm.extensions.acf) {
      alm.extensions.acf_field_type = alm.listing.dataset.acfFieldType;
      alm.extensions.acf_field_name = alm.listing.dataset.acfFieldName;
      alm.extensions.acf_parent_field_name = alm.listing.dataset.acfParentFieldName;
      alm.extensions.acf_row_index = alm.listing.dataset.acfRowIndex;
      alm.extensions.acf_post_id = alm.listing.dataset.acfPostId;
      // if field type, name or post ID is empty.
      if (alm.extensions.acf_field_type === undefined || alm.extensions.acf_field_name === undefined || alm.extensions.acf_post_id === undefined) {
        alm.extensions.acf = false;
      }
    }

    // Term Query.
    alm.extensions.term_query = alm.listing.dataset.termQuery === 'true';
    if (alm.extensions.term_query) {
      alm.extensions.term_query_taxonomy = alm.listing.dataset.termQueryTaxonomy;
      alm.extensions.term_query_hide_empty = alm.listing.dataset.termQueryHideEmpty;
      alm.extensions.term_query_number = alm.listing.dataset.termQueryNumber;
    }

    /* Pause */
    if (alm.pause === undefined || alm.addons.seo && alm.start_page > 1) {
      // SEO only.
      alm.pause = false;
    }
    if (alm.addons.preloaded && alm.addons.seo && alm.start_page > 0) {
      // SEO + Preloaded.
      alm.pause = false;
    }
    if (alm.addons.filters && alm.addons.filters_startpage > 0) {
      // Filters.
      alm.pause = false;
    }
    if (alm.addons.preloaded && alm.addons.paging) {
      alm.pause = true;
    }

    /* Max Pages */
    alm.max_pages = alm.max_pages === undefined || alm.max_pages === 0 ? 9999 : alm.max_pages;

    /* Scroll Distance */
    alm.scroll_distance = alm.scroll_distance === undefined ? 100 : alm.scroll_distance;
    alm.scroll_distance_perc = false;
    if (alm.scroll_distance.toString().indexOf('%') === -1) {
      // Standard scroll_distance
      alm.scroll_distance = parseInt(alm.scroll_distance);
    } else {
      // Percentage scroll_distance
      alm.scroll_distance_perc = true;
      alm.scroll_distance_orig = parseInt(alm.scroll_distance);
      alm.scroll_distance = getScrollPercentage(alm);
    }

    /* Masonry */
    if (alm.transition === 'masonry') {
      alm = almMasonryConfig(alm);
    }

    /* Paging */
    if (alm.addons.paging) {
      // Add loading class to main container.
      alm.main.classList.add('alm-loading');
    } else {
      var almChildren = el.childNodes; // Get child nodes of instance [nodeList]
      if (almChildren) {
        var almChildArray = ajax_load_more_toConsumableArray(almChildren); // Convert nodeList to array

        // Filter array to find the `.alm-btn-wrap` div
        var btnWrap = almChildArray.filter(function (element) {
          if (!element.classList) {
            // If not element (#text node)
            return false;
          }
          return element.classList.contains('alm-btn-wrap');
        });
        alm.button = btnWrap ? btnWrap[0].querySelector('.alm-load-more-btn') : container.querySelector('.alm-btn-wrap .alm-load-more-btn');
      } else {
        alm.button = container.querySelector('.alm-btn-wrap .alm-load-more-btn');
      }

      // Reset button state
      alm.button.disabled = false;
      alm.button.style.display = '';
    }

    /**
     * No Results.
     * Set template for showing no results HTML.
     */
    var alm_no_results = el.querySelector('.alm-no-results');
    alm.no_results = alm_no_results ? alm_no_results.innerHTML : '';

    /**
     * Results Text.
     * Render "Showing x of y results" text.
     */
    if (alm.integration.woocommerce) {
      var _alm27;
      // If woocommerce, get the default woocommerce results block
      alm.resultsText = document.querySelectorAll('.woocommerce-result-count');
      if (((_alm27 = alm) === null || _alm27 === void 0 || (_alm27 = _alm27.resultsText) === null || _alm27 === void 0 ? void 0 : _alm27.length) < 1) {
        alm.resultsText = document.querySelectorAll('.alm-results-text');
      }
    } else {
      alm.resultsText = document.querySelectorAll('.alm-results-text');
    }
    if (alm.resultsText) {
      alm.resultsText.forEach(function (results) {
        results.setAttribute('aria-live', 'polite');
        results.setAttribute('aria-atomic', 'true');
      });
    } else {
      alm.resultsText = false;
    }

    // Table of Contents: Render 1, 2, 3 etc. when pages are loaded
    alm.tableofcontents = document.querySelector('.alm-toc') || false;
    if (alm.tableofcontents) {
      alm.tableofcontents.setAttribute('aria-live', 'polite');
      alm.tableofcontents.setAttribute('aria-atomic', 'true');
    }

    /**
     * The function to get posts via Ajax/HTTP request.
     *
     * @since 2.0.0
     */
    alm.AjaxLoadMore.loadPosts = function () {
      if (alm.disable_ajax) {
        return;
      }
      if (typeof almOnChange === 'function') {
        window.almOnChange(alm);
      }

      // Set loading attributes.
      alm.loading = true;
      alm.main.classList.add('alm-loading');
      placeholder('show', alm);

      // Add loading styles to buttons.
      if (!alm.addons.paging) {
        if (alm.rel === 'prev') {
          alm.buttonPrev.classList.add('loading');
          if (alm.prev_button_labels.loading) {
            alm.buttonPrev.innerHTML = alm.prev_button_labels.loading;
          }
        } else {
          alm.button.classList.add('loading');
          if (alm.button_labels.loading) {
            alm.button.innerHTML = alm.button_labels.loading;
          }
        }
      }

      // Dispatch Ajax request.
      alm.AjaxLoadMore.ajax();
    };

    /**
     * The core Ajax Load More Ajax function.
     *
     * @param {string} type The type of Ajax request [standard|totalposts|totalpages].
     * @since 2.6.0
     */
    alm.AjaxLoadMore.ajax = /*#__PURE__*/ajax_load_more_asyncToGenerator( /*#__PURE__*/ajax_load_more_regeneratorRuntime().mark(function _callee() {
      var type,
        _alm28,
        params,
        cache,
        _args = arguments;
      return ajax_load_more_regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            type = _args.length > 0 && _args[0] !== undefined ? _args[0] : 'standard';
            if (!alm.extensions.restapi) {
              _context.next = 5;
              break;
            }
            alm.AjaxLoadMore.restapi(alm);
            _context.next = 14;
            break;
          case 5:
            // Standard ALM.
            params = getAjaxParams(alm, type); // Cache.
            if (!((_alm28 = alm) !== null && _alm28 !== void 0 && (_alm28 = _alm28.addons) !== null && _alm28 !== void 0 && _alm28.cache && !['totalposts', 'totalpages'].includes(type))) {
              _context.next = 13;
              break;
            }
            _context.next = 9;
            return getCache(alm, Object.assign({}, params));
          case 9:
            cache = _context.sent;
            if (cache) {
              alm.AjaxLoadMore.render(cache);
            } else {
              alm.AjaxLoadMore.adminajax(params, type);
            }
            _context.next = 14;
            break;
          case 13:
            alm.AjaxLoadMore.adminajax(params, type);
          case 14:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));

    /**
     * Send request to the admin-ajax.php
     *
     * @param {Object} params Query params.
     * @param {string} type   The type of Ajax request [standard|totalposts|totalpages].
     * @since 5.0.0
     */
    alm.AjaxLoadMore.adminajax = /*#__PURE__*/function () {
      var _ref2 = ajax_load_more_asyncToGenerator( /*#__PURE__*/ajax_load_more_regeneratorRuntime().mark(function _callee2(params, type) {
        var _alm_localize4, url, _params, _params$cache_slug, cache_slug, data;
        return ajax_load_more_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _alm_localize4 = alm_localize, url = _alm_localize4.ajaxurl; // Get Ajax URL
              _params = params, _params$cache_slug = _params.cache_slug, cache_slug = _params$cache_slug === void 0 ? '' : _params$cache_slug; // Deconstruct query params.
              /**
               * Single Posts.
               * If `single_post_target`, adjust the Ajax URL to the post URL.
               */
              if (alm.addons.single_post && alm.addons.single_post_target) {
                url = "".concat(alm.addons.single_post_permalink, "?id=").concat(alm.addons.single_post_id, "&alm_page=").concat(parseInt(alm.page) + 1);
                params = '';
              }

              // Query Loop || WooCommerce || Elementor.
              if (alm.addons.queryloop || alm.addons.woocommerce || alm.addons.elementor && alm.addons.elementor_type === 'posts') {
                url = getButtonURL(alm, alm.rel);
                params = '';
              }

              // Make API request.
              _context2.next = 6;
              return lib_axios.get(url, {
                params: params
              }).then(function (response) {
                if (alm.addons.single_post && alm.addons.single_post_target) {
                  return singlepostsHTML(alm, response, cache_slug); // Single Posts
                } else if (alm.addons.woocommerce) {
                  return wooGetContent(alm, url, response, cache_slug); // WooCommerce.
                } else if (alm.addons.elementor) {
                  return elementorGetContent(alm, url, response, cache_slug); // Elementor
                } else if (alm.addons.queryloop) {
                  return queryLoopGetContent(alm, url, response, cache_slug); // Query Loop
                }

                return response.data; // Standard ALM.
              })["catch"](function (error) {
                alm.AjaxLoadMore.error(error);
              });
            case 6:
              data = _context2.sent;
              _context2.t0 = type;
              _context2.next = _context2.t0 === 'totalposts' ? 10 : _context2.t0 === 'totalpages' ? 10 : 12;
              break;
            case 10:
              if (alm.addons.paging && alm.addons.nextpage && typeof almBuildPagination === 'function') {
                window.almBuildPagination(data.totalpages, alm);
                alm.totalpages = data.totalpages;
              } else {
                if (alm.addons.paging && typeof almBuildPagination === 'function') {
                  window.almBuildPagination(data.totalposts, alm);
                }
              }
              return _context2.abrupt("break", 14);
            case 12:
              alm.AjaxLoadMore.render(data);
              return _context2.abrupt("break", 14);
            case 14:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }();

    /**
     * Send request to the WP REST API
     *
     * @param {Object} alm The Ajax Load More object.
     * @since 5.0.0
     */
    alm.AjaxLoadMore.restapi = function (alm) {
      var _alm_localize5 = alm_localize,
        rest_api_url = _alm_localize5.rest_api_url; // Get Rest API URL
      var _alm$extensions = alm.extensions,
        restapi_base_url = _alm$extensions.restapi_base_url,
        restapi_namespace = _alm$extensions.restapi_namespace,
        restapi_endpoint = _alm$extensions.restapi_endpoint,
        restapi_template_id = _alm$extensions.restapi_template_id;
      var alm_rest_template = wp.template(restapi_template_id);
      var alm_rest_url = "".concat(rest_api_url).concat(restapi_base_url, "/").concat(restapi_namespace, "/").concat(restapi_endpoint);
      var params = getRestAPIParams(alm);
      lib_axios.get(alm_rest_url, {
        params: params
      }).then(function (response) {
        // Success
        var results = response.data; // Get data from response
        var _results$html = results.html,
          items = _results$html === void 0 ? null : _results$html,
          _results$meta = results.meta,
          meta = _results$meta === void 0 ? null : _results$meta;
        var postcount = meta && meta.postcount ? meta.postcount : 0;
        var totalposts = meta && meta.totalposts ? meta.totalposts : 0;

        // loop results to get data from each.
        var data = '';
        for (var i = 0; i < items.length; i++) {
          var result = items[i];
          data += alm_rest_template(result);
        }

        // Rest API debug.
        if (alm.extensions.restapi_debug === 'true') {
          console.log('ALM RestAPI Debug:', items); // eslint-disable-line no-console
        }

        // Create results object.
        var obj = {
          html: data,
          meta: {
            postcount: postcount,
            totalposts: totalposts
          }
        };
        alm.AjaxLoadMore.render(obj);
      })["catch"](function (error) {
        // Error
        alm.AjaxLoadMore.error(error);
      });
    };

    /**
     * Display/render results function.
     *
     * @param {Object} data The results of the Ajax request.
     * @since 2.6.0
     */
    alm.AjaxLoadMore.render = /*#__PURE__*/function () {
      var _ref3 = ajax_load_more_asyncToGenerator( /*#__PURE__*/ajax_load_more_regeneratorRuntime().mark(function _callee8(data) {
        var _alm33;
        var html, meta, total, totalposts, nodes, temp, paging_container, currentPage;
        return ajax_load_more_regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              if (alm.addons.single_post) {
                alm.AjaxLoadMore.getSinglePost(); // Fetch  single post data for next post.
              }

              // Parse incoming data.
              html = data.html, meta = data.meta;
              total = meta ? parseInt(meta.postcount) : parseInt(alm.posts_per_page); // Get current post counts.
              totalposts = typeof meta !== 'undefined' ? meta.totalposts : alm.posts_per_page * 5;
              alm.totalposts = totalposts;
              alm.postcount = alm.addons.paging ? total : alm.postcount + total;

              // Set alm.html as plain text return.
              alm.html = html;
              if (!meta) {
                // Display warning if `meta` is missing from response.
                console.warn('Ajax Load More: Unable to access `meta` object in Ajax response. There may be an issue in your Repeater Template or another theme/plugin hook causing interference with the Ajax request.');
              }

              // ALM Init: First run only.
              if (alm.init) {
                if (meta) {
                  alm.main.dataset.totalPosts = meta.totalposts ? meta.totalposts : 0;
                }

                // No Results / ALM Empty.
                if (total === 0) {
                  if (alm.addons.paging && typeof almPagingEmpty === 'function') {
                    window.almPagingEmpty(alm);
                  }
                  if (typeof almEmpty === 'function') {
                    window.almEmpty(alm);
                  }
                  if (alm.no_results) {
                    noResults(alm.content, alm.no_results);
                  }
                }

                // Paging Add-on.
                if (alm.addons.paging) {
                  // Dispatch call to build pagination.
                  if (typeof almBuildPagination === 'function') {
                    window.almBuildPagination(totalposts, alm, false);
                  }
                  if (total > 0) {
                    // Reset container opacity.
                    alm.addons.paging_container.style.opacity = 0;

                    // Start paging functionaity.
                    alm.AjaxLoadMore.pagingInit();
                  }
                }

                // SEO Offset.
                if (alm.addons.seo && alm.addons.seo_offset && !alm.addons.paging) {
                  createSEOOffset(alm);
                }

                /**
                 * SEO & Filters add-on.
                 * Handle isPaged results.
                 */
                if (alm.paged) {
                  // Reset the posts_per_page value.
                  if (alm.addons.seo || alm.addons.filters || alm.extensions.users) {
                    // Reset posts per page value.
                    alm.posts_per_page = alm.orginal_posts_per_page;
                  }

                  // SEO add-on.
                  if (alm.addons.seo) {
                    alm.page = alm.start_page ? alm.start_page - 1 : alm.page; // Set new page number.
                  }

                  // Filters add-on.
                  if (alm.addons.filters && alm.addons.filters_startpage > 0) {
                    alm.page = alm.addons.filters_startpage - 1; // Set new page number.
                  }
                }
                // Filters onLoad
                if (typeof almFiltersOnload === 'function') {
                  window.almFiltersOnload(alm);
                }
              }
              // End ALM Init.

              /**
               * Set Filter Facets.
               */
              if (alm.addons.filters && alm.facets && data.facets && typeof almFiltersFacets === 'function') {
                window.almFiltersFacets(data.facets);
              }

              /**
               * Display alm_debug results.
               */
              almDebug(alm);

              /**
               * Set localized variables and Results Text.
               */
              ajax_load_more_asyncToGenerator( /*#__PURE__*/ajax_load_more_regeneratorRuntime().mark(function _callee3() {
                return ajax_load_more_regeneratorRuntime().wrap(function _callee3$(_context3) {
                  while (1) switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return setLocalizedVars(alm);
                    case 2:
                    case "end":
                      return _context3.stop();
                  }
                }, _callee3);
              }))();

              // Get all returned data as an array of DOM nodes.
              nodes = alm.container_type === 'table' ? tableParser(alm.html) : domParser(alm.html);
              alm.last_loaded = nodes;

              // Render results.
              if (!(total > 0)) {
                _context8.next = 52;
                break;
              }
              if (!(alm.addons.woocommerce || alm.addons.elementor || alm.addons.queryloop)) {
                _context8.next = 21;
                break;
              }
              temp = document.createElement('div');
              temp.innerHTML = html;
              ajax_load_more_asyncToGenerator( /*#__PURE__*/ajax_load_more_regeneratorRuntime().mark(function _callee4() {
                return ajax_load_more_regeneratorRuntime().wrap(function _callee4$(_context4) {
                  while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                      if (!alm.addons.woocommerce) {
                        _context4.next = 4;
                        break;
                      }
                      _context4.next = 3;
                      return woocommerce(temp, alm);
                    case 3:
                      woocommerceLoaded(alm);
                    case 4:
                      if (!alm.addons.elementor) {
                        _context4.next = 8;
                        break;
                      }
                      _context4.next = 7;
                      return elementor(temp, alm);
                    case 7:
                      elementorLoaded(alm);
                    case 8:
                      if (!alm.addons.queryloop) {
                        _context4.next = 12;
                        break;
                      }
                      _context4.next = 11;
                      return queryLoop(temp, alm);
                    case 11:
                      queryLoopLoaded(alm);
                    case 12:
                    case "end":
                      return _context4.stop();
                  }
                }, _callee4);
              }))()["catch"](function (e) {
                if (alm.addons.woocommerce) {
                  console.warn('Ajax Load More: There was an error loading WooCommerce products.', e);
                }
                if (alm.addons.elementor) {
                  console.warn('Ajax Load More: There was an error loading Clementor items.', e);
                }
                if (alm.addons.queryloop) {
                  console.warn('Ajax Load More: There was an error loading Query Loop items.', e);
                }
              });
              alm.init = false;
              return _context8.abrupt("return");
            case 21:
              if (alm.addons.paging) {
                _context8.next = 36;
                break;
              }
              /**
               * Infinite Scroll Results.
               */
              nodes = formatHTML(alm, nodes);
              _context8.t0 = alm.transition;
              _context8.next = _context8.t0 === 'masonry' ? 26 : 30;
              break;
            case 26:
              _context8.next = 28;
              return displayResults(alm, nodes);
            case 28:
              // Wrap almMasonry in anonymous async/await function
              ajax_load_more_asyncToGenerator( /*#__PURE__*/ajax_load_more_regeneratorRuntime().mark(function _callee5() {
                return ajax_load_more_regeneratorRuntime().wrap(function _callee5$(_context5) {
                  while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.next = 2;
                      return almMasonry(alm, alm.init, alm_is_filtering);
                    case 2:
                      alm.masonry.init = false;
                      triggerWindowResize();

                      // Callback: ALM Complete
                      if (typeof almComplete === 'function') {
                        window.almComplete(alm);
                      }
                    case 5:
                    case "end":
                      return _context5.stop();
                  }
                }, _callee5);
              }))()["catch"](function () {
                console.error('There was an error with ALM Masonry'); //eslint-disable-line no-console
              });
              return _context8.abrupt("break", 33);
            case 30:
              _context8.next = 32;
              return displayResults(alm, nodes);
            case 32:
              return _context8.abrupt("break", 33);
            case 33:
              // Infinite Scroll -> Images Loaded: Run complete callbacks and checks.
              ajax_load_more_imagesLoaded(alm.listing, function () {
                alm.AjaxLoadMore.nested(); // Nested ALM.

                if (alm_is_filtering && alm.addons.filters) {
                  if (typeof almFiltersAddonComplete === 'function') {
                    window.almFiltersAddonComplete(el); // Callback: Filters Add-on Complete
                  }
                }

                if (typeof almComplete === 'function' && alm.transition !== 'masonry') {
                  window.almComplete(alm); // Callback: ALM Complete
                }

                // Trigger <script /> tags in templates.
                modules_insertScript.init(alm.last_loaded);

                // ALM Done.
                if (!alm.addons.single_post) {
                  if (alm.addons.nextpage) {
                    var _alm29, _alm30;
                    // Nextpage.
                    if (((_alm29 = alm) === null || _alm29 === void 0 || (_alm29 = _alm29.localize) === null || _alm29 === void 0 ? void 0 : _alm29.post_count) + (alm.addons.nextpage_startpage - 1) >= ((_alm30 = alm) === null || _alm30 === void 0 || (_alm30 = _alm30.localize) === null || _alm30 === void 0 ? void 0 : _alm30.total_posts)) {
                      alm.AjaxLoadMore.triggerDone();
                    }
                  } else {
                    var _alm31, _alm32;
                    if (((_alm31 = alm) === null || _alm31 === void 0 || (_alm31 = _alm31.localize) === null || _alm31 === void 0 ? void 0 : _alm31.post_count) >= ((_alm32 = alm) === null || _alm32 === void 0 || (_alm32 = _alm32.localize) === null || _alm32 === void 0 ? void 0 : _alm32.total_posts)) {
                      alm.AjaxLoadMore.triggerDone();
                    }
                  }
                }
                alm_is_filtering = false;
              });
              /**
               * End: Infinite Scroll Results.
               */
              _context8.next = 50;
              break;
            case 36:
              /**
               * Paging.
               */
              paging_container = alm.addons.paging_container;
              if (!alm.init) {
                _context8.next = 44;
                break;
              }
              if (!paging_container) {
                _context8.next = 42;
                break;
              }
              _context8.next = 41;
              return displayPagingResults(alm, nodes);
            case 41:
              // Inject content.

              // Paging -> Images Loaded: Run complete callbacks and checks.
              ajax_load_more_imagesLoaded(paging_container, /*#__PURE__*/ajax_load_more_asyncToGenerator( /*#__PURE__*/ajax_load_more_regeneratorRuntime().mark(function _callee6() {
                return ajax_load_more_regeneratorRuntime().wrap(function _callee6$(_context6) {
                  while (1) switch (_context6.prev = _context6.next) {
                    case 0:
                      pagingComplete(alm, alm_is_filtering, true);
                      alm_is_filtering = false;
                    case 2:
                    case "end":
                      return _context6.stop();
                  }
                }, _callee6);
              })));
            case 42:
              _context8.next = 50;
              break;
            case 44:
              if (!paging_container) {
                _context8.next = 50;
                break;
              }
              _context8.next = 47;
              return almFadeOut(paging_container, 250);
            case 47:
              _context8.next = 49;
              return displayPagingResults(alm, nodes);
            case 49:
              // Inject content.

              // Paging -> Images Loaded: Run complete callbacks and checks.
              ajax_load_more_imagesLoaded(paging_container, /*#__PURE__*/ajax_load_more_asyncToGenerator( /*#__PURE__*/ajax_load_more_regeneratorRuntime().mark(function _callee7() {
                return ajax_load_more_regeneratorRuntime().wrap(function _callee7$(_context7) {
                  while (1) switch (_context7.prev = _context7.next) {
                    case 0:
                      _context7.next = 2;
                      return almFadeIn(paging_container, 250);
                    case 2:
                      paging_container.style.opacity = '';
                      pagingComplete(alm, alm_is_filtering);
                      alm_is_filtering = false;
                    case 5:
                    case "end":
                      return _context7.stop();
                  }
                }, _callee7);
              })));
            case 50:
              _context8.next = 54;
              break;
            case 52:
              /**
               * No results from Ajax.
               */
              alm.AjaxLoadMore.noresults();
              alm.AjaxLoadMore.transitionEnd();
            case 54:
              /**
               * Destroy After
               */
              if (alm.destroy_after) {
                currentPage = alm.page + 1; // Add 1 because alm.page starts at 0
                currentPage = alm.addons.preloaded ? currentPage++ : currentPage; // Add 1 for preloaded
                if (parseInt(currentPage) === parseInt(alm.destroy_after)) {
                  alm.AjaxLoadMore.destroyed(); // Disable ALM if page = alm.destroy_after value.
                }
              }

              /**
               * Display Table of Contents
               */
              tableOfContents(alm, alm.init);

              /**
               * Set Focus for accessibility.
               */
              if ((_alm33 = alm) !== null && _alm33 !== void 0 && (_alm33 = _alm33.last_loaded) !== null && _alm33 !== void 0 && _alm33.length) {
                setFocus(alm, alm.last_loaded[0], total, alm_is_filtering);
              }
              alm.main.classList.remove('alm-is-filtering'); // Remove filtering class.

              if (alm.init) {
                alm.main.classList.add('alm-is-loaded'); // Add loaded class to main container.
              }

              alm.init = false; // Set init flag.
            case 60:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }();

    /**
     * Function runs when no results are returned.
     *
     * @since 5.3.1
     */
    alm.AjaxLoadMore.noresults = function () {
      if (!alm.addons.paging) {
        var _alm34, _alm35;
        // Add .done class, reset btn text
        (_alm34 = alm) === null || _alm34 === void 0 || (_alm34 = _alm34.button) === null || _alm34 === void 0 || (_alm34 = _alm34.classList) === null || _alm34 === void 0 || _alm34.remove('loading');
        (_alm35 = alm) === null || _alm35 === void 0 || (_alm35 = _alm35.button) === null || _alm35 === void 0 || (_alm35 = _alm35.classList) === null || _alm35 === void 0 || _alm35.add('done');
        alm.AjaxLoadMore.resetBtnText();
      }

      // Callback: ALM Complete
      if (typeof almComplete === 'function' && alm.transition !== 'masonry') {
        window.almComplete(alm);
      }

      // Filters Add-on Complete
      if (alm_is_filtering && alm.addons.filters) {
        if (typeof almFiltersAddonComplete === 'function') {
          window.almFiltersAddonComplete(el);
        }
        alm_is_filtering = false;
      }

      // Masonry, clear `alm-listing` height.
      if (alm.transition === 'masonry') {
        alm.content.style.height = 'auto';
      }

      // ALM Done
      alm.AjaxLoadMore.triggerDone();
    };

    /**
     * Init Paging + Preloaded add-ons.
     *
     * @param {string} html Results of Ajax request.
     * @since 2.11.3
     */
    alm.AjaxLoadMore.pagingPreloadedInit = function () {
      var html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      alm.AjaxLoadMore.pagingInit(); // Set up paging functionality.

      if (!html) {
        if (typeof almPagingEmpty === 'function') {
          window.almPagingEmpty(alm);
        }
        if (typeof almEmpty === 'function') {
          window.almEmpty(alm);
        }
        if (alm.no_results) {
          noResults(alm.content, alm.no_results);
        }
      }
    };

    /**
     * Init Paging + Next Page add-ons.
     *
     * @since 2.14.0
     */
    alm.AjaxLoadMore.pagingNextpageInit = function () {
      alm.AjaxLoadMore.pagingInit(); // Set up paging functionality.

      if (typeof almSetNextPageVars === 'function') {
        window.almSetNextPageVars(alm); // Set up Nextpage Vars.
      }
    };

    /**
     * Paging add-on first to create required containers.
     *
     * @since 5.0
     */
    alm.AjaxLoadMore.pagingInit = function () {
      var paging_container = alm.addons.paging_container; // Get content container.

      if (paging_container) {
        almFadeIn(paging_container, 150); // Fade in paging container.

        // Delay reveal of paging content.
        setTimeout(function () {
          alm.main.classList.remove('alm-loading'); // Remove `alm-loading` class
        }, 150);

        // Delay initial pagination display to avoid positioning issues.
        setTimeout(function () {
          paging_container.style.removeProperty('opacity'); // Remove initial opacity prop.

          if (typeof almFadePageControls === 'function') {
            window.almFadePageControls(alm.btnWrap); // Fade in paging controls.
          }

          if (typeof almPagingSetHeight === 'function') {
            window.almPagingSetHeight(paging_container); // Fade in container height.
          }
        }, 275);
      }
    };

    /**
     *	Automatically trigger nested ALM instances.
     *
     * @since 5.0
     */
    alm.AjaxLoadMore.nested = function () {
      var nested = alm.listing.querySelectorAll('.ajax-load-more-wrap:not(.alm-is-loaded)'); // Get all new instances
      if (nested) {
        ajax_load_more_toConsumableArray(nested).forEach(function (element) {
          window.almInit(element);
        });
      }
    };

    /**
     *  Get the Single Posts post ID via ajax.
     *
     *  @since 2.7.4
     */
    alm.AjaxLoadMore.getSinglePost = /*#__PURE__*/ajax_load_more_asyncToGenerator( /*#__PURE__*/ajax_load_more_regeneratorRuntime().mark(function _callee9() {
      var params, singlePostData;
      return ajax_load_more_regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            if (!alm.fetchingPreviousPost) {
              _context9.next = 2;
              break;
            }
            return _context9.abrupt("return");
          case 2:
            alm.fetchingPreviousPost = true; // Set loading flag.

            // Create data params.
            params = {
              action: 'alm_get_single',
              id: alm.addons.single_post_id,
              initial_id: alm.addons.single_post_init_id,
              order: alm.addons.single_post_order,
              taxonomy: alm.addons.single_post_taxonomy,
              excluded_terms: alm.addons.single_post_excluded_terms,
              post_type: alm.post_type,
              init: alm.addons.single_post_init
            }; // Send HTTP request via Axios.
            _context9.next = 6;
            return lib_axios.get(alm_localize.ajaxurl, {
              params: params
            }).then(function (response) {
              // Get data from response.
              var data = response.data;
              if (data.has_previous_post) {
                alm.listing.dataset.singlePostId = data.prev_id; // Update single-post-id on instance
                alm.addons.single_post_id = data.prev_id;
                alm.addons.single_post_permalink = data.prev_permalink;
                alm.addons.single_post_title = data.prev_title;
                alm.addons.single_post_slug = data.prev_slug;
                alm.addons.single_post_cache = data.cache;
              } else {
                alm.addons.single_post_cache = false;
                if (!data.has_previous_post) {
                  alm.AjaxLoadMore.triggerDone();
                }
              }
              if (typeof window.almSetSinglePost === 'function') {
                window.almSetSinglePost(alm, data.current_id, data.permalink, data.title);
              }
              alm.fetchingPreviousPost = false;
              alm.addons.single_post_init = false;
              return data;
            })["catch"](function (error) {
              // Error
              alm.AjaxLoadMore.error(error);
              alm.fetchingPreviousPost = false;
            });
          case 6:
            singlePostData = _context9.sent;
            return _context9.abrupt("return", singlePostData);
          case 8:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    }));
    if (alm.addons.single_post_id) {
      alm.fetchingPreviousPost = false;
      alm.addons.single_post_init = true;
    }

    /**
     * Triggers various add-on functions after load complete.
     *
     * @param {Object} alm The ALM object.
     * @since 2.14.0
     */
    alm.AjaxLoadMore.triggerAddons = function (alm) {
      if (typeof almSetNextPage === 'function' && alm.addons.nextpage) {
        window.almSetNextPage(alm);
      }
      if (typeof almSEO === 'function' && alm.addons.seo) {
        window.almSEO(alm, false);
      }
      if (typeof almWooCommerce === 'function' && alm.addons.woocommerce) {
        window.almWooCommerce(alm);
      }
      if (typeof almElementor === 'function' && alm.addons.elementor) {
        window.almElementor(alm);
      }
    };

    /**
     * Fires a set of actions and functions when ALM has no other posts to load.
     *
     * @since 2.11.3
     */
    alm.AjaxLoadMore.triggerDone = function () {
      alm.loading = false;
      alm.finished = true;
      placeholder('hide', alm);
      if (!alm.addons.paging) {
        if (alm.button_labels.done) {
          setTimeout(function () {
            alm.button.innerHTML = alm.button_labels.done;
          }, 75);
        }
        alm.button.classList.add('done');
        alm.button.removeAttribute('rel');
        alm.button.disabled = true;
      }

      // almDone
      if (typeof almDone === 'function') {
        // Delay done until animations complete
        setTimeout(function () {
          window.almDone(alm);
        }, alm.speed + 10);
      }
    };

    /**
     * Fires a set of actions once ALm Previous hits the first page.
     *
     * @since 5.5.0
     */
    alm.AjaxLoadMore.triggerDonePrev = function () {
      alm.loading = false;
      placeholder('hide', alm);
      if (!alm.addons.paging) {
        alm.buttonPrev.classList.add('done');
        alm.buttonPrev.style.opacity = '0.5';
        alm.buttonPrev.disabled = true;
        if (alm.prev_button_labels.done) {
          setTimeout(function () {
            alm.buttonPrev.innerHTML = alm.prev_button_labels.done;
          }, 75);
        }
      }

      // almDonePrev Callback.
      if (typeof almDonePrev === 'function') {
        // Delay done until animations complete
        setTimeout(function () {
          window.almDonePrev(alm);
        }, alm.speed + 10);
      }
    };

    /**
     * Resets the loading button text after loading has completed.
     *
     * @since 2.8.4
     */
    alm.AjaxLoadMore.resetBtnText = function () {
      if (alm.button && alm.button_labels.loading) {
        alm.button.innerHTML = alm.button_labels["default"];
      }
      if (alm.buttonPrev && alm.prev_button_labels.loading) {
        alm.buttonPrev.innerHTML = alm.prev_button_labels["default"];
      }
    };

    /**
     * Button click handler to load posts.
     *
     * @param {Object} e The target button element.
     * @since 4.2.0
     */
    alm.AjaxLoadMore.click = function (e) {
      if (isBlockEditor && alm.addons.queryloop) {
        return; //
      }

      var button = e.currentTarget || e.target;
      alm.rel = 'next';
      if (alm.pause === 'true') {
        alm.pause = false;
        alm.pause_override = false;
        alm.AjaxLoadMore.loadPosts();
      }
      if (!alm.loading && !alm.finished && !button.classList.contains('done')) {
        alm.loading = true;
        alm.page++;
        alm.AjaxLoadMore.loadPosts();
      }
      button.blur(); // Remove button focus
    };

    /**
     * Button click handler for previous load more.
     *
     * @param {Object} e The target button element.
     * @since 5.5.0
     */
    alm.AjaxLoadMore.prevClick = function (e) {
      var button = e.currentTarget || e.target;
      e.preventDefault();
      if (!alm.loading && !button.classList.contains('done')) {
        alm.loading = true;
        alm.pagePrev--;
        alm.rel = 'prev';
        alm.AjaxLoadMore.loadPosts();
        button.blur(); // Remove button focus
      }
    };

    /**
     * Set the Load Previous button to alm object.
     *
     * @param {Element} button The button element.
     * @since 5.5.0
     */
    alm.AjaxLoadMore.setPreviousButton = function (button) {
      alm.pagePrev = alm.page;
      alm.buttonPrev = button;
    };

    /**
     * Load More button click event handler.
     *
     * @since 1.0.0
     */
    if (!alm.addons.paging && !alm.fetchingPreviousPost) {
      alm.button.onclick = alm.AjaxLoadMore.click;
    }

    /**
     * Window resize functions for Paging, Scroll Distance Percentage etc.
     *
     * @since 2.1.2
     */
    if (alm.addons.paging || alm.scroll_distance_perc || alm.scroll_direction === 'horizontal') {
      var resize;
      alm.window.onresize = function () {
        clearTimeout(resize);
        resize = setTimeout(function () {
          if (alm.addons.paging) {
            // Paging
            if (typeof almOnWindowResize === 'function') {
              window.almOnWindowResize(alm);
            }
          }
          if (alm.scroll_distance_perc) {
            alm.scroll_distance = getScrollPercentage(alm);
          }
          if (alm.scroll_direction === 'horizontal') {
            alm.AjaxLoadMore.horizontal();
          }
        }, alm.speed);
      };
    }

    /**
     * Check to see if element is visible before loading posts.
     *
     * @since 2.1.2
     */
    alm.AjaxLoadMore.isVisible = function () {
      // Check for a width and height to determine visibility
      alm.visible = alm.main.clientWidth > 0 && alm.main.clientHeight > 0 ? true : false;
      return alm.visible;
    };

    /**
     * Load posts as user scrolls the page.
     *
     * @since 1.0
     */
    alm.AjaxLoadMore.scroll = function () {
      if (alm.timer) {
        clearTimeout(alm.timer);
      }
      alm.timer = setTimeout(function () {
        if (alm.AjaxLoadMore.isVisible() && !alm.fetchingPreviousPost) {
          var trigger = alm.trigger.getBoundingClientRect();
          var btnPos = Math.round(trigger.top - alm.window.innerHeight) + alm.scroll_distance;
          var scrollTrigger = btnPos <= 0 ? true : false;

          // Scroll Container
          if (alm.window !== window) {
            var scrollHeight = alm.main.offsetHeight; // ALM height
            var scrollWidth = alm.main.offsetWidth; // ALM Width
            var scrollPosition = '';
            if (alm.scroll_direction === 'horizontal') {
              // Left/Right
              alm.AjaxLoadMore.horizontal();
              scrollPosition = Math.round(alm.window.scrollLeft + alm.window.offsetWidth - alm.scroll_distance); // How far user has scrolled
              scrollTrigger = scrollWidth <= scrollPosition ? true : false;
            } else {
              // Up/Down
              scrollPosition = Math.round(alm.window.scrollTop + alm.window.offsetHeight - alm.scroll_distance); // How far user has scrolled
              scrollTrigger = scrollHeight <= scrollPosition ? true : false;
            }
          }

          // If Pause && Pause Override
          if (!alm.loading && !alm.finished && scrollTrigger && alm.page < alm.max_pages - 1 && alm.proceed && alm.pause === 'true' && alm.pause_override === 'true') {
            alm.button.click();
          }

          // Standard Scroll
          else {
            if (!alm.loading && !alm.finished && scrollTrigger && alm.page < alm.max_pages - 1 && alm.proceed && alm.pause !== 'true') {
              alm.button.click();
            }
          }
        }
      }, 25);
    };

    /**
     * Add scroll eventlisteners, only when needed.
     *
     * @since 5.2.0
     */
    alm.AjaxLoadMore.scrollSetup = function () {
      if (alm.scroll && !alm.addons.paging) {
        if (alm.scroll_container) {
          // Scroll Container
          alm.window = document.querySelector(alm.scroll_container) ? document.querySelector(alm.scroll_container) : alm.window;
          setTimeout(function () {
            // Delay to allow for ALM container to resize on load.
            alm.AjaxLoadMore.horizontal();
          }, 500);
        }
        alm.window.addEventListener('scroll', alm.AjaxLoadMore.scroll); // Scroll
        alm.window.addEventListener('touchstart', alm.AjaxLoadMore.scroll); // Touch Devices
        alm.window.addEventListener('wheel', function (e) {
          // Mousewheel
          var direction = Math.sign(e.deltaY);
          if (direction > 0) {
            alm.AjaxLoadMore.scroll();
          }
        });
        alm.window.addEventListener('keyup', function (e) {
          var key = e.key;
          switch (key) {
            case 'End':
            case 'PageDown':
              alm.AjaxLoadMore.scroll();
              break;
          }
        });
      }
    };

    /**
     * Configure horizontal scroll settings.
     *
     * @since 5.3.6
     */
    alm.AjaxLoadMore.horizontal = function () {
      if (alm.scroll_direction === 'horizontal') {
        alm.main.style.width = "".concat(alm.listing.offsetWidth, "px");
      }
    };

    /**
     * Destroy Ajax Load More functionality.
     *
     * @since 3.4.2
     */
    alm.AjaxLoadMore.destroyed = function () {
      alm.disable_ajax = true;
      if (!alm.addons.paging) {
        alm.button.style.display = 'none';
        alm.AjaxLoadMore.triggerDone();
        if (typeof almDestroyed === 'function') {
          window.almDestroyed(alm);
        }
      }
    };

    /**
     * Set variables after loading transition completes.
     *
     * @since 3.5
     */
    alm.AjaxLoadMore.transitionEnd = function () {
      setTimeout(function () {
        alm.AjaxLoadMore.resetBtnText();
        alm.main.classList.remove('alm-loading');

        // Loading buttons.
        if (alm.rel === 'prev') {
          var _alm36;
          (_alm36 = alm) === null || _alm36 === void 0 || (_alm36 = _alm36.buttonPrev) === null || _alm36 === void 0 || (_alm36 = _alm36.classList) === null || _alm36 === void 0 || _alm36.remove('loading');
        } else {
          var _alm37;
          (_alm37 = alm) === null || _alm37 === void 0 || (_alm37 = _alm37.button) === null || _alm37 === void 0 || (_alm37 = _alm37.classList) === null || _alm37 === void 0 || _alm37.remove('loading');
        }
        alm.AjaxLoadMore.triggerAddons(alm);
        if (!alm.addons.paging) {
          setTimeout(function () {
            alm.loading = false; // Delay to prevent loading to fast
          }, alm.speed * 2);
        }
      }, 25);

      // Hide loading placeholder.
      placeholder('hide', alm);
    };

    /**
     * Set individual localized variable.
     *
     * @param {string} name
     * @param {string} value
     * @since 4.1
     */
    alm.AjaxLoadMore.setLocalizedVar = function () {
      var _alm38;
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      if ((_alm38 = alm) !== null && _alm38 !== void 0 && _alm38.localize && name !== '' && value !== '') {
        alm.localize[name] = value; // Set ALM localize var.
        window[alm.localized_var][name] = value; // Update vars.
      }
    };

    /**
     * Init Ajax load More functionality and add-ons.
     *
     * @since 2.0
     */
    alm.AjaxLoadMore.init = /*#__PURE__*/ajax_load_more_asyncToGenerator( /*#__PURE__*/ajax_load_more_regeneratorRuntime().mark(function _callee12() {
      var nextpage_pages, _alm39, nextpage_first, nextpage_total;
      return ajax_load_more_regeneratorRuntime().wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            // Preloaded and Destroy After is 1.
            if (alm.addons.preloaded && alm.destroy_after === 1) {
              alm.AjaxLoadMore.destroyed();
            }

            // Paging Add-on.
            if (alm.addons.paging) {
              if (alm.addons.preloaded) {
                // Preloaded.
                alm.AjaxLoadMore.ajax('totalposts');
              } else if (alm.addons.nextpage) {
                // Next Page.
                alm.AjaxLoadMore.ajax('totalpages');
              } else {
                // Standard.
                alm.AjaxLoadMore.loadPosts();
              }
            }

            // Not Paging & not Single Post.
            if (!alm.addons.paging && !alm.addons.single_post) {
              if (alm.disable_ajax) {
                alm.finished = true;
                alm.button.classList.add('done');
              } else {
                // Set button label.
                alm.button.innerHTML = alm.button_labels["default"];

                // Check pause.
                if (alm.pause === 'true') {
                  alm.loading = false;
                } else {
                  alm.AjaxLoadMore.loadPosts();
                }
              }
            }

            // Single Post Add-on.
            if (alm.addons.single_post) {
              // Add delay for setup and scripts to load.
              setTimeout( /*#__PURE__*/ajax_load_more_asyncToGenerator( /*#__PURE__*/ajax_load_more_regeneratorRuntime().mark(function _callee10() {
                return ajax_load_more_regeneratorRuntime().wrap(function _callee10$(_context10) {
                  while (1) switch (_context10.prev = _context10.next) {
                    case 0:
                      _context10.next = 2;
                      return alm.AjaxLoadMore.getSinglePost();
                    case 2:
                      // Set next post on load

                      // Trigger done if custom query and no posts to render
                      if (alm.addons.single_post_query && alm.addons.single_post_order === '') {
                        alm.AjaxLoadMore.triggerDone();
                      }
                      alm.loading = false;
                      tableOfContents(alm, true, true);
                    case 5:
                    case "end":
                      return _context10.stop();
                  }
                }, _callee10);
              })), 250);
            }

            // Query Loop Add-on.
            if (alm.addons.queryloop && alm.addons.queryloop_settings) {
              queryLoopInit(alm);
            }

            // Preloaded + SEO && !Paging.
            if (alm.addons.preloaded && alm.addons.seo && !alm.addons.paging) {
              // Add delay for setup and scripts to load.
              setTimeout(function () {
                if (typeof almSEO === 'function' && alm.start_page < 1) {
                  window.almSEO(alm, true);
                }
              }, 200);
            }

            // Preloaded && !Paging.
            if (alm.addons.preloaded && !alm.addons.paging) {
              // Add delay for setup and scripts to load.
              setTimeout(function () {
                if (alm.addons.preloaded_total_posts <= alm.addons.preloaded_amount) {
                  alm.AjaxLoadMore.triggerDone();
                }
                // almEmpty callback.
                if (alm.addons.preloaded_total_posts === 0) {
                  if (typeof almEmpty === 'function') {
                    window.almEmpty(alm);
                  }
                  if (alm.no_results) {
                    noResults(alm.content, alm.no_results);
                  }
                }
              }, alm.speed);
            }

            // Preloaded Add-on ONLY.
            if (alm.addons.preloaded) {
              if (alm.resultsText) {
                almInitResultsText(alm, 'preloaded');
              }
              tableOfContents(alm, alm.init, true);
            }

            // Next Page Add-on.
            if (alm.addons.nextpage) {
              // Check that posts remain on load
              if (alm.listing.querySelector('.alm-nextpage') && !alm.addons.paging) {
                nextpage_pages = alm.listing.querySelectorAll('.alm-nextpage'); // All Next Page Items.
                if (nextpage_pages) {
                  nextpage_first = nextpage_pages[0];
                  nextpage_total = nextpage_first.dataset.totalPosts ? parseInt(nextpage_first.dataset.totalPosts) : (_alm39 = alm) === null || _alm39 === void 0 || (_alm39 = _alm39.localize) === null || _alm39 === void 0 ? void 0 : _alm39.total_posts; // Disable if last page loaded
                  if (nextpage_pages.length === nextpage_total || parseInt(nextpage_first.dataset.page) === nextpage_total) {
                    alm.AjaxLoadMore.triggerDone();
                  }
                }
              }
              if (alm.resultsText) {
                almInitResultsText(alm, 'nextpage');
              }
              tableOfContents(alm, alm.init, true);
            }

            // WooCommerce Add-on.
            if (alm.addons.woocommerce) {
              wooInit(alm);
              if (alm.addons.woocommerce_settings.paged >= parseInt(alm.addons.woocommerce_settings.pages)) {
                alm.AjaxLoadMore.triggerDone(); // Done if `paged is less than `pages`.
              }
            }

            // Elementor Add-on.
            if (alm.addons.elementor && alm.addons.elementor_type && alm.addons.elementor_type === 'posts') {
              elementorInit(alm);
              if (!alm.addons.elementor_next_page) {
                alm.AjaxLoadMore.triggerDone(); // Done if `elementor_next_page` is false.
              }
            }

            // Window Load.
            alm.window.addEventListener('load', function () {
              // Masonry & Preloaded.
              if (alm.transition === 'masonry' && alm.addons.preloaded) {
                // Wrap almMasonry in anonymous async/await function
                ajax_load_more_asyncToGenerator( /*#__PURE__*/ajax_load_more_regeneratorRuntime().mark(function _callee11() {
                  return ajax_load_more_regeneratorRuntime().wrap(function _callee11$(_context11) {
                    while (1) switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return almMasonry(alm, true, false);
                      case 2:
                        alm.masonry.init = false;
                      case 3:
                      case "end":
                        return _context11.stop();
                    }
                  }, _callee11);
                }))()["catch"](function () {
                  console.error('There was an error with ALM Masonry');
                });
              }

              //  Filters, Facets & Preloaded Facets
              if (alm.addons.preloaded && alm.addons.filters && alm.facets) {
                if (typeof almFiltersFacets === 'function') {
                  var _alm40;
                  var facets = (_alm40 = alm) === null || _alm40 === void 0 || (_alm40 = _alm40.localize) === null || _alm40 === void 0 ? void 0 : _alm40.facets;
                  if (facets) {
                    window.almFiltersFacets(facets);
                  }
                }
              }

              // Window Load Callback.
              if (typeof almOnLoad === 'function') {
                window.almOnLoad(alm); // eslint-disable-line
              }
            });

            setPreloadedParams(alm); // Set preloaded params.
          case 13:
          case "end":
            return _context12.stop();
        }
      }, _callee12);
    }));

    /**
     * Handle API errors by reseting the loading state and button text.
     *
     * @param {string} error The error message.
     * @since 2.6.0
     */
    alm.AjaxLoadMore.error = function (error) {
      console.error('Ajax Load More: There was an error with the Ajax request.', error); //eslint-disable-line no-console
      alm.loading = false;
      if (!alm.addons.paging) {
        alm.button.classList.remove('loading');
        alm.AjaxLoadMore.resetBtnText();
      }
    };

    /**
     * Update Current Page.
     * Note: Callback function triggered from Paging add-on.
     *
     * @param {number} current Current page number.
     * @param {Object} obj     Optional object (Deprecated).
     * @param {Object} alm     The ALM object.
     * @since 2.7.0
     */
    window.almUpdateCurrentPage = function (current, obj, alm) {
      // eslint-disable-line
      alm.page = current;
      alm.page = alm.addons.nextpage && !alm.addons.paging ? alm.page - 1 : alm.page; // Next Page add-on

      var target = alm.listing;
      var data = target === null || target === void 0 ? void 0 : target.innerHTML; // Get content

      if (alm.addons.paging_init && alm.addons.preloaded) {
        // Paging + Preloaded Firstrun.
        alm.addons.preloaded_amount = 0; // Reset preloaded_amount param.
        alm.AjaxLoadMore.pagingPreloadedInit(data);
        alm.addons.paging_init = false;
        alm.init = false;
      } else if (alm.addons.paging_init && alm.addons.nextpage) {
        // Paging + Next Page on firstrun.
        alm.AjaxLoadMore.pagingNextpageInit();
        alm.addons.paging_init = false;
        alm.init = false;
      } else {
        // Standard Paging
        alm.AjaxLoadMore.loadPosts();
      }
    };

    /**
     * Get the parent ALM container.
     *
     * @return {HTMLElement} The ALM listing container.
     * @since 2.7.0
     */
    window.almGetParentContainer = function () {
      var _alm41;
      return (_alm41 = alm) === null || _alm41 === void 0 ? void 0 : _alm41.listing;
    };

    /**
     * Returns the current ALM obj.
     *
     * @param {string} obj The ALM object to return.
     * @return {Object}    The ALM object.
     * @since 2.7.0
     */
    window.almGetObj = function () {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      if (obj) {
        return alm[obj]; // Return specific param.
      }

      return alm; // Return the entire alm object
    };

    /**
     * Trigger ajaxloadmore from any element on page.
     *
     * @since 2.12.0
     */
    window.almTriggerClick = function () {
      alm.button.click();
    };

    // Delay to prevent immediate loading of posts on initial page load via scroll.
    setTimeout(function () {
      alm.proceed = true;
      alm.AjaxLoadMore.scrollSetup();
    }, 1000);

    // Init Ajax Load More.
    alm.AjaxLoadMore.init();
  };

  // End ajaxloadmore

  /**
   * Initiate instance of Ajax load More
   *
   * @param {HTMLElement} el The ALM element.
   * @param {number}      id The ALM instance ID.
   * @since 5.0
   */
  window.almInit = function (el) {
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    new ajaxloadmore(el, id);
  };

  /**
   * Initiate Ajax load More if div is present on screen
   *
   * @since 2.1.2
   */
  var alm_instances = document.querySelectorAll('.ajax-load-more-wrap');
  if (alm_instances.length) {
    ajax_load_more_toConsumableArray(alm_instances).forEach(function (alm, index) {
      new ajaxloadmore(alm, index);
    });
  }
})();

/**
 * Filter an Ajax Load More instance.
 *
 * @param {string} transition The transition type.
 * @param {string} speed      The speed of the filter transition.
 * @param {Object} data       Query data as an object.
 * @since 5.0
 */
var filter = function filter() {
  var transition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'fade';
  var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  if (!transition || !speed || !data) {
    return false;
  }
  alm_is_filtering = true;
  almFilter(transition, speed, data, 'filter');
};

/**
 * Reset an Ajax Load More instance.
 *
 * @since 5.3.8
 * @param {Object} props The ALM props as an object.
 */
var ajax_load_more_reset = function reset() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var data = {};
  alm_is_filtering = true;
  if (props && props.target) {
    data = {
      target: target
    };
  }
  if (props && props.type === 'woocommerce') {
    // WooCommerce
    ajax_load_more_asyncToGenerator( /*#__PURE__*/ajax_load_more_regeneratorRuntime().mark(function _callee13() {
      var instance, settings;
      return ajax_load_more_regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            instance = document.querySelector('.ajax-load-more-wrap .alm-listing[data-woo="true"]'); // Get ALM instance
            _context13.next = 3;
            return wooReset();
          case 3:
            settings = _context13.sent;
            // Get WooCommerce `settings` via Ajax
            if (settings) {
              instance.dataset.wooSettings = settings; // Update data atts
              almFilter('fade', '100', data, 'filter');
            }
          case 5:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    }))()["catch"](function () {
      console.warn('Ajax Load More: There was an issue resetting the Ajax Load More instance.');
    });
  } else {
    // Standard ALM
    almFilter('fade', '200', data, 'filter');
  }
};

/**
 * Get the total post count in the current query by ALM instance ID.
 * Note: Uses localized ALM variables.
 *
 * @see https://github.com/dcooney/wordpress-ajax-load-more/blob/main/core/classes/class-alm-localize.php
 * @param {string} id An optional Ajax Load More ID.
 * @return {number}   The results from the localized variable.
 */
var ajax_load_more_getPostCount = function getPostCount() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return getTotals('post_count', id);
};

/**
 * Get the total number of posts by ALM instance ID.
 * Note: Uses localized ALM variables.
 *
 * @param {string} id An optional Ajax Load More ID.
 * @return {number}   The results from the localized variable.
 */
var getTotalPosts = function getTotalPosts() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return getTotals('total_posts', id);
};

/**
 * Get the total posts remaining in the current query by ALM instance ID.
 * Note: Uses localized ALM variables.
 *
 * @see https://github.com/dcooney/wordpress-ajax-load-more/blob/main/core/classes/class-alm-localize.php
 * @param {string} id An optional Ajax Load More ID.
 * @return {number}   The total remaining posts.
 */
var getTotalRemaining = function getTotalRemaining() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return getTotals('remaining', id);
};

/**
 * Track Page Views and Analytics
 *
 * @since 5.0
 * @param {string} type The add-on type that is triggering the analytics.
 */
var analytics = function analytics() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var _window$location = window.location,
    _window$location$path = _window$location.pathname,
    pathname = _window$location$path === void 0 ? '' : _window$location$path,
    _window$location$sear = _window$location.search,
    search = _window$location$sear === void 0 ? '' : _window$location$sear;

  /**
   * ALM Callback Function (URL Change)
   *
   * @see https://connekthq.com/plugins/ajax-load-more/docs/callback-functions/#url-update
   */
  if (typeof almUrlUpdate === 'function') {
    window.almUrlUpdate(pathname + search, type);
  }

  /**
   * ALM Callback Function
   */
  if (typeof almAnalytics === 'function') {
    window.almAnalytics(pathname + search, type);
  }
};

/**
 * Trigger Ajax Load More from other events.
 *
 * @since 5.0
 * @param {Element} instance The HTML element.
 */
var start = function start(instance) {
  if (!instance) {
    return false;
  }
  window.almInit(instance);
};

/**
 * Scroll window to position (global function).
 *
 * @since 5.0
 * @param {string} position The position to scroll.
 */
var almScroll = function almScroll(position) {
  if (!position) {
    return false;
  }
  window.scrollTo({
    top: position,
    behavior: 'smooth'
  });
};

/**
 * Get the current top/left coordinates of an element relative to the document.
 *
 * @since 5.0
 * @param {HTMLElement} el The HTML element.
 * @return {Object}        The top/left coordinates.
 */
var getOffset = function getOffset() {
  var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (!el) {
    return false;
  }
  var rect = el.getBoundingClientRect();
  var scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  var scrollTop = window.scrollY || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};

/**
 * Trigger a click event to load Ajax Load More content.
 *
 * @param {string} id The Ajax Load More ID.
 */
var click = function click() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var alm = document.querySelector('.ajax-load-more-wrap');
  var button = '';
  if (!id && alm) {
    // Default ALM element.
    button = alm.querySelector('button.alm-load-more-btn');
    if (button) {
      button.click();
    }
  } else {
    // Ajax Load More by ID.
    alm = document.querySelector(".ajax-load-more-wrap[data-id=\"".concat(id, "\"]"));
    if (alm) {
      button = alm.querySelector('button.alm-load-more-btn');
      if (button) {
        button.click();
      }
    }
  }
};

/**
 * Load ALM inside the WP Block Editor.
 *
 * @since 7.1.0
 * @param {Element} instance The HTML element.
 */
var wpblock = function wpblock(instance) {
  var listing = instance.querySelector('.alm-listing');
  if (!listing || instance.dataset.blockLoaded === 'true') {
    return; // Exit if does not exist or block already loaded.
  }

  instance.dataset.blockLoaded = 'true';
  listing.dataset.scroll = 'false'; // Remove scroll.
  start(instance);
};
}();
ajaxloadmore = __webpack_exports__;
/******/ })()
;