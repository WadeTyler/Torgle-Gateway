import { FastifyServerOptions } from 'fastify';
import { FastifyHttpProxyOptions } from '@fastify/http-proxy';

export interface ServerOptions extends FastifyServerOptions {
	port?: number;
	host?: string;
};

export interface ProxyRoute extends FastifyHttpProxyOptions {
	requiresAuth?: boolean;
}

export interface JwtOptions {
	issuer: string;
	jwksUri: string;
	audience?: string;
}

export interface Config {
	serverOptions?: ServerOptions;
	proxyRoutes?: ProxyRoute[];
	jwtOptions?: JwtOptions;
}


