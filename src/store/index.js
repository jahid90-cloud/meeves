const createStore = ({ env }) => {
    let events = [];

    const getAllEvents = () => {
        return Promise.resolve(events);
    };

    const getAllEventsFromStream = ({ streamName }) => {
        const matched = events.filter((e) => e.streamName === streamName);
        return Promise.resolve(matched);
    };

    const getLastEventFromStream = ({ streamName }) => {
        const matched = events.filter((e) => e.streamName === streamName);

        if (matched.length === 0) {
            return Promise.resolve(false);
        }

        const lastIdx = matched.length - 1;
        return Promise.resolve(matched[lastIdx]);
    };

    const addEvent = ({ id, type, streamName, data, metadata }) => {
        const event = {
            id,
            type,
            streamName,
            data,
            metadata,
        };

        events = [...events, event];

        return Promise.resolve(true);
    };

    return {
        getAllEvents,
        getAllEventsFromStream,
        getLastEventFromStream,
        addEvent,
    };
};

module.exports = createStore;
