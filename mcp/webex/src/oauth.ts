/**
 * Webex OAuth 2.0 Authorization Code flow.
 *
 * - authorize(): one-time browser-based login → stores access + refresh tokens
 * - refreshAccessToken(): transparent token refresh using stored refresh token
 * - getValidAccessToken(): returns a usable access token, refreshing if needed
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { URL } from "node:url";
import { randomBytes } from "node:crypto";
import {
  loadClientConfig,
  loadTokens,
  saveTokens,
  type OAuthClientConfig,
  type StoredTokens,
} from "./token-store.js";

const WEBEX_AUTH_URL = "https://webexapis.com/v1/authorize";
const WEBEX_TOKEN_URL = "https://webexapis.com/v1/access_token";
const DEFAULT_PORT = 11424;

const ACCESS_TOKEN_LIFETIME_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const REFRESH_TOKEN_LIFETIME_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
const REFRESH_BUFFER_MS = 5 * 60 * 1000; // refresh 5 min before expiry

type TokenResponse = {
  access_token: string;
  expires_in: number; // seconds
  refresh_token: string;
  refresh_token_expires_in: number; // seconds
  token_type: string;
};

function requireConfig(): OAuthClientConfig {
  const config = loadClientConfig();
  if (!config || !config.client_id || !config.client_secret) {
    throw new Error(
      "OAuth client not configured. Run: node dist/index.js auth setup --client-id=CID --client-secret=CSECRET"
    );
  }
  return config;
}

function buildAuthorizeUrl(config: OAuthClientConfig, state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.client_id,
    redirect_uri: config.redirect_uri,
    scope: config.scopes,
    state,
  });
  return `${WEBEX_AUTH_URL}?${params.toString()}`;
}

async function exchangeCodeForTokens(
  config: OAuthClientConfig,
  code: string
): Promise<StoredTokens> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.client_id,
    client_secret: config.client_secret,
    code,
    redirect_uri: config.redirect_uri,
  });

  const res = await fetch(WEBEX_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as TokenResponse;
  const now = Date.now();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: now + data.expires_in * 1000,
    refresh_token_expires_at: now + data.refresh_token_expires_in * 1000,
    token_type: data.token_type || "Bearer",
  };
}

export async function refreshAccessToken(): Promise<StoredTokens> {
  const config = requireConfig();
  const tokens = loadTokens();
  if (!tokens?.refresh_token) {
    throw new Error(
      "No refresh token stored. Run: node dist/index.js auth login"
    );
  }

  if (Date.now() >= tokens.refresh_token_expires_at) {
    throw new Error(
      "Refresh token expired. Re-authorize with: node dist/index.js auth login"
    );
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: config.client_id,
    client_secret: config.client_secret,
    refresh_token: tokens.refresh_token,
  });

  const res = await fetch(WEBEX_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as TokenResponse;
  const now = Date.now();
  const newTokens: StoredTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: now + data.expires_in * 1000,
    refresh_token_expires_at: now + data.refresh_token_expires_in * 1000,
    token_type: data.token_type || "Bearer",
  };
  saveTokens(newTokens);
  return newTokens;
}

/**
 * Returns a valid OAuth access token, refreshing transparently if needed.
 * Returns null if no OAuth tokens are configured (caller should fall back).
 */
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = loadTokens();
  if (!tokens?.access_token || !tokens?.refresh_token) return null;

  if (Date.now() < tokens.expires_at - REFRESH_BUFFER_MS) {
    return tokens.access_token;
  }

  try {
    const refreshed = await refreshAccessToken();
    return refreshed.access_token;
  } catch {
    return null;
  }
}

/**
 * Returns a human-readable status summary of the OAuth token state.
 */
export function getTokenStatus(): {
  configured: boolean;
  hasTokens: boolean;
  accessTokenValid: boolean;
  accessTokenExpiresAt: string | null;
  refreshTokenValid: boolean;
  refreshTokenExpiresAt: string | null;
  message: string;
} {
  const config = loadClientConfig();
  const tokens = loadTokens();
  const now = Date.now();

  if (!config?.client_id) {
    return {
      configured: false,
      hasTokens: false,
      accessTokenValid: false,
      accessTokenExpiresAt: null,
      refreshTokenValid: false,
      refreshTokenExpiresAt: null,
      message:
        "OAuth not configured. Run: node dist/index.js auth setup --client-id=CID --client-secret=CSECRET",
    };
  }

  if (!tokens?.access_token) {
    return {
      configured: true,
      hasTokens: false,
      accessTokenValid: false,
      accessTokenExpiresAt: null,
      refreshTokenValid: false,
      refreshTokenExpiresAt: null,
      message:
        "OAuth configured but no tokens stored. Run: node dist/index.js auth login",
    };
  }

  const accessValid = now < tokens.expires_at;
  const refreshValid = now < tokens.refresh_token_expires_at;

  let message: string;
  if (accessValid) {
    const daysLeft = Math.round((tokens.expires_at - now) / (24 * 60 * 60 * 1000) * 10) / 10;
    message = `Access token valid (${daysLeft} days remaining). Auto-refresh active.`;
  } else if (refreshValid) {
    message = "Access token expired but refresh token is valid. Will auto-refresh on next API call.";
  } else {
    message = "Both tokens expired. Re-authorize with: node dist/index.js auth login";
  }

  return {
    configured: true,
    hasTokens: true,
    accessTokenValid: accessValid,
    accessTokenExpiresAt: accessValid ? new Date(tokens.expires_at).toISOString() : null,
    refreshTokenValid: refreshValid,
    refreshTokenExpiresAt: refreshValid
      ? new Date(tokens.refresh_token_expires_at).toISOString()
      : null,
    message,
  };
}

/**
 * Interactive OAuth authorization flow.
 * Spins up a temporary local HTTP server, opens the browser, waits for callback.
 */
export async function authorize(): Promise<void> {
  const config = requireConfig();
  const state = randomBytes(16).toString("hex");

  const tokenPromise = new Promise<StoredTokens>((resolve, reject) => {
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const url = new URL(req.url ?? "/", `http://localhost:${DEFAULT_PORT}`);
        if (url.pathname !== "/callback") {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not found");
          return;
        }

        const code = url.searchParams.get("code");
        const returnedState = url.searchParams.get("state");
        const error = url.searchParams.get("error");

        if (error) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(`<html><body><h2>Authorization failed</h2><p>${error}</p><p>You can close this tab.</p></body></html>`);
          server.close();
          reject(new Error(`Authorization denied: ${error}`));
          return;
        }

        if (!code || returnedState !== state) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end("<html><body><h2>Invalid callback</h2><p>Missing code or state mismatch.</p></body></html>");
          server.close();
          reject(new Error("Invalid OAuth callback: missing code or state mismatch"));
          return;
        }

        const tokens = await exchangeCodeForTokens(config, code);
        saveTokens(tokens);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<html><body><h2>Webex authorization successful!</h2>" +
            "<p>Tokens saved. You can close this tab and return to Cursor.</p></body></html>"
        );
        server.close();
        resolve(tokens);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal error during token exchange.");
        server.close();
        reject(err);
      }
    });

    server.listen(DEFAULT_PORT, "127.0.0.1", () => {
      const authUrl = buildAuthorizeUrl(config, state);
      console.log(`\nOpening browser for Webex authorization...\n`);
      console.log(`If the browser doesn't open, visit:\n${authUrl}\n`);

      import("open")
        .then((mod) => mod.default(authUrl))
        .catch(() => {
          console.log("Could not open browser automatically. Please open the URL above manually.");
        });
    });

    server.on("error", (err) => {
      reject(new Error(`Failed to start local server on port ${DEFAULT_PORT}: ${err.message}`));
    });

    setTimeout(() => {
      server.close();
      reject(new Error("Authorization timed out after 120 seconds."));
    }, 120_000);
  });

  const tokens = await tokenPromise;
  const daysUntilRefreshExpiry = Math.round(
    (tokens.refresh_token_expires_at - Date.now()) / (24 * 60 * 60 * 1000)
  );
  console.log(`\nAuthorization complete!`);
  console.log(`Access token valid for ~14 days (auto-refreshes).`);
  console.log(`Refresh token valid for ~${daysUntilRefreshExpiry} days.\n`);
}
