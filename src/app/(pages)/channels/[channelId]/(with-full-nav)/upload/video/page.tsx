import Typography from '~/components/atom/typography';
import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/utils';

import UploadVideoForm from './components/form';

const VideoUploadPage = () => (
    <div className="flex w-full flex-col gap-16 pb-2 lg:gap-12">
        <UploadVideoForm />
        <Typography variant="muted" className="max-w-2xl self-center text-center text-xs font-light">
            By submitting your videos to MKSingh, you acknowledge that you agree to YouTube&apos;s{' '}
            <a
                href="https://support.google.com/youtube/answer/9528076?hl=en"
                rel="noreferrer noopener"
                target="_blank"
                className={cn(buttonVariants({ variant: 'link' }), 'h-fit p-0 text-xs text-brand')}
            >
                Terms of Service
            </a>{' '}
            and{' '}
            <a
                href="https://support.google.com/youtube/answer/9528076?hl=en"
                rel="noreferrer noopener"
                target="_blank"
                className={cn(buttonVariants({ variant: 'link' }), 'h-fit p-0 text-xs text-brand')}
            >
                Community Guidelines
            </a>
            . Please be sure not to violate others&apos; copyright or privacy rights.{' '}
            <a
                href="https://support.google.com/youtube/answer/9528076?hl=en"
                rel="noreferrer noopener"
                target="_blank"
                className={cn(buttonVariants({ variant: 'link' }), 'h-fit p-0 text-xs text-brand')}
            >
                Learn more
            </a>
        </Typography>
    </div>
);

export default VideoUploadPage;
