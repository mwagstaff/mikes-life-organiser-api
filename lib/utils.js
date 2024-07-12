import _ from 'lodash';
import axios from 'axios';
axios.defaults.timeout = 10000;

// Returns the JSON for the given URL
export async function getJson(url, filteredKeys = []) {
    try {
        const request = await axios.get(url);
        return request.data;
    }
    catch (error) {
        console.error(`Unable to get JSON data from ${url}: ${error}`);
        return undefined;
    }
}

export function getFilteredValues(data, keys) {
    let filteredData = {};
    for (let key of keys) {
        _.set(filteredData, key, _.get(data, key));
    }
    console.log(filteredData);
    return filteredData;
}