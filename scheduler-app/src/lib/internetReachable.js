const https = require("https");

const PROBE_URL = "https://connectivitycheck.gstatic.com/generate_204";
const TIMEOUT_MS = 5000;
const CACHE_TTL_MS = 12_000;

let cache = { expiresAt: 0, value: false };

function probeOnce() {
  return new Promise((resolve) => {
    let settled = false;
    const done = (v) => {
      if (settled) return;
      settled = true;
      resolve(v);
    };

    const req = https.get(PROBE_URL, { method: "GET" }, (res) => {
      res.resume();
      done(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on("error", () => done(false));
    req.setTimeout(TIMEOUT_MS, () => {
      req.destroy();
      done(false);
    });
  });
}

/**
 * Returns whether a quick HTTPS probe succeeds. Result is cached for CACHE_TTL_MS
 * so multiple due jobs (or tick + runNow) do not each hit the network.
 */
async function isInternetReachable() {
  const now = Date.now();
  if (now < cache.expiresAt) {
    return cache.value;
  }
  const value = await probeOnce();
  cache = { expiresAt: now + CACHE_TTL_MS, value };
  return value;
}

module.exports = { isInternetReachable };
