/* eslint-disable no-console */
/* eslint-disable import/first */
/* eslint-disable import/order */
import apmServerService from '../services/apm-server.service';
import { Logger } from 'winston';

declare global {
    namespace NodeJS {
        interface Global {
            logger: Logger;
            apm: any;
        }
    }
}

apmServerService().then((apm) => {
	console.log('Apm has been run');
}).catch((error) => {
	console.error(error);
});

import App from './app';
import logger from '../utils/logger';
import config from 'config';
import { IServerOptions } from '../interfaces';
import { connection, initializeTable } from '../models';
// import listeners from '../listeners';



global.logger = logger;
global.logger.info(`Listening ${process.env.NODE_ENV} config`);

const server = (options: IServerOptions): Promise<any> => new Promise<any>(async (resolve, reject) => {
	try {
		const application = new App();
		const app = await application.run(options.port);
		global.logger.info(`Graphql listening on the port ${options.port}`);

		const database = await connection.authenticate()
		global.logger.info('Connection to database successfully connected');
		await initializeTable()
		global.logger.info('Database has been initialize')

		resolve({
			app,
		});
	} catch (error) {
		reject(error);
	}
});

server({
	port: config.get('server.port'),
}).then((result) => {
	//
}).catch((error) => {
	global.logger.error(error);
	process.exit(1);
});
