'use server';
import { redirect } from 'next/navigation';

import prisma from '~/services/prisma';

export const isValidChannel = async ({ channelId, ssoUserId }: { channelId: string; ssoUserId: string }) => {
    const userToChannels = await prisma.usersToChannels.findFirst({
        where: {
            channelId,
            ssoUserId,
            isActive: true,
        },
    });
    return Boolean(userToChannels);
};

export const haveValidPlan = async ({ channelId }: { channelId: string }) => {
    const channel = await prisma.channel.findFirst({
        where: {
            id: channelId,
            isActive: true,
        },
    });

    if (!channel?.planValidity) {
        return redirect(
            `/channels/${channelId}/subscription?message=Your channel does not have a valid plan!&messageType=error`
        );
    } else {
        if (new Date(channel.planValidity) < new Date()) {
            return redirect(`/channels/${channelId}/subscription?message=Your plan has been expired!&messageType=error`);
        } else if (channel.planPaymentStatus !== 'done') {
            return redirect(
                `/channels/${channelId}/subscription?message=Something went wrong with payment, please contact with support team!&messageType=error`
            );
        }
    }
};

export const isValidPlan = async ({ channelId }: { channelId: string }) => {
    const channel = await prisma.channel.findFirst({
        where: {
            id: channelId,
            isActive: true,
        },
    });

    if (!channel?.planValidity) {
        return false;
    } else {
        if (new Date(channel.planValidity) < new Date()) {
            return false;
        } else if (channel.planPaymentStatus !== 'done') {
            return false;
        } else {
            return true;
        }
    }
};
