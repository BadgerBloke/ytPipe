import Link from 'next/link';

import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/utils';

const NotFoundPage = () => {
    return (
        <div className="m-auto flex flex-col items-center gap-2">
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href="/" className={cn(buttonVariants(), 'mt-4')}>
                Return Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
