import Link from 'next/link';

import {
    IconBrandDiscordFilled,
    IconBrandFacebookFilled,
    IconBrandInstagram,
    IconBrandTwitterFilled,
    IconBrandYoutubeFilled,
} from '@tabler/icons-react';

import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/utils';

const SocialIcons = () => (
    <div className="flex gap-4 grayscale">
        <LinkIcon href="#">
            <IconBrandYoutubeFilled className="h-5 w-5 text-red-500" />
        </LinkIcon>
        <LinkIcon href="#">
            <IconBrandDiscordFilled className="h-5 w-5 text-purple-500" />
        </LinkIcon>
        <LinkIcon href="#">
            <IconBrandTwitterFilled className="h-5 w-5 text-cyan-500" />
        </LinkIcon>
        <LinkIcon href="#">
            <IconBrandFacebookFilled className="h-5 w-5 text-blue-500" />
        </LinkIcon>
        <LinkIcon href="#">
            <IconBrandInstagram className="h-5 w-5 text-pink-500" />
        </LinkIcon>
    </div>
);

const LinkIcon: React.FC<{ children: React.ReactNode; href: string }> = ({ children, href }) => (
    <Link href={href} className={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}>
        {children}
    </Link>
);

export default SocialIcons;
