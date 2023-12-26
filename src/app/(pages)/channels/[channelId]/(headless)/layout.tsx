import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { uuidRegex } from '~/lib/constants/regex';
import { getUserData } from '~/lib/tools/cookies-handler';

import { isValidChannel, isValidPlan } from '../lib/action';

const HeadlessLayout = async ({ children, params }: { children: React.ReactNode; params: { channelId: string } }) => {
    const cookieStore = cookies();
    const userData = getUserData({ jwt: cookieStore.get('Authorization')?.value })!;

    if (!uuidRegex.test(params.channelId)) {
        return redirect(`/channels/${params.channelId}`);
    } else if (await isValidChannel({ channelId: params.channelId, ssoUserId: userData.sub })) {
        if (await isValidPlan({ channelId: params.channelId })) {
            return redirect(`/channels/${params.channelId}`);
        }
    } else {
        if (cookieStore.get('Provider')?.value === 'google') {
            return redirect(`/channels/${params.channelId}`);
        }
        return redirect(`/channels/onboarding`);
    }

    return <div className="flex h-screen w-full p-4 md:px-6 md:py-8 xl:p-16">{children}</div>;
};

export default HeadlessLayout;
