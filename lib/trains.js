import { getJson, getFilteredValues } from './utils.js';

// Trains config
// Use station CRS codes, which can be found here: http://www.railwaycodes.org.uk/stations/station0.shtm
const FROM_STATION = 'KTH';
const TO_STATION = 'VIC';
const REVERSE_JOURNEY_AFTER_TIME = '12:00';
const MAX_TRAINS = 4;
const TRAINS_SERVER_URI_DOMAIN = 'https://train-track-api.fly.dev';

export async function getTrainsData() {
    // If the current time is after the reverse journey time, then reverse the journey
    let url = `${TRAINS_SERVER_URI_DOMAIN}/api/v1/departures/from/${FROM_STATION}/to/${TO_STATION}`;
    const currentTime = new Date().toISOString().split('T')[1];
    if (currentTime > REVERSE_JOURNEY_AFTER_TIME) {
        url = `${TRAINS_SERVER_URI_DOMAIN}/api/v1/departures/from/${TO_STATION}/to/${FROM_STATION}`;
    }
    const trainsData = await getJson(url);
    return getFilteredData(trainsData);
}

function getFilteredData(trainsData) {
    if (trainsData && trainsData.departures && trainsData.departures.length > 0) {
        let filteredDepartures = trainsData.departures.slice(0, MAX_TRAINS);

        trainsData.departures = filteredDepartures;

        for (let departureIndex = 0; departureIndex < filteredDepartures.length; departureIndex++) {
            const departure = filteredDepartures[departureIndex];

            const filteredDeparture = getFilteredValues(departure, [
                'serviceType',
                'locationDetail.crs',
                'locationDetail.gbttBookedDeparture',
                'locationDetail.realtimeDeparture',
                'locationDetail.cancelReasonCode',
                'locationDetail.platform'
            ]);

            filteredDepartures[departureIndex] = filteredDeparture;

        }
    }

    return trainsData;
}
