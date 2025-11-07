import fastify from 'fastify';
import { proxyPlugin } from './plugins/proxy';
import { serverOptions } from './config/config';
import { registerCircuitBreaker } from './plugins/circuitbreaker';
import { registerRateLimitPlugin } from './plugins/ratelimit';
import { registerHealthPlugin } from './plugins/health';

const server = fastify(serverOptions);

registerHealthPlugin(server);
registerCircuitBreaker(server);
registerRateLimitPlugin(server);
server.register(proxyPlugin);

server.listen({ port: serverOptions.port, host: serverOptions.host }, function(err, address) {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	server.log.info(`Server listening on port ${serverOptions.port}`);
});
