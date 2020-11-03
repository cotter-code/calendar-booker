

function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Cotter = require('cotter');
var PropTypes = require('prop-types');
var binder = require('cotter/lib/binder');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Cotter__default = /*#__PURE__*/_interopDefaultLegacy(Cotter);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

var stub = function () {
    throw new Error("You forgot to wrap your component in <CotterProvider>.");
};
/**
 * The initial initialContext.
 */
var initialContext = {
    isLoggedIn: false,
    // In SSR mode the library will never check the session, so loading should be initialised as false
    isLoading: typeof window !== "undefined",
    logout: stub,
    getCotter: stub,
    getAccessToken: stub,
    checkLoggedIn: stub,
    apiKeyID: "",
};
/**
 * The Cotter Context
 */
var CotterContext = React.createContext(initialContext);

/**
 * ```jsx
 * <CotterProvider
 *   apiKeyID={YOUR_API_KEY_ID}
 * >
 *   <MyApp />
 * </CotterProvider>
 * ```
 *
 * Provides the CotterContext to its child components.
 */
var CotterProvider = function (opts) {
    var children = opts.children, apiKeyID = opts.apiKeyID;
    var _a = React.useState(false), loggedIn = _a[0], setloggedIn = _a[1];
    var _b = React.useState(true), loading = _b[0], setloading = _b[1];
    var _c = React.useState(undefined), user = _c[0], setuser = _c[1];
    var getCotter = function (config) {
        if (config && config.ApiKeyID) {
            var c = new Cotter__default['default'](config);
            return c;
        }
        else {
            var c = new Cotter__default['default'](apiKeyID);
            return c;
        }
    };
    React.useEffect(function () {
        if (apiKeyID) {
            checkLoggedIn();
        }
    }, [apiKeyID]);
    var checkLoggedIn = function () { return __awaiter(void 0, void 0, void 0, function () {
        var cotter, accessToken, usr;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cotter = getCotter();
                    return [4 /*yield*/, cotter.tokenHandler.getAccessToken()];
                case 1:
                    accessToken = _b.sent();
                    if (accessToken && ((_a = accessToken.token) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        setloggedIn(true);
                        usr = cotter.getLoggedInUser();
                        setuser(usr);
                    }
                    else {
                        setloggedIn(false);
                        setuser(undefined);
                    }
                    setloading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var getAccessToken = function () { return __awaiter(void 0, void 0, void 0, function () {
        var cotter, accessToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!apiKeyID) return [3 /*break*/, 2];
                    cotter = getCotter();
                    return [4 /*yield*/, cotter.tokenHandler.getAccessToken()];
                case 1:
                    accessToken = _a.sent();
                    return [2 /*return*/, accessToken];
                case 2: throw new Error("ApiKeyID is undefined, you may forgot to wrap your component in <CotterProvider>");
            }
        });
    }); };
    var logout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var cotter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!apiKeyID) return [3 /*break*/, 2];
                    cotter = getCotter();
                    return [4 /*yield*/, cotter.logOut()];
                case 1:
                    _a.sent();
                    setloggedIn(false);
                    setuser(undefined);
                    return [3 /*break*/, 3];
                case 2: throw new Error("ApiKeyID is undefined, you may forgot to wrap your component in <CotterProvider>");
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(CotterContext.Provider, { value: {
            checkLoggedIn: checkLoggedIn,
            isLoggedIn: loggedIn,
            isLoading: typeof window === "undefined" || loading,
            getCotter: getCotter,
            user: user,
            apiKeyID: apiKeyID,
            logout: logout,
            getAccessToken: getAccessToken,
        } }, children));
};

___$insertStyle(".Cotter__loader-wrapper {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  background: #fff;\n  opacity: 0;\n  z-index: -1;\n  transition: opacity 0.3s;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-radius: 6px;\n}\n.Cotter__loader-wrapper .Cotter__loader {\n  height: 80px;\n  width: 80px;\n}\n.Cotter__loader-wrapper.Cotter__is-active {\n  opacity: 1;\n  z-index: 1;\n}\n\n.Cotter__is-loading {\n  position: relative;\n}");

function Loading(_a) {
    var loading = _a.loading;
    return (React.createElement("div", { className: "Cotter__loader-wrapper " + (loading && "Cotter__is-active") },
        React.createElement("div", { className: "Cotter__loader Cotter__is-loading" })));
}

var defaultLoadingComponent = function () { return React.createElement(Loading, { loading: true }); };
var defaultLoginPagePath = "/";
var withAuthenticationRequired = function (Component, options) { return function (props) {
    var _a = React.useContext(CotterContext), isLoggedIn = _a.isLoggedIn, isLoading = _a.isLoading;
    var _b = options.loginPagePath, loginPagePath = _b === void 0 ? defaultLoginPagePath : _b, _c = options.loadingComponent, loadingComponent = _c === void 0 ? defaultLoadingComponent : _c;
    React.useEffect(function () {
        if (!isLoading && !isLoggedIn) {
            window.location.href =
                typeof loginPagePath === "function" ? loginPagePath() : loginPagePath;
        }
    }, [isLoggedIn, isLoading]);
    return !isLoggedIn ? loadingComponent : React.createElement(Component, __assign({}, props));
}; };

/**
 * ```jsx
 * <LoginForm
 *    authMethod="MAGIC_LINK"
 *    type="EMAIL"
 *    onSuccess={() => navigate("/")}
 *    onError={(err) => alert(err)}
 *    onBegin={(payload) => checkEmail(payload.identifier)}
 *    styles={{
 *      input_label: {color: "#ffffff"}
 *    }}
 *    additionalFields={[
 *      {
 *        name: "name",
 *        label: "Full Name",
 *        placeholder: "Enter your full name",
 *      },
 *    ]}
 *    width={300}
 *    height={300}
 * />;
 * ```
 *
 * Initiate Cotter's login form
 **/
function LoginForm(_a) {
    var onBegin = _a.onBegin, onSuccess = _a.onSuccess, onError = _a.onError, styles = _a.styles, additionalFields = _a.additionalFields, _b = _a.type, type = _b === void 0 ? binder.IDENTIFIER_TYPE.EMAIL : _b, _c = _a.authMethod, authMethod = _c === void 0 ? binder.AUTHENTICATION_METHOD.MAGIC_LINK : _c, _d = _a.width, width = _d === void 0 ? 300 : _d, _e = _a.height, height = _e === void 0 ? 300 : _e;
    var _f = React.useState(false), loaded = _f[0], setloaded = _f[1];
    var _g = React.useState(""), containerID = _g[0], setcontainerID = _g[1];
    var _h = React.useContext(CotterContext), getCotter = _h.getCotter, apiKeyID = _h.apiKeyID, checkLoggedIn = _h.checkLoggedIn;
    React.useEffect(function () {
        var randomID = Math.random().toString(36).substring(2, 15);
        setcontainerID("cotter-form-container-" + randomID);
    }, []);
    React.useEffect(function () {
        console.log(containerID);
        if (getCotter && (apiKeyID === null || apiKeyID === void 0 ? void 0 : apiKeyID.length) >= 36 && containerID && !loaded) {
            var config = {
                ApiKeyID: apiKeyID,
                Type: type,
            };
            if (styles) {
                config.Styles = styles;
            }
            if (additionalFields && additionalFields.length > 0) {
                config.AdditionalFields = additionalFields;
            }
            config.ContainerID = containerID;
            console.log(config);
            var cotter = getCotter(config);
            var cotterMethod = authMethod === binder.AUTHENTICATION_METHOD.MAGIC_LINK
                ? cotter.signInWithLink()
                : cotter.signInWithOTP();
            if (onBegin) {
                cotterMethod =
                    authMethod === binder.AUTHENTICATION_METHOD.MAGIC_LINK
                        ? cotter.signInWithLink(onBegin)
                        : cotter.signInWithOTP(onBegin);
            }
            var cotterType = type === binder.IDENTIFIER_TYPE.EMAIL
                ? cotterMethod.showEmailForm()
                : cotterMethod.showPhoneForm();
            setloaded(true);
            cotterType
                .then(function (resp) {
                checkLoggedIn();
                onSuccess(resp);
            })
                .catch(function (err) { return onError(err); });
        }
    }, [
        onSuccess,
        onError,
        authMethod,
        type,
        styles,
        additionalFields,
        containerID,
        loaded,
        onBegin,
        getCotter,
        apiKeyID,
        checkLoggedIn,
    ]);
    return (React.createElement(React.Fragment, null,
        (!apiKeyID || apiKeyID.length < 36) && (React.createElement("div", { style: { padding: "0px 20px" } },
            "You're missing the API KEY ID, you need to pass it to",
            " ",
            React.createElement("code", null, "CotterProvider"))),
        React.createElement("div", { id: containerID, style: { width: width, height: (apiKeyID === null || apiKeyID === void 0 ? void 0 : apiKeyID.length) >= 36 ? height : 10 } })));
}
LoginForm.propTypes = {
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
};

exports.CotterContext = CotterContext;
exports.CotterProvider = CotterProvider;
exports.LoginForm = LoginForm;
exports.withAuthenticationRequired = withAuthenticationRequired;
//# sourceMappingURL=index.js.map
