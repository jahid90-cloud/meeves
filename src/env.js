if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: 'dev.env' });
}

const loadFromEnv = (key) => {
    if (!process.env[key]) {
        console.error(`missing required env variable: [${key}]`);
        process.exit(-1);
    }

    return process.env[key];
};

const createEnv = () => {
    return {
        port: parseInt(loadFromEnv('PORT'), 10),
        appName: loadFromEnv('APP_NAME'),
        enableStoreRestServer: loadFromEnv('ENABLE_STORE_REST_SERVER'),
    };
};

module.exports = createEnv;
