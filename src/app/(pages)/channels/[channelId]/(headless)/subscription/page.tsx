import { Suspense } from 'react';

import { BillingCycle } from '@prisma/client';

import Toast from '~/components/atom/toast';
import Typography from '~/components/atom/typography';
import PlanCard from '~/components/organisms/plan-card';
import prisma from '~/services/prisma';

const SubscriptionPage = async ({
    params,
    searchParams,
}: {
    params: { channelId: string };
    searchParams: { [key: string]: string | undefined };
}) => {
    const plans = await prisma.plan.findMany({
        where: {
            isActive: true,
            OR: [
                {
                    AND: [
                        {
                            billingCycle: (searchParams['proBillingCycle'] as BillingCycle) || 'monthly',
                        },
                        {
                            code: 'pro',
                        },
                    ],
                },
                {
                    AND: [
                        {
                            billingCycle: (searchParams['basicBillingCycle'] as BillingCycle) || 'monthly',
                        },
                        {
                            code: 'basic',
                        },
                    ],
                },
                {
                    code: 'biz',
                },
            ],
        },
    });
    return (
        <div className="flex w-full flex-col items-center gap-10 lg:justify-center">
            <Suspense>
                <Toast />
            </Suspense>
            <Typography variant="h2">Choose your plan</Typography>
            <Typography variant="muted" className="-mt-8">
                to have fine grained admin control in your hand
            </Typography>
            {/* <Suspense> */}
            <div className="flex w-full flex-wrap items-center justify-center gap-5">
                {Boolean(plans.length) &&
                    plans.map(plan => (
                        <PlanCard
                            key={plan.id}
                            channelId={params.channelId}
                            searchParams={searchParams}
                            planId={plan.id}
                            title={plan.name}
                            code={plan.code}
                            description={plan.description}
                            features={plan.featuresDetail}
                            price={plan.price}
                            mrp={plan.mrp}
                            currency={plan.currency}
                            billingCycle={plan.billingCycle}
                        />
                    ))}
            </div>
            {/* </Suspense> */}
        </div>
    );
};

export default SubscriptionPage;
