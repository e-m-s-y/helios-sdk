const axios = require('axios');
const Logger = require('../logger.js');

async function get(url) {
    const id = generateId();

    Logger.debug(`[${id}] GET ${url}...`);

    return await axios.get(url)
        .then(response => {
            Logger.debug(`[${id}] Request completed with status 200`);

            return response;
        })
        .catch(err => {
            Logger.debug(`[${id}] Request completed with status ${err.response.status}`, err.response.data);

            return err.response;
        });
}

async function post(url, body) {
    const id = generateId();

    Logger.debug(`[${id}] POST ${url}...`);

    return await axios.post(url, body)
        .then(response => {
            Logger.debug(`[${id}] Request completed with status 200`);

            return response;
        })
        .catch(err => {
            Logger.debug(`[${id}] Request completed with status ${err.response.status}`, err.response.data);

            return err.response;
        });
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

module.exports = {
    get,
    post
};