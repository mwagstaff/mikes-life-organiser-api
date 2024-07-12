import _ from 'lodash';
import { getJson, getFilteredValues } from './utils.js';

// Football config
const MAX_MATCHES = 5;
const FOOTBALL_SERVER_URI_DOMAIN = 'https://football-scores-api.fly.dev';

export async function getMatches() {
    let matches = [];

    const filteredKeys = [
        'homeTeam.names.displayName',
        'homeTeam.score',
        'awayTeam.names.displayName',
        'awayTeam.score',
        'kickOffTime',
        'date',
        'friendlyDateTime',
        'tvInfo.channelInfo.fullName'
    ]

    const [fixturesJson, resultsJson] = await Promise.all([
        getJson(`${FOOTBALL_SERVER_URI_DOMAIN}/api/v1/matches/fixtures?limit=${MAX_MATCHES}`, filteredKeys),
        getJson(`${FOOTBALL_SERVER_URI_DOMAIN}/api/v1/matches/results?limit=${MAX_MATCHES}`, filteredKeys)
    ]);

    // Get today's results first
    if (resultsJson && resultsJson.length > 0) {
        for (const match of resultsJson) {
            // If the match date is today's date, then add it to the list
            const todaysDate = new Date().toISOString().split('T')[0];
            if (match.date === todaysDate) {
                match.friendlyDateTime = 'Today';
                matches.push(getFilteredValues(match, filteredKeys));
            }
        }
    }

    if (fixturesJson && fixturesJson.length > 0) {
        for (const match of fixturesJson) {
            // Check if the matches array already contains a match with the same ID, i.e. we already have a result
            // If there's already a result, don't add the corresponding fixture
            const matchIndex = matches.findIndex(m => m.id === match.id);
            if (matchIndex === -1 && match.friendlyDateTime) {
                matches.push(getFilteredValues(match, filteredKeys));
            }

            // If we've reached the maximum number of matches, then stop
            if (matches.length >= MAX_MATCHES) {
                break;
            }
        }
    }

    return matches.length > 0 ? matches.slice(0, MAX_MATCHES) : [];
}


