const uuid = require('uuid');
const { Crypto } = require('@foly/helios-crypto');

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

function verify(publicKey, signature) {
    if ( ! signature) {
        throw new Error('Cannot verify secret because signature is missing.');
    }

    if ( ! publicKey) {
        throw new Error('Cannot verify secret because public key is missing.');
    }

    const message = get(publicKey);

    if ( ! message) {
        throw new Error('Cannot verify because the secret does not exist.');
    }

    return Crypto.Message.verify({
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
    verify
}