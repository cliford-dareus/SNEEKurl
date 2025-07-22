import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Short from "../models/short";
import Click from "../models/clicks";

const getLinkAnalytics = async (req: any, res: Response) => {
  try {
    const { short: shortCode } = req.params;
    const { period = '7d' } = req.query; // 7d, 30d, 90d, 1y

    // Find the short URL with optimized query
    const shortUrl = await Short.findOne({ short: shortCode }).lean();

    if (!shortUrl) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Link not found"
      });
    }

    // Check access permissions
    if (req.userType === "authenticated") {
      if (!shortUrl.user || shortUrl.user.toString() !== req.user._id.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "Access denied"
        });
      }
    } else if (req.userType === "guest") {
      if (!shortUrl.guest || shortUrl.guest !== req.guest.client_id) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "Access denied"
        });
      }
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Authentication required"
      });
    }

    // Get period-specific data
    const periodDays = getPeriodDays(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Filter metadata by period
    const periodMetadata = (shortUrl.metadata || []).filter(
      item => new Date(item.time) >= startDate
    );

    // Calculate analytics
    const analytics = {
      link: {
        short: shortUrl.short,
        longUrl: shortUrl.longUrl,
        createdAt: shortUrl.createdAt,
        totalClicks: shortUrl.totalClicks || 0,
        lastClick: shortUrl.lastClick
      },
      period: {
        name: period,
        days: periodDays,
        clicks: periodMetadata.length
      },
      clicksByDay: getClicksByDay(periodMetadata, periodDays),
      deviceBreakdown: getDeviceBreakdown(periodMetadata),
      browserBreakdown: getBrowserBreakdown(periodMetadata),
      osBreakdown: getOSBreakdown(periodMetadata),
      countryBreakdown: getCountryBreakdown(periodMetadata),
      referrerBreakdown: getReferrerBreakdown(periodMetadata),
      hourlyPattern: getHourlyPattern(periodMetadata),
      uniqueVisitors: getUniqueVisitors(periodMetadata),
      recentClicks: getRecentClicks(periodMetadata)
    };

    res.status(StatusCodes.OK).json({ analytics });

  } catch (error) {
    console.error("Analytics error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch analytics"
    });
  }
};

const getUserAnalytics = async (req: any, res: Response) => {
  try {
    const user = req.user;
    const { period = '30d' } = req.query;

    const periodDays = getPeriodDays(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Use aggregation for better performance
    const [linkStats, clickStats] = await Promise.all([
      Short.aggregate([
        { $match: { user: user._id } },
        {
          $group: {
            _id: null,
            totalLinks: { $sum: 1 },
            totalClicks: { $sum: "$totalClicks" },
            avgClicksPerLink: { $avg: "$totalClicks" }
          }
        }
      ]),
      Click.aggregate([
        {
          $match: {
            user: user._id,
            date: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" }
            },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ])
    ]);

    // Get top performing links
    const topLinks = await Short.find({ user: user._id })
      .select('short longUrl totalClicks createdAt lastClick')
      .sort({ totalClicks: -1 })
      .limit(10)
      .lean();

    const stats = linkStats[0] || { totalLinks: 0, totalClicks: 0, avgClicksPerLink: 0 };

    const analytics = {
      overview: {
        totalLinks: stats.totalLinks,
        totalClicks: stats.totalClicks,
        averageClicksPerLink: Math.round(stats.avgClicksPerLink || 0),
        period: { name: period, days: periodDays }
      },
      topLinks: topLinks.map(link => ({
        short: link.short,
        longUrl: link.longUrl,
        clicks: link.totalClicks || 0,
        createdAt: link.createdAt,
        lastClick: link.lastClick
      })),
      clicksOverTime: formatClicksOverTime(clickStats, periodDays)
    };

    res.status(StatusCodes.OK).json({ analytics });

  } catch (error) {
    console.error("User analytics error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch user analytics"
    });
  }
};

// Enhanced helper functions
const getPeriodDays = (period: string): number => {
  switch (period) {
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    case '1y': return 365;
    default: return 7;
  }
};

const getClicksByDay = (metadata: any[], days: number) => {
  const dayMap = new Map();
  const now = new Date();

  // Initialize all days in period
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    dayMap.set(key, 0);
  }

  // Count clicks per day
  metadata.forEach(item => {
    const date = new Date(item.time).toISOString().split('T')[0];
    if (dayMap.has(date)) {
      dayMap.set(date, dayMap.get(date) + 1);
    }
  });

  return Array.from(dayMap.entries()).map(([date, clicks]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    clicks,
    fullDate: date
  }));
};

const getDeviceBreakdown = (metadata: any[]) => {
  const devices = { mobile: 0, desktop: 0 };
  metadata.forEach(item => {
    devices[item.isMobile ? 'mobile' : 'desktop']++;
  });

  const total = metadata.length;
  return [
    {
      id: 'Mobile',
      value: devices.mobile,
      percentage: total > 0 ? Math.round((devices.mobile / total) * 100) : 0
    },
    {
      id: 'Desktop',
      value: devices.desktop,
      percentage: total > 0 ? Math.round((devices.desktop / total) * 100) : 0
    }
  ];
};

const getBrowserBreakdown = (metadata: any[]) => {
  const browsers = new Map();
  metadata.forEach(item => {
    const browser = item.browser || 'Unknown';
    browsers.set(browser, (browsers.get(browser) || 0) + 1);
  });

  return Array.from(browsers.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([browser, clicks]) => ({
      browser,
      clicks,
      percentage: metadata.length > 0 ? Math.round((clicks / metadata.length) * 100) : 0
    }));
};

const getOSBreakdown = (metadata: any[]) => {
  const systems = new Map();
  metadata.forEach(item => {
    const os = item.os || 'Unknown';
    systems.set(os, (systems.get(os) || 0) + 1);
  });

  return Array.from(systems.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([os, clicks]) => ({
      os,
      clicks,
      percentage: metadata.length > 0 ? Math.round((clicks / metadata.length) * 100) : 0
    }));
};

const getCountryBreakdown = (metadata: any[]) => {
  const countries = new Map();
  metadata.forEach(item => {
    const country = item.country || 'Unknown';
    countries.set(country, (countries.get(country) || 0) + 1);
  });

  return Array.from(countries.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([country, clicks]) => ({
      country,
      clicks,
      percentage: metadata.length > 0 ? Math.round((clicks / metadata.length) * 100) : 0
    }));
};

const getReferrerBreakdown = (metadata: any[]) => {
  const referrers = new Map();
  metadata.forEach(item => {
    const referrer = item.referrerDomain || 'Direct';
    referrers.set(referrer, (referrers.get(referrer) || 0) + 1);
  });

  return Array.from(referrers.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([referrer, clicks]) => ({
      referrer,
      clicks,
      percentage: metadata.length > 0 ? Math.round((clicks / metadata.length) * 100) : 0
    }));
};

const getHourlyPattern = (metadata: any[]) => {
  const hours = new Array(24).fill(0);
  metadata.forEach(item => {
    const hour = new Date(item.time).getHours();
    hours[hour]++;
  });

  return hours.map((clicks, hour) => ({
    hour: `${hour}:00`,
    clicks
  }));
};

const getUniqueVisitors = (metadata: any[]) => {
  const uniqueSessions = new Set();
  metadata.forEach(item => {
    if (item.sessionId) {
      uniqueSessions.add(item.sessionId);
    }
  });

  return {
    total: uniqueSessions.size,
    percentage: metadata.length > 0 ? Math.round((uniqueSessions.size / metadata.length) * 100) : 0
  };
};

const getRecentClicks = (metadata: any[]) => {
  return metadata
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 20)
    .map(item => ({
      time: item.time,
      country: item.country || 'Unknown',
      isMobile: item.isMobile,
      browser: item.browser || 'Unknown',
      os: item.os || 'Unknown',
      referrer: item.referrerDomain || 'Direct'
    }));
};

const formatClicksOverTime = (clickStats: any[], days: number) => {
  const dayMap = new Map();
  const now = new Date();

  // Initialize all days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    dayMap.set(key, 0);
  }

  // Fill with actual data
  clickStats.forEach(stat => {
    if (dayMap.has(stat._id)) {
      dayMap.set(stat._id, stat.clicks);
    }
  });

  return Array.from(dayMap.entries()).map(([date, clicks]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    clicks
  }));
};

export { getLinkAnalytics, getUserAnalytics };
