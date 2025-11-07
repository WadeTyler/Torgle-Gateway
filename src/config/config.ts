import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import type { ServerOptions, Config, ProxyRoute, JwtOptions, CircuitBreakerOptions, RateLimitOptions } from '../types/config.d.ts';

/**
 * Load Config data from file.
 * Priority Order:
 * 1. "torgle-config.yml"
 * 2. "torgle-config.json"
 */
const configData = () => {
	const yamlPath = path.resolve(process.cwd(), 'torgle-config.yml');
	const jsonPath = path.resolve(process.cwd(), 'torgle-config.json');

	if (fs.existsSync(yamlPath)) {
		console.log("Loading configuration from torlge-config.yml");
		const fileContents = fs.readFileSync(yamlPath, 'utf8');
		return yaml.load(fileContents);
	} else if (fs.existsSync(jsonPath)) {
		console.log("Loading configuration from torlge-config.json");
		const fileContents = fs.readFileSync(jsonPath, 'utf8');
		return JSON.parse(fileContents);
	} else {
		console.warn('No configuration file found. Using default settings.');
		return {};
	}
}

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

const defaultRateLimitOptions: RateLimitOptions = {
	global: false, // Not global by default. This means it will only apply if enabled on each route.
	max: 1000,
	timeWindow: 1000 * 60,
	hook: 'preHandler',
}

/**
 * Load and export the configuration settings.
	* Merges default server options with those from the config file.
	* Exports proxy routes and JWT options if provided.
	* Defaults are applied where configuration is missing.
	* Ensures type safety with TypeScript interfaces.
*/
const config: Config = configData() as Config;

export const serverOptions: ServerOptions = { ...defaultServerOptions, ...config.serverOptions };
export const proxyRoutes: ProxyRoute[] = config.proxyRoutes || [];
export const rateLimitOptions: RateLimitOptions = { ...defaultRateLimitOptions, ...config.rateLimitOptions };
export const jwtOptions: JwtOptions | undefined = config.jwtOptions || undefined;
export const circuitBreakerOptions: CircuitBreakerOptions = {
	...defaultCircuitBreakerOptions,
	...config.circuitBreakerOptions,
};
