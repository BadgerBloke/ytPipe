'use server';

import { cookies } from 'next/headers';

import { MAIN_SITE } from '~/lib/config';
import { getUserData } from '~/lib/tools/cookies-handler';
import prisma from '~/services/prisma';
import { stripe } from '~/services/stripe';

export const handleOrderCreation = async (planId: string, channelId: string) => {
    const cookieStore = cookies();
    const userData = getUserData({ jwt: cookieStore.get('Authorization')?.value });
    const plan = await prisma.plan.findFirst({
        where: {
            id: planId,
        },
    });
    const usersToChannel = await prisma.usersToChannels.findFirst({
        where: {
            AND: [{ channelId }, { ssoUserId: userData?.sub }],
        },
    });
    if (plan && usersToChannel) {
        const order = await prisma.order.create({
            data: {
                totalAmount: plan.price,
                planId,
                currency: 'INR',
                validFrom: new Date(),
                validTo: calculateValidTo(plan.billingCycle),
                createdById: usersToChannel.id,
                updatedById: usersToChannel.id,
            },
        });

        if (order) {
            return await initiatePayment(order.id, plan.stripePriceId, channelId, planId);
        }
    }
};

export const initiatePayment = async (orderId: string, stripePriceId: string, channelId: string, planId: string) => {
    await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            status: 'payment_initiated',
        },
    });
    const session = await stripe.checkout.sessions.create({
        customer_email: 'customer@example.com',
        line_items: [
            {
                price: stripePriceId,
                quantity: 1,
            },
        ],
        metadata: {
            orderId,
            channelId,
            planId,
        },
        // payment_method_types: ['card'],
        mode: 'subscription',
        success_url: `${MAIN_SITE.baseUrl}/payment/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${MAIN_SITE.baseUrl}/payment/success?canceled=true&session_id={CHECKOUT_SESSION_ID}`,
    });
    return session;
};

const calculateValidTo = (billingCycle: string) => {
    const currentDate = new Date();

    if (billingCycle === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
    }

    return currentDate;
};
