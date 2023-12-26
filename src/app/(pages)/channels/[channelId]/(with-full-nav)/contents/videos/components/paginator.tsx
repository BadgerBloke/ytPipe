import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { Button } from '~/components/ui/button';

import { PageNavigator } from '../utils/navigator';

interface PaginatorProps {
    nextPageToken?: string | null;
    channelId: string;
    navigator: PageNavigator;
    handlePageChange: () => void;
}

const Paginator: React.FC<PaginatorProps> = ({ nextPageToken, navigator, handlePageChange }) => (
    <div className="flex items-center justify-end gap-3">
        {navigator.currentPage?.prevPage ? (
            <Button
                variant="ghost"
                onClick={() => {
                    navigator.prev();
                    handlePageChange();
                }}
            >
                <IconChevronLeft size="1.2rem" className="mr-2" /> Previous
            </Button>
        ) : null}
        {nextPageToken ? (
            <Button
                variant="ghost"
                onClick={() => {
                    navigator.next(nextPageToken);
                    handlePageChange();
                }}
            >
                Next <IconChevronRight size="1.2rem" className="ml-2" />
            </Button>
        ) : null}
    </div>
);

Paginator.displayName = 'Paginator';

export default Paginator;
