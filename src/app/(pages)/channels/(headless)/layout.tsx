import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getUserData } from '~/lib/tools/cookies-handler';
import prisma from '~/services/prisma';

const HeadlessLayout = async ({ children }: { children: React.ReactNode }) => {
    const cookieStore = cookies();
    const userData = getUserData({ jwt: cookieStore.get('Authorization')?.value });

    const usersToChannels = await prisma.usersToChannels.findMany({
        where: {
            ssoUserId: userData?.sub,
        },
    });

    if (!usersToChannels.length && cookieStore.get('Provider')?.value === 'google') {
        return redirect(`/channels/channelId`);
    }
    return <div className="flex h-screen w-full p-4 md:px-6 md:py-8 xl:p-16">{children}</div>;
};

export default HeadlessLayout;
