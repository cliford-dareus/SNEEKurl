import React, { useState, useEffect } from "react";

const Report = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const queryReport = () => {
        // @ts-ignore
      window.gapi.client
        .request({
          path: "/v4/reports:batchGet",
          root: "https://analyticsreporting.googleapis.com/",
          method: "POST",
          body: {
            reportRequests: [
              {
                viewId: "YOUR_VIEW_ID",
                dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
                metrics: [{ expression: "ga:sessions" }],
              },
            ],
          },
        })
        .then((response: any) => setData(response.result.reports[0].data.rows));
    };

    //@ts-ignore
    if (window.gapi.client) {
      queryReport();
    }
  }, []);

  return <div>{JSON.stringify(data)}</div>;
};

export default Report;
