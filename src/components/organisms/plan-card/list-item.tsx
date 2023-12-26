import { CheckIcon } from '@radix-ui/react-icons';

import Typography from '~/components/atom/typography';

const ListItem = ({ title }: { children?: React.ReactNode; title: string }) => (
    <div className="inline-flex gap-2">
        <CheckIcon className="h-3 w-3 shrink-0 rounded-full bg-brand text-black" />
        <Typography variant="muted" className="leading-[14px]">
            {title}
        </Typography>
    </div>
);

export default ListItem;
