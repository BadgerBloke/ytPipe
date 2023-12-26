import Typography from '~/components/atom/typography';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { UserData } from '~/lib/interfaces/user';

const CurrentUserInfoCard: React.FC<{ userData?: UserData }> = ({ userData }) => (
    <Card className="h-fit">
        <CardHeader>
            <CardTitle className="text-center">My Info</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex w-full flex-wrap-reverse justify-between gap-4 md:flex-nowrap">
                <table>
                    <tbody>
                        <tr>
                            <td className="pr-2">
                                <Typography variant="muted">Name:</Typography>
                            </td>
                            <td>
                                <Typography variant="small">{userData?.name}</Typography>
                            </td>
                        </tr>
                        <tr>
                            <td className="pr-2">
                                <Typography variant="muted">Email:</Typography>
                            </td>
                            <td>
                                <Typography variant="small">{userData?.email}</Typography>
                            </td>
                        </tr>
                        <tr>
                            <td className="pr-2">
                                <Typography variant="muted">Phone:</Typography>
                            </td>
                            <td>
                                <Typography variant="small">+91 1234567891</Typography>
                            </td>
                        </tr>
                        <tr>
                            <td className="pr-2">
                                <Typography variant="muted">Last login:</Typography>
                            </td>
                            <td>
                                <Typography variant="muted">06 January, 2023</Typography>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Avatar className="h-28 w-28">
                    <AvatarImage src="" />
                    <AvatarFallback>
                        {String(userData?.given_name.charAt(0)) + (userData?.family_name?.charAt(0) || '')}
                    </AvatarFallback>
                </Avatar>
            </div>
        </CardContent>
    </Card>
);

export default CurrentUserInfoCard;
