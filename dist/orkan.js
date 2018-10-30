/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("mobx");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("lodash/isObject");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("classnames");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("autobind-decorator");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("mobx-react");

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(0);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);

// EXTERNAL MODULE: external "react-dom"
var external_react_dom_ = __webpack_require__(9);
var external_react_dom_default = /*#__PURE__*/__webpack_require__.n(external_react_dom_);

// EXTERNAL MODULE: external "prop-types"
var external_prop_types_ = __webpack_require__(2);
var external_prop_types_default = /*#__PURE__*/__webpack_require__.n(external_prop_types_);

// EXTERNAL MODULE: external "mobx-react"
var external_mobx_react_ = __webpack_require__(6);

// EXTERNAL MODULE: external "mobx"
var external_mobx_ = __webpack_require__(1);

// EXTERNAL MODULE: external "autobind-decorator"
var external_autobind_decorator_ = __webpack_require__(5);
var external_autobind_decorator_default = /*#__PURE__*/__webpack_require__.n(external_autobind_decorator_);

// EXTERNAL MODULE: external "classnames"
var external_classnames_ = __webpack_require__(4);
var external_classnames_default = /*#__PURE__*/__webpack_require__.n(external_classnames_);

// CONCATENATED MODULE: ./src/orkan/constants.js
var REACT_CONTEXT_NAME = 'OrkanContext';
var SCHEMA_KEY_NAME = 'schema';
var SCHEMA_SETTINGS_KEY_NAME = 'schemaSettings';
var USERS_KEY_NAME = 'usersPermissions';
var USER_REQUESTS_KEY_NAME = 'usersRequests';
var MEDIA_KEY_NAME = 'media';
var ACTIVATION_EVENT_KEY = 'o';

// EXTERNAL MODULE: external "humaninput/dist/humaninput-full.min"
var humaninput_full_min_ = __webpack_require__(21);
var humaninput_full_min_default = /*#__PURE__*/__webpack_require__.n(humaninput_full_min_);

// CONCATENATED MODULE: ./src/orkan/utils/keyboard-utils.js

var keyboard_utils_Keyboard = /** @class */ (function () {
    function Keyboard() {
        this.binder = new humaninput_full_min_default.a(window);
        // this.binder.filter = e => true
    }
    Keyboard.prototype.bind = function (keys, handler) {
        this.binder.on(keys, handler);
    };
    Keyboard.prototype.unbind = function (keys, handler) {
        this.binder.off(keys, handler);
    };
    Keyboard.prototype.isDown = function (keys) {
        return this.binder.state.down.indexOf(keys) > -1 && this.binder.state.down.length === 1;
    };
    return Keyboard;
}());

var keyboard_utils_keyboard = new keyboard_utils_Keyboard();
var keyboard_utils_onDoublePress = function (key, handler) {
    var count = 0;
    var timeout;
    var singleHandler = function (e) {
        if (e.key.toLowerCase() !== key) {
            return;
        }
        count++;
        timeout && clearTimeout(timeout);
        if (count === 2) {
            handler(e);
            count = 0;
        }
        else {
            timeout = setTimeout(function () { return count = 0; }, 300);
        }
    };
    keyboard_utils_keyboard.bind(key, singleHandler);
    return function () { return keyboard_utils_keyboard.unbind(key, singleHandler); };
};

// EXTERNAL MODULE: ./node_modules/path-browserify/index.js
var path_browserify = __webpack_require__(20);
var path_browserify_default = /*#__PURE__*/__webpack_require__.n(path_browserify);

// EXTERNAL MODULE: external "lodash/isPlainObject"
var isPlainObject_ = __webpack_require__(8);
var isPlainObject_default = /*#__PURE__*/__webpack_require__.n(isPlainObject_);

// EXTERNAL MODULE: external "lodash/isObject"
var isObject_ = __webpack_require__(3);
var isObject_default = /*#__PURE__*/__webpack_require__.n(isObject_);

// EXTERNAL MODULE: external "lodash/isArray"
var isArray_ = __webpack_require__(11);
var isArray_default = /*#__PURE__*/__webpack_require__.n(isArray_);

// CONCATENATED MODULE: ./src/orkan/form/observable-nested-map.js
var observable_nested_map_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var observable_nested_map_KEY_SPLIT_REGEX = /\.|\[|\]\.|\]/;
var observable_nested_map_ObservableNestedMap = /** @class */ (function () {
    function ObservableNestedMap(value) {
        this.map = new external_mobx_["ObservableMap"]({});
        this.merge(value);
    }
    ObservableNestedMap.prototype.get = function (key, ctx) {
        if (ctx === void 0) { ctx = this.map; }
        var parts = key.split(observable_nested_map_KEY_SPLIT_REGEX).filter(function (part) { return !!part; });
        var part = parts.shift();
        var value;
        if (Object(external_mobx_["isObservableMap"])(ctx)) {
            value = ctx.get(part);
        }
        else if (Object(external_mobx_["isObservableArray"])(ctx)) {
            value = ctx[part];
        }
        if (parts.length && (Object(external_mobx_["isObservableMap"])(value) || Object(external_mobx_["isObservableArray"])(value))) {
            return this.get(parts.join('.'), value);
        }
        else {
            return value;
        }
    };
    ObservableNestedMap.prototype.shallowSet = function (ctx, key, value) {
        if (isPlainObject_default()(value) || Object(external_mobx_["isObservableObject"])(value)) {
            value = observable_nested_map_nestedMapFromObj(value);
        }
        else if (isArray_default()(value) || Object(external_mobx_["isObservableArray"])(value)) {
            value = observable_nested_map_nestedMapFromArray(value);
        }
        if (Object(external_mobx_["isObservableMap"])(ctx)) {
            ctx.set(key, value);
        }
        else if (Object(external_mobx_["isObservableArray"])(ctx)) {
            ctx[key] = value;
        }
    };
    ObservableNestedMap.prototype.set = function (key, value, ctx) {
        if (ctx === void 0) { ctx = this.map; }
        var parts = key.split(observable_nested_map_KEY_SPLIT_REGEX).filter(function (part) { return !!part; });
        var part = parts.shift();
        if (!parts.length) {
            return this.shallowSet(ctx, part, value);
        }
        var obj = this.get(part, ctx);
        if (!obj) {
            if (isNaN(parts[0])) {
                this.shallowSet(ctx, part, new external_mobx_["ObservableMap"]({}));
            }
            else {
                this.shallowSet(ctx, part, []);
            }
        }
        obj = this.get(part, ctx);
        return this.set(parts.join('.'), value, obj);
    };
    ObservableNestedMap.prototype.merge = function (value) {
        this.map.merge(observable_nested_map_nestedMapFromObj(value));
    };
    ObservableNestedMap.prototype.clear = function () {
        this.map.clear();
    };
    ObservableNestedMap.prototype.toJS = function () {
        return Object(external_mobx_["toJS"])(this.map);
    };
    observable_nested_map_decorate([
        external_mobx_["action"]
    ], ObservableNestedMap.prototype, "shallowSet", null);
    observable_nested_map_decorate([
        external_mobx_["action"]
    ], ObservableNestedMap.prototype, "set", null);
    observable_nested_map_decorate([
        external_mobx_["action"]
    ], ObservableNestedMap.prototype, "merge", null);
    observable_nested_map_decorate([
        external_mobx_["action"]
    ], ObservableNestedMap.prototype, "clear", null);
    return ObservableNestedMap;
}());

function observable_nested_map_nestedMapFromObj(obj) {
    var nestedMap = new external_mobx_["ObservableMap"](obj);
    nestedMap.forEach(function (value, key) {
        if (isPlainObject_default()(value) || Object(external_mobx_["isObservableObject"])(value)) {
            nestedMap.set(key, observable_nested_map_nestedMapFromObj(value));
        }
        else if (isArray_default()(value) || Object(external_mobx_["isObservableArray"])(value)) {
            nestedMap.set(key, observable_nested_map_nestedMapFromArray(value));
        }
        else if (isObject_default()(value) && !isPlainObject_default()(value)) {
            nestedMap.set(key, value);
        }
    });
    return nestedMap;
}
function observable_nested_map_nestedMapFromArray(arr) {
    return arr.map(function (value) {
        if (isPlainObject_default()(value) || Object(external_mobx_["isObservableObject"])(value)) {
            return observable_nested_map_nestedMapFromObj(value);
        }
        else if (isArray_default()(value) || Object(external_mobx_["isObservableArray"])(value)) {
            return observable_nested_map_nestedMapFromArray(value);
        }
        else if (isObject_default()(value) && !isPlainObject_default()(value)) {
            return external_mobx_["observable"].ref(value);
        }
        else {
            return value;
        }
    });
}

// CONCATENATED MODULE: ./src/orkan/firebase-store.js
var firebase_store_assign = (undefined && undefined.__assign) || function () {
    firebase_store_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return firebase_store_assign.apply(this, arguments);
};
var firebase_store_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var firebase_store_generator = (undefined && undefined.__generator) || function (thisArg, body) {
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



var firebase_store_FirebaseStore = /** @class */ (function () {
    function FirebaseStore(database, rootPath) {
        if (rootPath === void 0) { rootPath = 'orkan'; }
        this.pathsStatus = external_mobx_["observable"].map({});
        this.map = new observable_nested_map_ObservableNestedMap({});
        this.database = database;
        this.rootPath = rootPath;
    }
    FirebaseStore.prototype.toAbsolutePath = function (path) {
        return path_browserify_default.a.join(this.rootPath, path);
    };
    FirebaseStore.prototype.getValue = function (path) {
        var value = this.map.get(path.split('/').join('.'));
        return Object(external_mobx_["isObservable"])(value) ? Object(external_mobx_["toJS"])(value) : value;
    };
    FirebaseStore.prototype.setValue = function (path, value) {
        return this.database.ref(this.toAbsolutePath(path)).set(value);
    };
    FirebaseStore.prototype.push = function (path) {
        return this.database.ref(this.toAbsolutePath(path)).push();
    };
    FirebaseStore.prototype.listen = function (path) {
        var _this = this;
        var valueHandler = function (snapshot) {
            var snapshotVal = snapshot.exportVal();
            var dotPath = path.split('/').join('.');
            if (snapshotVal) {
                _this.map.set(dotPath, snapshotVal);
            }
            else {
                _this.map.set(dotPath, null);
            }
            _this.setPathIsLoading(path, false);
        };
        this.setPathIsLoading(path, true);
        this.database.ref(this.toAbsolutePath(path)).on('value', valueHandler);
        return function () {
            _this.database.ref(_this.toAbsolutePath(path)).off('value', valueHandler);
        };
    };
    FirebaseStore.prototype.load = function (path) {
        return firebase_store_awaiter(this, void 0, void 0, function () {
            var snapshot, snapshotVal, dotPath;
            return firebase_store_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setPathIsLoading(path, true);
                        return [4 /*yield*/, this.database.ref(this.toAbsolutePath(path)).once('value')];
                    case 1:
                        snapshot = _a.sent();
                        snapshotVal = snapshot.exportVal();
                        dotPath = path.split('/').join('.');
                        this.map.set(dotPath, snapshotVal);
                        this.setPathIsLoading(path, false);
                        return [2 /*return*/, snapshotVal];
                }
            });
        });
    };
    FirebaseStore.prototype.remove = function (path) {
        return this.database.ref(this.toAbsolutePath(path)).remove();
    };
    FirebaseStore.prototype.clearCache = function (path) {
        var dotPath = path.split('/').join('.');
        this.map.set(dotPath, null);
    };
    FirebaseStore.prototype.setPathStatus = function (path, status) {
        var currentStatus = this.pathsStatus.get(path) || {};
        this.pathsStatus.set(path, firebase_store_assign({}, currentStatus, status));
    };
    FirebaseStore.prototype.setPathIsLoading = function (path, state) {
        var currentStatus = this.pathsStatus.get(path);
        if (!currentStatus || !state) {
            this.setPathStatus(path, { isLoading: state });
        }
    };
    FirebaseStore.prototype.isPathLoading = function (path) {
        var currentStatus = this.pathsStatus.get(path);
        return currentStatus && currentStatus.isLoading;
    };
    return FirebaseStore;
}());
/* harmony default export */ var firebase_store = (firebase_store_FirebaseStore);

// EXTERNAL MODULE: ./src/orkan/orkan-indicator/style.scss
var style = __webpack_require__(25);

// CONCATENATED MODULE: ./src/orkan/orkan-indicator/index.js
var orkan_indicator_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var orkan_indicator_OrkanIndicator = /** @class */ (function (_super) {
    orkan_indicator_extends(OrkanIndicator, _super);
    function OrkanIndicator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OrkanIndicator.prototype.render = function () {
        var _a = this.props, className = _a.className, isBusy = _a.isBusy;
        var newClassName = external_classnames_default()('OrkanIndicator', className, {
            'OrkanIndicator-not-busy': !isBusy,
            'OrkanIndicator-busy': isBusy
        });
        return external_react_default.a.createElement("div", { className: newClassName });
    };
    OrkanIndicator.propTypes = {
        isBusy: external_prop_types_default.a.bool
    };
    return OrkanIndicator;
}(external_react_["Component"]));
/* harmony default export */ var orkan_indicator = (orkan_indicator_OrkanIndicator);

// EXTERNAL MODULE: external "invariant"
var external_invariant_ = __webpack_require__(19);
var external_invariant_default = /*#__PURE__*/__webpack_require__.n(external_invariant_);

// EXTERNAL MODULE: external "lodash/forEach"
var forEach_ = __webpack_require__(10);
var forEach_default = /*#__PURE__*/__webpack_require__.n(forEach_);

// EXTERNAL MODULE: external "lodash/find"
var find_ = __webpack_require__(18);
var find_default = /*#__PURE__*/__webpack_require__.n(find_);

// CONCATENATED MODULE: ./src/orkan/form/form-store.js
var form_store_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var form_store_FormStore = /** @class */ (function () {
    function FormStore(data, validation) {
        if (data === void 0) { data = {}; }
        if (validation === void 0) { validation = {}; }
        var _this = this;
        this.isDirty = false;
        this.errors = external_mobx_["observable"].map({});
        this.dataMap = new observable_nested_map_ObservableNestedMap({});
        this.validation = {};
        this.dataMap.merge(data);
        this.validation = validation;
        // we use a delay of 1ms. otherwise reaction works syncronousely apparently.
        // this is bad because we can get false positives on the isDirty flag
        this.destroyReaction = Object(external_mobx_["reaction"])(function () { return _this.data; }, function () {
            !_this.ignoreChange && _this.setDirty();
            _this.ignoreChange = false;
            var fields = Array.from(_this.errors.keys());
            _this.clearAllErrors();
            _this.validateFields(fields);
        }, { name: 'FormStore dirty check', fireImmediately: false, delay: 1 });
    }
    Object.defineProperty(FormStore.prototype, "data", {
        get: function () {
            return this.toJS();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormStore.prototype, "isValid", {
        get: function () {
            var _this = this;
            return !find_default()(this.validation, function (validation, key) { return !_this.isFieldValid(key); });
        },
        enumerable: true,
        configurable: true
    });
    FormStore.prototype.getFieldError = function (key) {
        var value = this.get(key);
        var failedValidator = this.validation[key] && this.validation[key].find(function (validator) { return !validator.validate(value); });
        return failedValidator && failedValidator.error;
    };
    FormStore.prototype.isFieldValid = function (key) {
        var value = this.get(key);
        var failedValidator = this.validation[key] && this.validation[key].find(function (validator) { return !validator.validate(value); });
        return !failedValidator;
    };
    FormStore.prototype.validateFields = function (fields) {
        var _this = this;
        if (fields === void 0) { fields = []; }
        fields.forEach(function (field) {
            _this.errors.set(field, _this.getFieldError(field));
        });
    };
    FormStore.prototype.clearFieldErrors = function (fields) {
        var _this = this;
        if (fields === void 0) { fields = []; }
        forEach_default()(fields, function (field) {
            _this.errors.delete(field);
        });
    };
    FormStore.prototype.clearAllErrors = function () {
        this.errors.clear();
    };
    FormStore.prototype.set = function (key, value, ignoreChange) {
        if (ignoreChange === void 0) { ignoreChange = false; }
        this.ignoreChange = ignoreChange;
        return this.dataMap.set(key, value);
    };
    FormStore.prototype.get = function (key) {
        var value = this.dataMap.get(key);
        return Object(external_mobx_["isObservable"])(value) ? Object(external_mobx_["toJS"])(value) : value;
    };
    FormStore.prototype.setDirty = function () {
        this.isDirty = true;
    };
    FormStore.prototype.setClean = function () {
        this.isDirty = false;
    };
    FormStore.prototype.reset = function (value) {
        this.ignoreChange = true;
        this.dataMap.clear();
        this.setClean();
        value && this.dataMap.merge(value);
    };
    FormStore.prototype.destroy = function () {
        this.destroyReaction();
    };
    FormStore.prototype.toJS = function () {
        return this.dataMap.toJS();
    };
    form_store_decorate([
        external_mobx_["observable"]
    ], FormStore.prototype, "isDirty", void 0);
    form_store_decorate([
        external_mobx_["computed"]
    ], FormStore.prototype, "data", null);
    form_store_decorate([
        external_mobx_["computed"]
    ], FormStore.prototype, "isValid", null);
    form_store_decorate([
        external_mobx_["action"]
    ], FormStore.prototype, "set", null);
    form_store_decorate([
        external_mobx_["action"]
    ], FormStore.prototype, "setDirty", null);
    form_store_decorate([
        external_mobx_["action"]
    ], FormStore.prototype, "setClean", null);
    return FormStore;
}());
/* harmony default export */ var form_store = (form_store_FormStore);
var form_store_FormValidators = /** @class */ (function () {
    function FormValidators() {
    }
    FormValidators.required = function (_a) {
        var _b = (_a === void 0 ? {} : _a).error, error = _b === void 0 ? 'This field is required' : _b;
        return {
            validate: function (value) { return !!value; },
            error: error
        };
    };
    FormValidators.notEmpty = function (_a) {
        var _b = (_a === void 0 ? {} : _a).error, error = _b === void 0 ? 'This field is required' : _b;
        return {
            validate: function (value) { return !!value && !!value.trim(); },
            error: error
        };
    };
    FormValidators.emailValidation = function (_a) {
        var _b = (_a === void 0 ? {} : _a).error, error = _b === void 0 ? 'Please enter a valid email address' : _b;
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return {
            validate: function (value) { return emailRegex.test(value); },
            error: error
        };
    };
    FormValidators.passwordValidation = function (_a) {
        var _b = (_a === void 0 ? {} : _a).error, error = _b === void 0 ? 'Your password must have at least 6 characters' : _b;
        var passwordRegex = /^\S{6,}$/;
        return {
            validate: function (value) { return passwordRegex.test(value); },
            error: error
        };
    };
    FormValidators.editorRequired = function (_a) {
        var _b = (_a === void 0 ? {} : _a).error, error = _b === void 0 ? 'This field is required' : _b;
        return {
            validate: function (value) { return value && value.getCurrentContent().hasText(); },
            error: error
        };
    };
    FormValidators.maxLength = function (_a) {
        var _b = _a === void 0 ? {} : _a, maxLength = _b.maxLength, _c = _b.error, error = _c === void 0 ? 'Text too long' : _c;
        return {
            validate: function (value) { return !value || value.length <= maxLength; },
            error: error
        };
    };
    FormValidators.urlValidation = function (_a) {
        var _b = (_a === void 0 ? {} : _a).error, error = _b === void 0 ? 'Url is not valid' : _b;
        var urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
        return {
            validate: function (value) { return urlRegex.test(value); },
            error: error
        };
    };
    FormValidators.allTagsMaxLength = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.limit, limit = _c === void 0 ? 25 : _c, _d = _b.error, error = _d === void 0 ? "Tag cannot exceed " + limit + " characters" : _d;
        var validator = function (value) {
            var tagsStrArray = value.split(",");
            var result = false;
            tagsStrArray.forEach(function (tagStr) {
                tagStr = tagStr.trim();
                if (tagStr.length < limit) {
                    result = true;
                }
            });
            return result;
        };
        return {
            validate: validator,
            error: error
        };
    };
    return FormValidators;
}());


// CONCATENATED MODULE: ./src/orkan/utils/schema-utils.js


var schema_utils_schemaGet = function (schema, path) {
    var pathParts = path.split('/').filter(function (it) { return !!it; });
    pathParts.shift();
    var returnValue = schema;
    while (returnValue && pathParts.length) {
        var part = pathParts.shift();
        returnValue = returnValue[part] || returnValue._;
    }
    return returnValue;
};
var schema_utils_toSchemaPath = function (schema, path) {
    var pathParts = path.split('/').filter(function (it) { return !!it; });
    var subSchema = schema;
    var schemaPathParts = [pathParts.shift()];
    while (subSchema && pathParts.length) {
        var part = pathParts.shift();
        if (subSchema[part]) {
            schemaPathParts.push(part);
        }
        else if (subSchema._) {
            schemaPathParts.push('_');
        }
        else {
            return;
        }
        subSchema = subSchema[part] || subSchema._;
    }
    return schemaPathParts.join('/');
};
var schema_utils_getSchemaPrimitiveKeysByPath = function (schema, path) {
    var pathSchema = schema_utils_schemaGet(schema, path);
    return !pathSchema ? [] : Object.keys(pathSchema)
        .filter(function (key) { return !isObject_default()(pathSchema[key]); });
};
var schema_utils_getSchemaCollectionPaths = function (schema) {
    var collectionPaths = [];
    schema_utils_schemaWalk(schema, function (value, path) {
        if (path[path.length - 1] === '_') {
            collectionPaths.push(path.slice(0, -1).join('/'));
        }
    });
    return collectionPaths;
};
var schema_utils_schemaWalk = function (schema, cb, path) {
    if (path === void 0) { path = ['.']; }
    forEach_default()(schema, function (value, key) {
        cb(value, path.concat([key]));
        if (isObject_default()(value)) {
            schema_utils_schemaWalk(value, cb, path.concat([key]));
        }
    });
};

// CONCATENATED MODULE: ./src/orkan/orkan-store.js
var orkan_store_assign = (undefined && undefined.__assign) || function () {
    orkan_store_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return orkan_store_assign.apply(this, arguments);
};
var orkan_store_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var orkan_store_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var orkan_store_generator = (undefined && undefined.__generator) || function (thisArg, body) {
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






var orkan_store_validPathInvariant = function (path) { return external_invariant_default()(path.startsWith('.'), 'Invalid path structure. paths must start with `.`'); };
var orkan_store_toAbsolutePath = function (path) {
    var pathParts = path.split('/');
    if (pathParts[0] !== '.') {
        pathParts.unshift('.');
    }
    return pathParts.join('/');
};
var orkan_store_OrkanStore = /** @class */ (function () {
    function OrkanStore(dataStore, authStore) {
        this.dataFormStore = new form_store({}, {});
        this.settingsFormStore = new form_store({}, {});
        this.isLoadingActivePath = false;
        this.isInitiating = false;
        this.dataStore = dataStore;
        this.authStore = authStore;
    }
    OrkanStore.prototype.init = function () {
        var _this = this;
        this.isInitiating = true;
        this.authStore.onAuthStateChanged(function (user) { return orkan_store_awaiter(_this, void 0, void 0, function () {
            var userPermissions, err_1;
            return orkan_store_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!user) return [3 /*break*/, 8];
                        userPermissions = void 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.dataStore.load(USERS_KEY_NAME + '/' + user.uid)];
                    case 2:
                        userPermissions = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        if (!userPermissions) return [3 /*break*/, 5];
                        this.user = user;
                        this.dataStore.listen(SCHEMA_KEY_NAME);
                        this.dataStore.listen(SCHEMA_SETTINGS_KEY_NAME);
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.createUserRequest(user)];
                    case 6:
                        _a.sent();
                        this.logout();
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        this.user = null;
                        _a.label = 9;
                    case 9:
                        this.isInitiating = false;
                        return [2 /*return*/];
                }
            });
        }); });
    };
    OrkanStore.prototype.logout = function () {
        this.dataStore.clearCache(USERS_KEY_NAME);
        this.dataStore.clearCache(SCHEMA_SETTINGS_KEY_NAME);
        this.dataStore.clearCache(SCHEMA_KEY_NAME);
        return this.authStore.signOut();
    };
    OrkanStore.prototype.isAdmin = function () {
        return !!this.user;
    };
    OrkanStore.prototype.createUserRequest = function (user) {
        return this.dataStore.setValue(USER_REQUESTS_KEY_NAME + '/' + user.uid, {
            email: user.email,
            avatarUrl: user.photoURL
        });
    };
    OrkanStore.prototype.getValue = function (nonAbsolutePath) {
        var _a;
        // to enable components use relative paths (e.g something vs ./something)
        var path = orkan_store_toAbsolutePath(nonAbsolutePath);
        if (this.isLoadingActivePath) {
            return this.dataStore.getValue(path);
        }
        if (this.activePath === path) {
            return this.dataFormStore.get(this.activePath) || this.dataStore.getValue(path);
        }
        else if (this.activePath && this.activePath.indexOf(path) === 0) {
            return orkan_store_assign({}, this.dataStore.getValue(path), (_a = {}, _a[this.activePath.replace(path + '/', '')] = this.dataFormStore.get(this.activePath) || this.dataStore.getValue(this.activePath), _a));
        }
        else if (!this.isPathPrimitive(path)) {
            return this.dataStore.getValue(path);
        }
        else if (this.activePath && path.indexOf(this.activePath) === 0) {
            var relativePath = path.replace(this.activePath, '');
            var relativePathParts = relativePath.split('/');
            relativePathParts.shift(); // removing the first item because its empty
            if (relativePathParts.length === 1) {
                var formValue = this.dataFormStore.get(this.activePath);
                return formValue && formValue[relativePathParts[0]];
            }
            else {
                return this.dataStore.getValue(path);
            }
        }
        else {
            return this.dataStore.getValue(path);
        }
    };
    OrkanStore.prototype.setActivePath = function (nonAbsolutePath) {
        return orkan_store_awaiter(this, void 0, void 0, function () {
            var path, storeValue;
            var _this = this;
            return orkan_store_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = orkan_store_toAbsolutePath(nonAbsolutePath);
                        this.activePath = path;
                        this.dataFormStore.reset();
                        this.isLoadingActivePath = true;
                        return [4 /*yield*/, this.loadRequiredFieldsByPath(path)];
                    case 1:
                        _a.sent();
                        this.isLoadingActivePath = false;
                        storeValue = this.dataStore.getValue(path) || {};
                        if (!this.isPathPrimitive(path)) {
                            this.getPrimitiveKeysByPath(path).forEach(function (key) {
                                _this.dataFormStore.set(path + "." + key, storeValue[key]);
                            });
                        }
                        else {
                            this.dataFormStore.set(path, this.dataStore.getValue(path));
                        }
                        setTimeout(function () { return _this.dataFormStore.setClean(); }, 2);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrkanStore.prototype.submitData = function () {
        return orkan_store_awaiter(this, void 0, void 0, function () {
            var newValue, currentValue;
            var _this = this;
            return orkan_store_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newValue = this.dataFormStore.get(this.activePath);
                        currentValue = this.dataStore.getValue(this.activePath);
                        if (!(isObject_default()(newValue) && isObject_default()(currentValue))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.dataStore.setValue(this.activePath, orkan_store_assign({}, currentValue, newValue))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.dataStore.setValue(this.activePath, newValue)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        setTimeout(function () { return _this.dataFormStore.setClean(); }, 2);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrkanStore.prototype.loadRequiredFieldsByPath = function (path) {
        var _this = this;
        return Promise.all(this.getPrimitiveKeysByPath(path)
            .filter(function (key) { return _this.dataStore.getValue(path + '/' + key) === undefined; })
            .map(function (key) { return _this.dataStore.load(path + '/' + key); }));
    };
    OrkanStore.prototype.getSchemaByPath = function (path, includeNative) {
        orkan_store_validPathInvariant(path);
        var schema = this.getSchema(includeNative);
        return schema_utils_schemaGet(schema, path);
    };
    OrkanStore.prototype.isPathPrimitive = function (path, includeNative) {
        orkan_store_validPathInvariant(path);
        var pathSchema = this.getSchemaByPath(path, includeNative);
        return !isObject_default()(pathSchema);
    };
    OrkanStore.prototype.getPrimitiveKeysByPath = function (path) {
        orkan_store_validPathInvariant(path);
        var schema = this.getSchema();
        return schema_utils_getSchemaPrimitiveKeysByPath(schema, path);
    };
    OrkanStore.prototype.getNonPrimitiveKeysByPath = function (path, includeNative) {
        orkan_store_validPathInvariant(path);
        var pathSchema = this.getSchemaByPath(path, includeNative);
        if (this.isPathCollection(path)) {
            return Object.keys(this.dataStore.getValue(path) || {});
        }
        else {
            return Object.keys(pathSchema)
                .filter(function (key) { return isObject_default()(pathSchema[key]); });
        }
    };
    OrkanStore.prototype.clearActivePath = function () {
        this.activePath = null;
        this.dataFormStore.reset();
        this.clearSettingsPath();
    };
    OrkanStore.prototype.clearSettingsPath = function () {
        this.settingsFormStore.reset();
        this.settingsPath = null;
    };
    OrkanStore.prototype.getSettingsByPath = function (path) {
        orkan_store_validPathInvariant(path);
        var schema = this.getSchema();
        var schemaSettings = this.getSchemaSettings();
        var schemaPath = schema_utils_toSchemaPath(schema, path);
        if (schemaPath === this.settingsPath) {
            return this.settingsFormStore.toJS();
        }
        else if (schemaSettings) {
            return schema_utils_schemaGet(schemaSettings, schemaPath);
        }
    };
    OrkanStore.prototype.submitSettings = function () {
        return orkan_store_awaiter(this, void 0, void 0, function () {
            var newValue;
            return orkan_store_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newValue = this.settingsFormStore.toJS();
                        return [4 /*yield*/, this.dataStore.setValue(SCHEMA_SETTINGS_KEY_NAME + '/' + this.settingsPath, newValue)];
                    case 1:
                        _a.sent();
                        this.clearSettingsPath();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrkanStore.prototype.setSettingsPath = function (path) {
        orkan_store_validPathInvariant(path);
        var schema = this.getSchema();
        var schemaSettings = this.getSchemaSettings();
        var schemaPath = schema_utils_toSchemaPath(schema, path);
        this.settingsPath = schemaPath;
        var defaultSettings;
        if (this.isPathCollection(path)) {
            defaultSettings = {
                collectionMainLabel: ''
            };
        }
        else {
            defaultSettings = {
                uiType: 'text'
            };
        }
        this.settingsFormStore.reset(orkan_store_assign({}, defaultSettings, schema_utils_schemaGet(schemaSettings, schemaPath)));
    };
    OrkanStore.prototype.isPathCollection = function (path) {
        return !!this.getSchemaByPath(path, true)._;
    };
    // todo: how do i create a primitive collection item?
    OrkanStore.prototype.createCollectionItem = function (path, key) {
        return orkan_store_awaiter(this, void 0, void 0, function () {
            var finalKey;
            return orkan_store_generator(this, function (_a) {
                orkan_store_validPathInvariant(path);
                finalKey = key || this.dataStore.push(this.activePath).key;
                this.setActivePath(path + '/' + finalKey);
                return [2 /*return*/];
            });
        });
    };
    OrkanStore.prototype.removeCollectionItem = function (path) {
        orkan_store_validPathInvariant(path);
        return this.dataStore.remove(path);
    };
    OrkanStore.prototype.getSchema = function (includeNative) {
        if (includeNative === void 0) { includeNative = false; }
        return orkan_store_assign({}, this.dataStore.getValue(SCHEMA_KEY_NAME), includeNative ? orkan_store_orkanSchema : {});
    };
    OrkanStore.prototype.getSchemaSettings = function () {
        return orkan_store_assign({}, this.dataStore.getValue(SCHEMA_SETTINGS_KEY_NAME), orkan_store_orkanSchemaSettings);
    };
    OrkanStore.prototype.getUserPermissions = function () {
        return this.dataStore.getValue(USERS_KEY_NAME + '/' + this.user.uid);
    };
    OrkanStore.prototype.getCollectionsPaths = function (includeNative) {
        return schema_utils_getSchemaCollectionPaths(this.getSchema(includeNative));
    };
    OrkanStore.prototype.approveUserRequest = function (uid) {
        return orkan_store_awaiter(this, void 0, void 0, function () {
            return orkan_store_generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataStore.remove(USER_REQUESTS_KEY_NAME + '/' + uid)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dataStore.setValue(USERS_KEY_NAME + '/' + uid, orkan_store_defaultUserPermissions)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrkanStore.prototype.declineUserRequest = function (uid) {
        return this.dataStore.remove(USER_REQUESTS_KEY_NAME + '/' + uid);
    };
    OrkanStore.prototype.openModal = function (Component, props) {
        var _this = this;
        if (props === void 0) { props = {}; }
        return new Promise(function (resolve, reject) {
            _this.modal = {
                Component: Component,
                props: orkan_store_assign({}, props, { resolve: function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        _this.modal = null;
                        resolve.apply(void 0, args);
                    }, reject: function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        _this.modal = null;
                        reject.apply(void 0, args);
                    } })
            };
        });
    };
    orkan_store_decorate([
        external_mobx_["observable"]
    ], OrkanStore.prototype, "activePath", void 0);
    orkan_store_decorate([
        external_mobx_["observable"]
    ], OrkanStore.prototype, "settingsPath", void 0);
    orkan_store_decorate([
        external_mobx_["observable"]
    ], OrkanStore.prototype, "isLoadingActivePath", void 0);
    orkan_store_decorate([
        external_mobx_["observable"]
    ], OrkanStore.prototype, "isInitiating", void 0);
    orkan_store_decorate([
        external_mobx_["observable"].ref
    ], OrkanStore.prototype, "user", void 0);
    orkan_store_decorate([
        external_mobx_["observable"].ref
    ], OrkanStore.prototype, "modal", void 0);
    return OrkanStore;
}());
/* harmony default export */ var orkan_store = (orkan_store_OrkanStore);
var orkan_store_orkanSchema = {
    schema: {},
    usersPermissions: {
        _: {
            editData: 'string',
            editPermissions: 'string',
            editSchema: 'string',
        }
    }
};
var orkan_store_orkanSchemaSettings = {
    usersPermissions: {
        // mainCollectionLabel: 'email',
        _: {
            editData: {
                uiType: 'switch'
            },
            editPermissions: {
                uiType: 'switch'
            },
            editSchema: {
                uiType: 'switch'
            }
        }
    }
};
var orkan_store_defaultUserPermissions = {
    editData: true
};
// {
// 	blog:{
// 		posts: {
// 			_: {title, body, date, image}
// 		}
// 	}
// }

// CONCATENATED MODULE: ./src/orkan/orkan-provider/index.js
var orkan_provider_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var orkan_provider_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var orkan_provider_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var orkan_provider_generator = (undefined && undefined.__generator) || function (thisArg, body) {
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
var orkan_provider_a, orkan_provider_b;













var orkan_provider_OrkanAdmin;
window.mobx = external_mobx_;
window.React = external_react_default.a;
window.ReactDOM = external_react_dom_default.a;
window.PropTypes = external_prop_types_default.a;
window.classNames = external_classnames_default.a;
window.autobind = external_autobind_decorator_default.a;
var orkan_provider_OrkanProvider = /** @class */ (function (_super) {
    orkan_provider_extends(OrkanProvider, _super);
    function OrkanProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.obState = {
            isModifierKeyDown: false,
            isActive: false,
            isBusy: false,
        };
        return _this;
    }
    OrkanProvider.prototype.getChildContext = function () {
        var _this = this;
        var _a;
        var store = this.props.store;
        return _a = {}, _a[REACT_CONTEXT_NAME] = {
            store: this.props.store,
            getValue: function (path) { return _this.orkanStore ? _this.orkanStore.getValue(path) : store.getValue(path); },
            setActivePath: function (path) { return _this.orkanStore.setActivePath(path); },
            isEditMode: function () {
                var _a = _this.obState, isActive = _a.isActive, isModifierKeyDown = _a.isModifierKeyDown;
                return isActive && _this.orkanStore.isAdmin() && isModifierKeyDown;
            },
            openModal: function () {
                var props = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    props[_i] = arguments[_i];
                }
                var _a;
                return _this.orkanStore && (_a = _this.orkanStore).openModal.apply(_a, props);
            }
        }, _a;
    };
    OrkanProvider.prototype.componentWillMount = function () {
        // this.activate();
        keyboard_utils_keyboard.bind('hold:1000:' + ACTIVATION_EVENT_KEY, this.activate);
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        // does not fire with normal api
        document.body.onblur = this.handleBlur;
    };
    OrkanProvider.prototype.activate = function () {
        return orkan_provider_awaiter(this, void 0, void 0, function () {
            var _a, store, auth, response, _b, err_1;
            var _this = this;
            return orkan_provider_generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, store = _a.store, auth = _a.auth;
                        if (this.obState.isActive) {
                            return [2 /*return*/];
                        }
                        this.obState.isBusy = true;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch('orkan-admin.js')];
                    case 2:
                        response = _c.sent();
                        _b = eval;
                        return [4 /*yield*/, response.text()];
                    case 3:
                        _b.apply(void 0, [_c.sent()]);
                        orkan_provider_OrkanAdmin = __orkan__.default;
                        delete window.__orkan__;
                        this.orkanStore = new orkan_store(store, auth);
                        this.obState.isActive = true;
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _c.sent();
                        console.error(err_1);
                        return [3 /*break*/, 5];
                    case 5:
                        setTimeout(function () {
                            _this.obState.isBusy = false;
                        }, 500);
                        window.a = this.orkanStore;
                        return [2 /*return*/];
                }
            });
        });
    };
    OrkanProvider.prototype.handleBlur = function (e) {
        this.obState.isModifierKeyDown = false;
    };
    OrkanProvider.prototype.handleKeyDown = function (e) {
        if (e.key === 'Meta') {
            this.obState.isModifierKeyDown = true;
        }
    };
    OrkanProvider.prototype.handleKeyUp = function (e) {
        if (e.key === 'Meta') {
            this.obState.isModifierKeyDown = false;
        }
    };
    OrkanProvider.prototype.render = function () {
        var children = this.props.children;
        var _a = this.obState, isActive = _a.isActive, isBusy = _a.isBusy;
        return [
            children,
            (isActive || isBusy) && external_react_dom_default.a.createPortal(external_react_default.a.createElement(orkan_indicator, { isBusy: isBusy || (this.orkanStore && this.orkanStore.isInitiating) }), document.body),
            isActive && external_react_dom_default.a.createPortal(external_react_default.a.createElement(orkan_provider_OrkanAdmin, { store: this.orkanStore }), document.body)
        ];
    };
    OrkanProvider.propTypes = {
        store: external_prop_types_default.a.instanceOf(firebase_store).isRequired,
        auth: external_prop_types_default.a.object.isRequired
    };
    OrkanProvider.childContextTypes = (orkan_provider_a = {},
        orkan_provider_a[REACT_CONTEXT_NAME] = external_prop_types_default.a.object,
        orkan_provider_a);
    OrkanProvider.contextTypes = (orkan_provider_b = {},
        orkan_provider_b[REACT_CONTEXT_NAME] = external_prop_types_default.a.object,
        orkan_provider_b);
    orkan_provider_decorate([
        external_mobx_["observable"].shallow
    ], OrkanProvider.prototype, "obState", void 0);
    orkan_provider_decorate([
        external_mobx_["observable"].ref
    ], OrkanProvider.prototype, "orkanStore", void 0);
    orkan_provider_decorate([
        external_autobind_decorator_default.a
    ], OrkanProvider.prototype, "activate", null);
    orkan_provider_decorate([
        external_autobind_decorator_default.a
    ], OrkanProvider.prototype, "handleBlur", null);
    orkan_provider_decorate([
        external_autobind_decorator_default.a
    ], OrkanProvider.prototype, "handleKeyDown", null);
    orkan_provider_decorate([
        external_autobind_decorator_default.a
    ], OrkanProvider.prototype, "handleKeyUp", null);
    OrkanProvider = orkan_provider_decorate([
        external_mobx_react_["observer"]
    ], OrkanProvider);
    return OrkanProvider;
}(external_react_["Component"]));
/* harmony default export */ var orkan_provider = (orkan_provider_OrkanProvider);
/*
    =load sequence

    idle: provider/injector, firebase store, simple getValue logic

    active Orkan pre-auth: auth ui, auth logic

    active Orkan post-auth: all ui, all logic

    =

    OrkanProvider + orkanInjector
    DataStore
    AuthStore
    OrkanAdmin
    OrkanStore
*/ 

// EXTERNAL MODULE: external "lodash/map"
var map_ = __webpack_require__(17);
var map_default = /*#__PURE__*/__webpack_require__.n(map_);

// EXTERNAL MODULE: external "lodash/mapValues"
var mapValues_ = __webpack_require__(15);
var mapValues_default = /*#__PURE__*/__webpack_require__.n(mapValues_);

// EXTERNAL MODULE: external "lodash/values"
var values_ = __webpack_require__(16);
var values_default = /*#__PURE__*/__webpack_require__.n(values_);

// CONCATENATED MODULE: ./src/orkan/orkan-inject.js
var orkan_inject_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var orkan_inject_assign = (undefined && undefined.__assign) || function () {
    orkan_inject_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return orkan_inject_assign.apply(this, arguments);
};
var orkan_inject_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






function orkan_inject_orkanInject(mapPathsToProps, config) {
    if (mapPathsToProps === void 0) { mapPathsToProps = function () { return ({}); }; }
    var options = orkan_inject_assign({ liveEditedData: true }, config);
    return function (DecoratedComponent) {
        var _a;
        var OrkanInjector = /** @class */ (function (_super) {
            orkan_inject_extends(OrkanInjector, _super);
            function OrkanInjector() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            OrkanInjector.prototype.componentWillMount = function () {
                var store = this.getContext().store;
                var paths = values_default()(mapPathsToProps(this.props)).filter(function (it) { return !!it; });
                this.disposables = paths.map(function (path) { return store.listen(path); });
            };
            OrkanInjector.prototype.componentWillUnmount = function () {
                this.disposables.forEach(function (dispose) { return dispose(); });
            };
            OrkanInjector.prototype.getContext = function () {
                return this.context[REACT_CONTEXT_NAME];
            };
            OrkanInjector.prototype.render = function () {
                var store = this.getContext().store;
                var _a = this.props.injectedProps, injectedProps = _a === void 0 ? [] : _a;
                var mappedPaths;
                var mappedValues = {};
                var mappedStatuses = {};
                try {
                    var getValue_1 = this.getContext().getValue;
                    mappedPaths = mapPathsToProps(this.props);
                    mappedValues = mapValues_default()(mappedPaths, function (path) {
                        if (!path) {
                            return;
                        }
                        return options.liveEditedData ? getValue_1(path) : store.getValue(path);
                    });
                    mappedStatuses = mapValues_default()(mappedPaths, function (path) { return store.isPathLoading(path); });
                }
                catch (err) {
                    //React 14+ reports the error in "inject" with a wrong stack trace. It will write something about
                    //failing to reconcile a different component that was already unmounted.
                    // so we catch the error report it and rethrow here we still have the actual stack trace.
                    console.error(err);
                    throw err;
                }
                return (external_react_default.a.createElement(DecoratedComponent, orkan_inject_assign({}, this.props, mappedValues, { isPathLoading: mappedStatuses, injectedProps: injectedProps.concat(Object.keys(mappedPaths)), orkan: this.getContext() })));
            };
            OrkanInjector.contextTypes = (_a = {},
                _a[REACT_CONTEXT_NAME] = external_prop_types_default.a.object,
                _a);
            OrkanInjector = orkan_inject_decorate([
                external_mobx_react_["observer"]
            ], OrkanInjector);
            return OrkanInjector;
        }(external_react_["Component"]));
        return OrkanInjector;
    };
}

// EXTERNAL MODULE: ./src/orkan/display-components/style.scss
var display_components_style = __webpack_require__(23);

// CONCATENATED MODULE: ./src/orkan/display-components/index.js
var display_components_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var display_components_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var display_components_Value = /** @class */ (function (_super) {
    display_components_extends(Value, _super);
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
        var _a = this.props, className = _a.className, value = _a.value, children = _a.children, orkan = _a.orkan, isPathLoading = _a.isPathLoading;
        var newClassName = external_classnames_default()('Value', className, {
            'Orkan-edit-mode': orkan.isEditMode()
        });
        if (isPathLoading.value) {
            return '...';
        }
        return external_react_default.a.createElement("span", { className: newClassName, onClick: this.handleClick }, value || children);
    };
    Value.propTypes = {
        path: external_prop_types_default.a.string.isRequired
    };
    display_components_decorate([
        external_autobind_decorator_default.a
    ], Value.prototype, "handleClick", null);
    Value = display_components_decorate([
        orkan_inject_orkanInject(function (props) {
            return {
                value: props.path
            };
        }),
        external_mobx_react_["observer"]
    ], Value);
    return Value;
}(external_react_["Component"]));

var display_components_WithValue = /** @class */ (function (_super) {
    display_components_extends(WithValue, _super);
    function WithValue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WithValue.prototype.handleClick = function (e) {
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
    WithValue.prototype.render = function () {
        var _a = this.props, className = _a.className, value = _a.value, render = _a.render, orkan = _a.orkan;
        if (!value) {
            return null;
        }
        var renderedValue = render(value);
        var newClassName = external_classnames_default()('WithValue', className, renderedValue.props.className, {
            'Orkan-edit-mode': orkan.isEditMode(),
        });
        return Object(external_react_["cloneElement"])(renderedValue, { className: newClassName, onClick: this.handleClick });
    };
    WithValue.propTypes = {
        path: external_prop_types_default.a.string.isRequired,
        render: external_prop_types_default.a.func
    };
    display_components_decorate([
        external_autobind_decorator_default.a
    ], WithValue.prototype, "handleClick", null);
    WithValue = display_components_decorate([
        orkan_inject_orkanInject(function (props) {
            return {
                value: props.path
            };
        }),
        external_mobx_react_["observer"]
    ], WithValue);
    return WithValue;
}(external_react_["Component"]));

var display_components_Collection = /** @class */ (function (_super) {
    display_components_extends(Collection, _super);
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
        var _a = this.props, className = _a.className, renderItem = _a.renderItem, collection = _a.collection, orkan = _a.orkan;
        var newClassName = external_classnames_default()('Collection', className, {
            'Orkan-edit-mode': orkan.isEditMode()
        });
        var itemClassName = external_classnames_default()('Collection-item', {
            'Orkan-edit-mode': orkan.isEditMode()
        });
        return (external_react_default.a.createElement("div", { className: newClassName }, map_default()(collection, function (item, key) { return Object(external_react_["cloneElement"])(renderItem(item, key), { className: itemClassName, onClick: function (e) { return _this.handleClick(e, key); } }); })));
    };
    Collection.propTypes = {
        path: external_prop_types_default.a.string.isRequired,
        renderItem: external_prop_types_default.a.func
    };
    Collection.defaultProps = {
        renderItem: function () { return null; }
    };
    display_components_decorate([
        external_autobind_decorator_default.a
    ], Collection.prototype, "handleClick", null);
    Collection = display_components_decorate([
        orkan_inject_orkanInject(function (props) {
            return {
                collection: props.path
            };
        }),
        external_mobx_react_["observer"]
    ], Collection);
    return Collection;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/orkan/index.js
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "OrkanProvider", function() { return orkan_provider; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Value", function() { return display_components_Value; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "WithValue", function() { return display_components_WithValue; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Collection", function() { return display_components_Collection; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "FirebaseStore", function() { return firebase_store; });






/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("lodash/isPlainObject");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("react-dom");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("lodash/forEach");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("lodash/isArray");

/***/ }),
/* 12 */,
/* 13 */
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
/* 14 */
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
/* 15 */
/***/ (function(module, exports) {

module.exports = require("lodash/mapValues");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("lodash/values");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("lodash/map");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("lodash/find");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("invariant");

/***/ }),
/* 20 */
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(26)))

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("humaninput/dist/humaninput-full.min");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(14)(false);
// imports


// module
exports.push([module.i, "@keyframes listItemAnimation {\n  0% {\n    transform: translateX(-10px); }\n  99% {\n    transform: translateX(0);\n    opacity: 1; }\n  100% {\n    transform: none; } }\n\n@keyframes smallListItemAnimation {\n  from {\n    opacity: 0;\n    transform: translateX(-5px); }\n  to {\n    transform: translateX(0);\n    opacity: 1; } }\n\n@keyframes modalAnimation {\n  from {\n    opacity: 0;\n    transform: translateY(-50%); }\n  to {\n    transform: translateY(0);\n    opacity: 1; } }\n\n@keyframes orkanTopUiAnimation {\n  from {\n    opacity: 0;\n    transform: translate3d(0, -100%, 0); }\n  to {\n    opacity: 1;\n    transform: translate3d(0, 0, 0); } }\n\n@keyframes orkanAuthAnimation {\n  from {\n    transform: translate3d(-50%, -100%, 0); }\n  to {\n    transform: translate3d(-50%, 0, 0); } }\n\n@keyframes orkanOverlayAnimation {\n  from {\n    opacity: 0;\n    transform: translate3d(-60%, -50%, 0); }\n  to {\n    opacity: 1;\n    transform: translate3d(-50%, -50%, 0); } }\n\n.Value.Orkan-edit-mode:hover, .WithValue.Orkan-edit-mode:hover, .Collection-item.Orkan-edit-mode:hover {\n  position: relative; }\n  .Value.Orkan-edit-mode:hover:after, .WithValue.Orkan-edit-mode:hover:after, .Collection-item.Orkan-edit-mode:hover:after {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    right: 0;\n    background: repeating-linear-gradient(45deg, rgba(250, 41, 73, 0.9), rgba(250, 41, 73, 0.9) 20px, rgba(250, 41, 73, 0.8) 20px, rgba(250, 41, 73, 0.8) 40px);\n    font-weight: 400 !important;\n    letter-spacing: normal;\n    text-transform: none;\n    cursor: pointer;\n    color: black;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 100000000;\n    border: 2px solid #FA2949; }\n  .Value.Orkan-edit-mode:hover:before, .WithValue.Orkan-edit-mode:hover:before, .Collection-item.Orkan-edit-mode:hover:before {\n    animation: orkanOverlayAnimation;\n    animation-duration: .3s;\n    z-index: 100000001;\n    background: white;\n    left: 50%;\n    top: 50%;\n    position: absolute;\n    font-size: 15px !important;\n    font-weight: 500 !important;\n    font-family: 'Roboto';\n    color: #FA2949;\n    border-radius: 2px;\n    padding: 0 10px;\n    cursor: pointer;\n    height: 25px;\n    max-height: 100%;\n    transform: translate3d(-50%, -50%, 0);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    text-align: center;\n    letter-spacing: normal;\n    text-transform: uppercase; }\n\n.Value {\n  display: inline-block;\n  white-space: pre; }\n", ""]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(13)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(14)(false);
// imports


// module
exports.push([module.i, "@keyframes listItemAnimation {\n  0% {\n    transform: translateX(-10px); }\n  99% {\n    transform: translateX(0);\n    opacity: 1; }\n  100% {\n    transform: none; } }\n\n@keyframes smallListItemAnimation {\n  from {\n    opacity: 0;\n    transform: translateX(-5px); }\n  to {\n    transform: translateX(0);\n    opacity: 1; } }\n\n@keyframes modalAnimation {\n  from {\n    opacity: 0;\n    transform: translateY(-50%); }\n  to {\n    transform: translateY(0);\n    opacity: 1; } }\n\n@keyframes orkanTopUiAnimation {\n  from {\n    opacity: 0;\n    transform: translate3d(0, -100%, 0); }\n  to {\n    opacity: 1;\n    transform: translate3d(0, 0, 0); } }\n\n@keyframes orkanAuthAnimation {\n  from {\n    transform: translate3d(-50%, -100%, 0); }\n  to {\n    transform: translate3d(-50%, 0, 0); } }\n\n.OrkanIndicator {\n  z-index: 99999999999999;\n  animation: orkanTopUiAnimation;\n  animation-timing-function: ease-in-out;\n  animation-duration: .2s;\n  width: 100%;\n  height: 5px;\n  position: fixed;\n  top: 0;\n  left: 0; }\n  .OrkanIndicator:after {\n    animation-timing-function: linear !important;\n    animation: OrkanIndicatorBusyAnimation;\n    animation-duration: 1s;\n    animation-iteration-count: infinite;\n    animation-fill-mode: both;\n    transform: translate3d(0, 0, 0);\n    transition: transform 3s ease-in-out;\n    content: '';\n    position: absolute;\n    left: -68px;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    background: repeating-linear-gradient(45deg, #FA2949, #FA2949 20px, #fc7489 20px, #fc7489 40px); }\n  .OrkanIndicator.OrkanIndicator-busy:after {\n    animation-play-state: running; }\n  .OrkanIndicator.OrkanIndicator-not-busy:after {\n    animation-play-state: paused; }\n\n@keyframes OrkanIndicatorBusyAnimation {\n  from {\n    transform: translate3d(0, 0, 0); }\n  to {\n    transform: translate3d(58px, 0, 0); } }\n", ""]);

// exports


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(13)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {}

/***/ }),
/* 26 */
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


/***/ })
/******/ ]);