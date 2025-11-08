import { FastifyInstance } from "fastify";
import { serverOptions } from "../config/config";


/**
* Enables the health check endpoint. Health check endpoints returns status 200 if healthy.
* The health check endpoint is enabled by default and can be disabled in the serverOptions.healthCheck config.
* Default endpoint: '/health'
*/
export async function registerHealthPlugin(server: FastifyInstance) {
	if (serverOptions.healthCheck.enabled) {
		const opts = {
			schema: {
				response: {
					200: {
						type: 'object',
						properties: {
							status: { type: 'string' }
						}
					}
				}
			}
		};

		server.get(serverOptions.healthCheck.endpoint, opts, (req, reply) => {
			reply.send({ status: "OK" });
		});

		server.log.info(`Health Check endpoint registered at: ${serverOptions.healthCheck.endpoint}`);
	}
}
