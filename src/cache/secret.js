const Logger = require('../logger.js');

const cache = new Map();
const cacheDuration = process.env.CACHE_SECRET_DURATION || 3600000;

function set(publicKey, secret) {
    let secrets = get(publicKey) || [];

    secrets.push({
        cached_at: Date.now(),
        data: secret
    });

    cache.set(publicKey, secrets);
    Logger.info(`Created secret for public key ${publicKey}`);
}

function get(publicKey, value) {
    if (publicKey === undefined) {
        return cache;
    }

    const secrets = cache.get(publicKey);

    if ( ! secrets) {
        return undefined;
    }

    if (value === undefined) {
        return secrets;
    }

    for (const secret of secrets) {
        if (secret.data === value) {
            if (isExpired(secret)) {
                remove(publicKey, secret.data);

                return undefined;
            }

            Logger.info(`Found secret for ${publicKey}`);

            return secret.data;
        }
    }

    return undefined;
}

function isExpired(secret) {
    if ( ! secret) {
        return false;
    }

    return Date.now() - secret.cached_at > cacheDuration;
}

function remove(publicKey, value) {
    const secrets = cache.get(publicKey);

    for (const key in secrets) {
        if (secrets.hasOwnProperty(key)) {
            if (secrets[key].data === value) {
                secrets.splice(key, 1);

                if ( ! secrets.length) {
                    cache.delete(publicKey);
                } else {
                    cache.set(publicKey, secrets);
                }

                Logger.info(`Removed expired cached secret(s) for ${publicKey}`);
            }
        }
    }
}

module.exports = {
    set,
    get,
    remove,
    isExpired
};