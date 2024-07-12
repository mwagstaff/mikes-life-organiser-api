import { getMatches } from './lib/football.js';
import { getForecastData } from './lib/weather.js';
import { getTrainsData } from './lib/trains.js';
import { getBins } from './lib/bins.js';

import express from 'express';
const app = express();

async function getData(latitude, longitude) {
    const [matches, forecast, trains, bins] = await Promise.all([
        getMatches(),
        getForecastData(latitude, longitude),
        getTrainsData(),
        getBins()
    ]);
    return {
        matches: matches,
        forecast: forecast,
        trains: trains,
        bins: bins
    };
}

app.get('/api/v1/data/latitude/:latitude/longitude/:longitude', async (req, res) => {
    res.json(await getData(req.params.latitude, req.params.longitude));
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});