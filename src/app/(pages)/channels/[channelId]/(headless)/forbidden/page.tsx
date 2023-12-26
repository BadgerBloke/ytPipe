const ForbiddenPage = ({ params }: { params: { channelId: string } }) => (
    <div>Channel {params.channelId}: Access Forbidden</div>
);

export default ForbiddenPage;
