import { IconVideoOff } from '@tabler/icons-react';
import { IconVideoPlus } from '@tabler/icons-react';
import { IconVideo } from '@tabler/icons-react';

import Tooltip from '~/components/atom/tooltip';
import Typography from '~/components/atom/typography';
import Dropzone, { DragAccept, DragIdeal, DragReject } from '~/components/molecules/dropzone';

interface VideoUploaderProps {
    handleVideoSelection: (video: File[]) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ handleVideoSelection }) => (
    <Tooltip message="You have reached max limit" hidden={true}>
        <div className="w-full lg:w-1/3">
            <Dropzone
                onChange={handleVideoSelection}
                className="flex aspect-video h-fit w-full flex-col items-center justify-center gap-2 transition-colors duration-300 group-hover:text-muted-foreground"
                accept={{ 'video/*': ['.avi', '.mp4', '.mpeg', '.ogv', '.ts', '.webm', '.3gp', '.3g2'] }}
                maxFiles={1}
                maxSize={25 * 1_024 * 10_48_576}
                multiple={false}
            >
                <DragIdeal>
                    <IconVideo className="h-10 w-10" />
                    <Typography variant="large">Upload video</Typography>
                    <Typography variant="muted" className="mx-2 mb-1 text-center">
                        Drag and drop the file here or click to select one.
                        <br />
                        Your video will be private untill you publish it.
                        <br />
                        max 25 gb
                    </Typography>
                </DragIdeal>
                <DragAccept>
                    <IconVideoPlus className="h-10 w-10" />
                    <Typography variant="large">Video accepted</Typography>
                </DragAccept>
                <DragReject>
                    <IconVideoOff className="h-10 w-10" />
                    <Typography variant="large">Unsupported file</Typography>
                </DragReject>
            </Dropzone>
        </div>
    </Tooltip>
);

export default VideoUploader;
