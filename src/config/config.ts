import configData from '../../torgle-config.json';
import { FastifyHttpProxyOptions } from '@fastify/http-proxy';

export interface ServerOptions {
	port?: number;
	host?: string;
	logging?: boolean;
};

export interface Config {
	serverOptions?: ServerOptions;
	proxyRoutes?: FastifyHttpProxyOptions[];
}

const defaultServerOptions: ServerOptions = {
	port: 9000,
	host: '0.0.0.0',
	logging: true,
};

const config: Config = configData as Config;

export const serverOptions = {
	...defaultServerOptions,
	...config.serverOptions,
};
export const proxyRoutes = config.proxyRoutes || [];

export default config;

