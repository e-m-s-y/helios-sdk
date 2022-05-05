const SocketClient = require('./client.js');

module.exports = {
    BuilderFactory: {
        helios() {
            return new SocketClient('Helios socket', process.env.SOCKET_ENDPOINT || 'https://socket.heliosblockchain.io');
        },
    }
};