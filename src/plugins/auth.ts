import { JwksClient } from "jwks-rsa";
import { jwtOptions } from "../config/config";
import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

const client = new JwksClient({
	jwksUri: jwtOptions?.jwksUri || "",
	cache: true,
	cacheMaxAge: 600000 // 10 minutes
});

function getKey(header: any, callback: any) {
	client.getSigningKey(header.kid, (err, key) => {
		if (err) {
			callback(err);
			return;
		}
		const signingKey = key?.getPublicKey();
		callback(null, signingKey);
	})
}

async function verifyToken(token: string) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, getKey, {
			issuer: jwtOptions?.issuer,
			audience: jwtOptions?.audience,
			algorithms: ['RS256']
		}, (err, decoded) => {
			if (err) reject(err);
			else resolve(decoded);
		});
	});
}

function extractAuthToken(request: FastifyRequest): string {
	const authHeader = request.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new Error("Missing or invalid Authorization header");
	}
	return authHeader.substring(7);
}

/**
 * Fastify preHandler to authenticate requests using JWT.
 * Attaches the decoded token to request.user if successful.
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
	try {
		const token = extractAuthToken(request);
		const decoded = await verifyToken(token);

		// Attach decoded token to request object
		(request as any).user = decoded;
	} catch (err) {
		reply.code(401).send({ error: "Unauthorized" });
	}
}
