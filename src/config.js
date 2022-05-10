const createStore = require('./store');

const createEventsApp = require('./apps/events');
const createHomeApp = require('./apps/home');
const createPingApp = require('./apps/ping');

const createConfig = ({ env }) => {
    const store = createStore({ env });

    const homeApp = createHomeApp({ env });
    const pingApp = createPingApp({ env });
    const eventsApp = createEventsApp({ env, store });

    return {
        homeApp,
        pingApp,
        eventsApp,
    };
};

module.exports = createConfig;
