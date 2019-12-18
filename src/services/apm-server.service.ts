import elasticApmNode from 'elastic-apm-node';
import config from 'config';

export default (): Promise<any> => new Promise<any>(async (resolve, reject) => {
	try {
		const apm = await elasticApmNode.start({
			serviceName: config.get('server.name'),
			serverUrl: `${config.get('services.apm-server.host')}`,
			captureBody: 'all',
			usePathAsTransactionName: true,
			active: ['staging', 'production'].includes(process.env.NODE_ENV),
			environment: process.env.NODE_ENV
			// logLevel: 'trace',
		});
		global.apm = apm;
		resolve(apm);
	} catch (error) {
		reject(error);
	}
});
