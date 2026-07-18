/**
 * Cloudflare Worker entry for vinext / Sites.
 * The vinext fetch handler is provided via virtual entry at build time.
 * This file remains the wrangler `main` so bindings are attached to the Worker.
 */
export { default } from "vinext/server/fetch-handler";
