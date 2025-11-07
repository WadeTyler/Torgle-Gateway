import fastify from 'fastify';
import { proxyPlugin } from './plugins/proxy';
import { serverOptions } from './config/config';
import { registerCircuitBreaker } from './plugins/circuitbreaker';

const server = fastify(serverOptions);

registerCircuitBreaker(server);
server.register(proxyPlugin);

server.listen({ port: serverOptions.port, host: serverOptions.host }, function(err, address) {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	server.log.info(`Server listening on port ${serverOptions.port}`);
});
