'use server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

import { MAIN_SITE } from '../config';
import { COOKIES } from '../constants/cookies-name';
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
        domain: MAIN_SITE.domain,
        httpOnly: true,
        secure: true,
        sameSite: true,
    });
    return 'OK';
};
