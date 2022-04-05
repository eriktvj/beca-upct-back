import { buildConfig } from './config';
import prettyShutdown from './pretty-shutdown';
import 'make-promises-safe';
import { buildApp } from './app';
import { buildLogger } from './logger';

const config = buildConfig();
const logger = buildLogger(config.log);

async function main() {
    logger.info(`Starting ${config.projectName}`);
    const app = await buildApp(logger);

    const { http } = config;
    await app.getServer().listen(http.port, http.host);
    process.on('SIGTERM', prettyShutdown(app, logger));
    process.on('SIGINT', prettyShutdown(app, logger));
}

main().catch(error => {
    logger.error(
        `Error while starting up ${config.projectName}. ${error.message}`
    );
    process.exit(1);
});