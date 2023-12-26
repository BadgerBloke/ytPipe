'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Switch } from '~/components/ui/switch';
import { createQueryString, deleteQueryString } from '~/lib/tools/general';

const BillingCycleSwitch: React.FC<{
    billingCycle: string;
    code: string;
    currency: string;
    price: string;
    mrp: string;
    searchParams: { [key: string]: string | undefined };
}> = ({ code, searchParams: searchParamsObj }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    return (
        <Switch
            id={`billing-cycle-${code}`}
            checked={searchParamsObj[`${code}BillingCycle`] === 'yearly'}
            onCheckedChange={e =>
                router.push(
                    `${pathname}?${
                        e
                            ? createQueryString({ searchParams, name: `${code}BillingCycle`, value: 'yearly' })
                            : deleteQueryString({ searchParams, name: `${code}BillingCycle` })
                    }`
                )
            }
        />
    );
};

export default BillingCycleSwitch;
