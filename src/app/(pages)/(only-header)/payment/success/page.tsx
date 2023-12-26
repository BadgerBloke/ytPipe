import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { COOKIES } from '~/lib/constants/cookies-name';
import { getUserData } from '~/lib/tools/cookies-handler';
import prisma from '~/services/prisma';
import { stripe } from '~/services/stripe';

const PaymentSuccessPage = async ({ searchParams }: { searchParams: Record<string, string> | undefined }) => {
    const cookieStore = cookies();
    const userData = getUserData({ jwt: cookieStore.get('Authorization')?.value })!;

    if (searchParams?.session_id) {
        const session = await stripe.checkout.sessions.retrieve(
            String(searchParams?.session_id || JSON.parse(decodeURIComponent(String(cookieStore.get(COOKIES.TEMP)?.value))))
        );
        const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
        const validTo = new Date(subscription.current_period_end * 1000);
        if (session.status === 'complete' && session.amount_total && session.metadata?.orderId) {
            try {
                const usersToChannels = userData
                    ? await prisma.usersToChannels.findFirst({
                          where: {
                              channelId: session.metadata?.channelId,
                              ssoUserId: userData.sub,
                              isActive: true,
                          },
                      })
                    : null;
                const order = await prisma.order.update({
                    where: {
                        id: session.metadata.orderId,
                        totalAmount: Number(session.amount_total / 100),
                        isActive: true,
                        status: {
                            not: 'payment_done',
                        },
                    },
                    data: {
                        status: 'payment_done',
                        validFrom: new Date(subscription.current_period_start * 1000),
                        validTo,
                        ...(usersToChannels && { updatedById: usersToChannels.id }),
                    },
                });
                if (order) {
                    console.log('UsersToChannel and Order 😡😡', usersToChannels, order);
                    await Promise.all([
                        prisma.payment.create({
                            data: {
                                amount: Number(session.amount_total / 100),
                                currency: session.currency === 'inr' ? 'INR' : 'USD',
                                status: session.payment_status === 'paid' ? 'done' : 'pending',
                                isActive: true,
                                checkoutSessionId: session.id,
                                subscriptionId: String(session.subscription),
                                invoiceId: String(session.invoice),
                                customerId: String(session.customer),
                                orderId: String(session.metadata?.orderId),
                                createdById: usersToChannels ? usersToChannels.id : order.updatedById,
                                updatedById: usersToChannels ? usersToChannels.id : order.updatedById,
                            },
                        }),
                        prisma.channel.update({
                            where: {
                                id: session.metadata?.channelId,
                                isActive: true,
                            },
                            data: {
                                planId: session.metadata?.planId,
                                planPaymentStatus: session.payment_status === 'paid' ? 'done' : 'pending',
                                activeOrderId: session.metadata?.orderId,
                                planValidity: validTo,
                                updatedById: usersToChannels ? usersToChannels.id : order.updatedById,
                            },
                        }),
                    ]);

                    return (
                        <div>
                            Payment Success Page
                            <pre>{JSON.stringify(searchParams, undefined, 2)}</pre>
                            <pre>{JSON.stringify(session, undefined, 2)}</pre>
                            <pre>{JSON.stringify(subscription, undefined, 2)}</pre>
                        </div>
                    );
                } else {
                    throw new Error('Duplicate request!');
                }
            } catch (err) {
                console.log('catch block 😡', err);
                return (
                    <div>
                        Error Success Page
                        <pre>{JSON.stringify(searchParams, undefined, 2)}</pre>
                        <pre>{JSON.stringify(session, undefined, 2)}</pre>
                        <pre>{JSON.stringify(subscription, undefined, 2)}</pre>
                    </div>
                );
                // notFound();
            }
        } else {
            console.log('1st else block 😡');
            notFound();
        }
    } else {
        console.log('else block 😡');
        notFound();
    }
};

export default PaymentSuccessPage;
