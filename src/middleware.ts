import { NextResponse } from 'next/server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import * as jose from 'jose';

import { IAM, REDIS } from './lib/config';
// import { ytPipe } from './lib/constants/error-code';

export const config = {
    matcher: [
        /*
         * Match all request paths
         */
        // '/:path*',
        // '/((?!_next/static|_next/image|favicon.ico).*)',
        '/channels/:path*',
        '/api/:path*',
    ],
};

/*
 * This middleware is used to protect API routes only.
 * It checks if the request has a token in the cookie.
 * If not, it responds with a 401 status code.
 * If yes, it initializes the Appwrite client with the token.
 * If the token is invalid, it responds with a 401 status code.
 * If the token is valid, it continues to the API route.
 */

export const middleware = withAxiom(async (req: AxiomRequest) => {
    const EVENT_BASE_NAME = 'ytPipe Middleware';
    const cookieStore = req.cookies;
    const authorization = cookieStore.get('Authorization')?.value;
    if (authorization) {
        req.log.info(`${EVENT_BASE_NAME} - authorization cookies available`, { authorization });
        try {
            req.log.info(`${EVENT_BASE_NAME} - fetching certs`);

            const { kid } = jose.decodeProtectedHeader(authorization);
            let JWKS = null;
            try {
                const res = await fetch(`${REDIS.host}/get/${kid}`, {
                    headers: {
                        Authorization: `Bearer ${REDIS.token}`,
                    },
                }).then(r => r.json());
                JWKS = jose.createLocalJWKSet(JSON.parse(res.result));
                req.log.info(`${EVENT_BASE_NAME} - read certs from redis`, { kid });
            } catch (error) {
                const jwksRes = await fetch(`${IAM.baseUrl}/realms/${IAM.realm}/protocol/openid-connect/certs`).then(r =>
                    r.json()
                );
                await fetch(`${REDIS.host}/set/${kid}/${encodeURIComponent(JSON.stringify(jwksRes))}`, {
                    headers: {
                        Authorization: `Bearer ${REDIS.token}`,
                    },
                });
                JWKS = jose.createLocalJWKSet(jwksRes);
                req.log.info(`${EVENT_BASE_NAME} - fetched and wrote certs to redis`, { kid, error });
            }

            req.log.info(`${EVENT_BASE_NAME} - verifying access_token`);
            const { payload, protectedHeader } = await jose.jwtVerify(authorization, JWKS, {
                issuer: `${IAM.baseUrl}/realms/${IAM.realm}`,
            });

            req.log.info(`${EVENT_BASE_NAME} - Valid authorization jwt`, { payload, protectedHeader });
            // if (
            //     // req.nextUrl.pathname.toLowerCase().startsWith('/ytpipe') &&
            //     cookieStore.get('Provider')?.value === 'google'
            // ) {
            //     req.log.info(`${EVENT_BASE_NAME} - non-google user trying ytPipe, redirecting to login`, { payload });
            //     return NextResponse.redirect(
            //         new URL(
            //             `/api/logout?callback=${req.nextUrl.pathname}&error=${ytPipe.yt403.code}`,
            //             new URL(MAIN_SITE.authBaseUrl)
            //         ),
            //         { status: 307 }
            //     );
            // }
            return NextResponse.next({ ...req });
        } catch (error) {
            req.log.info(`${EVENT_BASE_NAME} - jwt validation error, redirecting to login`, { error });
            return NextResponse.redirect(new URL(`/login?callback=${req.nextUrl.pathname}`, new URL(IAM.baseUrl)), {
                status: 307,
            });
        }
    }
    req.log.info(`${EVENT_BASE_NAME} - accessing private route without authorization cookie, redirecting to login`);
    return NextResponse.redirect(new URL(`/login?callback=${req.nextUrl.pathname}`, new URL(IAM.baseUrl)), {
        status: 307,
    });
});
