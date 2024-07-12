import { getMatches } from './lib/football.js';
import { getForecastData } from './lib/weather.js';
import { getTrainsData } from './lib/trains.js';
import { getBins } from './lib/bins.js';

const port = process.env.PORT || 10000;

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

// Healthcheck endpoint
app.get('/api/v1/healthcheck', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/v1/data/latitude/:latitude/longitude/:longitude', async (req, res) => {
    res.json(await getData(req.params.latitude, req.params.longitude));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});