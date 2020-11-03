/// <reference types="react" />
import * as PropTypes from "prop-types";
import { AUTHENTICATION_METHOD, IDENTIFIER_TYPE, Styles, AdditionalField, VerifySuccess, OnBeginHandler } from "cotter/lib/binder";
interface LoginFormOptions {
    type: IDENTIFIER_TYPE;
    authMethod: AUTHENTICATION_METHOD;
    onSuccess: (response: VerifySuccess) => void;
    onError: (err: any) => void;
    onBegin?: OnBeginHandler;
    styles?: Styles;
    additionalFields?: AdditionalField[];
    width: number;
    height: number;
}
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
declare function LoginForm({ onBegin, onSuccess, onError, styles, additionalFields, type, authMethod, width, height, }: LoginFormOptions): JSX.Element;
declare namespace LoginForm {
    var propTypes: {
        onSuccess: PropTypes.Validator<(...args: any[]) => any>;
        onError: PropTypes.Validator<(...args: any[]) => any>;
    };
}
export default LoginForm;
