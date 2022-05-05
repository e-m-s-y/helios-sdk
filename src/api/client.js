const SolarCrypto = require('@solar-network/crypto');
const HeliosCrypto = require('@foly/helios-crypto');

const Logger = require('../logger.js');
const Request = require('./request.js');
const Cache = require('../cache/index.js');

async function getCryptoConfig() {
    const response = await Request.get(`${process.env.API_ENDPOINT}/api/node/configuration/crypto`);

    if ( ! response || response.status !== 200) {
        throw new Error('Could not get crypto config.');
    }

    return response.data.data;
}

async function broadcastTransaction(tx, mnemonic = null) {
    const struct = tx.getStruct();
    const senderWalletAddress = SolarCrypto.Identities.Address.fromPublicKey(struct.senderPublicKey);

    try {
        await tx.build();
    } catch (e) {
        revertNonce(senderWalletAddress);

        throw new Error(e.message);
    }

    const type = tx.constructor.name.replace('Builder', '');

    Logger.info(`Sending ${type} transaction to ${struct.recipientId}...`);

    const response = await Request.post(`${process.env.API_ENDPOINT}/api/transactions`, {
        transactions: [struct]
    });

    if ( ! response || response.status !== 200) {
        throw new Error('Could not send transaction.');
    }

    if (response.data.data.broadcast[0] === struct.id) {
        return struct;
    }

    if (response.data.errors[struct.id]) {
        console.log(response.data.errors[struct.id]);

        if (mnemonic != null && response.data.errors[struct.id].message.includes('Cannot apply a transaction with nonce')) {
            Logger.error('Detected invalid nonce, resetting nonce...');
            await resetNonce(senderWalletAddress);
            Logger.info('Retrying request with fresh nonce...');

            tx.nonce(await getNextNonce(senderWalletAddress)).sign(mnemonic);

            return broadcastTransaction(tx);
        }

        await revertNonce(senderWalletAddress);

        throw new Error(response.data.errors[struct.id].message || 'Transaction invalid - no message from relay.');
    }

    throw new Error('Transaction could not be broadcasted.');
}

async function sendTransferTransaction(recipientId, mnemonic, amount = null, vendorField = null) {
    const sender = SolarCrypto.Identities.Address.fromPassphrase(mnemonic);
    const nextNonce = await getNextNonce(sender);

    const tx = SolarCrypto.Transactions.BuilderFactory.transfer()
        .amount(amount || process.env.TRANSACTION_AMOUNT)
        .version(2)
        .recipientId(recipientId)
        .vendorField(vendorField)
        .nonce(nextNonce)
        .fee(process.env.TRANSACTION_FEE)
        .sign(mnemonic);

    return await broadcastTransaction(tx, mnemonic);
}

async function sendCharacterRegistrationTransaction(recipientId, asset, mnemonic) {
    const sender = SolarCrypto.Identities.Address.fromPassphrase(mnemonic);
    const nextNonce = await getNextNonce(sender);
    const tx = HeliosCrypto.Builders.BuilderFactory.characterRegistration()
        .version(2)
        .recipientId(recipientId)
        .nonce(nextNonce)
        .name(asset.name)
        .classId(asset.classId)
        .sign(mnemonic);

    return await broadcastTransaction(tx, mnemonic);
}

async function sendAuthenticationTransaction(recipientId, isLoggedIn, mnemonic) {
    const sender = SolarCrypto.Identities.Address.fromPassphrase(mnemonic);
    const nextNonce = await getNextNonce(sender);
    const tx = HeliosCrypto.Builders.BuilderFactory.authentication()
        .version(2)
        .setLoggedIn(isLoggedIn)
        .recipientId(recipientId)
        .nonce(nextNonce)
        .sign(mnemonic);

    return await broadcastTransaction(tx, mnemonic);
}

async function getWallet(address) {
    if (Cache.Wallet.has(address)) {
        return Cache.Wallet.get(address);
    }

    const response = await Request.get(`${process.env.API_ENDPOINT}/api/v2/wallets/${address}`);

    // New generated wallets don't exist on chain yet so a 404 may proceed.
    if (response && response.status === 404) {
        return undefined;
    }

    if ( ! response || response.status !== 200) {
        throw new Error('Could not get wallet.');
    }

    Cache.Wallet.set(response.data.data);

    return response.data.data;
}

async function getNextNonce(walletAddress) {
    if (Cache.Nonce.has(walletAddress)) {
        Cache.Nonce.set(walletAddress, Cache.Nonce.get(walletAddress) + 1);

        return Cache.Nonce.get(walletAddress);
    }

    await resetNonce(walletAddress);

    Cache.Nonce.set(walletAddress, Cache.Nonce.get(walletAddress) + 1);

    return Cache.Nonce.get(walletAddress);
}

async function resetNonce(walletAddress) {
    const response = await Request.get(`${process.env.API_ENDPOINT}/api/wallets/${walletAddress}`);

    if ( ! response || response.status !== 200) {
        throw new Error('Could not get nonce.');
    }

    Cache.Nonce.set(walletAddress, parseInt(response.data.data.nonce));
    Logger.debug(`Reset cached nonce for ${walletAddress}`);
}

function revertNonce(walletAddress) {
    if (Cache.Nonce.has(walletAddress)) {
        Cache.Nonce.set(walletAddress, Cache.Nonce.get(walletAddress) - 1);
        Logger.debug(`Reverted cached nonce for ${walletAddress}`);
    }
}

module.exports = {
    getCryptoConfig, sendTransferTransaction, sendAuthenticationTransaction, sendCharacterRegistrationTransaction,
};