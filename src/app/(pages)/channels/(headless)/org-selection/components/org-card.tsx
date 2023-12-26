import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Typography from '~/components/atom/typography';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Roles } from '~/lib/interfaces/user';
import { getUserData, setOrgCookie } from '~/lib/tools/cookies-handler';

interface OrgCardProps {
    name: string;
    description: string;
    orgId: string;
    role: Roles;
    plan?: string;
    validity?: string;
}

const OrgCard: React.FC<OrgCardProps> = async ({ name, description, orgId, role, plan, validity }) => {
    const cookieStore = cookies();
    const userData = getUserData({ jwt: cookieStore.get('Authorization')?.value });
    return (
        <form
            className="w-full md:w-fit"
            action={async () => {
                'use server';
                const res = setOrgCookie(orgId);
                if (res === 'OK') {
                    redirect(`/channels/${userData?.sub}`);
                }
            }}
        >
            <button className="h-full w-full flex-grow text-start md:w-fit">
                <Card className="h-full w-full flex-grow transition-colors duration-300 hover:bg-secondary/50 md:w-fit">
                    <CardHeader>
                        <Avatar className="mx-auto h-16 w-16">
                            <AvatarImage src="" />
                            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </CardHeader>
                    <CardContent>
                        <CardTitle>{name}</CardTitle>
                        <CardDescription>{description}</CardDescription>

                        <table className="mt-2">
                            <tbody>
                                <tr>
                                    <td className="pr-2">
                                        <Typography variant="muted">Role:</Typography>
                                    </td>
                                    <td>
                                        <Badge className="capitalize">{role.replaceAll('_', ' ')}</Badge>
                                    </td>
                                </tr>
                                {Boolean(plan) && (
                                    <tr>
                                        <td className="pr-2">
                                            <Typography variant="muted">Plan:</Typography>
                                        </td>
                                        <td>
                                            <Typography variant="small">{plan}</Typography>
                                        </td>
                                    </tr>
                                )}
                                {Boolean(validity) && (
                                    <tr>
                                        <td className="pr-2">
                                            <Typography variant="muted">Valid till:</Typography>
                                        </td>
                                        <td>
                                            <Typography variant="small">22 October, 2024</Typography>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </button>
        </form>
    );
};

export default OrgCard;
