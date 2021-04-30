import fetch, {RequestInit} from "node-fetch";

async function fetchJson<T = any>(url: string, init?: RequestInit) {
    const response = await fetch(url, init);
    if (!response.ok) {
        throw new Error(`Fetch ${response.url} return error ${response.statusText}`);
    }
    return await response.json() as T;
}

export default fetchJson;
