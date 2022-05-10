if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: 'dev.env' });
}

const loadFromEnv = (key) => {
    if (!process.env[key]) {
        throw new Error(`missing required env variable: [${key}]`);
    }

    return process.env[key];
};

const createEnv = () => {
    return {
        port: parseInt(loadFromEnv('PORT'), 10),
        appName: loadFromEnv('APP_NAME'),
    };
};

module.exports = createEnv;
