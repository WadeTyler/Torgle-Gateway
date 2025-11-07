
import { FastifyInstance } from "fastify";
import proxy from "@fastify/http-proxy";
import { circuitBreakerOptions, proxyRoutes, rateLimitOptions } from "../config/config";
import { authenticate } from "./auth";

/**
 * Fastify plugin to register proxy routes with optional authentication.
 * Iterates over configured proxy routes and registers them with the server.
 * If a route requires authentication, the authenticate preHandler is applied.
 */
export async function proxyPlugin(server: FastifyInstance) {
	for (const route of proxyRoutes) {
		const handlers = [];

		if (route.rateLimitOptions) {
			// Override default rate limit options with route specific rate limit options.
			const options = { ...rateLimitOptions, ...route.rateLimitOptions };
			handlers.push(server.rateLimit(options));
		}

		if (circuitBreakerOptions.enabled) {
			handlers.push(server.circuitBreaker());
		}

		if (route.requiresAuth) {
			handlers.push(authenticate);
		}


		await server.register(proxy, {
			...route,
			preHandler: handlers.length > 0 ? handlers as any : undefined
		});
		server.log.info(`Registered proxy route: ${route.httpMethods || "*"} ${route.prefix} -> ${route.upstream}`);
	}
}

