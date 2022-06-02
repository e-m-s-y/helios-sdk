const uuid = require('uuid');
const { HeliosCrypto } = require('@foly/helios-crypto');
const { ArkCrypto } = require('@arkecosystem/crypto');

const Cache = require('../cache/index.js');

function create(publicKey, message = undefined) {
    message = message || uuid.v4();

    Cache.Secret.set(publicKey, message);

    return get(publicKey);
}

function get(publicKey = undefined) {
    return Cache.Secret.get(publicKey);
}

function remove(publicKey) {
    return Cache.Secret.remove(publicKey);
}

function sign(publicKey, mnemonic) {
    if ( ! publicKey) {
        throw new Error('Cannot sign message because public key is missing.');
    }

    if ( ! mnemonic) {
        throw new Error('Cannot sign message because mnemonic is missing.');
    }

    const message = get(publicKey);

    if ( ! message) {
        throw new Error('Cannot sign message because the secret does not exist.');
    }

    return Crypto.Message.sign(message, mnemonic);
}

function validate(publicKey, signature) {
    if ( ! signature) {
        throw new Error('Cannot verify secret because signature is missing.');
    }

    if ( ! publicKey) {
        throw new Error('Cannot verify secret because public key is missing.');
    }
}

function verifyEcdsa(publicKey, signature) {
    validate(publicKey, signature);

    const message = get(publicKey);

    if ( ! message) {
        throw new Error('Cannot verify because the secret does not exist.');
    }

    return ArkCrypto.Message.verify({
        message,
        publicKey,
        signature
    });
}

function verifyBip340(publicKey, signature) {
    validate(publicKey, signature);

    const message = get(publicKey);

    if ( ! message) {
        throw new Error('Cannot verify because the secret does not exist.');
    }

    return HeliosCrypto.Message.verify({
        message,
        publicKey,
        signature
    });
}

module.exports = {
    create,
    get,
    remove,
    sign,
    verifyEcdsa,
    verifyBip340,
}