/// <reference types="react" />
import Cotter from "cotter";
import { CotterAccessToken } from "cotter-token-js";
import { Config } from "cotter/lib/binder";
import User from "cotter/lib/models/User";
/**
 * Contains the authenticated state and authentication methods provided by the `useCotter` hook.
 */
export interface CotterContextInterface {
    isLoggedIn: boolean;
    isLoading: boolean;
    getCotter?: (config?: Config) => Cotter;
    user?: User;
    apiKeyID: string;
    logout: (logoutPath?: String) => Promise<void>;
    checkLoggedIn: () => Promise<void>;
    getAccessToken: () => Promise<CotterAccessToken | null>;
}
/**
 * The initial initialContext.
 */
export declare const initialContext: CotterContextInterface;
/**
 * The Cotter Context
 */
declare const CotterContext: import("react").Context<CotterContextInterface>;
export default CotterContext;
