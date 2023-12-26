import { Suspense } from 'react';
import { cookies } from 'next/headers';

import { BillingCycle } from '@prisma/client';

import Toast from '~/components/atom/toast';
import Typography from '~/components/atom/typography';
import PlanCard from '~/components/organisms/plan-card';
import { getUserData } from '~/lib/tools/cookies-handler';
import prisma from '~/services/prisma';

const YTPipePricingPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const cookieStore = cookies();
    const userData = getUserData({ jwt: cookieStore.get('Authorization')?.value });
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
            <Typography variant="h2">Our ytPipe Pricing</Typography>
            <Typography variant="muted" className="-mt-8">
                {userData
                    ? 'for changing your plan just goto your ytPipe settings'
                    : 'first create your ytPipe account to buy a plan'}
            </Typography>
            <div className="flex w-full flex-wrap items-center justify-center gap-5">
                {Boolean(plans.length) &&
                    plans.map(plan => (
                        <PlanCard
                            key={plan.id}
                            channelId="no-channel"
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
        </div>
    );
};

export default YTPipePricingPage;
