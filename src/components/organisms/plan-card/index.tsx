import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import clsx from 'clsx';

import { Decimal } from '@prisma/client/runtime/library';
import { IconCurrencyDollar, IconCurrencyRupee } from '@tabler/icons-react';

import Typography from '~/components/atom/typography';
import { Button, buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';

import { handleOrderCreation } from './action';
import BillingCycleSwitch from './billing-cycle-switch';
import ListItem from './list-item';

interface PlanCardProps {
    channelId: string;
    planId: string;
    title: string;
    code: string;
    description: string;
    features: string;
    price: Decimal;
    mrp: Decimal;
    currency: string;
    billingCycle: string;
    searchParams: { [key: string]: string | undefined };
}

const PlanCard: React.FC<PlanCardProps> = async ({
    channelId,
    planId,
    title,
    code,
    description,
    features,
    price,
    mrp,
    currency,
    billingCycle,
    searchParams,
}) => {
    return (
        <Card
            className={cn(
                `w-full md:w-fit md:max-w-xs lg:h-full`,
                clsx({
                    'border-brand': code === 'pro',
                })
            )}
        >
            <CardHeader>
                <CardTitle className="capitalize">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6">
                    {Number(price) ? (
                        <div className="-mb-4 flex flex-col">
                            {Number(mrp) !== Number(price) ? (
                                <div className="inline-flex items-baseline gap-2">
                                    {currency === 'INR' ? (
                                        <IconCurrencyRupee className="-mr-2 h-4 w-4 place-self-center font-semibold text-muted-foreground" />
                                    ) : (
                                        <IconCurrencyDollar className="-mr-2 h-6 w-6 place-self-center font-semibold text-brand" />
                                    )}
                                    <Typography variant="muted" className="line-through decoration-brand/50 decoration-1">
                                        {String(mrp)}
                                    </Typography>
                                </div>
                            ) : null}
                            <div className="inline-flex items-baseline gap-2">
                                {currency === 'INR' ? (
                                    <IconCurrencyRupee className="-mr-2 h-6 w-6 place-self-center font-semibold text-brand" />
                                ) : (
                                    <IconCurrencyDollar className="-mr-2 h-6 w-6 place-self-center font-semibold text-brand" />
                                )}
                                <Typography variant="h3" className="text-brand">
                                    {String(price)}
                                </Typography>

                                <div className="flex items-center space-x-2">
                                    <Label htmlFor={`billing-cycle-${code}`} className="cursor-pointer">
                                        {searchParams[`${code}BillingCycle`] || billingCycle}
                                    </Label>
                                    <Suspense fallback={<div>This is fallback</div>}>
                                        <BillingCycleSwitch
                                            billingCycle={billingCycle}
                                            code={code}
                                            searchParams={searchParams}
                                            mrp={String(mrp)}
                                            currency={currency}
                                            price={String(price)}
                                        />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Typography variant="h3" className="text-brand">
                            Custom
                        </Typography>
                    )}

                    {code === 'biz' ? (
                        <a
                            target="_blank"
                            rel="noreferrer noopener"
                            href="https://cal.com/mksingh"
                            className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                        >
                            Schedule a call
                        </a>
                    ) : channelId === 'no-channel' ? (
                        <Link
                            href="/channels/undefined"
                            className={cn(
                                buttonVariants({ variant: code === 'pro' ? 'default' : 'outline' }),
                                'w-full',
                                clsx({ 'bg-brand': code === 'pro' })
                            )}
                        >
                            Get Started
                        </Link>
                    ) : (
                        <form
                            action={async () => {
                                'use server';
                                const res = await handleOrderCreation(planId, channelId);
                                if (res && res.url) {
                                    redirect(res.url);
                                }
                            }}
                        >
                            <Button
                                variant={code === 'pro' ? 'default' : 'outline'}
                                className={cn('w-full', clsx({ 'bg-brand': code === 'pro' }))}
                            >
                                Get Started
                            </Button>
                        </form>
                    )}

                    <div className="flex flex-col gap-3">
                        {features.split('\\n').map((line, index) => (
                            <ListItem key={index.toString()} title={line} />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PlanCard;
