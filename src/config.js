const createHomeApp = require('./apps/home');

const createConfig = ({ env }) => {
    const homeApp = createHomeApp({ env });

    return {
        homeApp,
    };
};

module.exports = createConfig;
