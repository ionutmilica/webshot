import getServer from './server';

const { server, close } = getServer();

process.on('SIGINT', () => {
    // logger.debug('Received SIGINT. Shutting down now.');
    close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    close(() => {
        // logger.info('All requests finished. Shutting down now.');
        process.exit(0);
    });
});
