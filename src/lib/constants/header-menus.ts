// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Icon, IconBrandYoutubeFilled, IconHelp, IconMenu, IconTags } from '@tabler/icons-react';

type MenuType = {
    href: string;
    text: string;
    icon: Icon;
    name?: string;
    path?: string;
    havePage: boolean;
};

export type HeaderMenuType = MenuType & {
    children?: Omit<MenuType, 'icon'>[];
};

const HEADER_MENUS: Array<HeaderMenuType> = [
    {
        href: '/channels/{{orgId}}',
        text: 'Channel',
        icon: IconBrandYoutubeFilled,
        havePage: true,
    },
    {
        href: '/pricing',
        text: 'Pricing',
        icon: IconTags,
        havePage: true,
    },
    // {
    //     href: '/', // Don't leave href as blank string otherwise accordion will not work.
    //     text: 'Help',
    //     icon: IconHelp,
    //     havePage: false,
    //     children: [
    //         {
    //             href: '/contact-us',
    //             text: 'Contact us',
    //             havePage: true,
    //         },
    //         {
    //             href: '/terms-of-service',
    //             text: 'Terms of Service',
    //             havePage: true,
    //         },
    //         {
    //             href: '/privacy-policy',
    //             text: 'Privacy Policy',
    //             havePage: true,
    //         },
    //     ],
    // },
    // {
    //     href: '/about',
    //     text: 'About',
    //     icon: IconMenu,
    // },
    // {
    //     href: '/pricing',
    //     text: 'Pricing',
    //     icon: IconMenu,
    // },
    // {
    //     href: '#2',
    //     text: 'Support',
    //     icon: IconMenu,
    //     children: [
    //         {
    //             href: '/faq',
    //             text: 'FAQ',
    //         },
    //         {
    //             href: '/demo',
    //             text: 'Book a demo',
    //         },
    //         {
    //             href: '/forums',
    //             text: 'Forums',
    //         },
    //     ],
    // },
];

export const headerMenu = (orgId?: string) => {
    return HEADER_MENUS.map(menu => {
        return { ...menu, href: menu.href.replace('{{orgId}}', String(orgId)) };
    });
};
