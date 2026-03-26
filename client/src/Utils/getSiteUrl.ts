export const getSiteUrl = (site: string | undefined): string => {
    const splitSite = site?.split('https://')[1];
    const sufix = splitSite?.split('').indexOf('/');
    const domain = splitSite?.split('').slice(0, sufix).join('');
    return domain!;
};

export const getWebsiteName =(url: string) => {
    try {
        const parsedUrl = new URL(url);

        // Get the hostname (e.g., "www.example.com")
        let hostname = parsedUrl.hostname;

        // Remove "www." if it exists
        hostname = hostname.replace(/^www\./i, '');

        hostname = hostname.split(".")[0]

        // Return the main domain (e.g., "example.com")
        return hostname;

    } catch (e) {
        console.error("Invalid URL:", e);
        return null;
    }
};


