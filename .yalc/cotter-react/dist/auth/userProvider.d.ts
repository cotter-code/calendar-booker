import * as React from 'react';
import { Config } from "cotter/lib/binder";
export interface CotterProviderOptions extends Config {
    /**
     * The child nodes your Provider has wrapped
     */
    children?: React.ReactNode;
    apiKeyID: string;
}
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
declare const CotterProvider: (opts: CotterProviderOptions) => JSX.Element;
export default CotterProvider;
