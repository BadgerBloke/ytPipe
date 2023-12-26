import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { v4 as uuid } from 'uuid';

import { IconCheck, IconPhoto, IconPhotoCheck, IconPhotoOff, IconX } from '@tabler/icons-react';

import Tooltip from '~/components/atom/tooltip';
import Typography from '~/components/atom/typography';
import Dropzone, { DragAccept, DragIdeal, DragReject } from '~/components/molecules/dropzone';
import { Button, buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/utils';

interface ThumbnailUploaderProps {
    thumbnails?: File[];
    setThumbnails: Dispatch<SetStateAction<File[] | undefined>>;
    handleThumbnailSelection: (images: File[]) => void;
}

const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({ thumbnails, setThumbnails, handleThumbnailSelection }) => {
    const handleRemove = (index: number) => {
        setThumbnails(prev => {
            const temp = prev ? [...prev] : [];
            temp.splice(index, 1);
            return temp;
        });
    };
    return (
        <div className="flex flex-col gap-2">
            <Typography variant="small">Thumbnail</Typography>
            <Typography variant="muted">
                <span className="mr-2">
                    Select or upload a picture that shows what&apos;s in your video. A good thumbnail stands out and draws
                    viewers&apos; attention.
                </span>
                <a
                    href="https://support.google.com/youtube/answer/72431?hl=en"
                    rel="noreferrer noopener"
                    target="_blank"
                    className={cn(buttonVariants({ variant: 'link' }), 'h-fit p-0 text-brand')}
                >
                    Learn more
                </a>
            </Typography>
            <div className="flex flex-wrap items-center gap-y-2 md:gap-x-2 md:gap-y-3">
                <Tooltip message="You have reached max limit" hidden={Number(thumbnails?.length || 0) < 5}>
                    <div className="w-1/2 p-1 md:w-56 md:p-0">
                        <Dropzone
                            disabled={Number(thumbnails?.length) >= 5}
                            onChange={handleThumbnailSelection}
                            className="flex aspect-video h-fit w-full flex-col items-center justify-center gap-2 transition-colors duration-300 group-hover:text-muted-foreground md:w-56"
                            accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
                            maxFiles={5}
                            maxSize={2 * 10_48_576}
                        >
                            <DragIdeal>
                                <IconPhoto className="h-6 w-6" />
                                <Typography variant="small">Upload thumbnail</Typography>
                                <Typography variant="muted">max 2 mb</Typography>
                            </DragIdeal>
                            <DragAccept>
                                <IconPhotoCheck className="h-6 w-6" />
                                <Typography variant="small">Thumbnail accepted</Typography>
                            </DragAccept>
                            <DragReject>
                                <IconPhotoOff className="h-6 w-6" />
                                <Typography variant="small">Unsupported file</Typography>
                            </DragReject>
                        </Dropzone>
                    </div>
                </Tooltip>
                {thumbnails?.map((thumbnail, index) => (
                    <div className="group relative w-1/2 p-1 md:w-56 md:p-0" key={uuid()}>
                        <div className="relative flex aspect-video h-fit w-full md:w-56">
                            <Image
                                src={URL.createObjectURL(thumbnail)}
                                alt="thumbnail"
                                fill
                                className="rounded-md object-fill group-hover:backdrop-blur-md"
                            />
                        </div>
                        <div className="invisible absolute inset-0 flex items-center justify-center gap-3 rounded-md p-1 group-hover:visible group-hover:backdrop-blur-sm md:p-0">
                            <Tooltip message="Remove">
                                <Button type="button" variant="destructive" size="icon" onClick={() => handleRemove(index)}>
                                    <IconX className="h-4 w-4" />
                                </Button>
                            </Tooltip>
                            <Tooltip message="Upload">
                                <Button type="button" variant="secondary" size="icon">
                                    <IconCheck className="h-4 w-4" />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThumbnailUploader;
