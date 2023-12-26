import { Fragment } from 'react';
import { cookies } from 'next/headers';

import Footer from '~/components/organisms/layout/footer';
import Header from '~/components/organisms/layout/header';
import { getUserData } from '~/lib/tools/cookies-handler';

const OnlyHeaderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const cookieStore = cookies();
    const userData = getUserData({ jwt: cookieStore.get('Authorization')?.value });
    return (
        <Fragment>
            <Header userData={userData} />
            <main className="flex flex-col items-center justify-between p-6 md:p-12 lg:p-24">{children}</main>
            <Footer />
        </Fragment>
    );
};

export default OnlyHeaderLayout;
