/**
 * File-based persistence for OAuth client credentials and tokens.
 * Storage directory: ~/.webex-mcp/
 * Files are created with 0600 permissions (owner read/write only).
 */

import { mkdirSync, readFileSync, writeFileSync, chmodSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const STORE_DIR = join(homedir(), ".webex-mcp");
const CONFIG_FILE = join(STORE_DIR, "config.json");
const TOKENS_FILE = join(STORE_DIR, "tokens.json");

export type OAuthClientConfig = {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scopes: string;
};

export type StoredTokens = {
  access_token: string;
  refresh_token: string;
  expires_at: number; // epoch ms
  refresh_token_expires_at: number; // epoch ms
  token_type: string;
};

function ensureDir(): void {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true, mode: 0o700 });
  }
}

function writeSecure(filePath: string, data: string): void {
  ensureDir();
  writeFileSync(filePath, data, { encoding: "utf-8", mode: 0o600 });
  chmodSync(filePath, 0o600);
}

function readJson<T>(filePath: string): T | null {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

export function saveClientConfig(config: OAuthClientConfig): void {
  writeSecure(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function loadClientConfig(): OAuthClientConfig | null {
  return readJson<OAuthClientConfig>(CONFIG_FILE);
}

export function saveTokens(tokens: StoredTokens): void {
  writeSecure(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

export function loadTokens(): StoredTokens | null {
  return readJson<StoredTokens>(TOKENS_FILE);
}

export function clearTokens(): void {
  if (existsSync(TOKENS_FILE)) {
    writeSecure(TOKENS_FILE, "{}");
  }
}

export function getStoreDir(): string {
  return STORE_DIR;
}
