
import { FastifyInstance } from "fastify";
import proxy from "@fastify/http-proxy";
import { proxyRoutes } from "../config/config";
import { authenticate } from "./auth";

/**
 * Fastify plugin to register proxy routes with optional authentication.
 * Iterates over configured proxy routes and registers them with the server.
 * If a route requires authentication, the authenticate preHandler is applied.
 */
export async function proxyPlugin(server: FastifyInstance) {
	for (const route of proxyRoutes) {
		await server.register(proxy, {
			...route,
			preHandler: route.requiresAuth ? authenticate : undefined
		});
		server.log.info(`Registered proxy route: ${route.httpMethods || "*"} ${route.prefix} -> ${route.upstream}`);
	}
}

