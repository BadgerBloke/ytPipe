import { SelectValue } from 'react-tailwindcss-select/dist/components/type';

import Typography from '~/components/atom/typography';
import MultiSelect from '~/components/molecules/multi-select';
import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/utils';

interface PlaylistsProps {
    options?: { [key: string]: string };
    value: SelectValue;
    onChange: (val: SelectValue) => void;
}

const Playlists: React.FC<PlaylistsProps> = ({ value, onChange }) => {
    const handlePlaylistChange = (val: SelectValue) => {
        onChange(val);
    };
    return (
        <div className="flex w-full flex-col gap-2">
            <Typography variant="small">Playlists</Typography>
            <Typography variant="muted">
                <span className="mr-2">Add your video to one or more playlists to organize your content for viewers.</span>
                <a
                    href="https://support.google.com/youtube/answer/57792"
                    rel="noreferrer noopener"
                    target="_blank"
                    className={cn(buttonVariants({ variant: 'link' }), 'h-fit p-0 text-brand')}
                >
                    Learn more
                </a>
            </Typography>
            <MultiSelect
                options={[
                    { label: 'React JS', value: 'reactjs' },
                    { label: 'Next JS', value: 'nextjs' },
                    { label: 'Rust', value: 'rust' },
                ]}
                primaryColor=""
                value={value}
                onChange={handlePlaylistChange}
            />
        </div>
    );
};

export default Playlists;
