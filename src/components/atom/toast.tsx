'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { useToast } from '~/components/ui/use-toast';

type Variant = 'destructive' | 'success' | 'default';

const toastVariant: { [key: string]: Variant } = {
    error: 'destructive',
    success: 'success',
    info: 'default',
};

const Toast = () => {
    const { toast } = useToast();
    const searchParams = useSearchParams();

    useEffect(() => {
        const showToast = () => {
            toast({
                description: searchParams.get('message'),
                variant: toastVariant[searchParams.get('messageType') || 'info'],
                ...(searchParams.get('title') && { title: searchParams.get('title') || 'No title' }),
            });
            // ...(action && { action: <ToastAction altText="Try again">Try again</ToastAction> }),
        };
        if (searchParams.get('message')) {
            showToast();
        }
    }, [searchParams, toast]);

    return <></>;
};

export default Toast;
