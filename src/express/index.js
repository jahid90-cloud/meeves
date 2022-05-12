const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const { v4: uuid } = require('uuid');

const primeRequestContext = () => {
    return (req, res, next) => {
        req.context = {
            ...req.context,
            requestId: uuid(),
        };

        next();
    };
};

const createApp = ({ env, config }) => {
    const app = express();

    // configure morgan custom tokens
    morgan.token('request-id', (req, res) => {
        return req.context.requestId;
    });

    // attach middlewares
    app.use(primeRequestContext());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(morgan(':date[iso] - [:request-id] :method :url :status :res[content-length] - :response-time ms'));

    // mount routes
    app.use('/', config.homeApp);
    app.use('/ping', config.pingApp);
    app.use('/events', config.eventsApp);

    console.debug('created express app');

    return app;
};

module.exports = createApp;
