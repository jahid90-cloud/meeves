const { v4: uuid } = require('uuid');

const createStore = ({ env }) => {
    const db = {};
    db.events = [];
    db.eventsByStream = {};
    db.eventsByType = {};

    const addEvent = ({ type, streamName, data, metadata }) => {
        const id = uuid();
        const event = {
            id,
            type,
            streamName,
            data,
            metadata,
        };

        db.events = [...db.events, event];

        db.eventsByStream[streamName] = db.eventsByStream[streamName] || [];
        db.eventsByStream[streamName] = [...db.eventsByStream[streamName], event];

        db.eventsByType[type] = db.eventsByType[type] || [];
        db.eventsByType[type] = [...db.eventsByType[type], event];

        return Promise.resolve(id);
    };

    const getAllEvents = () => {
        return Promise.resolve(db.events.map((e) => e.id));
    };

    const getAllEventsFromStream = ({ streamName }) => {
        return Promise.resolve((db.eventsByStream[streamName] || []).map((e) => e.id));
    };

    const getLastEventFromStream = ({ streamName }) => {
        const matched = db.eventsByStream[streamName];

        if (!matched) {
            return Promise.resolve(false);
        }

        const lastIdx = matched.length - 1;
        return Promise.resolve(matched[lastIdx].id);
    };

    const getAllEventsOfType = ({ type }) => {
        return Promise.resolve((db.eventsByType[type] || []).map((e) => e.id));
    };

    const getEventDetail = ({ id }) => {
        const matched = db.events.filter((e) => e.id === id);

        if (!matched || matched.length === 0) {
            return Promise.resolve(false);
        }

        return Promise.resolve(matched);
    };

    return {
        addEvent,
        getAllEvents,
        getAllEventsFromStream,
        getLastEventFromStream,
        getAllEventsOfType,
        getEventDetail,
    };
};

module.exports = createStore;
