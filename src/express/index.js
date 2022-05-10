const bodyParser = require('body-parser');
const express = require('express');

const createApp = ({ env, config }) => {
    const app = express();

    // attach middlewares
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // mount routes
    app.use('/', config.homeApp);

    console.debug('created express app');

    return app;
};

module.exports = createApp;
