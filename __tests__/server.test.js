const supertest = require('supertest');

const testEnv = {
    appName: 'meeves test',
};

const createConfig = require('../src/config');
const createApp = require('../src/express');

const TEST_EVENT_1 = {
    type: 'Test',
    streamName: 'test-stream',
    data: {
        key: 'value',
    },
    metadata: {
        some: 'value',
    },
};

const TEST_EVENT_2 = {
    type: 'Test2',
    streamName: 'another-test-stream',
    data: {
        key: 'value',
    },
    metadata: {
        some: 'value',
    },
};

describe('GET /ping', () => {
    let config;
    let app;

    beforeEach(() => {
        config = createConfig({ env: testEnv });
        app = createApp({ env: testEnv, config });
    });

    it('responds with ok', async () => {
        await supertest(app)
            .get('/ping')
            .expect(200)
            .then((res) => {
                expect(res.text).toBe('OK');
            });
    });
});

describe('POST /events', () => {
    let config;
    let app;

    beforeEach(() => {
        config = createConfig({ env: testEnv });
        app = createApp({ env: testEnv, config });
    });

    it('creates an event', async () => {
        await supertest(app)
            .post('/events')
            .send(TEST_EVENT_1)
            .expect(201)
            .then((res) => {
                expect(res.text.length).toBe(36);
            });
    });
});

describe('GET /events', () => {
    let config;
    let app;

    beforeEach(async () => {
        config = createConfig({ env: testEnv });
        app = createApp({ env: testEnv, config });

        await supertest(app).post('/events').send(TEST_EVENT_1);
        await supertest(app).post('/events').send(TEST_EVENT_2);
    });

    it('retrieves all the events', async () => {
        await supertest(app)
            .get('/events')
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBe(2);
            });
    });
});

describe('GET /events/stream/:streamName', () => {
    let config;
    let app;

    beforeEach(async () => {
        config = createConfig({ env: testEnv });
        app = createApp({ env: testEnv, config });

        await supertest(app).post('/events').send(TEST_EVENT_1);
        await supertest(app).post('/events').send(TEST_EVENT_2);
        await supertest(app).post('/events').send(TEST_EVENT_1);
    });

    it('retrieves all the events from a stream', async () => {
        await supertest(app)
            .get(`/events/stream/${TEST_EVENT_2.streamName}`)
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBe(1);
            });
    });
});

describe('GET /events/stream/:streamName/last', () => {
    let config;
    let app;

    let generatedIds;

    beforeEach(async () => {
        config = createConfig({ env: testEnv });
        app = createApp({ env: testEnv, config });

        generatedIds = [];

        await supertest(app)
            .post('/events')
            .send(TEST_EVENT_1)
            .then((res) => res.text)
            .then((id) => generatedIds.push(id));
        await supertest(app)
            .post('/events')
            .send(TEST_EVENT_2)
            .then((res) => res.text)
            .then((id) => generatedIds.push(id));
        await supertest(app)
            .post('/events')
            .send(TEST_EVENT_1)
            .then((res) => res.text)
            .then((id) => generatedIds.push(id));
    });

    it('retrieves the last event from a stream', async () => {
        await supertest(app)
            .get(`/events/stream/${TEST_EVENT_1.streamName}/last`)
            .expect(200)
            .then((res) => {
                expect(res.body).toBe(generatedIds[2]);
            });
    });
});

describe('GET /events/type/:type', () => {
    let config;
    let app;

    beforeEach(async () => {
        config = createConfig({ env: testEnv });
        app = createApp({ env: testEnv, config });

        await supertest(app).post('/events').send(TEST_EVENT_1);
        await supertest(app).post('/events').send(TEST_EVENT_2);
        await supertest(app).post('/events').send(TEST_EVENT_1);
    });

    it('retrieves all the events by type', async () => {
        await supertest(app)
            .get(`/events/type/${TEST_EVENT_1.type}`)
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBe(2);
            });
    });
});

describe('GET /events/:id', () => {
    let config;
    let app;

    let generatedIds;

    beforeEach(async () => {
        config = createConfig({ env: testEnv });
        app = createApp({ env: testEnv, config });

        generatedIds = [];

        await supertest(app).post('/events').send(TEST_EVENT_1);
        await supertest(app).post('/events').send(TEST_EVENT_2);
    });

    it('retrieves the details of an event', async () => {
        await supertest(app)
            .get(`/events/stream/${TEST_EVENT_2.streamName}/last`)
            .expect(200)
            .then((res) => {
                // The id returned is a string within quotes; remove quotes to extract id
                const eventId = res.text.replace(/["]+/g, '');
                return supertest(app).get(`/events/${eventId}`).expect(200);
            })
            .then((res) => {
                expect(res.body.type).toBe(TEST_EVENT_2.type);
                expect(res.body.streamName).toBe(TEST_EVENT_2.streamName);
                expect(res.body.data).toEqual(TEST_EVENT_2.data);
                expect(res.body.metadata).toEqual(TEST_EVENT_2.metadata);
                expect(res.body.streamPosition).toBe(1);
                expect(res.body.globalPosition).toBe(1);
            });
    });
});
