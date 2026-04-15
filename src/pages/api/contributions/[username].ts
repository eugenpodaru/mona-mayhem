import type { APIRoute } from 'astro';

export const prerender = false;

const CACHE_TTL_MS = 5 * 60 * 1000;
const STALE_GRACE_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 7000;
const MAX_CACHE_ENTRIES = 500;

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

type CacheEntry = {
	payload: JsonValue;
	fetchedAt: number;
	expiresAt: number;
	staleUntil: number;
	lastAccessedAt: number;
};

const contributionsCache = new Map<string, CacheEntry>();

const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

const jsonHeaders = {
	'Content-Type': 'application/json',
};

function buildJsonResponse(status: number, body: JsonValue, extraHeaders?: Record<string, string>) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			...jsonHeaders,
			...extraHeaders,
		},
	});
}

function errorResponse(status: number, code: string, message: string, username?: string) {
	return buildJsonResponse(status, {
		ok: false,
		error: {
			code,
			message,
		},
		...(username ? { username } : {}),
	});
}

function getCacheKey(username: string) {
	return username.toLowerCase();
}

function getNow() {
	return Date.now();
}

function isFresh(entry: CacheEntry, now: number) {
	return entry.expiresAt > now;
}

function isStaleButUsable(entry: CacheEntry, now: number) {
	return entry.expiresAt <= now && entry.staleUntil > now;
}

function cleanupCache(now: number) {
	for (const [key, entry] of contributionsCache) {
		if (entry.staleUntil <= now) {
			contributionsCache.delete(key);
		}
	}

	if (contributionsCache.size <= MAX_CACHE_ENTRIES) {
		return;
	}

	const sorted = [...contributionsCache.entries()].sort((a, b) => a[1].lastAccessedAt - b[1].lastAccessedAt);
	const entriesToRemove = contributionsCache.size - MAX_CACHE_ENTRIES;

	for (let i = 0; i < entriesToRemove; i += 1) {
		const [key] = sorted[i];
		contributionsCache.delete(key);
	}
}

function getCachedEntry(cacheKey: string, now: number) {
	const entry = contributionsCache.get(cacheKey);
	if (!entry) {
		return null;
	}

	entry.lastAccessedAt = now;
	return entry;
}

function setCachedEntry(cacheKey: string, payload: JsonValue, now: number) {
	contributionsCache.set(cacheKey, {
		payload,
		fetchedAt: now,
		expiresAt: now + CACHE_TTL_MS,
		staleUntil: now + CACHE_TTL_MS + STALE_GRACE_MS,
		lastAccessedAt: now,
	});

	cleanupCache(now);
}

async function fetchContributions(username: string) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

	try {
		return await fetch(`https://github.com/${username}.contribs`, {
			headers: {
				Accept: 'application/json',
			},
			signal: controller.signal,
		});
	} finally {
		clearTimeout(timeoutId);
	}
}

async function parseUpstreamJson(upstreamResponse: Response) {
	const responseText = await upstreamResponse.text();

	if (!responseText) {
		return null;
	}

	try {
		return JSON.parse(responseText) as JsonValue;
	} catch {
		return null;
	}
}

function successResponse(username: string, payload: JsonValue, stale: boolean, cacheState: 'HIT' | 'MISS' | 'STALE') {
	const now = getNow();
	const maxAge = stale ? 0 : Math.floor(CACHE_TTL_MS / 1000);

	return buildJsonResponse(
		200,
		{
			ok: true,
			username,
			data: payload,
			meta: {
				stale,
				generatedAt: new Date(now).toISOString(),
			},
		},
		{
			'Cache-Control': `public, max-age=${maxAge}, stale-if-error=${Math.floor(STALE_GRACE_MS / 1000)}`,
			'X-Cache': cacheState,
			...(stale ? { Warning: '110 - "Response is stale"' } : {}),
		}
	);
}

export const GET: APIRoute = async ({ params }) => {
	const username = params.username?.trim();

	if (!username) {
		return errorResponse(400, 'INVALID_USERNAME', 'Username is required.');
	}

	if (!usernameRegex.test(username)) {
		return errorResponse(400, 'INVALID_USERNAME', 'Username must be a valid GitHub username.', username);
	}

	const now = getNow();
	cleanupCache(now);

	const cacheKey = getCacheKey(username);
	const cached = getCachedEntry(cacheKey, now);

	if (cached && isFresh(cached, now)) {
		return successResponse(username, cached.payload, false, 'HIT');
	}

	let upstreamResponse: Response;

	try {
		upstreamResponse = await fetchContributions(username);
	} catch (error) {
		if (cached && isStaleButUsable(cached, now)) {
			console.warn('Serving stale contribution data due to upstream error', {
				username,
				error: error instanceof Error ? error.message : 'Unknown error',
			});
			return successResponse(username, cached.payload, true, 'STALE');
		}

		if (error instanceof DOMException && error.name === 'AbortError') {
			return errorResponse(504, 'UPSTREAM_TIMEOUT', 'Timed out while fetching contribution data.', username);
		}

		return errorResponse(502, 'UPSTREAM_FETCH_FAILED', 'Unable to fetch contribution data from upstream.', username);
	}

	if (upstreamResponse.status === 404) {
		return errorResponse(404, 'USERNAME_NOT_FOUND', 'No contribution data found for this username.', username);
	}

	if (!upstreamResponse.ok) {
		if (cached && isStaleButUsable(cached, now)) {
			console.warn('Serving stale contribution data due to upstream non-success status', {
				username,
				status: upstreamResponse.status,
			});
			return successResponse(username, cached.payload, true, 'STALE');
		}

		return errorResponse(502, 'UPSTREAM_BAD_RESPONSE', 'Unexpected response received from upstream.', username);
	}

	const upstreamPayload = await parseUpstreamJson(upstreamResponse);

	if (upstreamPayload === null) {
		if (cached && isStaleButUsable(cached, now)) {
			console.warn('Serving stale contribution data due to invalid upstream JSON', { username });
			return successResponse(username, cached.payload, true, 'STALE');
		}

		return errorResponse(502, 'UPSTREAM_INVALID_JSON', 'Upstream returned malformed JSON.', username);
	}

	setCachedEntry(cacheKey, upstreamPayload, now);
	return successResponse(username, upstreamPayload, false, 'MISS');
};
