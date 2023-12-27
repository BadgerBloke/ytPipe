import { NextRequest, NextResponse } from 'next/server';
import httpStatus from 'http-status';

import { IAM } from '~/lib/config';
import { setCookies } from '~/lib/tools/cookies-handler';

const POST = async (req: NextRequest) => {
    try {
        const { accessToken } = await req.json();
        if (!accessToken) return NextResponse.json({ error: httpStatus['400_NAME'] }, { status: httpStatus.BAD_REQUEST });

        const body = JSON.stringify({ accessToken });

        req.headers.set('host', IAM.baseUrl.slice(8));
        req.headers.set('content-length', String(body.length));

        const requestOptions = {
            method: 'POST',
            headers: req.headers,
            body,
        };

        const res = await fetch(`${IAM.baseUrl}/api/protocol/openid-connect/token/introspect`, requestOptions).then(r =>
            r.json()
        );

        if (res.active) {
            const response = NextResponse.json({ active: res.active }, { status: httpStatus.OK });
            setCookies({ response, authorization: accessToken, provider: 'email' });
            return response;
        }
        return NextResponse.json({ active: res.active }, { status: httpStatus.OK });
    } catch (err) {
        return NextResponse.json({ message: (err as Error).message }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
};

export { POST };
