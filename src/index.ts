import fastify from 'fastify';
import { proxyPlugin } from './routes/proxy';
import { serverOptions } from './config/config';

const server = fastify({
	logger: true,
});

server.register(proxyPlugin);

server.listen({ port: serverOptions.port, host: serverOptions.host }, function(err, address) {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	server.log.info(`Server listening on port ${serverOptions.port}`);
});
