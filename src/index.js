const dotenv = require('dotenv');
const Ark = require('@arkecosystem/crypto');
const Helios = require('@foly/helios-crypto');
const Solar = require('@solar-network/crypto');

dotenv.config();

const Logger = require('./logger.js');
const Api = require('./api/index.js');

async function initialize() {
    Logger.info('Setting crypto config...');

    const config = await Api.Helios.getCryptoConfig();

    Solar.Managers.configManager.setConfig(config);

    for (const milestone of config.milestones) {
        Solar.Managers.configManager.setHeight(milestone.height);
    }

    Logger.info('Registering custom transactions...');
    Solar.Transactions.TransactionRegistry.registerTransactionType(Helios.Transactions.AuthenticationTransaction);
    Solar.Transactions.TransactionRegistry.registerTransactionType(Helios.Transactions.CharacterRegistrationTransaction);
    Logger.info('SDK is ready for use.')
}

module.exports = {
    initialize,
    Solar,
    Helios,
    Ark,
    Api,
    Secret: require('./secret/index.js'),
    Socket: require('./socket/index.js'),
};