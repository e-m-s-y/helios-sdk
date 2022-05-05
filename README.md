# Helios SDK

Helios SDK is a simple Software Development Kit to interact with the Helios bridgechain. 

### Features
- Easily broadcast transactions.
- Automatic crypto config handling.
- Automatic nonce handling.
- Listen to real-time blockchain events with ease.

### Prerequisites
- pnpm

## Usage
### Installation
```
pnpm install && pnpm build
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
### Listen to real-time Helios blockchain events
```javascript
const SDK = require('@foly/helios-sdk');

const heliosSocket = await SDK.Socket.Builders.BuilderFactory.helios();

heliosSocket.connect();
heliosSocket.on('block.applied', data => console.log(data));
```
## Credits

- [e-m-s-y](https://github.com/e-m-s-y)
- [Solar-network](https://github.com/Solar-network)

## License

[CC BY-ND 4.0](LICENSE.md)
