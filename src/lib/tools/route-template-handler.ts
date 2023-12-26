export const replaceRouteTemplate = (route: string, orgId: string) => {
    return route.replace('{{orgId}}', orgId);
};
