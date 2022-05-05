const {connect} = require('socket.io-client');

const Logger = require('../../logger.js');

module.exports = class Client {
    constructor(id, endpoint) {
        this.id = id;
        this.endpoint = endpoint;
        this.connected = false;
        this.io = undefined;

        Logger.info(`[${this.id}] Created socket instance`);

    }

    connect() {
        Logger.info(`[${this.id}] Connecting to server...`);

        const socket = connect(this.endpoint, {
            transports: ['websocket']
        });

        socket.on('connect', () => {
            Logger.info(`[${this.id}] Connected to ${this.endpoint}`);
            this.connected = true;
        });
        socket.on('connect_error', data => {
            Logger.error(data);
        });
        socket.on('disconnect', () => {
            Logger.info(`[${this.id}] Disconnected from ${this.endpoint}`);
            this.connected = false;
        });

        this.io = socket;
    }

    on(event, handler) {
        this.io.on(event, data => {
            Logger.info(`[${this.id}] ↓ ${event}`);

            if (handler) {
                handler(data);
            }
        });
        Logger.info(`[${this.id}] Added '${event}' event handler`);
    }
};