import * as React from "react";
/**
 * Options for the withAuthenticationRequired
 */
export interface WithAuthenticationRequiredOptions {
    /**
     * ```js
     * withAuthenticationRequired(Dashboard, {
     *   loginPagePath: '/' // where to return after finish login
     * })
     * ```
     *
     * The path where the login page is located.
     */
    loginPagePath?: string | (() => string);
    /**
     * ```js
     * withAuthenticationRequired(Profile, {
     *   loadingComponent: () => <div>Loading... We're redirecting you to login.</div>
     * })
     * ```
     *
     * Show a component to the user while they're being redirected to the login page.
     */
    loadingComponent?: () => JSX.Element;
}
declare const withAuthenticationRequired: <P extends object>(Component: React.ComponentType<P>, options: WithAuthenticationRequiredOptions) => (props: P) => (() => JSX.Element) | JSX.Element;
export default withAuthenticationRequired;
