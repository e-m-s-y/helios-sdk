const SocketClient = require('./client.js');

module.exports = {
    BuilderFactory: {
        default() {
            return new SocketClient('Default socket', process.env.SOCKET_ENDPOINT);
        },
        helios() {
            return new SocketClient('Helios socket', 'https://socket.heliosblockchain.io');
        },
    }
};