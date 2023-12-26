import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter } from '~/components/ui/card';
import { cn } from '~/lib/utils';

const VideoUploadCard: React.FC<{ channelId: string }> = ({ channelId }) => (
    <Card className="w-fit">
        <CardContent className="mb-5 flex flex-col items-center p-6">
            <Image src="/images/upload_video.svg" height={150} width={150} alt="upload video" priority />
            <CardDescription className="text-center">
                Want to see metrics on your recent video?
                <br />
                Upload and publish a video to get started.
            </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Link
                className={cn(buttonVariants(), 'rounded-full bg-brand px-6 text-black')}
                href={`/channels/${channelId}/upload/video`}
            >
                Upload video
            </Link>
        </CardFooter>
    </Card>
);

export default VideoUploadCard;
