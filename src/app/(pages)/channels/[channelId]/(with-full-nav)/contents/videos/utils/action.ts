'use server';

import { cookies } from 'next/headers';
import { google } from 'googleapis';

const oAuth = new google.auth.OAuth2();

const getVideos = async ({ maxResults, pageToken }: { maxResults?: number; pageToken?: string | null }) => {
    const cookieStore = cookies();
    const providerAccessToken = cookieStore.get('Provider-Access-Token')?.value;
    oAuth.setCredentials({ access_token: providerAccessToken });
    const service = google.youtube('v3');

    return await service.search
        .list({
            auth: oAuth,
            part: ['snippet'],
            forMine: true,
            type: ['video'],
            maxResults: Number(maxResults) || 10,
            ...(pageToken && { pageToken }),
        })
        .then(v => v.data);
};

export default getVideos;
