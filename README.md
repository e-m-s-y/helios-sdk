# Helios SDK

Helios SDK is a simple Software Development Kit to interact with the Helios bridgechain. 

### Features
- Easily broadcast transactions.
- Automatic crypto config handling.
- Automatic nonce handling.
- Sign and verify crypto messages with easy.
- Listen to real-time blockchain events with ease.

### Prerequisites
- pnpm
- NodeJS version 16.x

## Usage
### Installation
```shell
pnpm install @foly/helios-sdk
```
### Configuration
Feel free to override the following default configuration to your own likings using a `.env` file.
```dotenv
CACHE_WALLET_DURATION=10000
CACHE_NONCE_DURATION=10000
TRANSACTION_AMOUNT=100000
TRANSACTION_FEE=100000
API_ENDPOINT=https://api.heliosblockchain.io
SOCKET_ENDPOINT=https://socket.heliosblockchain.io
```

### Send transfer transaction
```javascript
const SDK = require('@foly/helios-sdk');

await SDK.initialize();
await SDK.Api.Relay.sendTransferTransaction(
    recipientId, 
    mnemonic, 
    amount, 
    vendorField
);
```
### Send authentication transaction
```javascript
const SDK = require('@foly/helios-sdk');

await SDK.initialize();
await SDK.Api.Relay.sendAuthenticationTransaction(
    recipientId,
    isLoggedIn,
    mnemonic,
);
```
### Send character registration transaction
```javascript
const SDK = require('@foly/helios-sdk');

await SDK.initialize();
await SDK.Api.Relay.sendCharacterRegistrationTransaction(
    recipientId,
    {
        name: 'name',
        classId: 1
    },
    mnemonic,
);
```
### Sign and verify a crypto message
```javascript
const SDK = require('@foly/helios-sdk');

SDK.Secret.create(publicKey, 'message');

const ecdsa = SDK.Secret.signEcdsa(publicKey, mnemonic).signature;
const bip340 = SDK.Secret.signBip340(publicKey, mnemonic).signature;
const isVerified = SDK.Secret.verifyEcdsa(publicKey, ecdsa);
const isVerified = SDK.Secret.verifyBip340(publicKey, bip340);
```
### Listen to real-time Helios blockchain events
```javascript
const SDK = require('@foly/helios-sdk');

const heliosSocket = await SDK.Socket.Builders.BuilderFactory.helios();

heliosSocket.connect();
heliosSocket.on('block.applied', data => console.log(data));
```
## Credits

- [e-m-s-y](https://github.com/e-m-s-y) - maintainer of this project.
- [Solar-network](https://github.com/Solar-network) - for providing Solar Core.

## License

[CC BY-ND 4.0](LICENSE.md)
