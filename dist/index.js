(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("orkan", [], factory);
	else if(typeof exports === 'object')
		exports["orkan"] = factory();
	else
		root["orkan"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 38);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("mobx");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("autobind-decorator");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("mobx-react");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("firebase/app");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("classnames");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("invariant");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("lodash/mapValues");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("lodash/omitBy");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("lodash/forEach");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("react-dom");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(27)))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("lodash/values");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("react-addons-shallow-compare");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("lodash/find");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("observable-nested-map");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("lodash/assignWith");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("lodash/mapKeys");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var refs = 0;
var dispose;
var content = __webpack_require__(31);
if(typeof content === 'string') content = [[module.i, content, '']];
exports.use = exports.ref = function() {
	if(!(refs++)) {
		exports.locals = content.locals;
		dispose = __webpack_require__(9)(content, {});
	}
	return exports;
};
exports.unuse = exports.unref = function() {
	if(!(--refs)) {
		dispose();
		dispose = null;
	}
};
if(false) { var lastRefs; }

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var refs = 0;
var dispose;
var content = __webpack_require__(34);
if(typeof content === 'string') content = [[module.i, content, '']];
exports.use = exports.ref = function() {
	if(!(refs++)) {
		exports.locals = content.locals;
		dispose = __webpack_require__(9)(content, {});
	}
	return exports;
};
exports.unuse = exports.unref = function() {
	if(!(--refs)) {
		dispose();
		dispose = null;
	}
};
if(false) { var lastRefs; }

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var refs = 0;
var dispose;
var content = __webpack_require__(35);
if(typeof content === 'string') content = [[module.i, content, '']];
exports.use = exports.ref = function() {
	if(!(refs++)) {
		exports.locals = content.locals;
		dispose = __webpack_require__(9)(content, {});
	}
	return exports;
};
exports.unuse = exports.unref = function() {
	if(!(--refs)) {
		dispose();
		dispose = null;
	}
};
if(false) { var lastRefs; }

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("lodash/map");

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var refs = 0;
var dispose;
var content = __webpack_require__(36);
if(typeof content === 'string') content = [[module.i, content, '']];
exports.use = exports.ref = function() {
	if(!(refs++)) {
		exports.locals = content.locals;
		dispose = __webpack_require__(9)(content, {});
	}
	return exports;
};
exports.unuse = exports.unref = function() {
	if(!(--refs)) {
		dispose();
		dispose = null;
	}
};
if(false) { var lastRefs; }

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var refs = 0;
var dispose;
var content = __webpack_require__(37);
if(typeof content === 'string') content = [[module.i, content, '']];
exports.use = exports.ref = function() {
	if(!(refs++)) {
		exports.locals = content.locals;
		dispose = __webpack_require__(9)(content, {});
	}
	return exports;
};
exports.unuse = exports.unref = function() {
	if(!(--refs)) {
		dispose();
		dispose = null;
	}
};
if(false) { var lastRefs; }

/***/ }),
/* 27 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("firebase/firestore");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("firebase/auth");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("firebase/storage");

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(false);
// imports


// module
exports.push([module.i, ".s3mT2rgn {\n  z-index: 99999999999999;\n  animation: s3mT22BR;\n  animation-timing-function: ease-in-out;\n  animation-duration: .2s;\n  width: 100%;\n  height: 5px;\n  position: fixed;\n  top: 0;\n  left: 0; }\n  .s3mT2rgn:after {\n    animation-timing-function: linear !important;\n    animation: s3mT3mhh;\n    animation-duration: 1s;\n    animation-iteration-count: infinite;\n    animation-fill-mode: both;\n    transform: translate3d(0, 0, 0);\n    transition: transform 3s ease-in-out;\n    content: '';\n    position: absolute;\n    left: -68px;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    background: repeating-linear-gradient(45deg, #FA2949, #FA2949 20px, #fc7489 20px, #fc7489 40px); }\n  .s3mT2rgn.s3mT3af-:after {\n    animation-play-state: running; }\n  .s3mT2rgn.s3mT3u3V:after {\n    animation-play-state: paused; }\n\n.s3mT2Cso:after {\n  background: repeating-linear-gradient(45deg, #1a1e2b, #1a1e2b 20px, #565e7b 20px, #565e7b 40px); }\n\n@keyframes s3mT3mhh {\n  from {\n    transform: translate3d(0, 0, 0); }\n  to {\n    transform: translate3d(58px, 0, 0); } }\n", ""]);

// exports
exports.locals = {
	"root": "s3mT2rgn",
	"modalAnimation": "s3mT22BR",
	"OrkanIndicatorBusyAnimation": "s3mT3mhh",
	"busy": "s3mT3af-",
	"notBusy": "s3mT3u3V",
	"dark": "s3mT2Cso"
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var refs = 0;
var dispose;
var content = __webpack_require__(33);
if(typeof content === 'string') content = [[module.i, content, '']];
exports.use = exports.ref = function() {
	if(!(refs++)) {
		exports.locals = content.locals;
		dispose = __webpack_require__(9)(content, {});
	}
	return exports;
};
exports.unuse = exports.unref = function() {
	if(!(--refs)) {
		dispose();
		dispose = null;
	}
};
if(false) { var lastRefs; }

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(false);
// imports


// module
exports.push([module.i, ".s3mT1qFI {\n  display: inline-block;\n  white-space: pre; }\n\n.s3mT-zMK:hover {\n  position: relative; }\n  .s3mT-zMK:hover:after {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    right: 0;\n    background: repeating-linear-gradient(45deg, rgba(250, 41, 73, 0.9), rgba(250, 41, 73, 0.9) 20px, rgba(250, 41, 73, 0.8) 20px, rgba(250, 41, 73, 0.8) 40px);\n    font-weight: 400 !important;\n    letter-spacing: normal;\n    text-transform: none;\n    cursor: pointer;\n    color: black;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 100000000;\n    border: 2px solid #FA2949; }\n\n.s3mT-zMK.s3mT3G3q:hover {\n  position: relative; }\n  .s3mT-zMK.s3mT3G3q:hover:after {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    right: 0;\n    background: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9) 20px, rgba(255, 255, 255, 0.8) 20px, rgba(255, 255, 255, 0.8) 40px);\n    font-weight: 400 !important;\n    letter-spacing: normal;\n    text-transform: none;\n    cursor: pointer;\n    color: black;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 100000000;\n    border: 2px solid white; }\n", ""]);

// exports
exports.locals = {
	"root": "s3mT1qFI",
	"editMode": "s3mT-zMK",
	"lightOverlay": "s3mT3G3q"
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(false);
// imports


// module
exports.push([module.i, ".s3mT2D0m:hover {\n  position: relative; }\n  .s3mT2D0m:hover:after {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    right: 0;\n    background: repeating-linear-gradient(45deg, rgba(250, 41, 73, 0.9), rgba(250, 41, 73, 0.9) 20px, rgba(250, 41, 73, 0.8) 20px, rgba(250, 41, 73, 0.8) 40px);\n    font-weight: 400 !important;\n    letter-spacing: normal;\n    text-transform: none;\n    cursor: pointer;\n    color: black;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 100000000;\n    border: 2px solid #FA2949; }\n\n.s3mT2D0m.s3mT2lU9:hover {\n  position: relative; }\n  .s3mT2D0m.s3mT2lU9:hover:after {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    right: 0;\n    background: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9) 20px, rgba(255, 255, 255, 0.8) 20px, rgba(255, 255, 255, 0.8) 40px);\n    font-weight: 400 !important;\n    letter-spacing: normal;\n    text-transform: none;\n    cursor: pointer;\n    color: black;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 100000000;\n    border: 2px solid white; }\n", ""]);

// exports
exports.locals = {
	"editMode": "s3mT2D0m",
	"lightOverlay": "s3mT2lU9"
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(false);
// imports


// module
exports.push([module.i, ".s3mT1cZi:hover {\n  position: relative; }\n  .s3mT1cZi:hover:after {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    right: 0;\n    background: repeating-linear-gradient(45deg, rgba(250, 41, 73, 0.9), rgba(250, 41, 73, 0.9) 20px, rgba(250, 41, 73, 0.8) 20px, rgba(250, 41, 73, 0.8) 40px);\n    font-weight: 400 !important;\n    letter-spacing: normal;\n    text-transform: none;\n    cursor: pointer;\n    color: black;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 100000000;\n    border: 2px solid #FA2949; }\n\n.s3mT1cZi.s3mT3fCo:hover {\n  position: relative; }\n  .s3mT1cZi.s3mT3fCo:hover:after {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    right: 0;\n    background: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9) 20px, rgba(255, 255, 255, 0.8) 20px, rgba(255, 255, 255, 0.8) 40px);\n    font-weight: 400 !important;\n    letter-spacing: normal;\n    text-transform: none;\n    cursor: pointer;\n    color: black;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 100000000;\n    border: 2px solid white; }\n", ""]);

// exports
exports.locals = {
	"editMode": "s3mT1cZi",
	"lightOverlay": "s3mT3fCo"
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(false);
// imports


// module
exports.push([module.i, ".s3mTJfvR:hover {\n  position: relative; }\n  .s3mTJfvR:hover:after {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    right: 0;\n    background: repeating-linear-gradient(45deg, rgba(250, 41, 73, 0.9), rgba(250, 41, 73, 0.9) 20px, rgba(250, 41, 73, 0.8) 20px, rgba(250, 41, 73, 0.8) 40px);\n    font-weight: 400 !important;\n    letter-spacing: normal;\n    text-transform: none;\n    cursor: pointer;\n    color: black;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 100000000;\n    border: 2px solid #FA2949; }\n\n.s3mTJfvR.s3mT1fPO:hover {\n  position: relative; }\n  .s3mTJfvR.s3mT1fPO:hover:after {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    right: 0;\n    background: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9) 20px, rgba(255, 255, 255, 0.8) 20px, rgba(255, 255, 255, 0.8) 40px);\n    font-weight: 400 !important;\n    letter-spacing: normal;\n    text-transform: none;\n    cursor: pointer;\n    color: black;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 100000000;\n    border: 2px solid white; }\n", ""]);

// exports
exports.locals = {
	"editMode": "s3mTJfvR",
	"lightOverlay": "s3mT1fPO"
};

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(2);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);

// EXTERNAL MODULE: external "prop-types"
var external_prop_types_ = __webpack_require__(0);
var external_prop_types_default = /*#__PURE__*/__webpack_require__.n(external_prop_types_);

// EXTERNAL MODULE: external "mobx-react"
var external_mobx_react_ = __webpack_require__(4);

// EXTERNAL MODULE: external "lodash/mapValues"
var mapValues_ = __webpack_require__(10);
var mapValues_default = /*#__PURE__*/__webpack_require__.n(mapValues_);

// EXTERNAL MODULE: external "lodash/values"
var values_ = __webpack_require__(15);
var values_default = /*#__PURE__*/__webpack_require__.n(values_);

// EXTERNAL MODULE: external "lodash/omitBy"
var omitBy_ = __webpack_require__(11);
var omitBy_default = /*#__PURE__*/__webpack_require__.n(omitBy_);

// EXTERNAL MODULE: external "react-addons-shallow-compare"
var external_react_addons_shallow_compare_ = __webpack_require__(16);
var external_react_addons_shallow_compare_default = /*#__PURE__*/__webpack_require__.n(external_react_addons_shallow_compare_);

// CONCATENATED MODULE: ./src/constants.js
var ORKAN_ADMIN_GLOBAL = '__orkan_admin__';
var REACT_CONTEXT_NAME = 'OrkanContext';
var ACTIVATION_EVENT_KEY = 'o';
var SUPPORTED_AUTH_PROVIDERS = ['google', 'facebook', 'github'];
var DEFAULT_BASE_PATH = 'test';
var FIREBASE_APP_NAME = 'orkan';
var USERS_KEY = 'orkanUsers';
var MEDIA_KEY = 'orkanMedia';
var USERS_REQUESTS_KEY = 'orkanUsersRequests';
var OBJECTS_KEY = 'orkanObjects';
var SCHEMA_KEY = 'schema';
var SCHEMA_SETTINGS_KEY = 'schemaSettings';
var SCHEMA_PATH = OBJECTS_KEY + '/' + SCHEMA_KEY;
var SCHEMA_SETTINGS_PATH = OBJECTS_KEY + '/' + SCHEMA_SETTINGS_KEY;

// EXTERNAL MODULE: external "invariant"
var external_invariant_ = __webpack_require__(7);
var external_invariant_default = /*#__PURE__*/__webpack_require__.n(external_invariant_);

// EXTERNAL MODULE: external "lodash/forEach"
var forEach_ = __webpack_require__(12);
var forEach_default = /*#__PURE__*/__webpack_require__.n(forEach_);

// EXTERNAL MODULE: external "lodash/find"
var find_ = __webpack_require__(17);
var find_default = /*#__PURE__*/__webpack_require__.n(find_);

// EXTERNAL MODULE: external "mobx"
var external_mobx_ = __webpack_require__(1);

// EXTERNAL MODULE: external "observable-nested-map"
var external_observable_nested_map_ = __webpack_require__(18);
var external_observable_nested_map_default = /*#__PURE__*/__webpack_require__.n(external_observable_nested_map_);

// EXTERNAL MODULE: ./node_modules/path-browserify/index.js
var path_browserify = __webpack_require__(14);
var path_browserify_default = /*#__PURE__*/__webpack_require__.n(path_browserify);

// EXTERNAL MODULE: external "firebase/app"
var app_ = __webpack_require__(5);
var app_default = /*#__PURE__*/__webpack_require__.n(app_);

// CONCATENATED MODULE: ./src/firestore.js
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};








var validPathInvariant = function (path) {
    external_invariant_default()(!!path.length, 'Invalid path, expected a non empty string');
    external_invariant_default()(typeof path === 'string', 'Invalid path expected a string, got ' + typeof path);
    external_invariant_default()(!path.startsWith('.') && !path.startsWith('/'), 'Invalid path structure. paths cannot start with `.` or `/`. got:' + path);
};
var validQueryInvariant = function (path, options) {
    external_invariant_default()(!options || path.split('/').length === 1, "Invalid query arguments. cannot query non collections with options");
};
var settablePathInvariant = function (path) {
    external_invariant_default()(path.split('/').length <= 2, "Non queryable path " + path);
};
var collectionPathInvariant = function (path) { return external_invariant_default()(path.split('/').length === 1, 'Invalid collection path. expected a path with one segment'); };
/*
    where: {
        path: {operator: value},
        ...
    }
*/
var applyWhereOptionsToQuery = function (query, whereOptions) {
    if (whereOptions === void 0) { whereOptions = {}; }
    var finalQuery = query;
    iterateWhereOptions(whereOptions, function (path, optionOperator, optionValue) { return finalQuery = finalQuery.where(path, optionOperator, optionValue); });
    return finalQuery;
};
var iterateWhereOptions = function (whereOptions, cb) {
    forEach_default()(whereOptions, function (option, path) {
        forEach_default()(option, function (optionValue, optionOperator) { return cb(path, optionOperator, optionValue); });
    });
};
var serializeQueryOptions = function (options, includeLimit) {
    if (options === void 0) { options = {}; }
    if (includeLimit === void 0) { includeLimit = false; }
    var queryString = [];
    iterateWhereOptions(options.where, function (path, optionOperator, optionValue) { return queryString.push("where=" + path + optionOperator + optionValue); });
    forEach_default()(options.orderBy, function (direction, path) {
        queryString.push("orderBy:" + path + "|" + direction);
    });
    includeLimit && options.limit !== undefined && queryString.push("limit:" + options.limit);
    return queryString.join('&');
};
var serializeQuery = function (path, options, includeLimit) { return toQueryablePath(path) + '?' + serializeQueryOptions(options, includeLimit); };
/*
    orderBy: {
        path: 'asc'|'desc',
        ...
    }
*/
var applyOrderByOptionsToQuery = function (query, orderByOptions) {
    if (orderByOptions === void 0) { orderByOptions = {}; }
    var finalQuery = query;
    forEach_default()(orderByOptions, function (direction, path) {
        finalQuery = finalQuery.orderBy(path, direction);
    });
    return finalQuery;
};
var toDotPath = function (slashPath) { return slashPath.split('/').join('.'); };
var breakPath = function (path) {
    var _a = path.split('/'), collection = _a[0], docPath = _a[1], innerParts = _a.slice(2);
    return { collection: collection, docPath: docPath, innerPath: innerParts.join('/') };
};
var toQueryablePath = function (path) { return path.split('/').slice(0, 2).join('/'); };
var isCollectionPath = function (path) { return path.split('/').length === 1; };
/*
    # how does it work?

    ## listening to values
    - regardless the path requested, the most basic piece of data which will be loaded is a document
    - values returned will always be accurate to the path requested

    store.listen('objects/home/hero/title') => listens to objects/home
    store.load('objects/home/hero/title') => loads objects/home, returns objects/home/hero/title
    store.getValue('objects/home/hero/title') => returns objects/home/hero/title
    store.listen('posts/12345/title') => listens to posts/12345
    store.load('posts/12345/title') => loads posts/12345, returns posts/12345/title
    store.getValue('posts/12345/title') => returns posts/12345/title

    ## listening to collections
    - don't use options on non collection paths
    - collections data and order are cached even if not listened to anymore, to ensure fresh order on next listen - clear cache

    store.listen('posts', {where.. orderBy..}) => listens to posts with options. on collections only
    store.load('posts', {where.. orderBy..}) => loads posts with options. on collections only
    store.getValue('posts', {where.. orderBy..}) => returns posts with options. on collections only

    ## check initial loading status
    store.isLoading('posts') => return if posts is loading
    store.isLoading('posts', {where.. orderBy..}) => return if posts is running with options. on collections only
    store.isLoading('posts/12345/title') => return if posts/12345 is loading
    store.isLoading('objects/home/hero/title') -> return if objects/home is loading

    ## setting values
    - setting values is available only on a collection or document level

    store.setValue('posts/1234', {...}) => will add/override posts/1234
    store.setValue('objects/home', {...}) => will add/override object/homes
    store.setValue('posts', {...}) => will push a new document to posts with auto key

    ## removing values
    - removing values is available only on a document level

    store.remove('posts/1234') => will remove posts/1234
    store.remove('objects/home') => will remove objects/home
*/
var firestore_Firestore = /** @class */ (function () {
    function Firestore(api, initialState, options) {
        if (initialState === void 0) { initialState = {}; }
        if (options === void 0) { options = {}; }
        this.map = new external_observable_nested_map_default.a({});
        this.pathsStatus = external_mobx_["observable"].map({});
        this.listeners = external_mobx_["observable"].map({});
        this.collections = external_mobx_["observable"].map({});
        this.config = {
            DocumentSnapshot: app_default.a.firestore.DocumentSnapshot,
            QuerySnapshot: app_default.a.firestore.QuerySnapshot,
            QueryDocumentSnapshot: app_default.a.firestore.QueryDocumentSnapshot
        };
        this.api = api;
        this.map.merge(initialState.map);
        this.collections.merge(initialState.collections);
        this.pathsStatus.merge(initialState.pathsStatus);
        this.listeners.merge(initialState.listeners);
        this.config = __assign({}, this.config, options);
        // window.a = () => console.log(this.map.toJS(), toJS(this.collections), toJS(this.listeners), toJS(this.pathsStatus))
    }
    Firestore.prototype.getBusyPromise = function () {
        var _this = this;
        var isBusy = function () { return !!find_default()(Object(external_mobx_["toJS"])(_this.pathsStatus), function (path) { return path.isLoading; }); };
        if (isBusy()) {
            return Object(external_mobx_["when"])(function () { return !isBusy(); });
        }
    };
    Firestore.prototype.getValue = function (path, options) {
        var _this = this;
        validPathInvariant(path);
        validQueryInvariant(path, options);
        if (isCollectionPath(path)) {
            var serializedPath = serializeQuery(path, options);
            var collection = this.collections.get(serializedPath) || [];
            var limit = (options && options.limit) || collection.length;
            return collection.slice(0, limit).map(function (collectionKey) {
                var value = _this.map.get(toDotPath(path_browserify_default.a.join(path, collectionKey)));
                var raw = Object(external_mobx_["isObservable"])(value) ? Object(external_mobx_["toJS"])(value) : value;
                if (typeof raw === 'object') {
                    return __assign({}, raw, { $key: collectionKey });
                }
                else {
                    return { $value: raw, $key: collectionKey };
                }
            });
        }
        else {
            var value = this.map.get(toDotPath(path));
            return Object(external_mobx_["isObservable"])(value) ? Object(external_mobx_["toJS"])(value) : value;
        }
    };
    Firestore.prototype.setValue = function (path, value) {
        return __awaiter(this, void 0, void 0, function () {
            var sanitizedValue, query, action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validPathInvariant(path);
                        settablePathInvariant(path);
                        sanitizedValue = value;
                        if (typeof value === 'object') {
                            sanitizedValue = omitBy_default()(value, function (value) { return value === undefined; });
                        }
                        query = this.createQuery(path);
                        action = (query.add || query.set).bind(query);
                        this.map.set(toDotPath(path), value);
                        return [4 /*yield*/, action(sanitizedValue)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Firestore.prototype.addToCollection = function (serializedQuery, index, key) {
        validPathInvariant(serializedQuery);
        var collection = this.collections.get(serializedQuery);
        if (!collection) {
            collection = Object(external_mobx_["observable"])([]);
            this.collections.set(serializedQuery, collection);
        }
        !collection.includes(key) && collection.splice(index, 0, key);
    };
    Firestore.prototype.removeFromCollection = function (serializedQuery, key) {
        var collection = this.collections.get(serializedQuery);
        collection.remove(key);
    };
    Firestore.prototype.removeCollection = function (serializedQuery) {
        this.collections.delete(serializedQuery);
    };
    Firestore.prototype.listen = function (path, options) {
        var _this = this;
        validPathInvariant(path);
        var serializedQuery = serializeQuery(path, options, true);
        var listener = this.listeners.get(serializedQuery);
        if (listener) {
            listener.listeners++;
        }
        else {
            this.setPathIsLoading(serializedQuery, true);
            var query = this.createQuery(path, options);
            var destroy = query.onSnapshot(Object(external_mobx_["action"])(function (snapshot) {
                _this.handleNewSnapShot(path, options, snapshot);
                _this.setPathIsLoading(serializedQuery, false);
            }), function (err) {
                console.warn("[" + serializedQuery + "]", err);
            });
            listener = Object(external_mobx_["observable"])({
                listeners: 1,
                destroy: destroy
            });
            this.listeners.set(serializedQuery, listener);
        }
        return function () {
            listener.listeners--;
            if (!listener.listeners) {
                listener.destroy();
                _this.listeners.delete(serializedQuery);
            }
        };
    };
    Firestore.prototype.load = function (path, options) {
        return __awaiter(this, void 0, void 0, function () {
            var serializedQuery, query, snapshot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validPathInvariant(path);
                        serializedQuery = serializeQuery(path, options);
                        this.setPathIsLoading(serializedQuery, true);
                        query = this.createQuery(path, options);
                        return [4 /*yield*/, query.get()];
                    case 1:
                        snapshot = _a.sent();
                        this.handleNewSnapShot(path, options, snapshot);
                        this.setPathIsLoading(serializedQuery, false);
                        return [2 /*return*/, this.getValue(path, options)];
                }
            });
        });
    };
    Firestore.prototype.handleNewSnapShot = function (path, options, snapshot) {
        var _this = this;
        var sanitizedPath = toQueryablePath(path);
        if (this.isDocumentSnapshot(snapshot)) {
            if (snapshot.exists) {
                this.map.set(toDotPath(sanitizedPath), snapshot.data());
            }
            else {
                this.map.remove(toDotPath(sanitizedPath));
            }
        }
        else if (this.isCollectionSnapshot(snapshot)) {
            // no need to sanitize path because only collection paths end up here
            var serializedQuery_1 = serializeQuery(path, options);
            // console.log('collection update', serializedQuery, serializeQuery(path, options, true))
            typeof snapshot.docChanges === 'function' && snapshot.docChanges().forEach(function (change) {
                var docPath = path_browserify_default.a.join(path, change.doc.id);
                // console.log('change', change.type, change.doc.id, change.newIndex, change.oldIndex)
                switch (change.type) {
                    case 'modified':
                        _this.map.set(toDotPath(docPath), change.doc.data());
                        if (change.oldIndex > -1 && change.newIndex !== change.oldIndex) {
                            _this.removeFromCollection(serializedQuery_1, change.doc.id);
                            _this.addToCollection(serializedQuery_1, change.newIndex, change.doc.id);
                        }
                        break;
                    case 'added':
                        _this.map.set(toDotPath(docPath), change.doc.data());
                        _this.addToCollection(serializedQuery_1, change.newIndex, change.doc.id);
                        break;
                    case 'removed':
                        // not removing the document from this.map, it can be still used by another
                        _this.removeFromCollection(serializedQuery_1, change.doc.id);
                        break;
                }
            });
        }
    };
    Firestore.prototype.remove = function (path) {
        validPathInvariant(path);
        settablePathInvariant(path);
        this.map.remove(toDotPath(path));
        return this.createQuery(path).delete();
    };
    Firestore.prototype.clearCache = function (path, options) {
        validPathInvariant(path);
        var serializedQuery = serializeQuery(path, options);
        var serializedQueryWithLimit = serializeQuery(path, options, true);
        this.map.remove(toDotPath(path));
        this.removeCollection(serializedQuery);
        this.removePathStatus(serializedQuery);
    };
    Firestore.prototype.clearAll = function () {
        this.map.clear();
        this.pathsStatus.clear();
        this.collections.clear();
        this.listeners.clear();
    };
    Firestore.prototype.removePathStatus = function (serializedQuery) {
        validPathInvariant(serializedQuery);
        this.pathsStatus.delete(serializedQuery);
    };
    Firestore.prototype.setPathStatus = function (serializedQuery, status) {
        validPathInvariant(serializedQuery);
        var currentStatus = this.pathsStatus.get(serializedQuery) || {};
        this.pathsStatus.set(serializedQuery, __assign({}, currentStatus, status));
    };
    Firestore.prototype.setPathIsLoading = function (serializedQuery, state) {
        validPathInvariant(serializedQuery);
        var currentStatus = this.pathsStatus.get(serializedQuery);
        if (!currentStatus || !state) {
            this.setPathStatus(serializedQuery, { isLoading: state });
        }
    };
    Firestore.prototype.isLoading = function (serializedQuery) {
        validPathInvariant(serializedQuery);
        var currentStatus = this.pathsStatus.get(serializedQuery);
        return currentStatus && currentStatus.isLoading;
    };
    Firestore.prototype.createQuery = function (path, options) {
        if (options === void 0) { options = {}; }
        var _a = breakPath(path), collection = _a.collection, docPath = _a.docPath;
        var query = this.api.collection(collection);
        if (docPath) {
            query = query.doc(docPath);
        }
        query = applyWhereOptionsToQuery(query, options.where);
        query = applyOrderByOptionsToQuery(query, options.orderBy);
        if (options.limit) {
            query = query.limit(options.limit);
        }
        return query;
    };
    Firestore.prototype.generateKey = function (path) {
        collectionPathInvariant(path);
        return this.api.collection(path).doc().id;
    };
    Firestore.prototype.isDocumentSnapshot = function (snapshot) {
        return snapshot instanceof this.config.DocumentSnapshot || snapshot instanceof this.config.QueryDocumentSnapshot;
    };
    Firestore.prototype.isCollectionSnapshot = function (snapshot) {
        return snapshot instanceof this.config.QuerySnapshot;
    };
    Firestore.prototype.toJS = function () {
        return {
            map: this.map.toJS(),
            collections: Object(external_mobx_["toJS"])(this.collections),
            pathsStatus: Object(external_mobx_["toJS"])(this.pathsStatus),
            listeners: Object(external_mobx_["toJS"])(this.listeners)
        };
    };
    Firestore.toDotPath = toDotPath;
    Firestore.breakPath = breakPath;
    Firestore.toQueryablePath = toQueryablePath;
    __decorate([
        external_mobx_["action"]
    ], Firestore.prototype, "addToCollection", null);
    __decorate([
        external_mobx_["action"]
    ], Firestore.prototype, "removeFromCollection", null);
    __decorate([
        external_mobx_["action"]
    ], Firestore.prototype, "removeCollection", null);
    __decorate([
        external_mobx_["action"]
    ], Firestore.prototype, "load", null);
    __decorate([
        external_mobx_["action"]
    ], Firestore.prototype, "handleNewSnapShot", null);
    __decorate([
        external_mobx_["action"]
    ], Firestore.prototype, "clearAll", null);
    __decorate([
        external_mobx_["action"]
    ], Firestore.prototype, "removePathStatus", null);
    __decorate([
        external_mobx_["action"]
    ], Firestore.prototype, "setPathStatus", null);
    __decorate([
        external_mobx_["action"]
    ], Firestore.prototype, "setPathIsLoading", null);
    return Firestore;
}());
/* harmony default export */ var firestore = (firestore_Firestore);

// CONCATENATED MODULE: ./src/inject.js
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var inject_assign = (undefined && undefined.__assign) || function () {
    inject_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return inject_assign.apply(this, arguments);
};
var inject_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var isNode = new Function("try {return this===global;}catch(e){return false;}");
function inject(mapPropsToPaths, config) {
    if (mapPropsToPaths === void 0) { mapPropsToPaths = function () { return ({}); }; }
    var options = inject_assign({ liveEditedData: true }, config);
    return function (DecoratedComponent) {
        var _a;
        var injector = /** @class */ (function (_super) {
            __extends(injector, _super);
            function injector() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.disposables = [];
                return _this;
            }
            injector.prototype.componentWillMount = function () {
                this.disposables = this.listenToPaths(this.props);
            };
            injector.prototype.componentWillReceiveProps = function (nextProps, nextState) {
                if (external_react_addons_shallow_compare_default()(this, nextProps, nextState)) {
                    var newDisposables = this.listenToPaths(nextProps);
                    this.disposeAllListeners();
                    this.disposables = newDisposables;
                }
            };
            injector.prototype.componentWillReact = function () {
                var newDisposables = this.listenToPaths(this.props);
                this.disposeAllListeners();
                this.disposables = newDisposables;
            };
            injector.prototype.componentWillUnmount = function () {
                this.disposeAllListeners();
            };
            injector.prototype.getContext = function () {
                return this.context[REACT_CONTEXT_NAME];
            };
            injector.prototype.disposeAllListeners = function () {
                this.disposables.forEach(function (dispose) { return dispose(); });
            };
            injector.prototype.listenToPaths = function (props) {
                var store = this.getContext().store;
                var mappedQueries = values_default()(mapPropsToPaths(props)).filter(function (it) { return !!it; });
                return mappedQueries.map(function (query) {
                    var _a = parseQuery(query), path = _a.path, pathOptions = _a.pathOptions;
                    if (isNode()) {
                        store.load(path, pathOptions);
                        return function () { return null; };
                    }
                    else {
                        return store.listen(path, pathOptions);
                    }
                });
            };
            injector.prototype.getValue = function (path, pathOptions) {
                var _a = this.getContext(), store = _a.store, getLiveValue = _a.getLiveValue, isAdminOpen = _a.isAdminOpen;
                return options.liveEditedData && isAdminOpen()
                    ? getLiveValue(path, pathOptions)
                    : store.getValue(path, pathOptions);
            };
            injector.prototype.render = function () {
                var _this = this;
                var store = this.getContext().store;
                var _a = this.props.injectedProps, injectedProps = _a === void 0 ? [] : _a;
                var mappedQueries;
                var mappedValues = {};
                var mappedStatuses = {};
                try {
                    mappedQueries = mapPropsToPaths(this.props);
                    mappedQueries = omitBy_default()(mappedQueries, function (value) { return !value; });
                    mappedValues = mapValues_default()(mappedQueries, function (query) {
                        var _a = parseQuery(query), path = _a.path, pathOptions = _a.pathOptions;
                        return _this.getValue(path, pathOptions);
                    });
                    mappedStatuses = mapValues_default()(mappedQueries, function (query) {
                        var _a = parseQuery(query), path = _a.path, pathOptions = _a.pathOptions;
                        return store.isLoading(serializeQuery(path, pathOptions));
                    });
                }
                catch (err) {
                    //React 14+ reports the error in "inject" with a wrong stack trace. It will write something about
                    //failing to reconcile a different component that was already unmounted.
                    // so we catch the error report it and rethrow here we still have the actual stack trace.
                    console.error(err);
                    throw err;
                }
                return (external_react_default.a.createElement(DecoratedComponent, inject_assign({}, this.props, mappedValues, { isPathLoading: mappedStatuses, injectedProps: injectedProps.concat(Object.keys(mappedQueries)), orkan: this.getContext() })));
            };
            injector.propTypes = inject_assign({}, (DecoratedComponent.propTypes || {}));
            injector.contextTypes = (_a = {},
                _a[REACT_CONTEXT_NAME] = external_prop_types_default.a.object,
                _a);
            injector.decoratedComponent = DecoratedComponent;
            injector = inject_decorate([
                external_mobx_react_["observer"]
            ], injector);
            return injector;
        }(external_react_["Component"]));
        return injector;
    };
}
// for documentation purposes only
inject.propTypes = {
    mapPropsToPaths: external_prop_types_default.a.func,
    options: external_prop_types_default.a.shape({
        liveEditedData: external_prop_types_default.a.bool
    })
};
inject.defaultProps = {
    options: {
        liveEditedData: true
    }
};
var parseQuery = function (query) {
    if (typeof query === 'string') {
        return { path: query };
    }
    else {
        var pathOptions = omitBy_default()(query, function (value, key) { return key === 'path' || !value; });
        pathOptions = Object.keys(pathOptions).length ? pathOptions : undefined;
        return { path: query.path, pathOptions: pathOptions };
    }
};

// EXTERNAL MODULE: external "react-dom"
var external_react_dom_ = __webpack_require__(13);
var external_react_dom_default = /*#__PURE__*/__webpack_require__.n(external_react_dom_);

// EXTERNAL MODULE: external "autobind-decorator"
var external_autobind_decorator_ = __webpack_require__(3);
var external_autobind_decorator_default = /*#__PURE__*/__webpack_require__.n(external_autobind_decorator_);

// EXTERNAL MODULE: external "classnames"
var external_classnames_ = __webpack_require__(6);
var external_classnames_default = /*#__PURE__*/__webpack_require__.n(external_classnames_);

// EXTERNAL MODULE: external "firebase/firestore"
var firestore_ = __webpack_require__(28);

// EXTERNAL MODULE: external "firebase/auth"
var auth_ = __webpack_require__(29);

// EXTERNAL MODULE: external "firebase/storage"
var storage_ = __webpack_require__(30);

// EXTERNAL MODULE: external "lodash/assignWith"
var assignWith_ = __webpack_require__(19);
var assignWith_default = /*#__PURE__*/__webpack_require__.n(assignWith_);

// EXTERNAL MODULE: external "lodash/mapKeys"
var mapKeys_ = __webpack_require__(20);
var mapKeys_default = /*#__PURE__*/__webpack_require__.n(mapKeys_);

// CONCATENATED MODULE: ./src/utils/style-utils.js




var createStyle = function (style) {
    var overrides = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        overrides[_i - 1] = arguments[_i];
    }
    var customizer = function (val1, val2) { return external_classnames_default()(val1, val2); };
    var createFlags = function (flags) { return external_classnames_default()(mapKeys_default()(flags, function (value, key) { return style[key]; })); };
    return assignWith_default.a.apply(void 0, [{},
        style].concat(overrides.map(function (override) {
        if (typeof override === 'string') {
            return { root: override };
        }
        else if (typeof override === 'object') {
            return mapValues_default()(override, function (value) {
                if (typeof value === 'string') {
                    return value;
                }
                else {
                    return createFlags(value);
                }
            });
        }
    }), [customizer]));
};

// EXTERNAL MODULE: ./src/indicator/style.scss
var indicator_style = __webpack_require__(21);
var style_default = /*#__PURE__*/__webpack_require__.n(indicator_style);

// CONCATENATED MODULE: ./src/indicator/index.js
var indicator_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var indicator_Indicator = /** @class */ (function (_super) {
    indicator_extends(Indicator, _super);
    function Indicator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Indicator.prototype.render = function () {
        var _a = this.props, className = _a.className, isBusy = _a.isBusy, color = _a.color;
        var s = createStyle(style_default.a, className, {
            root: {
                notBusy: !isBusy,
                busy: isBusy,
                dark: color === 'dark'
            }
        });
        return external_react_default.a.createElement("div", { className: s.root });
    };
    Indicator.propTypes = {
        isBusy: external_prop_types_default.a.bool,
        color: external_prop_types_default.a.oneOf(['default', 'dark'])
    };
    Indicator.defaultProps = {
        color: 'default'
    };
    return Indicator;
}(external_react_["Component"]));
/* harmony default export */ var indicator = (indicator_Indicator);

// EXTERNAL MODULE: ./src/provider/style.scss
var provider_style = __webpack_require__(32);

// CONCATENATED MODULE: ./src/provider/index.js
var provider_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var provider_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var provider_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var provider_generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var provider_a, provider_b;















// import {keyboard} from '../utils/keyboard-utils';


var OrkanAdmin;
var firebaseApp;
var provider_firestore;
var provider_Provider = /** @class */ (function (_super) {
    provider_extends(Provider, _super);
    function Provider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.obState = {
            isModifierKeyDown: false,
            isActive: false,
            isBusy: false,
        };
        return _this;
    }
    Provider_1 = Provider;
    Provider.prototype.getChildContext = function () {
        var _this = this;
        var _a;
        return _a = {}, _a[REACT_CONTEXT_NAME] = {
            activateAdmin: function () { return _this.activateAdmin(); },
            store: provider_firestore,
            getLiveValue: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _a;
                return !!_this.adminStore && !!_this.adminStore.isAdmin && (_a = _this.adminStore).getLiveValue.apply(_a, args);
            },
            setActivePath: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _a;
                return !!_this.adminStore && (_a = _this.adminStore).setActivePathWhenPossible.apply(_a, args);
            },
            isEditMode: function () {
                var _a = _this.obState, isActive = _a.isActive, isModifierKeyDown = _a.isModifierKeyDown;
                return isActive && !!_this.adminStore && !!_this.adminStore.isAdmin && !!isModifierKeyDown;
            },
            isAdminOpen: function () { return _this.adminStore && _this.adminStore.activePath; }
        }, _a;
    };
    Provider.prototype.componentWillMount = function () {
        return provider_awaiter(this, void 0, void 0, function () {
            var _a, firebaseConfig, onStoreReady, initialState, nativeFirestore;
            return provider_generator(this, function (_b) {
                _a = this.props, firebaseConfig = _a.firebaseConfig, onStoreReady = _a.onStoreReady, initialState = _a.initialState;
                if (!firebaseApp) {
                    firebaseApp = app_default.a.initializeApp(firebaseConfig, FIREBASE_APP_NAME);
                    nativeFirestore = app_default.a.firestore(firebaseApp);
                    nativeFirestore.settings({ timestampsInSnapshots: true });
                    provider_firestore = new firestore(nativeFirestore, initialState, {
                        DocumentSnapshot: app_default.a.firestore.DocumentSnapshot,
                        QuerySnapshot: app_default.a.firestore.QuerySnapshot,
                        QueryDocumentSnapshot: app_default.a.firestore.QueryDocumentSnapshot
                    });
                }
                onStoreReady(provider_firestore);
                return [2 /*return*/];
            });
        });
    };
    Provider.prototype.componentDidMount = function () {
        return provider_awaiter(this, void 0, void 0, function () {
            var _a, firebaseConfig, adminConfig, onStoreReady, firebase;
            return provider_generator(this, function (_b) {
                _a = this.props, firebaseConfig = _a.firebaseConfig, adminConfig = _a.adminConfig, onStoreReady = _a.onStoreReady, firebase = _a.firebase;
                return [2 /*return*/];
            });
        });
    };
    Provider.prototype.guestLogin = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var adminConfig = _this.props.adminConfig;
            // guest login
            if (adminConfig.allowGuests) {
                var dispose_1 = firebaseApp.auth().onIdTokenChanged(function (firebaseUser) { return provider_awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return provider_generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                dispose_1();
                                _a = !firebaseUser;
                                if (!_a) return [3 /*break*/, 2];
                                return [4 /*yield*/, firebaseApp.auth().signInAnonymously()];
                            case 1:
                                _a = (_b.sent());
                                _b.label = 2;
                            case 2:
                                _a;
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
        });
    };
    Provider.prototype.activateAdmin = function () {
        return provider_awaiter(this, void 0, void 0, function () {
            var fetchUrl, response, _a, err_1;
            var _this = this;
            return provider_generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.obState.isActive) {
                            return [2 /*return*/];
                        }
                        this.obState.isBusy = true;
                        return [4 /*yield*/, this.guestLogin()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 6]);
                        this.exposeDependencies();
                        fetchUrl =  false
                            ? undefined
                            : 'https://orkan-admin.firebaseapp.com/admin.js';
                        return [4 /*yield*/, fetch(fetchUrl)];
                    case 3:
                        response = _b.sent();
                        _a = eval;
                        return [4 /*yield*/, response.text()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]);
                        OrkanAdmin = window[ORKAN_ADMIN_GLOBAL].default;
                        delete window[ORKAN_ADMIN_GLOBAL];
                        this.obState.isActive = true;
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _b.sent();
                        console.error(err_1);
                        return [3 /*break*/, 6];
                    case 6:
                        setTimeout(function () {
                            _this.obState.isBusy = false;
                        }, 500);
                        return [2 /*return*/];
                }
            });
        });
    };
    Provider.prototype.exposeDependencies = function () {
        window.mobx = external_mobx_;
        window.React = external_react_default.a;
        window.ReactDOM = external_react_dom_default.a;
        window.PropTypes = external_prop_types_default.a;
        window.classNames = external_classnames_default.a;
        window.autobind = external_autobind_decorator_default.a;
        window.firebase = app_default.a;
        window.orkan = {
            Provider: Provider_1,
            inject: inject,
            Firestore: firestore
        };
    };
    Provider.prototype.handleStoreReady = function (store) {
        this.adminStore = store;
    };
    Provider.prototype.handleBlur = function (e) {
        this.obState.isModifierKeyDown = false;
    };
    Provider.prototype.handleKeyDown = function (e) {
        if (e.key === 'Meta') {
            this.obState.isModifierKeyDown = true;
        }
    };
    Provider.prototype.handleKeyUp = function (e) {
        if (e.key === 'Meta') {
            this.obState.isModifierKeyDown = false;
        }
    };
    Provider.prototype.render = function () {
        var _a = this.props, children = _a.children, adminConfig = _a.adminConfig;
        var _b = this.obState, isActive = _b.isActive, isBusy = _b.isBusy;
        return [
            children,
            (isActive || isBusy) && external_react_dom_default.a.createPortal(external_react_default.a.createElement(indicator, { color: adminConfig.color, isBusy: isBusy || (this.adminStore && this.adminStore.isInitializing) }), document.body),
            isActive && external_react_dom_default.a.createPortal(external_react_default.a.createElement(OrkanAdmin, { config: adminConfig, dataStore: provider_firestore, onStoreReady: this.handleStoreReady }), document.body)
        ];
    };
    var Provider_1;
    Provider.propTypes = {
        onStoreReady: external_prop_types_default.a.func,
        adminConfig: external_prop_types_default.a.shape({
            color: external_prop_types_default.a.oneOf(['default', 'dark']),
            authProviders: external_prop_types_default.a.arrayOf(external_prop_types_default.a.oneOf(SUPPORTED_AUTH_PROVIDERS)),
            allowGuests: external_prop_types_default.a.bool
        }),
        firebaseConfig: external_prop_types_default.a.shape({
            apiKey: external_prop_types_default.a.string,
            authDomain: external_prop_types_default.a.string,
            databaseURL: external_prop_types_default.a.string,
            projectId: external_prop_types_default.a.string,
            storageBucket: external_prop_types_default.a.string,
            messagingSenderId: external_prop_types_default.a.string
        }).isRequired,
    };
    Provider.defaultProps = {
        onStoreReady: function () { return null; }
    };
    Provider.childContextTypes = (provider_a = {},
        provider_a[REACT_CONTEXT_NAME] = external_prop_types_default.a.object,
        provider_a);
    Provider.contextTypes = (provider_b = {},
        provider_b[REACT_CONTEXT_NAME] = external_prop_types_default.a.object,
        provider_b);
    provider_decorate([
        external_mobx_["observable"].shallow
    ], Provider.prototype, "obState", void 0);
    provider_decorate([
        external_mobx_["observable"].ref
    ], Provider.prototype, "adminStore", void 0);
    provider_decorate([
        external_autobind_decorator_default.a
    ], Provider.prototype, "activateAdmin", null);
    provider_decorate([
        external_autobind_decorator_default.a
    ], Provider.prototype, "handleStoreReady", null);
    provider_decorate([
        external_autobind_decorator_default.a
    ], Provider.prototype, "handleBlur", null);
    provider_decorate([
        external_autobind_decorator_default.a
    ], Provider.prototype, "handleKeyDown", null);
    provider_decorate([
        external_autobind_decorator_default.a
    ], Provider.prototype, "handleKeyUp", null);
    Provider = Provider_1 = provider_decorate([
        external_mobx_react_["observer"]
    ], Provider);
    return Provider;
}(external_react_["Component"]));
/* harmony default export */ var provider = (provider_Provider);

// EXTERNAL MODULE: ./src/value/style.scss
var value_style = __webpack_require__(22);
var value_style_default = /*#__PURE__*/__webpack_require__.n(value_style);

// CONCATENATED MODULE: ./src/value/index.js
var value_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var value_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var value_Value = /** @class */ (function (_super) {
    value_extends(Value, _super);
    function Value() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Value.prototype.handleClick = function (e) {
        var _a = this.props, onClick = _a.onClick, path = _a.path, orkan = _a.orkan;
        if (orkan.isEditMode()) {
            orkan.setActivePath(path);
            e.preventDefault();
            e.stopPropagation();
        }
        else {
            onClick && onClick(e);
        }
    };
    Value.prototype.render = function () {
        var _a = this.props, className = _a.className, value = _a.value, children = _a.children, orkan = _a.orkan, isPathLoading = _a.isPathLoading, html = _a.html, lightOverlay = _a.lightOverlay;
        if (isPathLoading.value) {
            return '...';
        }
        var s = createStyle(value_style_default.a, className, {
            root: {
                editMode: orkan.isEditMode(),
                lightOverlay: lightOverlay
            }
        });
        if (html) {
            return external_react_default.a.createElement("span", { className: s.root, dangerouslySetInnerHTML: { __html: value || children }, onClick: this.handleClick });
        }
        else {
            return external_react_default.a.createElement("span", { className: s.root, onClick: this.handleClick }, value || children);
        }
    };
    Value.propTypes = {
        path: external_prop_types_default.a.string.isRequired,
        html: external_prop_types_default.a.bool,
        lightOverlay: external_prop_types_default.a.bool,
    };
    Value.defaultProps = {
        lightOverlay: false
    };
    value_decorate([
        external_autobind_decorator_default.a
    ], Value.prototype, "handleClick", null);
    Value = value_decorate([
        inject(function (props) {
            return {
                value: props.path
            };
        }),
        external_mobx_react_["observer"]
    ], Value);
    return Value;
}(external_react_["Component"]));
/* harmony default export */ var src_value = (value_Value);

// EXTERNAL MODULE: ./src/with-value/style.scss
var with_value_style = __webpack_require__(23);
var with_value_style_default = /*#__PURE__*/__webpack_require__.n(with_value_style);

// CONCATENATED MODULE: ./src/with-value/index.js
var with_value_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var with_value_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var with_value_WithValue = /** @class */ (function (_super) {
    with_value_extends(WithValue, _super);
    function WithValue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WithValue.prototype.handleClick = function (e, originalHandler) {
        var _a = this.props, path = _a.path, orkan = _a.orkan;
        if (orkan.isEditMode()) {
            orkan.setActivePath(path);
            e.preventDefault();
            e.stopPropagation();
        }
        else {
            originalHandler && originalHandler(e);
        }
    };
    WithValue.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, value = _a.value, render = _a.render, orkan = _a.orkan, lightOverlay = _a.lightOverlay;
        if (!value) {
            return null;
        }
        var renderedValue = render(value);
        if (!renderedValue) {
            return null;
        }
        var s = createStyle(with_value_style_default.a, className, renderedValue.props.className, {
            root: {
                editMode: orkan.isEditMode(),
                lightOverlay: lightOverlay
            }
        });
        return Object(external_react_["cloneElement"])(renderedValue, { className: s.root, onClick: function (e) { return _this.handleClick(e, renderedValue.props.onClick); } });
    };
    WithValue.propTypes = {
        path: external_prop_types_default.a.string.isRequired,
        lightOverlay: external_prop_types_default.a.bool,
        render: external_prop_types_default.a.func
    };
    WithValue.defaultProps = {
        lightOverlay: false
    };
    with_value_decorate([
        external_autobind_decorator_default.a
    ], WithValue.prototype, "handleClick", null);
    WithValue = with_value_decorate([
        inject(function (props) {
            return {
                value: props.path
            };
        }),
        external_mobx_react_["observer"]
    ], WithValue);
    return WithValue;
}(external_react_["Component"]));
/* harmony default export */ var with_value = (with_value_WithValue);

// EXTERNAL MODULE: external "lodash/map"
var map_ = __webpack_require__(24);
var map_default = /*#__PURE__*/__webpack_require__.n(map_);

// EXTERNAL MODULE: ./src/list/style.scss
var list_style = __webpack_require__(25);
var list_style_default = /*#__PURE__*/__webpack_require__.n(list_style);

// CONCATENATED MODULE: ./src/list/index.js
var list_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var list_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var list_List = /** @class */ (function (_super) {
    list_extends(List, _super);
    function List() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    List.prototype.handleClick = function (e, key) {
        var _a = this.props, onClick = _a.onClick, path = _a.path, orkan = _a.orkan;
        if (orkan.isEditMode()) {
            orkan.setActivePath(path + "/" + key);
            e.preventDefault();
            e.stopPropagation();
        }
        else {
            onClick && onClick(e);
        }
    };
    List.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, classes = _a.classes, renderItem = _a.renderItem, value = _a.value, orkan = _a.orkan, lightOverlay = _a.lightOverlay;
        var s = createStyle(list_style_default.a, className, classes, {
            item: {
                editMode: orkan.isEditMode(),
                lightOverlay: lightOverlay
            }
        });
        return (external_react_default.a.createElement("div", { className: s.root }, map_default()(value, function (item, i) {
            var renderedItem = renderItem(item, item.$key);
            if (!renderedItem) {
                return null;
            }
            if (typeof renderedItem === 'object') {
                return Object(external_react_["cloneElement"])(renderedItem, { key: i, className: external_classnames_default()(s.item, renderedItem.props.className), onClick: function (e) { return _this.handleClick(e, i); } });
            }
            else {
                return renderedItem;
            }
        })));
    };
    List.propTypes = {
        path: external_prop_types_default.a.string.isRequired,
        renderItem: external_prop_types_default.a.func,
        lightOverlay: external_prop_types_default.a.bool,
    };
    List.defaultProps = {
        renderItem: function () { return null; },
        lightOverlay: false
    };
    list_decorate([
        external_autobind_decorator_default.a
    ], List.prototype, "handleClick", null);
    List = list_decorate([
        inject(function (_a) {
            var path = _a.path;
            return {
                value: path
            };
        }),
        external_mobx_react_["observer"]
    ], List);
    return List;
}(external_react_["Component"]));
/* harmony default export */ var list = (list_List);

// EXTERNAL MODULE: ./src/collection/style.scss
var collection_style = __webpack_require__(26);
var collection_style_default = /*#__PURE__*/__webpack_require__.n(collection_style);

// CONCATENATED MODULE: ./src/collection/index.js
var collection_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var collection_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var collection_Collection = /** @class */ (function (_super) {
    collection_extends(Collection, _super);
    function Collection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Collection.prototype.handleClick = function (e, key) {
        var _a = this.props, onClick = _a.onClick, path = _a.path, orkan = _a.orkan;
        if (orkan.isEditMode()) {
            orkan.setActivePath(path + "/" + key);
            e.preventDefault();
            e.stopPropagation();
        }
        else {
            onClick && onClick(e);
        }
    };
    Collection.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, classes = _a.classes, renderItem = _a.renderItem, collection = _a.collection, orkan = _a.orkan, lightOverlay = _a.lightOverlay;
        var s = createStyle(collection_style_default.a, className, classes, {
            item: {
                editMode: orkan.isEditMode(),
                lightOverlay: lightOverlay
            }
        });
        var cleanCollection = collection.filter(function (it) { return !!it; });
        return (external_react_default.a.createElement("div", { className: s.root }, cleanCollection.map(function (item) {
            var renderedItem = renderItem(item, item.$key);
            if (!renderedItem) {
                return null;
            }
            if (typeof renderedItem === 'object') {
                return Object(external_react_["cloneElement"])(renderedItem, { key: item.$key, className: external_classnames_default()(s.item, renderedItem.props.className), onClick: function (e) { return _this.handleClick(e, item.$key); } });
            }
            else {
                return renderedItem;
            }
        })));
    };
    Collection.propTypes = {
        path: external_prop_types_default.a.string.isRequired,
        renderItem: external_prop_types_default.a.func,
        lightOverlay: external_prop_types_default.a.bool,
        orderBy: external_prop_types_default.a.objectOf(external_prop_types_default.a.oneOf(['asc', 'desc'])),
        where: external_prop_types_default.a.objectOf(external_prop_types_default.a.shape({
            '==': external_prop_types_default.a.oneOfType([external_prop_types_default.a.string, external_prop_types_default.a.number]),
            '!=': external_prop_types_default.a.oneOfType([external_prop_types_default.a.string, external_prop_types_default.a.number]),
            '>=': external_prop_types_default.a.oneOfType([external_prop_types_default.a.string, external_prop_types_default.a.number]),
            '<=': external_prop_types_default.a.oneOfType([external_prop_types_default.a.string, external_prop_types_default.a.number])
        })),
        limit: external_prop_types_default.a.number
    };
    Collection.defaultProps = {
        renderItem: function () { return null; },
        lightOverlay: false
    };
    collection_decorate([
        external_autobind_decorator_default.a
    ], Collection.prototype, "handleClick", null);
    Collection = collection_decorate([
        inject(function (_a) {
            var path = _a.path, orderBy = _a.orderBy, where = _a.where, limit = _a.limit;
            return {
                collection: { path: path, orderBy: orderBy, where: where, limit: limit }
            };
        }),
        external_mobx_react_["observer"]
    ], Collection);
    return Collection;
}(external_react_["Component"]));
/* harmony default export */ var src_collection = (collection_Collection);

// CONCATENATED MODULE: ./src/index.js
/* concated harmony reexport inject */__webpack_require__.d(__webpack_exports__, "inject", function() { return inject; });
/* concated harmony reexport Provider */__webpack_require__.d(__webpack_exports__, "Provider", function() { return provider; });
/* concated harmony reexport Collection */__webpack_require__.d(__webpack_exports__, "Collection", function() { return src_collection; });
/* concated harmony reexport Value */__webpack_require__.d(__webpack_exports__, "Value", function() { return src_value; });
/* concated harmony reexport WithValue */__webpack_require__.d(__webpack_exports__, "WithValue", function() { return with_value; });
/* concated harmony reexport List */__webpack_require__.d(__webpack_exports__, "List", function() { return list; });
/* concated harmony reexport Firestore */__webpack_require__.d(__webpack_exports__, "Firestore", function() { return firestore; });










/***/ })
/******/ ]);
});