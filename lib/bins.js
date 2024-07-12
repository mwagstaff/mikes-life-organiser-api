import { getJson } from './utils.js';


// Bromley Bins config
const BROMLEY_BINS_API_URL = 'https://waste-collection.fly.dev/api/v1/bin/3642936/next_collections';

export async function getBins() {
    return await getJson(BROMLEY_BINS_API_URL);
}