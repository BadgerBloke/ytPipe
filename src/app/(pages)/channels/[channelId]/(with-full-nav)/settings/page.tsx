import { cookies } from 'next/headers';

import Typography from '~/components/atom/typography';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { getUserData } from '~/lib/tools/cookies-handler';

import CurrentUserInfoCard from './components/current-user-info';
import MemberForm from './components/form';
import MembersTable from './components/members-table';

const SettingsPage = () => {
    const cookieStore = cookies();
    const userData = getUserData({ jwt: cookieStore.get('Authorization')?.value });
    return (
        <div className="flex w-full flex-col gap-6">
            <div className="inline-flex items-center gap-4">
                <Typography variant="h3">MKSingh Settings</Typography>
                <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>MS</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex w-full gap-6">
                <MemberForm />
                <CurrentUserInfoCard userData={userData} />
            </div>
            <MembersTable />
        </div>
    );
};

export default SettingsPage;
