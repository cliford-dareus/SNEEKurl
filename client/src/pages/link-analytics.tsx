import React from "react";
import { useParams } from "react-router-dom";
import { useGetUrlQuery, useGetUrlsQuery } from "../app/services/urlapi";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveRadialBar } from "@nivo/radial-bar";

type Props = {};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const LinkAnalytics = (props: Props) => {
  const { id } = useParams();
  const { data, isLoading } = useGetUrlQuery(id);

  const labels: {
    id: number;
    date: string;
    clicks: number;
    mobileClicks: number;
    desktopClicks: number;
  }[] = [];

  const devicesData: { id: string; data: { x: string; y: number }[] }[] = [];

  if (!isLoading && data?.short.metadata) {
    const monthMap = new Map<
      string,
      { clicks: number; mobileClicks: number; desktopClicks: number }
    >();

    for (const item of data.short.metadata) {
      const date = new Date(item.time);
      const monthYearKey = `${date.getMonth()}/${date.getFullYear()}`;
      const entry = monthMap.get(monthYearKey) || {
        clicks: 0,
        mobileClicks: 0,
        desktopClicks: 0,
      };
      entry[item.isMobile ? "mobileClicks" : "desktopClicks"]++;
      entry.clicks++;
      monthMap.set(monthYearKey, entry);
    }

    labels.length = 0;
    for (const [key, value] of monthMap) {
      const [monthIndex, year] = key.split("/").map(Number);
      labels.push({
        id: labels.length,
        date: MONTHS[monthIndex],
        clicks: value.clicks,
        mobileClicks: value.mobileClicks,
        desktopClicks: value.desktopClicks,
      });
    }

    devicesData.length = 0;
    const deviceMap = { mobile: 0, desktop: 0 };
    for (const item of data.short.metadata) {
      deviceMap[item.isMobile ? "mobile" : "desktop"]++;
    }
    devicesData.push({
      id: "mobile",
      data: [{ x: "clicks", y: deviceMap.mobile }],
    });
    devicesData.push({
      id: "desktop",
      data: [{ x: "clicks", y: deviceMap.desktop }],
    });
  }

  return (
    <div>
      <div className="">LinkAnalytics</div>
      <div className="w-full h-[50vh]">
        {!isLoading && (
          <ResponsiveBar
            data={labels}
            indexBy={"date"}
            colors={["#6366f1", "#eed312"]}
            keys={["clicks"]}
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            defs={[
              {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "#38bcb2",
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "#eed312",
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "date",
              legendPosition: "middle",
              legendOffset: 32,
              truncateTickAt: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "clicks",
              legendPosition: "middle",
              legendOffset: -40,
              truncateTickAt: 0,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
          />
        )}
      </div>
      <div className="mt-4">
        {" "}
        <h2 className="text-2xl my-4">Devices</h2>
        <div className="w-full flex">
          <div className="w-full h-[30vh]">
            {!isLoading && (
              <ResponsiveRadialBar
                data={devicesData}
                colors={["#6366f1"]}
                padding={0.4}
                cornerRadius={2}
                margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
                radialAxisStart={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                circularAxisOuter={{
                  tickSize: 5,
                  tickPadding: 12,
                  tickRotation: 0,
                }}
              />
            )}{" "}
          </div>{" "}
          <div className="w-[30%]">
            <ul>
              {new Array(12).fill(0).map((_, i) => (
                <li key={i}>{MONTHS[i]}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkAnalytics;
