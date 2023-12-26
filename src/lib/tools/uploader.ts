import { PresignedUrl } from '~/services/s3';

type OptionsType = {
    file: File;
    getPresignedUrlEndpoint: string;
    completeUploadEndpoint: string;
    chunkSize?: number;
    threadsQuantity?: number;
};

export type PartsType = { PartNumber: number; ETag: string }[];

export class Uploader {
    chunkSize;
    threadsQuantity;
    getPresignedUrlEndpoint;
    completeUploadEndpoint;
    file: OptionsType['file'];
    aborted = false;
    uploadedSize = 0;
    progressCache: { [key: number]: number } = {};
    activeConnections: { [key: number]: XMLHttpRequest } = {};
    parts: PresignedUrl[] = [];
    uploadedParts: PartsType = [];
    uploadId: string | null = null;
    expiry = 0;
    fileKey: string | null = null;
    onProgressFn: ({ sent, total, percentage }: { sent: number; total: number; percentage: number }) => void = () => {};
    onCompleteFn: ({ location }: { location: string }) => void = () => {};
    onErrorFn: (error?: unknown) => void = () => {};

    fileNameCorrectorRegx = /[~`!@#$%^&*{}<>;?/+|"]/g;

    constructor(options: OptionsType) {
        // this must be bigger than or equal to 5MB,
        // otherwise AWS will respond with:
        // "Your proposed upload is smaller than the minimum allowed size"
        this.chunkSize = options?.chunkSize || 1024 * 1024 * 5;
        // number of parallel uploads
        this.threadsQuantity = Math.min(options.threadsQuantity || 5, 15);
        this.file = options.file;
        this.getPresignedUrlEndpoint = options.getPresignedUrlEndpoint;
        this.completeUploadEndpoint = options.completeUploadEndpoint;
    }

    // starting the multipart upload request
    start() {
        this.initialize();
    }

    async initialize() {
        try {
            // retrieving the pre-signed URLs
            const numberOfparts = Math.ceil(this.file.size / this.chunkSize);

            const AWSMultipartFileDataInput = {
                fileName: this.file.name.replaceAll(this.fileNameCorrectorRegx, ' '),
                parts: numberOfparts,
            };

            const urlsResponse = await fetch(this.getPresignedUrlEndpoint, {
                method: 'POST',
                body: JSON.stringify(AWSMultipartFileDataInput),
            }).then(r => r.json());

            const newParts = urlsResponse.data.signedUrls;
            this.fileKey = AWSMultipartFileDataInput.fileName;
            this.uploadId = urlsResponse.data.uploadId;
            this.expiry = urlsResponse.data.expiry;
            this.parts.push(...newParts);

            this.sendNext();
        } catch (error) {
            await this.complete(error);
        }
    }

    sendNext() {
        const activeConnections = Object.keys(this.activeConnections).length;

        if (activeConnections >= this.threadsQuantity) {
            return;
        }

        if (!this.parts.length) {
            if (!activeConnections) {
                this.complete();
            }

            return;
        }

        const part = this.parts.pop();
        if (this.file && part) {
            const sentSize = (part.partNumber - 1) * this.chunkSize;
            const chunk = this.file.slice(sentSize, sentSize + this.chunkSize);

            const sendChunkStarted = () => {
                this.sendNext();
            };

            this.sendChunk(chunk, part, sendChunkStarted)
                .then(() => {
                    this.sendNext();
                })
                .catch(error => {
                    this.parts.push(part);

                    this.complete(error);
                });
        }
    }

    // terminating the multipart upload request on success or failure
    async complete(error?: unknown) {
        if (error && !this.aborted) {
            this.onErrorFn(error);
            return;
        }

        if (error) {
            this.onErrorFn(error);
            return;
        }

        try {
            await this.sendCompleteRequest();
        } catch (error) {
            this.onErrorFn(error);
        }
    }

    // finalizing the multipart upload request on success by calling
    // the finalization API
    async sendCompleteRequest() {
        if (this.uploadId && this.fileKey) {
            const videoFinalizationMultiPartInput = {
                uploadId: this.uploadId, // todo
                fileKey: this.fileKey, // todo
                parts: this.uploadedParts,
            };

            const res = await fetch(this.completeUploadEndpoint, {
                method: 'POST',
                body: JSON.stringify(videoFinalizationMultiPartInput),
            }).then(r => r.json());

            this.onCompleteFn({ location: res.data.location });
        }
    }

    sendChunk(chunk: Blob, part: PresignedUrl, sendChunkStarted: () => void) {
        return new Promise((resolve, reject) => {
            this.upload(chunk, part, sendChunkStarted)
                .then(status => {
                    if (status !== 200) {
                        reject(new Error('Failed chunk upload'));
                        return;
                    }

                    resolve(status);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    // calculating the current progress of the multipart upload request
    handleProgress(part: number, event: Event) {
        if (this.file) {
            if (event.type === 'progress' || event.type === 'error' || event.type === 'abort') {
                console.log('handleProgress event: ', event);
                this.progressCache[part] = 5; // todo
            }

            if (event.type === 'uploaded') {
                this.uploadedSize += this.progressCache[part] || 0;
                delete this.progressCache[part];
            }

            const inProgress = Object.keys(this.progressCache)
                .map(Number)
                .reduce((memo, id) => (memo += this.progressCache[id]), 0);

            const sent = Math.min(this.uploadedSize + inProgress, this.file.size);

            const total = this.file.size;

            const percentage = Math.round((sent / total) * 100);

            this.onProgressFn({
                sent: sent,
                total: total,
                percentage: percentage,
            });
        }
    }

    // uploading a part through its pre-signed URL
    upload(file: Blob, part: PresignedUrl, sendChunkStarted: () => void) {
        // uploading each part with its pre-signed URL
        return new Promise((resolve, reject) => {
            if (this.uploadId && this.fileKey) {
                // - 1 because PartNumber is an index starting from 1 and not 0
                const xhr = (this.activeConnections[part.partNumber - 1] = new XMLHttpRequest());

                sendChunkStarted();

                const progressListener = this.handleProgress.bind(this, part.partNumber - 1);

                xhr.upload.addEventListener('progress', progressListener);

                xhr.addEventListener('error', progressListener);
                xhr.addEventListener('abort', progressListener);
                xhr.addEventListener('loaded', progressListener);

                xhr.open('PUT', part.signedUrl);

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        // retrieving the ETag parameter from the HTTP headers
                        const ETag = xhr.getResponseHeader('ETag');

                        if (ETag) {
                            const uploadedPart = {
                                PartNumber: part.partNumber,
                                // removing the " enclosing carachters from
                                // the raw ETag
                                ETag: ETag.replaceAll('"', ''),
                            };

                            this.uploadedParts.push(uploadedPart);

                            resolve(xhr.status);
                            delete this.activeConnections[part.partNumber - 1];
                        }
                    }
                };

                xhr.onerror = error => {
                    reject(error);
                    delete this.activeConnections[part.partNumber - 1];
                };

                xhr.onabort = () => {
                    reject(new Error('Upload canceled by user'));
                    delete this.activeConnections[part.partNumber - 1];
                };

                xhr.send(file);
            }
        });
    }

    onProgress(onProgress: ({ sent, total, percentage }: { sent: number; total: number; percentage: number }) => void) {
        this.onProgressFn = onProgress;
        return this;
    }

    onError(onError: (error?: unknown) => void) {
        this.onErrorFn = onError;
        return this;
    }

    onComplete(onComplete: ({ location }: { location: string }) => void) {
        this.onCompleteFn = onComplete;
        return this;
    }

    abort() {
        Object.keys(this.activeConnections)
            .map(Number)
            .forEach(id => {
                this.activeConnections[id].abort();
            });

        this.aborted = true;
    }
}
