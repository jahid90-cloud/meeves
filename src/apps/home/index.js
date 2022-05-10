const express = require('express');

const createHandlers = ({ env }) => {
    const handleHome = (req, res) => {
        res.send('Welcome to in-memory event store!');
    };

    return {
        handleHome,
    };
};

const createHomeApp = ({ env }) => {
    const handlers = createHandlers({ env });

    const router = express.Router();

    router.get('/', handlers.handleHome);

    console.debug('created home app');

    return router;
};

module.exports = createHomeApp;
