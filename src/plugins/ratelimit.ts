
import rateLimiterPlugin from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';
import { rateLimitOptions } from '../config/config';

export function registerRateLimitPlugin(server: FastifyInstance) {
	if (rateLimitOptions) {
		server.register(rateLimiterPlugin, rateLimitOptions);
		server.log.info(`Default Rate limiter plugin options initialized.`);
		rateLimitOptions.global && server.log.info("Rate limiter will apply globally.");
	}
}
