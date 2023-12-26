export const createQueryString = ({
    searchParams,
    name,
    value,
}: {
    searchParams: URLSearchParams;
    name: string;
    value: string;
}) => {
    const params = new URLSearchParams(searchParams);
    params.set(name, value);

    return params.toString();
};

export const deleteQueryString = ({ searchParams, name }: { searchParams: URLSearchParams; name: string }) => {
    const params = new URLSearchParams(searchParams);
    params.delete(name);

    return params.toString();
};
