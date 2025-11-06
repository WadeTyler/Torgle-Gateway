import configData from '../../torgle-config.json';
import { FastifyHttpProxyOptions } from '@fastify/http-proxy';
import { FastifyServerOptions } from 'fastify';

export interface ServerOptions extends FastifyServerOptions {
	port?: number;
	host?: string;
};

export interface ProxyRoute extends FastifyHttpProxyOptions {
	requiresAuth?: boolean;
}

export interface Config {
	serverOptions?: ServerOptions;
	proxyRoutes?: ProxyRoute[];
}

const defaultServerOptions: ServerOptions = {
	port: 9000,
	host: '0.0.0.0',
	logger: true
};

const config: Config = configData as Config;

export const serverOptions = {
	...defaultServerOptions,
	...config.serverOptions,
};
export const proxyRoutes = config.proxyRoutes || [];

export default config;

