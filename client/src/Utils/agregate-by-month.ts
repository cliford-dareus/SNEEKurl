import {CHART_DATA} from "./common";

export const clickByMonth = (d: any) => {
    if (!d || !d.clicks) return; // Ensure `d` and `d.clicks` exist

    const clicksByMonth = d.clicks.reduce((acc: any, item: any) => {
        const month = new Date(item.date).toLocaleString('en-US', {month: 'long'});
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const groupedData = Object.entries(clicksByMonth).map(([month, clicks]) => ({
        x: month,
        y: clicks,
    }));

    return CHART_DATA.reduce((acc, item) => {
        const match = groupedData.find((data) => data.x === item.x);
        if (match !== undefined) {
            acc.push({x: match.x, y: match.y as number})
        } else {
            acc.push(item)
        }
        return acc;
    }, [] as { x: string; y: number }[]);
};