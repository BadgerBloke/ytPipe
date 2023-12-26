import Select from 'react-tailwindcss-select';
import { Option, SelectProps } from 'react-tailwindcss-select/dist/components/type';

import { cn } from '~/lib/utils';

import { buttonVariants } from '../ui/button';

const MultiSelect: React.FC<SelectProps> = props => (
    <Select
        placeholder="Select"
        isMultiple
        isSearchable
        isClearable
        classNames={{
            menuButton: (value?: { isDisabled?: boolean }) =>
                cn(
                    'flex rounded-md bg-transparent border border-muted cursor-pointer text-sm text-muted-foreground',
                    value?.isDisabled ? 'bg-muted text-muted-foreground' : ''
                ),
            menu: 'bg-tranparent border border-muted rounded-md mt-1 p-1 shadow-md',
            list: '-mx-[10px]',
            listItem: (value?: { isSelected?: boolean }) =>
                cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full justify-start px-2 cursor-pointer',
                    value?.isSelected ? buttonVariants({ variant: 'secondary' }) : ''
                ),
            searchContainer: 'px-0 relative mb-2',
            searchBox:
                'flex h-9 w-full rounded-md border border-border bg-transparent pl-8 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-muted',
            searchIcon: 'h-4 w-4 absolute my-auto inset-y-0 left-2',
            tagItem: (value?: { item?: Option; isDisabled?: boolean }) =>
                cn(buttonVariants({ variant: 'secondary' }), 'pl-2 pr-1 py-1 h-fit space-x-2', value?.item ? '' : ''),
            tagItemText: 'text-xs text-foreground',
            tagItemIconContainer: cn(
                buttonVariants({ variant: 'outline', size: 'icon' }),
                'h-6 w-6 flex items-center justify-center hover:bg-destructive'
            ),
            closeIcon: cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'h-6 w-6 p-1 flex items-center justify-center hover:bg-destructive'
            ),
        }}
        {...props}
    />
);

export default MultiSelect;
