import { App } from './app';
import { buildConfig } from './config';
import { Logger } from 'pino';

export default function prettyShutdown(
    app: App,
    logger: Logger
): () => Promise<void> {
    const config = buildConfig();
    return async (): Promise<void> => {
        try {
            logger.info(`Shutting down ${config.projectName}.`);
            await app.close();
            logger.info('Shutdown complete. Exit now.');
            process.exit(0);
        } catch (error) {
            logger.error('error while shutting down.', error);
            process.exit(1);
        }
    };
}