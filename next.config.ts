import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	serverExternalPackages: [
		"@emotion/react",
		"@emotion/styled",
		"@emotion/utils",
		"@emotion/cache",
		"@emotion/use-insertion-effect-with-fallbacks",
	],
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
