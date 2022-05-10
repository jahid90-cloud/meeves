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
    const fetchAllEvents = () => {
        return store.getAllEvents();
    };

    const fetchAllEventsFromStream = ({ streamName }) => {
        return store.getAllEventsFromStream({ streamName });
    };

    const fetchLastEventFromStream = ({ streamName }) => {
        return store.getLastEventFromStream({ streamName });
    };

    return {
        fetchAllEvents,
        fetchAllEventsFromStream,
        fetchLastEventFromStream,
    };
};

const createHandlers = ({ actions, queries }) => {
    const handleViewAllEvents = (req, res) => {
        return queries
            .fetchAllEvents()
            .then((events) => {
                if (events.length === 0) {
                    return res.status(404).send('No events were found');
                }

                return res.json(events);
            })
            .catch((err) => res.status(500).send('Something went wrong: ' + err.message));
    };

    const handleViewAllStreamEvents = (req, res) => {
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

    const handleViewLastStreamEvent = (req, res) => {
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
        const { type, streamName, data, metadata } = req.body;
        return actions
            .addNewEvent({ type, streamName, data, metadata })
            .then((id) => res.status(201).send(id))
            .catch((err) => res.status(500).send('Something went wrong: ' + err.message));
    };

    return {
        handleViewAllEvents,
        handleViewAllStreamEvents,
        handleViewLastStreamEvent,
        handleAddNewEvent,
    };
};

const createEventsApp = ({ env, store }) => {
    const actions = createActions({ env, store });
    const queries = createQueries({ env, store });
    const handlers = createHandlers({ actions, queries });

    const router = express.Router();

    router.get('/', handlers.handleViewAllEvents);
    router.post('/', handlers.handleAddNewEvent);
    router.get('/:streamName/all', handlers.handleViewAllStreamEvents);
    router.get('/:streamName/last', handlers.handleViewLastStreamEvent);

    return router;
};

module.exports = createEventsApp;
