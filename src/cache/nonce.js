const Logger = require('../logger.js');

const cache = new Map();
const cacheDuration = process.env.CACHE_NONCE_DURATION || 10000;

function set(walletAddress, nonce) {
    cache.set(walletAddress, {
        cached_at: Date.now(),
        data: nonce
    });

    Logger.info(`Cached nonce (${nonce}) for wallet ${walletAddress}`);
}

function get(walletAddress) {
    const wallet = cache.get(walletAddress);

    if ( ! wallet) {
        return;
    }

    if (Date.now() - wallet.cached_at > cacheDuration) {
        cache.delete(walletAddress);
        Logger.info(`Removed expired cached wallet ${walletAddress}`);

        return;
    }

    Logger.info(`Found cached nonce for wallet ${walletAddress}`);

    return wallet.data;
}

function increment(walletAddress) {
    const nonce = get(walletAddress) || 0;

    set(walletAddress, nonce);

    Logger.info(`Cached incremented nonce for wallet ${walletAddress}`);
}

function has(walletAddress) {
    return cache.has(walletAddress);
}

module.exports = {
    set,
    get,
    has,
    increment
};