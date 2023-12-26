import React from 'react';
import DropzonePrimitive, { DropzoneProps, DropzoneRootProps } from 'react-dropzone';

import { cn } from '~/lib/utils';

export const DragIdeal: React.FC<{ children: React.ReactNode }> = ({ children }) => children;
export const DragAccept: React.FC<{ children: React.ReactNode }> = ({ children }) => children;
export const DragReject: React.FC<{ children: React.ReactNode }> = ({ children }) => children;
type AllowedChildren =
    | React.ReactElement<typeof DragIdeal>
    | React.ReactElement<typeof DragAccept>
    | React.ReactElement<typeof DragReject>;

interface DropzoneExtendedProps extends Omit<DropzoneProps, 'children'> {
    children: AllowedChildren | AllowedChildren[];
    className?: string;
    inputClassName?: string;
    onChange: (val: File[]) => void;
}

interface DropzoneRootExtendedProps extends DropzoneRootProps {
    className?: string;
}

const DropzoneRoot: React.FC<DropzoneRootExtendedProps> = ({ children, className, ...props }) => (
    <div
        className={cn(
            'group flex cursor-pointer items-center justify-center rounded-md border border-dashed border-muted-foreground bg-muted transition-colors duration-300 hover:border-muted-foreground/75 hover:bg-muted/50 disabled:cursor-not-allowed disabled:border-muted-foreground/75 disabled:bg-muted/50',
            className
        )}
        {...props}
    >
        {children}
    </div>
);

const Dropzone: React.FC<DropzoneExtendedProps> = ({ children, onChange, className, inputClassName, ...props }) => {
    const filteredChildren = React.Children.toArray(children).filter((child): child is AllowedChildren => {
        return (
            React.isValidElement(child) &&
            (child.type === DragIdeal || child.type === DragAccept || child.type === DragReject)
        );
    });

    if (React.Children.count(children) !== React.Children.count(filteredChildren)) {
        throw new Error('Invalid child component passed to Dropzone');
    }

    return (
        <DropzonePrimitive onDrop={onChange} {...props}>
            {({ getRootProps, getInputProps, isDragAccept, isDragReject }) => (
                <>
                    <DropzoneRoot
                        {...getRootProps()}
                        className={cn(
                            props.disabled ? 'cursor-not-allowed border-muted-foreground/75 bg-muted/50' : 'bg-transparent',
                            className
                        )}
                    >
                        <div
                            className={cn(
                                isDragAccept ? 'bg-success/75' : isDragReject ? 'bg-destructive/75' : 'bg-muted',
                                '-z-10 flex h-full w-full flex-col items-center justify-center gap-2'
                            )}
                        >
                            <input {...getInputProps()} className={cn('peer', inputClassName)} />
                            {isDragAccept && filteredChildren.find(child => child.type === DragAccept)}
                            {isDragReject && filteredChildren.find(child => child.type === DragReject)}
                            {!isDragAccept && !isDragReject && filteredChildren.find(child => child.type === DragIdeal)}
                        </div>
                    </DropzoneRoot>
                </>
            )}
        </DropzonePrimitive>
    );
};

export default Dropzone;
