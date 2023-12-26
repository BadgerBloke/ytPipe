import { S3Client } from '@aws-sdk/client-s3';

import { DIGITAL_OCEAN } from '~/lib/config';

export type PresignedUrl = {
    signedUrl: string;
    partNumber: number;
};

export const s3Client = new S3Client({
    forcePathStyle: false,
    endpoint: DIGITAL_OCEAN.ENDPOINT,
    region: DIGITAL_OCEAN.REGION,
    credentials: {
        accessKeyId: DIGITAL_OCEAN.ACCESS_KEY,
        secretAccessKey: DIGITAL_OCEAN.SECRET_KEY,
    },
});
