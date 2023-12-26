import { Fragment } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Header from '~/components/organisms/layout/header';
import Navigation from '~/components/organisms/layout/navigation';
import { uuidRegex } from '~/lib/constants/regex';
import { getUserData } from '~/lib/tools/cookies-handler';
import prisma from '~/services/prisma';

import { haveValidPlan, isValidChannel } from '../lib/action';
const UserIdLayout: React.FC<{ children: React.ReactNode; params: { channelId: string } }> = async ({
    children,
    params,
}) => {
    const cookieStore = cookies();
    const userData = getUserData({ jwt: cookieStore.get('Authorization')?.value })!;

    if (
        !uuidRegex.test(params.channelId) ||
        !(await isValidChannel({ channelId: params.channelId, ssoUserId: userData.sub }))
    ) {
        const userToChannels = await prisma.usersToChannels.findMany({
            where: {
                ssoUserId: userData.sub,
                isActive: true,
            },
        });
        if (userToChannels.length === 1) {
            await haveValidPlan({ channelId: userToChannels[0].channelId });
            return redirect(`/channels/${userToChannels[0].channelId}`);
        } else if (userToChannels.length > 1) {
            return redirect('/channels/org-selection');
        } else {
            if (cookieStore.get('Provider')?.value === 'google') {
                const result = await Promise.all([
                    prisma.channel.create({
                        data: {
                            name: userData.name,
                        },
                    }),
                    prisma.user.create({
                        data: {
                            ssoUserId: userData.sub,
                            name: userData.name,
                            email: userData.email,
                            isActive: true,
                        },
                    }),
                ]);

                await prisma.usersToChannels.create({
                    data: {
                        userId: result[1].id,
                        ssoUserId: result[1].ssoUserId,
                        channelId: result[0].id,
                        roles: ['owner'],
                        isActive: true,
                    },
                });

                if (result[0] && result[1]) {
                    return redirect(
                        `/channels/${result[0].id}/subscription?message=Your channel has been created. Now select a plan to continue...&messageType=success`
                    );
                }
            } else {
                return redirect('/channels/onboarding');
            }
        }
    } else {
        await haveValidPlan({ channelId: params.channelId });
    }
    return (
        <Fragment>
            <Header
                className="sticky top-0 max-w-full bg-background/50 backdrop-blur-md sm:px-4"
                userData={userData}
                channelId={params.channelId}
            />
            <div className="flex w-full">
                <Navigation orgId={params.channelId}>{children}</Navigation>
            </div>
        </Fragment>
    );
};

export default UserIdLayout;
