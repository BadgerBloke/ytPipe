import { HeartFilledIcon } from '@radix-ui/react-icons';

import Typography from '~/components/atom/typography';

import SocialIcons from './social-icons';

const Footer = () => (
    <footer className="mx-auto mt-auto flex max-w-[1344px] flex-col gap-4 p-5 text-center sm:px-10 lg:gap-6">
        <div className="flex max-w-md flex-col items-center gap-4">
            <Typography variant="large">ytPipe</Typography>
            <Typography variant="muted">
                We are a company dedicated to automate the manual repetitive business processes and enhance your efficiency.
            </Typography>
            <SocialIcons />
        </div>
        <Typography variant="muted" className="inline-flex text-[10px]">
            ©2023-24 All Rights Reserved. This site is developed and maintained with{' '}
            <HeartFilledIcon className="mx-1 h-4 w-4 text-brand" /> by
            <a href="https://www.mksingh.in" target="_blank" rel="noreferrer" className="ml-1 text-brand">
                MKSingh
            </a>
        </Typography>
    </footer>
);

export default Footer;
