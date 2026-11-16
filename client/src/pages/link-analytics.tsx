import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import { useParams } from "react-router-dom";
import { useGetLinkAnalyticsQuery } from "../app/services/urlapi";

const chartTheme = {
  text: { fill: "hsl(var(--muted-foreground))" },
  axis: {
    ticks: { text: { fill: "hsl(var(--muted-foreground))" } },
    domain: { line: { stroke: "hsl(var(--border))" } },
  },
  grid: { line: { stroke: "hsl(var(--border))" } },
  tooltip: {
    container: {
      background: "hsl(var(--card))",
      color: "hsl(var(--card-foreground))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      fontSize: 12,
    },
  },
};

const StatCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
      {value}
    </p>
    {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const BreakdownList = ({
  title,
  items,
  nameKey,
}: {
  title: string;
  items: any[] | undefined;
  nameKey: string;
}) => (
  <div className="rounded-lg border border-border bg-card p-5">
    <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
    <div className="space-y-2.5">
      {items && items.length > 0 ? (
        items.slice(0, 8).map((item, index) => (
          <div
            key={item[nameKey] ?? index}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="w-5 shrink-0 text-xs text-muted-foreground">
                {index + 1}
              </span>
              <span className="truncate text-foreground">{item[nameKey]}</span>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-medium text-foreground">{item.clicks}</span>
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({item.percentage}%)
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No data available
        </p>
      )}
    </div>
  </div>
);

const LinkAnalytics = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetLinkAnalyticsQuery(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  if (error || !data?.analytics) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-destructive">
          {(error as any)?.data?.message || "Failed to load analytics"}
        </p>
      </div>
    );
  }

  const { analytics } = data;
  const {
    link,
    period,
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    countryBreakdown,
    referrerBreakdown,
    hourlyPattern,
    uniqueVisitors,
    recentClicks,
  } = analytics;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Link Analytics
        </h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-primary">sneek.co/{link.short}</span>
          <span>→</span>
          <span className="max-w-md truncate">{link.longUrl}</span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Created {new Date(link.createdAt).toLocaleDateString()}
          {link.lastClick && (
            <span className="ml-3">
              Last click {new Date(link.lastClick).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total clicks" value={link.totalClicks} />
        <StatCard
          label="Period clicks"
          value={period.clicks}
          hint={`Last ${period.days} days`}
        />
        <StatCard
          label="Unique visitors"
          value={uniqueVisitors.total}
          hint={`${uniqueVisitors.percentage}% of clicks`}
        />
        <StatCard
          label="Mobile traffic"
          value={`${deviceBreakdown?.find((d: any) => d.id === "Mobile")?.percentage || 0}%`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Device distribution
          </h3>
          <div className="h-56">
            {deviceBreakdown?.some((d: any) => d.value > 0) ? (
              <ResponsivePie
                data={deviceBreakdown}
                margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
                innerRadius={0.55}
                padAngle={1}
                cornerRadius={3}
                colors={["hsl(238, 70%, 55%)", "hsl(250, 50%, 70%)"]}
                borderWidth={0}
                enableArcLinkLabels={false}
                arcLabelsSkipAngle={12}
                theme={chartTheme}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Clicks by hour
          </h3>
          <div className="h-56">
            {hourlyPattern?.some((h: any) => h.clicks > 0) ? (
              <ResponsiveLine
                data={[
                  {
                    id: "clicks",
                    data: hourlyPattern.map((h: any) => ({
                      x: h.hour,
                      y: h.clicks,
                    })),
                  },
                ]}
                margin={{ top: 16, right: 16, bottom: 40, left: 36 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: "auto", max: "auto" }}
                curve="monotoneX"
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 8,
                  tickRotation: -40,
                }}
                axisLeft={{
                  tickSize: 0,
                  tickPadding: 8,
                }}
                colors={["hsl(238, 70%, 55%)"]}
                pointSize={5}
                pointBorderWidth={0}
                enableGridX={false}
                theme={chartTheme}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BreakdownList
          title="Top browsers"
          items={browserBreakdown}
          nameKey="browser"
        />
        <BreakdownList
          title="Operating systems"
          items={osBreakdown}
          nameKey="os"
        />
        <BreakdownList
          title="Top countries"
          items={countryBreakdown}
          nameKey="country"
        />
        <BreakdownList
          title="Top referrers"
          items={referrerBreakdown}
          nameKey="referrer"
        />
      </div>

      {/* Recent Activity */}
      {recentClicks?.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Recent activity
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Time</th>
                  <th className="pb-2 pr-4 font-medium">Country</th>
                  <th className="pb-2 pr-4 font-medium">Device</th>
                  <th className="pb-2 pr-4 font-medium">Browser</th>
                  <th className="pb-2 pr-4 font-medium">OS</th>
                  <th className="pb-2 font-medium">Referrer</th>
                </tr>
              </thead>
              <tbody>
                {recentClicks.slice(0, 10).map((click: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="py-2.5 pr-4 text-muted-foreground">
                      {new Date(click.time).toLocaleString()}
                    </td>
                    <td className="py-2.5 pr-4">{click.country}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          click.isMobile
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {click.isMobile ? "Mobile" : "Desktop"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">{click.browser}</td>
                    <td className="py-2.5 pr-4">{click.os}</td>
                    <td className="max-w-[8rem] truncate py-2.5">
                      {click.referrer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {period.clicks === 0 && (
        <div className="rounded-lg border border-dashed border-border py-12 text-center">
          <h3 className="text-sm font-semibold text-foreground">
            No recent data
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            This link hasn't been clicked in the last {period.days} days.
          </p>
        </div>
      )}
    </div>
  );
};

export default LinkAnalytics;
