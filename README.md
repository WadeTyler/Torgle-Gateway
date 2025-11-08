# Torgle Gateway

Torgle Gateway is a lightweight, self-hosted, opinionated and open source API Gateway
 service. Torgle Gateway is designed for quick setup and simple configuration process.
Torgle Gateway is an ideal solution for quick API Gateways, proxying,
rate limiting, or authentication entry points.

## Features

* Easily bootable via Docker and Deployable with Kubernetes.
* Built in Route Proxying.
* Built in Rate Limiting.
* Built in Circuit Breaker.
* Built in OAuth2 JWT Authentication.
* Single Config Entrypoint.

## How it works

Using the latest docker image @ [wadetyler/torgle-gateway](https://hub.docker.com/r/wadetyler/torgle-gateway)
 you can easily launch your api gateway within seconds by mounting your
 **torgle-config.yml** or **torgle-config.json** to the `/usr/src/data` directory.
Torgle Gateway will read your config file and run accordingly.

### Prerequisites

* Familiar with Git/GitHub.
* Familiar with Docker and Docker compose.

### Usage

It is **recommended** to create a separate repository and
 `docker-compose.yml` for your API-Gateway.

#### Creating your torgle-config.yml

For this example, we will show a `torgle-config.yml` configuration, but you can also use JSON.

To view the full types for `torgle-config`, please see [src/types/config.d.ts](/src/types/config.d.ts).

Torgle is built on [Fastify](https://fastify.dev/), and many of its configurations extend the default Fastify types.

---

### Torgle Configuration Options

Below is an example `torgle-config.yml` file with explanations for each section.

#### `serverOptions`
Contains the base options for the server.
- `port`: The port the server will listen on. Defaults to `9000`.
- `host`: The host the server will bind to. Defaults to `'0.0.0.0'`.
- `healthCheck`: Configures the health check endpoint.
  - `enabled`: If `true`, the health check is enabled. Defaults to `true`.
  - `endpoint`: The path for the health check endpoint. Defaults to `'/health'`.
- For more options, see the `FastifyServerOptions` interface in the [Fastify documentation](https://github.com/fastify/fastify/blob/main/fastify.d.ts#L111).

#### `proxyRoutes`
An array of routes to proxy to external services.
- `prefix`: The incoming path to match (e.g., `"/google"`).
- `upstream`: The target URL to which the request will be forwarded (e.g., `"https://google.com"`).
- `httpMethods`: An array of HTTP methods to match (e.g., `["GET"]`).
- `requiresAuth`: If `true`, requires authentication to be configured and successful. Defaults to `false`.
- `rateLimitOptions`: Sets up per-route rate limiting, which overrides any global settings.
- For more proxy options, see the `FastifyHttpProxyOptions` interface in the [fastify-http-proxy documentation](https://github.com/fastify/fastify-http-proxy/blob/main/types/index.d.ts#L62).

#### `rateLimitOptions` (Global)
Sets the default rate limit options for all routes.
- `global`: If `true`, this rate limit applies to all routes. Per-route `rateLimitOptions` will override this setting. Defaults to `false`.
- `max`: The maximum number of requests allowed within the `timeWindow`. Defaults to `1000`.
- `timeWindow`: The time frame in milliseconds. Defaults to `60000` (1 minute).
- For more options, see the `RateLimitPluginOptions` in the [fastify-rate-limit documentation](https://github.com/fastify/fastify-rate-limit/blob/main/types/index.d.ts#L156).

#### `circuitBreakerOptions`
Configures the circuit breaker to prevent repeated requests to a failing service.
- `enabled`: If `true`, the circuit breaker is enabled. Defaults to `false`.
- `threshold`: The number of failed requests required to open the circuit. Defaults to `5`.
- `timeout`: The time in milliseconds before a request to a protected service times out. Defaults to `10000`.
- `resetTimeout`: The time in milliseconds before the circuit moves from 'open' to 'half-open'. Defaults to `5000`.

#### `jwtOptions`
Configures JWT-based authentication for handling OAuth2 tokens. This is required if you use `requiresAuth: true` on any route.
- `issuer`: The URL of the JWT issuer.
- `jwksUri`: The URI for fetching the JSON Web Key Set (JWKS).
- `audience`: (Optional) The audience claim to validate in the JWT.

```yaml
# torgle-config.yml

serverOptions:
  port: 9000
  host: '0.0.0.0'
  healthCheck:
    enabled: true
    endpoint: '/health'

proxyRoutes:
  - prefix: '/google'
    upstream: 'https://google.com'
    httpMethods: ['GET']
    requiresAuth: false
    rateLimitOptions:
      max: 100
      timeWindow: 60000

rateLimitOptions:
  global: true
  max: 1000
  timeWindow: 60000

circuitBreakerOptions:
  enabled: true
  threshold: 5
  timeout: 10000
  resetTimeout: 5000

jwtOptions:
  issuer: 'https://your-auth-server.com/'
  jwksUri: 'https://your-auth-server.com/.well-known/jwks.json'
  audience: 'your-api-audience'
```

## Contributions

Contributions are welcome and greatly appreciated! We are excited to see what you build with Torgle Gateway.

### Reporting Bugs and Suggesting Features

If you encounter a bug or have an idea for a new feature, please open an issue on GitHub. When reporting a bug, please include:

- A clear and concise description of the bug.
- Steps to reproduce the behavior.
- The expected behavior and what actually happened.
- Your `torgle-config.yml` (with any sensitive information removed).

### Submitting Code Changes

To contribute code, please follow these steps:

1.  **Fork the Repository:** Create your own fork of the Torgle Gateway repository.
2.  **Create a Branch:** Make a new branch for your changes. Use a descriptive name, such as `feat/new-caching-layer` or `fix/proxy-timeout-bug`.
    ```sh
    git checkout -b feat/my-awesome-feature
    ```
3.  **Develop Locally:**
    - Clone your forked repository.
    - Install dependencies with `npm install`.
    - Make your changes to the code.
    - Run `npm test` to ensure all tests pass.
4.  **Commit Your Changes:** Write a clear and descriptive commit message.
    ```sh
    git commit -m "Feat: Add support for my awesome feature"
    ```
5.  **Push to Your Branch:**
    ```sh
    git push origin feat/my-awesome-feature
    ```
6.  **Open a Pull Request:** Go to the Torgle Gateway repository and open a new pull request. Provide a detailed description of the changes you've made.

Thank you for helping make Torgle Gateway better!

## License

This project is licensed under the [GNU GENERAL PUBLIC LICENSE](/LICENSE).
