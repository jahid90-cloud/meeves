const express = require('express');

const createActions = ({ env, store }) => {
    const addNewEvent = ({ id, type, streamName, data, metadata }) => {
        return store.addEvent({ id, type, streamName, data, metadata });
    };

    return {
        addNewEvent,
    };
};

const createQueries = ({ env, store }) => {
    const fetchAllEventsFromStream = ({ streamName }) => {
        return store.getAllEventsFromStream({ streamName });
    };

    const fetchLastEventFromStream = ({ streamName }) => {
        return store.getLastEventFromStream({ streamName });
    };

    return {
        fetchAllEventsFromStream,
        fetchLastEventFromStream,
    };
};

const createHandlers = ({ actions, queries }) => {
    const handleViewAllEvents = (req, res) => {
        const { streamName } = req.params;

        return queries
            .fetchAllEventsFromStream({ streamName })
            .then((events) => {
                if (events.length === 0) {
                    return res.status(404).send('stream not found');
                }

                return res.json(events);
            })
            .catch((err) => res.status(500).send('Something went wrong: ' + err.message));
    };

    const handleViewLastEvent = (req, res) => {
        const { streamName } = req.params;

        return queries
            .fetchLastEventFromStream({ streamName })
            .then((event) => {
                if (!event) {
                    return res.status(404).send('stream not found');
                }

                return res.json(event);
            })
            .catch((err) => res.status(500).send('Something went wrong: ' + err.message));
    };

    const handleAddNewEvent = (req, res) => {
        const { id, type, streamName, data, metadata } = req.body;
        return actions
            .addNewEvent({ id, type, streamName, data, metadata })
            .then(res.sendStatus(202))
            .catch((err) => res.status(500).send('Something went wrong: ' + err.message));
    };

    return {
        handleViewAllEvents,
        handleViewLastEvent,
        handleAddNewEvent,
    };
};

const createEventsApp = ({ env, store }) => {
    const actions = createActions({ env, store });
    const queries = createQueries({ env, store });
    const handlers = createHandlers({ actions, queries });

    const router = express.Router();

    router.get('/:streamName/all', handlers.handleViewAllEvents);
    router.get('/:streamName/last', handlers.handleViewLastEvent);
    router.post('/', handlers.handleAddNewEvent);

    return router;
};

module.exports = createEventsApp;
