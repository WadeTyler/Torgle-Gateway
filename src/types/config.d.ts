import { FastifyServerOptions } from 'fastify';
import { FastifyHttpProxyOptions } from '@fastify/http-proxy';
import { FastifyCircuitBreakerOptions } from '@fastify/circuit-breaker';
import { FastifyRateLimitOptions, RateLimitPluginOptions } from '@fastify/rate-limit';

export interface ServerOptions extends FastifyServerOptions {
	port?: number;
	host?: string;
};

export interface ProxyRoute extends FastifyHttpProxyOptions {
	requiresAuth?: boolean;
	rateLimitOptions?: RateLimitOptions;
}

export interface RateLimitOptions extends RateLimitPluginOptions {
}

export interface JwtOptions {
	issuer: string;
	jwksUri: string;
	audience?: string;
}

export interface CircuitBreakerOptions extends FastifyCircuitBreakerOptions {
	enabled: boolean;
}

export interface Config {
	serverOptions?: ServerOptions;
	proxyRoutes?: ProxyRoute[];
	rateLimitOptions?: RateLimitOptions;
	jwtOptions?: JwtOptions;
	circuitBreakerOptions?: CircuitBreakerOptions;
}


