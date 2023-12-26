'use client';

import Typography from '~/components/atom/typography';
import { Button } from '~/components/ui/button';

const ErrorPage = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
    return (
        <div className="m-auto flex w-full max-w-lg flex-col items-center gap-3">
            <h2>Something went wrong!</h2>
            <Typography variant="muted" className="text-center">
                {error.message.replace(/(<a[^>]+>)(quota)(<\/a>)/g, '$2')}
            </Typography>
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </Button>
        </div>
    );
};

export default ErrorPage;
