const createStore = require('./store');

const createEventsApp = require('./apps/events');
const createHomeApp = require('./apps/home');

const createConfig = ({ env }) => {
    const store = createStore({ env });

    const homeApp = createHomeApp({ env });
    const eventsApp = createEventsApp({ env, store });

    return {
        homeApp,
        eventsApp,
    };
};

module.exports = createConfig;
