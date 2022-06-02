const uuid = require('uuid');
const Helios = require('@foly/helios-crypto');
const Ark = require('@arkecosystem/crypto');

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

function validateSignParameters(publicKey, mnemonic) {
    if ( ! publicKey) {
        throw new Error('Cannot sign message because public key is missing.');
    }

    if ( ! mnemonic) {
        throw new Error('Cannot sign message because mnemonic is missing.');
    }
}

function signEcdsa(publicKey, mnemonic) {
    validateSignParameters(publicKey, mnemonic);

    const message = get(publicKey);

    if ( ! message) {
        throw new Error('Cannot sign message because the secret does not exist.');
    }

    return Helios.Crypto.Message.sign(message, mnemonic);
}

function signBip340(publicKey, mnemonic) {
    validateSignParameters(publicKey, mnemonic);

    const message = get(publicKey);

    if ( ! message) {
        throw new Error('Cannot sign message because the secret does not exist.');
    }

    return Helios.Crypto.Message.sign(message, mnemonic);
}

function validateVerifyParameters(publicKey, signature) {
    if ( ! signature) {
        throw new Error('Cannot verify secret because signature is missing.');
    }

    if ( ! publicKey) {
        throw new Error('Cannot verify secret because public key is missing.');
    }
}

function verifyEcdsa(publicKey, signature) {
    validateVerifyParameters(publicKey, signature);

    const message = get(publicKey);

    if ( ! message) {
        throw new Error('Cannot verify because the secret does not exist.');
    }

    return Ark.Crypto.Message.verify({
        message,
        publicKey,
        signature
    });
}

function verifyBip340(publicKey, signature) {
    validateVerifyParameters(publicKey, signature);

    const message = get(publicKey);

    if ( ! message) {
        throw new Error('Cannot verify because the secret does not exist.');
    }

    return Helios.Crypto.Message.verify({
        message,
        publicKey,
        signature
    });
}

module.exports = {
    create,
    get,
    remove,
    signEcdsa,
    signBip340,
    verifyEcdsa,
    verifyBip340,
}