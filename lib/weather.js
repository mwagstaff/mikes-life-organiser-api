import { getJson, getFilteredValues } from './utils.js';


// Weather config
const WEATHER_API_KEY = 'b7c507191e034a5791a124926242206';
const MAX_WEATHER_DAYS = 2;

export async function getForecastData(latitude, longitude) {
    console.log(`Getting weather data for ${latitude}, ${longitude}`);
    const forecastData = await getJson(`https://api.weatherapi.com/v1/forecast.json?q=${latitude},${longitude}&days=${MAX_WEATHER_DAYS + 1}&key=${WEATHER_API_KEY}`);
    return getDataFiltered(forecastData);
}

function getDataFiltered(forecastData) {
    delete forecastData.location;
    delete forecastData.current;

    const forecastDays = forecastData.forecast.forecastday;
    for (let dayIndex = 0; dayIndex < forecastDays.length; dayIndex ++) {
        // Delete unneeded day level attributes
        const day = forecastDays[dayIndex];
        delete day.astro;
        day.day = getFilteredValues(day.day, ['maxtemp_c', 'totalprecip_mm', 'condition']);
        // If the date is not today's date, then delete the hour attribute
        if (day.date.split('T')[0] !== new Date().toISOString().split('T')[0]) {
            delete day.hour;
        }
        // Otherwise, delete unneeded hour level attributes
        else {
            for (let hourIndex = 0; hourIndex < day.hour.length; hourIndex ++) {
                const hour = day.hour[hourIndex];
                const filteredHour = getFilteredValues(hour, ['temp_c', 'condition', 'time_epoch', 'time', 'precip_mm']); 
                // Replace the hour with the filtered hour
                day.hour[hourIndex] = filteredHour;
            }
        }
    }

    return forecastData;
}