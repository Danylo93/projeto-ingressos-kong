import { API_BASE_URL, API_TOKEN } from "./config";

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || res.statusText);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON response: ${text}`);
  }
}

export async function fetchApiJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  if (API_TOKEN) headers.set("apikey", API_TOKEN);
  return fetchJson<T>(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });
}
