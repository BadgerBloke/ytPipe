'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '~/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Uploader } from '~/lib/tools/uploader';

import { UploadVideoFormType, uploadVideoSchema } from '../schemas/upload-video';

import Audience from './audience';
import Playlists from './playlists';
import ThumbnailUploader from './thumbnail-uploader';
import VideoUploader from './video-uploader';

const UploadVideoForm = () => {
    const [thumbnails, setThumbnails] = useState<File[]>();
    const [videoFile, setVideoFile] = useState<File>();
    const [videoUrl, setVideoUrl] = useState<string>();

    const form = useForm<UploadVideoFormType>({
        resolver: zodResolver(uploadVideoSchema),
        defaultValues: {
            title: '',
            description: '',
            playlist: null,
            contentForKids: 'no',
            ageRestriction: 'no',
        },
    });

    function onSubmit(values: UploadVideoFormType) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }

    const handleThumbnailSelection = (images: File[]) => {
        setThumbnails(prev => {
            const updatedThumbnails = prev ? [...prev, ...images] : images;
            if (updatedThumbnails.length > 5) {
                return updatedThumbnails.slice(0, 5);
            } else {
                return updatedThumbnails;
            }
        });
        console.log('accepted images: ', images);
    };

    const handleVideoSelection = (video: File[]) => {
        console.log('video file: ', video);
        if (video) {
            setVideoFile(video[0]);
        }
    };

    const handleUpload = async () => {
        if (videoFile) {
            let percentage: number | undefined = undefined;
            const uploader = new Uploader({
                getPresignedUrlEndpoint: '/api/video',
                completeUploadEndpoint: '/api/finalize-upload',
                file: videoFile,
            });

            uploader
                .onProgress(({ sent, total, percentage: newPercentage }) => {
                    if (newPercentage !== percentage) {
                        percentage = newPercentage;
                        console.log(`${percentage}%`, sent, total);
                    }
                })
                .onError((error: unknown) => {
                    setVideoFile(undefined);
                    console.log('error on upload: ', error);
                })
                .onComplete(({ location }) => {
                    setVideoFile(undefined);
                    setVideoUrl(location);
                });
            uploader.start();
        }
    };

    const handleFileDownload = async (type: 'video' | 'image') => {
        if (type === 'video') {
            try {
                const res = await fetch(`/api/video?key=${videoUrl?.split('/').pop()}`).then(r => r.json());
                console.log('file url: ', res.location, res);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className="flex w-full flex-wrap-reverse gap-10 lg:flex-nowrap lg:gap-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-12 lg:w-2/3 lg:space-y-10">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title (required)</FormLabel>
                                <FormControl>
                                    <Input
                                        className="peer"
                                        placeholder="Add a title that describes your video (type @ to mention a channel)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="hidden w-full justify-end peer-focus-within:flex">
                                    {form.getValues('title').length}/100
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="peer h-auto min-h-[60px] resize-none"
                                        rows={7}
                                        placeholder="Tell viewers about your video (type @ to mention a channel)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="hidden w-full justify-end peer-focus-within:flex">
                                    {form.getValues('description').length}/5000
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ThumbnailUploader
                        key={uuid()}
                        thumbnails={thumbnails}
                        setThumbnails={setThumbnails}
                        handleThumbnailSelection={handleThumbnailSelection}
                    />
                    <FormField
                        control={form.control}
                        name="playlist"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Playlists
                                        value={field.value}
                                        onChange={val => field.onChange(val as UploadVideoFormType['playlist'])}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="contentForKids"
                        render={({ field }) => (
                            <FormField
                                control={form.control}
                                name="ageRestriction"
                                render={ageRestrictionField => (
                                    <Audience contentForKidsField={field} ageRestrictionField={ageRestrictionField.field} />
                                )}
                            />
                        )}
                    />
                    <Button type="button" onClick={handleUpload} className="mr-3">
                        Upload
                    </Button>
                    <Button type="button" onClick={() => handleFileDownload('video')} className="mr-3">
                        Download
                    </Button>
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
            <VideoUploader handleVideoSelection={handleVideoSelection} />
        </div>
    );
};

export default UploadVideoForm;
