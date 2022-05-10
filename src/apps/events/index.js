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

    const fetchAllEventsByType = ({ type }) => {
        return store.getAllEventsOfType({ type });
    };

    const fetchEvent = ({ id }) => {
        return store.getEventDetail({ id });
    };

    return {
        fetchAllEvents,
        fetchAllEventsFromStream,
        fetchLastEventFromStream,
        fetchAllEventsByType,
        fetchEvent,
    };
};

const createHandlers = ({ actions, queries }) => {
    const handleAddNewEvent = (req, res) => {
        const { type, streamName, data, metadata } = req.body;
        return actions
            .addNewEvent({ type, streamName, data, metadata })
            .then((id) => res.status(201).send(id))
            .catch((err) => res.status(500).send('something went wrong: ' + err.message));
    };

    const handleViewAllEvents = (req, res) => {
        return queries
            .fetchAllEvents()
            .then((events) => {
                if (events.length === 0) {
                    return res.status(404).send('no events were found');
                }

                return res.json(events);
            })
            .catch((err) => res.status(500).send('something went wrong: ' + err.message));
    };

    const handleViewAllStreamEvents = (req, res) => {
        const { streamName } = req.params;

        return queries
            .fetchAllEventsFromStream({ streamName })
            .then((events) => {
                if (events.length === 0) {
                    return res.status(404).send('no events were found');
                }

                return res.json(events);
            })
            .catch((err) => res.status(500).send('something went wrong: ' + err.message));
    };

    const handleViewLastStreamEvent = (req, res) => {
        const { streamName } = req.params;

        return queries
            .fetchLastEventFromStream({ streamName })
            .then((event) => {
                if (!event) {
                    return res.status(404).send('no events were found');
                }

                return res.json(event);
            })
            .catch((err) => res.status(500).send('something went wrong: ' + err.message));
    };

    const handleViewAllEventsByType = (req, res) => {
        const { type } = req.params;
        return queries
            .fetchAllEventsByType({ type })
            .then((events) => {
                if (events.length === 0) {
                    return res.status(404).send('no events were found');
                }
                return res.json(events);
            })
            .catch((err) => res.status(500).send('something went wrong: ' + err.message));
    };

    const handleViewEvent = (req, res) => {
        const { id } = req.params;
        return queries
            .fetchEvent({ id })
            .then((event) => {
                if (!event) {
                    return res.status(404).send('event not found');
                }
                return res.json(event);
            })
            .catch((err) => res.status(500).send('something went wrong: ' + err.message));
    };

    return {
        handleAddNewEvent,
        handleViewAllEvents,
        handleViewAllStreamEvents,
        handleViewLastStreamEvent,
        handleViewAllEventsByType,
        handleViewEvent,
    };
};

const createEventsApp = ({ env, store }) => {
    const actions = createActions({ env, store });
    const queries = createQueries({ env, store });
    const handlers = createHandlers({ actions, queries });

    const router = express.Router();

    router.get('/', handlers.handleViewAllEvents);
    router.post('/', handlers.handleAddNewEvent);
    router.get('/stream/:streamName', handlers.handleViewAllStreamEvents);
    router.get('/stream/:streamName/last', handlers.handleViewLastStreamEvent);
    router.get('/type/:type', handlers.handleViewAllEventsByType);
    router.get('/:id', handlers.handleViewEvent);

    return router;
};

module.exports = createEventsApp;
