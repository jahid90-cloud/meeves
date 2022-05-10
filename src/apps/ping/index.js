const express = require('express');

const createHandlers = ({ env }) => {
    const handlePing = (req, res) => res.send('OK');

    return {
        handlePing,
    };
};

const createPingApp = ({ env }) => {
    const handlers = createHandlers({ env });

    const router = express.Router();

    router.get('/', handlers.handlePing);

    console.debug('created ping app');

    return router;
};

module.exports = createPingApp;
