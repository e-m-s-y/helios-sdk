function info(message) {
    console.log('[SDK] %s', message);
}

function debug(message, object) {
    if (object) {
        console.log('[SDK] %s %O', message, object);
    } else {
        console.log('[SDK] %s', message);
    }
}

function error(message, object) {
    if (object) {
        console.error('[SDK] %s %O', message, object);
    } else {
        console.error('[SDK] %s', message);
    }
}

module.exports = {
    info,
    debug,
    error
};