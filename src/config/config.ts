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
	// Attempt to read from mounted path first
	// then fallback to current working directory
	// This allows for flexibility in different deployment environments
	try {
		try {
			return loadConfigFromMountedPath();
		} catch (e) {
			console.log((e as Error).message);
			return loadConfigFromCwd();
		}
	} catch (e) {
		console.log((e as Error).message);
		console.log("Using default config.");
		return {} as Config;
	}
}

function loadConfigFromMountedPath() {
	const yamlPath = "/usr/src/data/torgle-config.yml";
	const jsonPath = "/usr/src/data/torgle-config.json";
	return loadFiles(yamlPath, jsonPath);
}

function loadConfigFromCwd() {
	const yamlPath = path.resolve(process.cwd(), 'torgle-config.yml');
	const jsonPath = path.resolve(process.cwd(), 'torgle-config.json');
	return loadFiles(yamlPath, jsonPath);
}

function loadFiles(yamlPath: string, jsonPath: string): Config | null {
	if (fs.existsSync(yamlPath)) {
		return loadFromFileSync(yamlPath);
	} else if (fs.existsSync(jsonPath)) {
		return loadFromFileSync(jsonPath);
	}
	throw new Error("No configuration file found in: " + yamlPath + " or " + jsonPath);
}

function loadFromFileSync(filePath: string): Config {
	console.log("Loading configuration from", filePath);
	const fileContents = fs.readFileSync(filePath, 'utf8');
	if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
		return yaml.load(fileContents) as Config;
	} else if (filePath.endsWith('.json')) {
		return JSON.parse(fileContents) as Config;
	}
	throw new Error('Unsupported configuration file format');
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
