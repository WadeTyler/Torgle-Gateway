
import { FastifyInstance } from "fastify";
import proxy from "@fastify/http-proxy";
import { proxyRoutes } from "../config/config";

export async function proxyPlugin(server: FastifyInstance) {
	for (const route of proxyRoutes) {
		await server.register(proxy, route);
	}
}

