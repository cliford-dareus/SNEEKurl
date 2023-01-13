export const getSiteUrl = (site: string | undefined): string => {
    const splitSite = site?.split('https://')[1];
    const sufix = splitSite?.split('').indexOf('/');
    const domain = splitSite?.split('').slice(0, sufix).join('');
    return domain!;
};


