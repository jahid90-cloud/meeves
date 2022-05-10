const createEnv = require('./env');
const createConfig = require('./config');
const createApp = require('./express');

const start = () => {
    const env = createEnv();
    const config = createConfig({ env });
    const app = createApp({ env, config });

    const onAppStart = () => {
        console.info('app environment information:');
        console.table([
            ['App Name', env.appName],
            ['Port', env.port],
        ]);
        console.info(`${env.appName} started and listening on port ${env.port}`);
    };

    app.listen(env.port, onAppStart);
};

module.exports = {
    start,
};
