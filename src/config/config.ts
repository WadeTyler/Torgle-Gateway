import configData from '../../torgle-config.json';
import type { ServerOptions, Config, ProxyRoute, JwtOptions, CircuitBreakerOptions } from '../types/config.d.ts';

const defaultServerOptions: ServerOptions = {
	port: 9000,
	host: '0.0.0.0',
	logger: true
};

const defaultCircuitBreakerOptions: CircuitBreakerOptions = {
	enabled: false, // Default to disabled
	threshold: 5,
	timeout: 10000,
	resetTimeout: 10000,
	onCircuitOpen: async (_req, reply) => {
		reply.statusCode = 503;
		throw new Error('Service unavailable');
	},
	onTimeout: async (_req, reply) => {
		reply.statusCode = 504;
		throw new Error('Request timed out');
	}
};

/**
 * Load and export the configuration settings.
	* Merges default server options with those from the config file.
	* Exports proxy routes and JWT options if provided.
	* Defaults are applied where configuration is missing.
	* Ensures type safety with TypeScript interfaces.
*/
const config: Config = configData as Config;

export const serverOptions: ServerOptions = {
	...defaultServerOptions, ...config.serverOptions,
};
export const proxyRoutes: ProxyRoute[] = config.proxyRoutes || [];
export const jwtOptions: JwtOptions | undefined = config.jwtOptions || undefined;
export const circuitBreakerOptions: CircuitBreakerOptions = {
	...defaultCircuitBreakerOptions,
	...config.circuitBreakerOptions,
};
