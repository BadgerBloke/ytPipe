import VideoUploadCard from './components/video-upload-card';

const YtPipePage = async ({ params }: { params: { channelId: string } }) => {
    return <VideoUploadCard channelId={params.channelId} />;
};

export default YtPipePage;
