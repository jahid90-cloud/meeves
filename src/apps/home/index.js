const express = require('express');

const createHandlers = () => {
    const handleHome = (req, res) => {
        res.send('Welcome!');
    };

    return {
        handleHome,
    };
};

const createHomeApp = ({ env }) => {
    const handlers = createHandlers();

    const router = express.Router();

    router.get('/', handlers.handleHome);

    console.debug('created home app');

    return router;
};

module.exports = createHomeApp;
