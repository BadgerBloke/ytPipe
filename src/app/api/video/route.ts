import { NextResponse } from 'next/server';
import httpStatus from 'http-status';

import { CreateMultipartUploadCommand, GetObjectCommand, UploadPartCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { DIGITAL_OCEAN } from '~/lib/config';
import { PresignedUrl, s3Client } from '~/services/s3';

const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);

    try {
        if (!searchParams.get('key'))
            return NextResponse.json({ message: httpStatus['400_NAME'] }, { status: httpStatus.BAD_REQUEST });

        const getObjectCmd = new GetObjectCommand({
            Bucket: DIGITAL_OCEAN.BUCKET,
            Key: String(searchParams.get('key')),
        });

        const signedUrl = await getSignedUrl(s3Client, getObjectCmd, {
            expiresIn: 60 * (Number(searchParams.get('urlValidity')) || 15),
        });
        return NextResponse.json({ message: httpStatus['200_NAME'], location: signedUrl }, { status: httpStatus.OK });
    } catch (error) {
        return NextResponse.json({ message: httpStatus['500_NAME'], error }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
};

const POST = async (req: Request) => {
    const body = await req.json();
    try {
        if (!body.fileName || !body.parts)
            return NextResponse.json({ message: httpStatus['400_NAME'] }, { status: httpStatus.BAD_REQUEST });

        const name = body.fileName;
        const parts = body.parts;
        const multipartCmd = new CreateMultipartUploadCommand({
            Bucket: DIGITAL_OCEAN.BUCKET,
            Key: name,
        });
        const multipartResponse = await s3Client.send(multipartCmd);

        const promises = [];
        for (let i = 0; i < parts; i++) {
            const uploadCmd = new UploadPartCommand({
                Bucket: DIGITAL_OCEAN.BUCKET,
                Key: name,
                PartNumber: i + 1,
                UploadId: multipartResponse.UploadId,
            });
            promises.push(
                getSignedUrl(s3Client, uploadCmd, {
                    expiresIn: 60 * 15 * parts,
                })
            );
        }

        const signedUrlsArr = await Promise.all(promises);
        const signedUrls: PresignedUrl[] = signedUrlsArr.map(signedUrl => {
            const searchParams = new URLSearchParams(signedUrl);
            return {
                signedUrl,
                partNumber: Number(searchParams.get('partNumber')),
            };
        });
        return NextResponse.json(
            {
                message: httpStatus['200_NAME'],
                data: { uploadId: multipartResponse.UploadId, expiry: 60 * 15 * parts, signedUrls },
            },
            { status: httpStatus.OK }
        );
    } catch (error) {
        console.log('Error: ', error);
        return NextResponse.json({ message: httpStatus['500_NAME'], error }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
};

export { GET, POST };
