import Typography from '~/components/atom/typography';
import { Roles } from '~/lib/interfaces/user';

import OrgCard from './components/org-card';

const OrgSelectionPage = () => {
    const userOrgs: {
        name: string;
        description: string;
        orgId: string;
        role: Roles;
        plan?: string;
        validity?: string;
    }[] = [
        {
            name: 'MKSingh',
            description: 'The ultimate automator',
            orgId: 'flkd-3490-lfkd-345',
            role: 'content_editor',
            plan: 'Basic',
            validity: '10 March, 2023',
        },
        {
            name: 'indicFinTech',
            description: 'one stop fintech solution',
            orgId: 'flkd-3490-lfkd-343',
            role: 'owner',
            plan: 'Professional',
            validity: '10 March, 2024',
        },
        {
            name: 'Rust SEA',
            description: 'The ultimate rust ecosystem',
            orgId: 'flkd-3490-lfkd-342',
            role: 'manager',
            plan: 'Business',
            validity: '10 March, 2025',
        },
        {
            name: 'MKSingh 2',
            description: 'The ultimate automator',
            orgId: 'flkd-3490-lfkd-43f45',
            role: 'reviewer',
            plan: 'Basic',
            validity: '10 March, 2023',
        },
        {
            name: 'indicFinTech 2',
            description: 'one stop fintech solution',
            orgId: 'flkd-3490-lfkfdad-343',
            role: 'video_editor',
            plan: 'Professional',
            validity: '10 March, 2024',
        },
        {
            name: 'Rust SEA 2',
            description: 'The ultimate rust ecosystem',
            orgId: 'flkd-3490fas-lfkd-342',
            role: 'manager',
            plan: 'Business',
            validity: '10 March, 2025',
        },
    ];

    const advanceViewingRole: Roles[] = ['owner', 'manager'];
    return (
        <div className="m-auto flex flex-col items-center gap-10">
            <Typography variant="h2">Click on channel card with which you want to proceed</Typography>
            <Typography variant="large" className="-mt-8 text-muted-foreground">
                Your account is associated with multiple Channels
            </Typography>
            <div className="flex flex-wrap gap-x-4 gap-y-6">
                {userOrgs.map(org => (
                    <OrgCard
                        key={org.orgId}
                        orgId={org.orgId}
                        name={org.name}
                        description={org.description}
                        role={org.role}
                        plan={advanceViewingRole.includes(org.role) ? org.plan : undefined}
                        validity={advanceViewingRole.includes(org.role) ? org.validity : undefined}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrgSelectionPage;
