export const MAIN_SITE = {
    baseUrl: String(process.env.NEXT_PUBLIC_HOST_URL),
    authBaseUrl: String(process.env.NEXT_PUBLIC_AUTH_BASE_URL),
    domain: String(process.env.NEXT_PUBLIC_DOMAIN),
};

export const IAM = {
    baseUrl: String(process.env.IAM_BASE_URL),
    realm: String(process.env.IAM_REALM),
};

export const DIGITAL_OCEAN = {
    ACCESS_KEY: String(process.env.SPACES_ACCESS_KEY),
    SECRET_KEY: String(process.env.SPACES_SECRET_KEY),
    ENDPOINT: String(process.env.SPACES_ORIGIN_ENDPOINT),
    BUCKET: String(process.env.SPACES_BUCKET),
    REGION: String(process.env.SPACES_REGION),
};

export const REDIS = {
    url: String(process.env.REDIS_URL),
    token: String(process.env.REDIS_BEARER_TOKEN),
    host: String(process.env.REDIS_HOST),
};
