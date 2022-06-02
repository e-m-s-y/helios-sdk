const SocketClient = require('./client.js');

module.exports = {
    BuilderFactory: {
        helios() {
            return new SocketClient('Helios socket', process.env.SOCKET_HELIOS_ENDPOINT || 'https://socket.heliosblockchain.io');
        },
    }
};