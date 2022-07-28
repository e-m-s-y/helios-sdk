const uuid = require('uuid');
const Helios = require('@foly/helios-crypto');
const Ark = require('@arkecosystem/crypto');

const Cache = require('../cache/index.js');

function create(publicKey, value = undefined) {
    value = value || uuid.v4();

    Cache.Secret.set(publicKey, value);

    return value;
}

function get(publicKey = undefined, value = undefined) {
    return Cache.Secret.get(publicKey, value);
}

function remove(publicKey, value) {
    return Cache.Secret.remove(publicKey, value);
}

function clean() {
    const cache = Cache.Secret.get();

    for (const [publicKey, secrets] of cache.entries()) {
        for (const secret of secrets) {
            if (Cache.Secret.isExpired(secret)) {
                Cache.Secret.remove(publicKey, secret.data);
            }
        }
    }
}

function validateSignParameters(publicKey, secret, mnemonic) {
    if ( ! publicKey) {
        throw new Error('Cannot sign secret because public key is missing.');
    }

    if ( ! secret) {
        throw new Error('Cannot sign secret because secret is missing.');
    }

    if ( ! mnemonic) {
        throw new Error('Cannot sign secret because mnemonic is missing.');
    }
}

function signEcdsa(publicKey, secret, mnemonic) {
    validateSignParameters(publicKey, secret, mnemonic);

    secret = get(publicKey, secret);

    if ( ! secret) {
        throw new Error('Cannot sign secret because the secret does not exist.');
    }

    return Ark.Crypto.Message.sign(secret, mnemonic);
}

function signSchnorr(publicKey, secret, mnemonic) {
    validateSignParameters(publicKey, secret, mnemonic);

    secret = get(publicKey, secret);

    if ( ! secret) {
        throw new Error('Cannot sign secret because the secret does not exist.');
    }

    return Helios.Crypto.Message.sign(secret, mnemonic);
}

function validateVerifyParameters(publicKey, signature) {
    if ( ! signature) {
        throw new Error('Cannot verify secrets because signature is missing.');
    }

    if ( ! publicKey) {
        throw new Error('Cannot verify secrets because public key is missing.');
    }
}

function verifyEcdsa(publicKey, signature) {
    validateVerifyParameters(publicKey, signature);

    const secrets = get(publicKey);

    if ( ! secrets) {
        throw new Error('Cannot verify because the secrets do not exist.');
    }

    for (const secret of secrets) {
        try {
            const isVerified = Ark.Crypto.Message.verify({
                message: secret.data,
                publicKey,
                signature
            });



            if (isVerified) {
                return true;
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return false;
}

function verifySchnorr(publicKey, signature) {
    validateVerifyParameters(publicKey, signature);

    const secrets = get(publicKey);

    if ( ! secrets) {
        throw new Error('Cannot verify because the secrets do not exist.');
    }

    for (const secret in secrets) {
        const isVerified = Helios.Crypto.Message.verify({
            message: secret.data,
            publicKey,
            signature
        });

        if (isVerified) {
            return true;
        }
    }

    return false;
}

module.exports = {
    create,
    get,
    remove,
    signEcdsa,
    signSchnorr,
    verifyEcdsa,
    verifySchnorr,
    clean,
}