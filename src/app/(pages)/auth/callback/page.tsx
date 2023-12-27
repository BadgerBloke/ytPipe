'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import Loader from '~/components/organisms/loading';

const CallbackPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const handleIntrospection = async () => {
        const res = await fetch('/auth/callback/server', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                accessToken: searchParams.get('accessToken'),
            }),
        });

        const data = await res.json();
        if (res.status === 200) {
            router.replace(`${searchParams.get('callback') || '/'}`);
        } else {
            toast.error('Something went wrong!', {
                description: data.message,
            });
        }
    };
    useEffect(() => {
        handleIntrospection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <Loader message="Please wait, processing your request..." />;
};

export default CallbackPage;
