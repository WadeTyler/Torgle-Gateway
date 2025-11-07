import { FastifyInstance } from "fastify";
import circuitBreaker from "@fastify/circuit-breaker";
import { circuitBreakerOptions } from "../config/config";

export function registerCircuitBreaker(server: FastifyInstance) {
	if (circuitBreakerOptions.enabled) {
		server.register(circuitBreaker, circuitBreakerOptions);
		server.log.info("Circuit breaker plugin registered.");
	}
}

