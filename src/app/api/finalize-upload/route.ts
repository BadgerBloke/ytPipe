import { NextResponse } from 'next/server';
import httpStatus from 'http-status';

import { CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';

import { DIGITAL_OCEAN } from '~/lib/config';
import { PartsType } from '~/lib/tools/uploader';
import { s3Client } from '~/services/s3';

const POST = async (req: Request) => {
    const body: { uploadId: string; fileKey: string; parts: PartsType } = await req.json();
    try {
        if (!body.uploadId || !body.fileKey || !body.parts)
            return NextResponse.json({ message: httpStatus['400_NAME'] }, { status: httpStatus.BAD_REQUEST });

        const completeMultipartCmd = new CompleteMultipartUploadCommand({
            Bucket: DIGITAL_OCEAN.BUCKET,
            Key: body.fileKey,
            UploadId: body.uploadId,
            MultipartUpload: {
                Parts: body.parts.sort((a, b) => a.PartNumber - b.PartNumber),
            },
        });

        const multipartCompletionRes = await s3Client.send(completeMultipartCmd);
        return NextResponse.json(
            { message: httpStatus['201_NAME'], data: { location: multipartCompletionRes.Location } },
            { status: httpStatus.CREATED }
        );
    } catch (error) {
        return NextResponse.json({ message: httpStatus['500_NAME'], error }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
};

export { POST };
