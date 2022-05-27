const Logger = require('../logger.js');

const cache = new Map();

function set(publicKey, data) {
    cache.set(publicKey, data);

    Logger.info(`Created secret for public key ${publicKey}`);
}

function get(publicKey = undefined) {
    return cache.has(publicKey) ? cache.get(publicKey) : cache;
}

function has(publicKey) {
    return cache.has(publicKey);
}

function remove(publicKey) {
    return cache.delete(publicKey);
}

module.exports = {
    set,
    get,
    has,
    remove,
};