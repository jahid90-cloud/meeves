const { v4: uuid } = require('uuid');

const createStore = ({ env }) => {
    const db = {};
    db.events = [];
    db.eventsByStream = {};
    db.eventsByType = {};

    const getAllEvents = () => {
        return Promise.resolve(db.events.map((e) => e.id));
    };

    const getAllEventsFromStream = ({ streamName }) => {
        return Promise.resolve(db.eventsByStream[streamName].map((e) => e.id));
    };

    const getLastEventFromStream = ({ streamName }) => {
        const matched = db.eventsByStream[streamName];

        if (!matched) {
            return Promise.resolve(false);
        }

        const lastIdx = matched.length - 1;
        return Promise.resolve(matched[lastIdx].id);
    };

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

    return {
        getAllEvents,
        getAllEventsFromStream,
        getLastEventFromStream,
        addEvent,
    };
};

module.exports = createStore;
