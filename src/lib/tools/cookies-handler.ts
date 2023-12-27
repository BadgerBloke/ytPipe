'use server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import * as jose from 'jose';

import { CLIENT, COOKIES } from '../config';
import { UserData } from '../interfaces/user';

export const getUserData = ({ jwt }: { jwt?: string }): UserData | undefined => {
    if (jwt) {
        return jose.decodeJwt(jwt) as unknown as UserData;
    }
    return;
};

export const setOrgCookie = (orgId: string) => {
    const oneDay = 24 * 60 * 60 * 1000;
    cookies().set(COOKIES.ORG_ID, orgId, {
        expires: Date.now() + oneDay,
        maxAge: oneDay,
        path: '/',
        domain: CLIENT.domain,
        httpOnly: true,
        secure: true,
        sameSite: true,
    });
    return 'OK';
};

export const setCookies = ({
    response,
    authorization,
    providerAccessToken,
    providerRefreshToken,
    provider,
    maxAge,
    expires,
    serverAction,
}: {
    response?: NextResponse;
    authorization: string;
    providerAccessToken?: string;
    providerRefreshToken?: string;
    provider?: string;
    maxAge?: number;
    expires?: number;
    serverAction?: boolean;
}): void => {
    if (!response && typeof serverAction === 'undefined') {
        throw new Error('Either "response" or "serverAction" must be provided.');
    }

    if (response && typeof serverAction !== 'undefined') {
        throw new Error('Both "response" and "serverAction" cannot be provided simultaneously.');
    }

    const remainingTime = getRemainingTime(authorization);
    const res = response ? response.cookies : cookies();
    res.set(COOKIES.authorization, authorization, {
        domain: CLIENT.domain,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: maxAge ?? remainingTime,
        httpOnly: true,
        expires: expires ?? remainingTime,
    });

    if (providerAccessToken) {
        res.set(COOKIES.providerAccessToken, providerAccessToken, {
            domain: CLIENT.domain,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: maxAge ?? remainingTime,
            httpOnly: true,
            expires: expires ?? remainingTime,
        });
    }
    if (providerRefreshToken) {
        res.set(COOKIES.providerRefreshToken, providerRefreshToken, {
            domain: CLIENT.domain,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: maxAge ?? remainingTime,
            httpOnly: true,
            expires: expires ?? remainingTime,
        });
    }

    res.set(COOKIES.provider, provider || 'email', {
        domain: CLIENT.domain,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: maxAge ?? remainingTime,
        httpOnly: true,
        expires: expires ?? remainingTime,
    });
};

export const deleteCookies = ({ response }: { response: NextResponse }): void => {
    Object.keys(COOKIES).forEach(key => {
        response.cookies.set(COOKIES[key as keyof typeof COOKIES], '', {
            domain: CLIENT.domain,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 0,
            httpOnly: true,
            expires: 0,
        });
    });
};

export const getRemainingTime = (jwt: string) => {
    const payload = jose.decodeJwt(jwt);
    const expiryTime = payload.exp;

    if (expiryTime) {
        // Get the current time in seconds since the UNIX epoch
        const currentTime = Math.floor(Date.now() / 1000);

        // Calculate the remaining time in seconds
        return expiryTime - currentTime;
    }
    return 0;
};
