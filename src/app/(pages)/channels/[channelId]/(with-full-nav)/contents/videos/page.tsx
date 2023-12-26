import Typography from '~/components/atom/typography';

import VideosTable from './components/table';
import getVideos from './utils/action';

const VideosContentPage = async ({ params }: { params: { channelId: string } }) => {
    const data = await getVideos({ pageToken: '' });
    return data.items?.length ? (
        <VideosTable data={data} channelId={params.channelId} />
    ) : (
        <Typography variant="muted">No videos found!</Typography>
    );
};

export default VideosContentPage;
