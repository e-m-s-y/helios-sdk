const Logger = require('../logger.js');

const cache = new Map();
const cacheDuration = process.env.CACHE_NONCE_DURATION || 10000;

function set(walletAddress, nonce) {
    cache.set(walletAddress, {
        cached_at: Date.now(),
        data: nonce
    });

    Logger.info(`Cached nonce for wallet ${walletAddress}`);
}

function get(walletAddress) {
    const wallet = cache.get(walletAddress);

    if ( ! wallet) {
        return;
    }

    if (Date.now() - wallet.cached_at > cacheDuration) {
        wallet.delete(walletAddress);
        Logger.info(`Removed expired cached wallet ${walletAddress}`);

        return;
    }

    Logger.info(`Found cached nonce for wallet ${walletAddress}`);

    return wallet.data;
}

function has(walletAddress) {
    return cache.has(walletAddress);
}

module.exports = {
    set,
    get,
    has
};