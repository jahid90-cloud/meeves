const express = require('express');

const createActions = ({ env, store }) => {
    const addNewEvent = ({ id, type, streamName, data, metadata }) => {
        return store.addEvent({ id, type, streamName, data, metadata });
    };

    const deleteEvent = ({ id }) => {
        return store.deleteEvent({ id });
    };

    return {
        addNewEvent,
        deleteEvent,
    };
};

const createQueries = ({ env, store }) => {
    const fetchAllEvents = (fromPosition, full) => {
        if (full || full === '') {
            return store
                .getAllEvents(fromPosition)
                .then((ids) => Promise.all(ids.map((id) => store.getEventDetail({ id }))));
        }
        return store.getAllEvents(fromPosition);
    };

    const fetchAllEventsFromStream = ({ streamName, fromPosition }) => {
        return store.getAllEventsFromStream({ streamName, fromPosition });
    };

    const fetchLastEventFromStream = ({ streamName }) => {
        return store.getLastEventFromStream({ streamName });
    };

    const fetchAllEventsByType = ({ type }) => {
        return store.getAllEventsOfType({ type });
    };

    const fetchAllEventsFromCategory = ({ category, fromPosition }) => {
        return store.getAllEventsFromCategory({ category, fromPosition });
    };

    const fetchMetadataMatchingEvents = ({ attrName, attrValue }) => {
        return store.getAllEventsMatchingMetadataAttr({ attrName, attrValue });
    };

    const fetchEvent = ({ id }) => {
        return store.getEventDetail({ id });
    };

    return {
        fetchAllEvents,
        fetchAllEventsFromStream,
        fetchLastEventFromStream,
        fetchAllEventsByType,
        fetchAllEventsFromCategory,
        fetchMetadataMatchingEvents,
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

    const handleDeleteEvent = (req, res) => {
        const id = req.params;

        return actions
            .deleteEvent({ id })
            .then(() => res.sendStatus(204))
            .catch((err) => res.status(500).send('something went wrong: ' + err.message));
    };

    const handleViewAllEvents = (req, res) => {
        const { full, fromPosition } = req.query;

        return queries
            .fetchAllEvents(fromPosition ? parseInt(fromPosition) : 0, full)
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
        const { fromPosition } = req.query;

        return queries
            .fetchAllEventsFromStream({ streamName, fromPosition: fromPosition ? parseInt(fromPosition) : 0 })
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

    const handleViewAllCategoryEvents = (req, res) => {
        const { category } = req.params;
        const { fromPosition } = req.query;

        return queries
            .fetchAllEventsFromCategory({ category, fromPosition: fromPosition ? parseInt(fromPosition) : 0 })
            .then((events) => {
                if (events.length === 0) {
                    return res.status(404).send('no events were found');
                }
                return res.json(events);
            })
            .catch((err) => res.status(500).send('something went wrong: ' + err.message));
    };

    const handleMetadataMatchingEvents = (req, res) => {
        const { attr, value } = req.params;
        return queries
            .fetchMetadataMatchingEvents({ attrName: attr, attrValue: value })
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
        handleDeleteEvent,
        handleViewAllEvents,
        handleViewAllStreamEvents,
        handleViewLastStreamEvent,
        handleViewAllEventsByType,
        handleViewAllCategoryEvents,
        handleMetadataMatchingEvents,
        handleViewEvent,
    };
};

const createEventsApp = ({ env, store }) => {
    const actions = createActions({ env, store });
    const queries = createQueries({ env, store });
    const handlers = createHandlers({ actions, queries });

    const router = express.Router();

    router.post('/', handlers.handleAddNewEvent);
    router.delete('/:id', handlers.handleDeleteEvent);
    router.get('/', handlers.handleViewAllEvents);
    router.get('/:id', handlers.handleViewEvent);
    router.get('/stream/:streamName', handlers.handleViewAllStreamEvents);
    router.get('/stream/:streamName/last', handlers.handleViewLastStreamEvent);
    router.get('/type/:type', handlers.handleViewAllEventsByType);
    router.get('/category/:category', handlers.handleViewAllCategoryEvents);
    router.get('/metadata/:attr/:value', handlers.handleMetadataMatchingEvents);

    return router;
};

module.exports = createEventsApp;
