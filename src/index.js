const SolarCrypto = require('@solar-network/crypto');
const HeliosCrypto = require('@foly/helios-crypto');
const dotenv = require('dotenv');

dotenv.config();

const Logger = require('./logger.js');
const Api = require('./api/index.js');

async function initialize() {
    Logger.info('Setting crypto config...');

    const config = await Api.Relay.getCryptoConfig();

    SolarCrypto.Managers.configManager.setConfig(config);

    for (const milestone of config.milestones) {
        SolarCrypto.Managers.configManager.setHeight(milestone.height);
    }

    Logger.info('Registering custom transactions...');
    SolarCrypto.Transactions.TransactionRegistry.registerTransactionType(HeliosCrypto.Transactions.AuthenticationTransaction);
    SolarCrypto.Transactions.TransactionRegistry.registerTransactionType(HeliosCrypto.Transactions.CharacterRegistrationTransaction);
    Logger.info('SDK is ready for use.')
}

module.exports = {
    initialize,
    SolarCrypto,
    HeliosCrypto,
    Api,
    Socket: require('./socket/index.js')
};