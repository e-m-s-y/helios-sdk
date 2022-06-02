const Logger = require('../logger.js');

const cache = new Map();
const cacheDuration = process.env.CACHE_WALLET_DURATION || 10000;

function set(wallet) {
    cache.set(wallet.address, {
        cached_at: Date.now(),
        data: wallet
    });

    Logger.info(`Cached wallet ${wallet.address}`);
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

    Logger.info(`Found cached wallet ${walletAddress}`);

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