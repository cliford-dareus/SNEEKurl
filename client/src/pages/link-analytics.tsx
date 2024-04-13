import React from "react";
import { useParams } from "react-router-dom";
import { useGetUrlQuery, useGetUrlsQuery } from "../app/services/urlapi";
import { LuBaby } from "react-icons/lu";
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

  //  @ts-ignore
  const byDate = data?.metadata.reduce((acc, item) => {
    const date = new Date(item.time);
    const monthYearKey = `${date.getMonth()}/${date.getFullYear()}`;
    acc[monthYearKey] = acc[monthYearKey] || [];
    acc[monthYearKey].push(item);
    return acc;
  }, {});


  if (isLoading) return <LuBaby />;

  const labels: { id: number; date: string; clicks: number }[] = [];
  const monthMap = new Map<string, number>();

  for (const item of data?.metadata || []) {
    const date = new Date(item.time);
    const monthYearKey = `${date.getMonth()}/${date.getFullYear()}`;
    const count = monthMap.get(monthYearKey) || 0;
    monthMap.set(monthYearKey, count + 1);
  }``

  let i = 0;
  for (const [key, value] of monthMap.entries()) {
    const [monthIndex, year] = key.split("/").map(Number);
    const month = MONTHS[monthIndex];
    labels.push({ id: i++, date: month, clicks: value });
  }

  return (
    <div>
      <div className="">LinkAnalytics</div>
      <div className="w-full h-[50vh]">
        {!isLoading && (
          <ResponsiveBar
            data={labels}
            indexBy={"date"}
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

      <div className="w-full h-[50vh] flex">
        <div className="h-full">
            {/* <ResponsiveRadialBar /> */}
        </div>
      </div>
    </div>
  );
};

export default LinkAnalytics;
