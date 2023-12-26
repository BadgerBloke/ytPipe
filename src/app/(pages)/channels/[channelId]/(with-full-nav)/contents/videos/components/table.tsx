'use client';

/* eslint-disable camelcase */
import { useState } from 'react';
import Image from 'next/image';
import { youtube_v3 } from 'googleapis';

import Typography from '~/components/atom/typography';
import Loader from '~/components/organisms/loading';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table';

import getVideos from '../utils/action';
import { PageNavigator } from '../utils/navigator';

import Paginator from './paginator';

interface VideosTableProps {
    data: youtube_v3.Schema$SearchListResponse;
    channelId: string;
}
const navigator = new PageNavigator('');

const VideosTable: React.FC<VideosTableProps> = ({ data, channelId }) => {
    const [videos, setVideos] = useState(data);
    const [loading, setLoading] = useState(false);

    const handlePageChange = async () => {
        setLoading(true);
        const videosData = await getVideos({ pageToken: navigator.currentPage?.token });
        if (videosData) {
            setVideos(videosData);
        }
        //  else if (res.status === 401 || res.status === 403) {
        //     // setVideos(null);
        //     setAuthStatus(false);
        //     notifications.show({
        //         title: 'Google Auth Failure',
        //         message: json.message,
        //         icon: <IconX size="1rem" />,
        //         color: 'red',
        //     });
        //     redirect(`/auth/logout?callback=${pathname}`);
        // } else {
        //     // setVideos(null);
        //     setError(json.message);
        // }
        setLoading(false);
    };

    return loading ? (
        <Loader />
    ) : (
        <Table>
            <TableCaption>A list of your YouTube videos.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]"></TableHead>
                    <TableHead className="w-[100px]">Title</TableHead>
                    <TableHead>Published at</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {videos.items?.map(video => (
                    <TableRow key={video.id?.videoId}>
                        <TableCell>
                            <Image
                                src={String(video.snippet?.thumbnails?.medium?.url)}
                                height={
                                    video.snippet?.thumbnails?.default?.height
                                        ? video.snippet?.thumbnails?.default?.height - 20
                                        : 100
                                }
                                width={Number(video.snippet?.thumbnails?.default?.width)}
                                alt={String(video.snippet?.title)}
                                priority
                                className="rounded-sm"
                            />
                        </TableCell>
                        <TableCell className="font-medium">
                            <a
                                href={`https://www.youtube.com/watch?v=${video.id?.videoId}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="flex flex-col gap-1"
                            >
                                <Typography variant="p" className="line-clamp-1">
                                    {video.snippet?.title}
                                </Typography>
                                <Typography variant="muted" className="line-clamp-2">
                                    {video.snippet?.description}
                                </Typography>
                            </a>
                        </TableCell>
                        <TableCell>
                            <Typography variant="small">{video.snippet?.publishedAt}</Typography>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3} className="px-7 text-right">
                        Total videos: {videos.pageInfo?.totalResults}
                    </TableCell>
                    {/* <TableCell className="text-right"></TableCell> */}
                </TableRow>
                <TableRow>
                    <TableCell colSpan={3} className="text-right">
                        <Paginator
                            nextPageToken={videos.nextPageToken}
                            navigator={navigator}
                            channelId={channelId}
                            handlePageChange={handlePageChange}
                        />
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
};

export default VideosTable;
