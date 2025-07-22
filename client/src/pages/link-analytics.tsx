import React, { useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { useParams } from "react-router-dom";
import { useGetLinkAnalyticsQuery } from "../app/services/urlapi";
import { useAppSelector } from "../app/hook";
import { selectCurrentUser } from "../features/auth/authslice";

const LinkAnalytics = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetLinkAnalyticsQuery(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (error || !data?.analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-error">
          {error?.data?.message || "Failed to load analytics"}
        </div>
      </div>
    );
  }

  const { analytics } = data;
  const { link, period, clicksByDay, deviceBreakdown, browserBreakdown, osBreakdown, countryBreakdown, referrerBreakdown, hourlyPattern, uniqueVisitors, recentClicks } = analytics;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-base-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Link Analytics</h1>
        <div className="flex items-center gap-4 text-sm text-base-content">
          <span className="font-medium">sneek.co/{link.short}</span>
          <span>→</span>
          <span className="truncate max-w-md">{link.longUrl}</span>
        </div>
        <div className="mt-2 text-sm text-base-content/70">
          Created: {new Date(link.createdAt).toLocaleDateString()}
          {link.lastClick && (
            <span className="ml-4">
              Last click: {new Date(link.lastClick).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-base-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-base-content mb-2">Total Clicks</h3>
          <p className="text-3xl font-bold text-primary">{link.totalClicks}</p>
        </div>

        <div className="bg-base-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-base-content mb-2">Period Clicks</h3>
          <p className="text-3xl font-bold text-secondary">{period.clicks}</p>
          <p className="text-xs text-base-content/70">Last {period.days} days</p>
        </div>

        <div className="bg-base-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-base-content mb-2">Unique Visitors</h3>
          <p className="text-3xl font-bold text-accent">{uniqueVisitors.total}</p>
          <p className="text-xs text-base-content/70">{uniqueVisitors.percentage}% of clicks</p>
        </div>

        <div className="bg-base-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-base-content mb-2">Mobile Traffic</h3>
          <p className="text-3xl font-bold text-info">
            {deviceBreakdown.find(d => d.id === 'Mobile')?.percentage || 0}%
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Clicks Chart */}
        <div className="bg-base-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Clicks Over Time</h3>
          <div className="h-64">
            {/* {clicksByDay?.length > 0 ? (
              <ResponsiveBar
                data={clicksByDay}
                keys={['clicks']}
                indexBy="date"
                margin={{ top: 20, right: 20, bottom: 50, left: 40 }}
                padding={0.3}
                colors={['#6366f1']}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                }}
                enableLabel={false}
                theme={{
                  text: { fill: 'oklch(var(--bc))' },
                  axis: { ticks: { text: { fill: 'oklch(var(--bc))' } } }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-base-content">
                No data available
              </div>
            )} */}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-base-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Device Distribution</h3>
          <div className="h-64">
            {deviceBreakdown?.some(d => d.value > 0) ? (
              <ResponsivePie
                data={deviceBreakdown}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={['#6366f1', '#8b5cf6']}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableArcLinkLabels={false}
                arcLabelsSkipAngle={10}
                theme={{
                  text: { fill: 'oklch(var(--bc))' }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-base-content">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Browser Breakdown */}
        <div className="bg-base-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Top Browsers</h3>
          <div className="space-y-3">
            {browserBreakdown?.length > 0 ? (
              browserBreakdown?.map(({ browser, clicks, percentage }, index) => (
                <div key={browser} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-base-content">
                      #{index + 1}
                    </span>
                    <span>{browser}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-primary">{clicks}</span>
                    <span className="text-xs text-base-content/70 ml-2">({percentage}%)</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-base-content">No data available</div>
            )}
          </div>
        </div>

        {/* Operating Systems */}
        <div className="bg-base-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Operating Systems</h3>
          <div className="space-y-3">
            {osBreakdown?.length > 0 ? (
              osBreakdown?.map(({ os, clicks, percentage }, index) => (
                <div key={os} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-base-content">
                      #{index + 1}
                    </span>
                    <span>{os}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-primary">{clicks}</span>
                    <span className="text-xs text-base-content/70 ml-2">({percentage}%)</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-base-content">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Hourly Pattern */}
      <div className="bg-base-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Click Pattern by Hour</h3>
        <div className="h-64">
          {hourlyPattern?.some(h => h.clicks > 0) ? (
            <ResponsiveLine
              data={[{
                id: "clicks",
                data: hourlyPattern.map(h => ({ x: h.hour, y: h.clicks }))
              }]}
              margin={{ top: 20, right: 20, bottom: 50, left: 40 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
              curve="cardinal"
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
              }}
              colors={['#6366f1']}
              pointSize={6}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              enableGridX={false}
              theme={{
                text: { fill: 'oklch(var(--bc))' },
                axis: { ticks: { text: { fill: 'oklch(var(--bc))' } } }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-base-content">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Countries and Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Countries */}
        <div className="bg-base-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Top Countries</h3>
          <div className="space-y-3">
            {countryBreakdown?.length > 0 ? (
              countryBreakdown?.slice(0, 8).map(({ country, clicks, percentage }, index) => (
                <div key={country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-base-content">
                      #{index + 1}
                    </span>
                    <span>{country}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-primary">{clicks}</span>
                    <span className="text-xs text-base-content/70 ml-2">({percentage}%)</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-base-content">No data available</div>
            )}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-base-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Top Referrers</h3>
          <div className="space-y-3">
            {referrerBreakdown?.length > 0 ? (
              referrerBreakdown?.slice(0, 8).map(({ referrer, clicks, percentage }, index) => (
                <div key={referrer} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-base-content">
                      #{index + 1}
                    </span>
                    <span className="truncate max-w-32">{referrer}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-primary">{clicks}</span>
                    <span className="text-xs text-base-content/70 ml-2">({percentage}%)</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-base-content">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentClicks?.length > 0 && (
        <div className="bg-base-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Country</th>
                  <th>Device</th>
                  <th>Browser</th>
                  <th>OS</th>
                  <th>Referrer</th>
                </tr>
              </thead>
              <tbody>
                {/* {recentClicks?.slice(0, 10)?.map((click, index) => (
                  <tr key={index}>
                    <td className="text-sm">
                      {new Date(click.time).toLocaleString()}
                    </td>
                    <td>{click.country}</td>
                    <td>
                      <span className={`badge ${click.isMobile ? 'badge-secondary' : 'badge-primary'}`}>
                        {click.isMobile ? 'Mobile' : 'Desktop'}
                      </span>
                    </td>
                    <td>{click.browser}</td>
                    <td>{click.os}</td>
                    <td className="truncate max-w-32">{click.referrer}</td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data State */}
      {period.clicks === 0 && (
        <div className="bg-base-200 rounded-lg p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No Recent Analytics Data</h3>
          <p className="text-base-content">
            This link hasn't been clicked in the last {period.days} days. Share it to start collecting analytics!
          </p>
        </div>
      )}
    </div>
  );
};

export default LinkAnalytics;
