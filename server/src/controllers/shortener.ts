import {Request, Response} from "express";
import geoip from "geoip-lite";
import {StatusCodes} from "http-status-codes";

import Short from "../models/short";
import User from "../models/user";
import jwt from "jsonwebtoken";
import Page from "../models/page";
import Click from "../models/clicks";

const create = async (req: any, res: Response) => {
    try {
        const { longUrl, backhalf } = req.body;

        if (!longUrl) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                message: "Enter a long URL"
            });
        }

        let short;

        if (req.userType === "authenticated") {
            // Authenticated user logic
            const user = req.user;
            const isUrlExist = await Short.findOne({ longUrl, user: user._id });

            if (isUrlExist) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    short: isUrlExist,
                    message: "URL already exists"
                });
            }

            short = backhalf
                ? await Short.create({ longUrl, short: backhalf, user: user._id })
                : await Short.create({ longUrl, user: user._id });

            // Include limit info in response
            const response = {
                short,
                limits: req.linkLimits || null
            };

            return res.status(StatusCodes.OK).json(response);

        } else if (req.userType === "guest") {
            // Guest user logic with limitations
            const guest = req.guest;

            // Check guest limits (handled by middleware, but double-check)
            const guestUrls = await Short.countDocuments({ guest: guest.client_id });
            if (guestUrls >= 5) { // Guest limit
                return res.status(StatusCodes.PAYMENT_REQUIRED).json({
                    message: "Guest limit reached. Please sign up for more links.",
                    current: guestUrls,
                    limit: 5,
                    upgradeRequired: true
                });
            }

            short = await Short.create({
                longUrl,
                expired_in: new Date(Date.now() + 30 * 60 * 1000), // 30 min expiry
                guest: guest.client_id,
            });

            return res.status(StatusCodes.OK).json({
                short,
                limits: {
                    current: guestUrls + 1,
                    limit: 5,
                    remaining: 4 - guestUrls
                }
            });
        }

        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Invalid user type"
        });

    } catch (error) {
        console.error("Link creation error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Internal Server Error"
        });
    }
};

const getUrl = async (req: any, res: Response) => {
    const short = req.params.short;
    const url = await Short.findOne({short});

    if (!url) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: "Link does not exist"});
    }

    res.status(StatusCodes.OK).json({short: url, message: "Link found"});
};

const getUrls = async (req: any, res: Response) => {
    const {page, skip, sort, clicks, limit, search} = req.query;

    if (req.userType === "guest") {
        const guest = req.guest;
        const urls = await Short.find({guest: guest.client_id});
        return res.status(StatusCodes.OK).json({urls});
    }

    const user = await User.findOne({_id: req.user._id});

    if (!user) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({message: "Something went wrong ... "});
    }

    const clickOptions = {
        most_click: "desc",
        less_click: "asc",
    };
    // @ts-ignore
    const clickOption = clicks ? clickOptions[clicks] : "";

    try {
        if (search) {
            const regex_search = {$regex: search, $options: "i"};
            const urls = await Short.find({
                user: user._id,
                longUrl: regex_search,
            });
            return res.status(StatusCodes.OK).json({urls});
        }

        const urls = await Short.find({user: user._id})
            .limit(limit)
            .sort({
                createdAt: sort,
                clicks: clickOption,
            })
            .exec();

        res.status(StatusCodes.OK).json({urls});
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST)
            .json({message: "Something went wrong!"});
    }
};

const editUrl = async (req: Request, res: Response) => {
    const {id, longUrl, shortUrl, isShareable} = req.body;
    // Encode the password in db and verify it here
    const password = req.body.password ?? undefined;

    const url = await Short.findById(id);
    if (!url) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({message: "Link does not exist"});
    }

    const update = {
        $set: {longUrl, shortUrl, isShareable},
        $unset: password ? undefined : {password: ""},
    };

    try {
        await Short.findByIdAndUpdate(id, update);
        const message = password
            ? "Link updated"
            : "Link updated (password removed)";
        res.status(StatusCodes.OK).send({message});
    } catch {
        res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: "Link could not be updated"});
    }
};

const visitUrl = async (req: Request, res: Response) => {
    const shortUrl = req.params.short;
    const providedPassword = req.query.password;

    const url = await Short.findOne({short: shortUrl});

    if (!url) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    // Enhanced metadata collection
    const userAgent = req.headers["user-agent"] || "";
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    // Better IP extraction
    const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(',')[0]?.trim() ||
                     req.headers["x-real-ip"] as string ||
                     req.socket.remoteAddress ||
                     req.connection.remoteAddress ||
                     "unknown";

    const geo = geoip.lookup(ipAddress);

    // Enhanced referrer processing
    let referrer = req.headers.referer || "";
    let referrerDomain = "Direct";
    if (referrer) {
        try {
            const url = new URL(referrer);
            referrerDomain = url.hostname;
        } catch {
            referrerDomain = "Unknown";
        }
    }

    const metadata = {
        time: new Date(),
        ipAddress: ipAddress !== "unknown" ? ipAddress : undefined,
        userAgent,
        referer: referrer || undefined,
        referrerDomain,
        country: geo?.country || "Unknown",
        region: geo?.region || undefined,
        city: geo?.city || undefined,
        timezone: geo?.timezone || undefined,
        isMobile,
        browser: extractBrowser(userAgent),
        os: extractOS(userAgent),
        sessionId: generateSessionId(req)
    };

    try {
        if (url.password && !providedPassword) {
            return res.status(StatusCodes.FORBIDDEN)
                .send(`Link is protected by password`);
        } else if (url.password && providedPassword) {
            const isCorrectPassword = providedPassword === url.password;

            if (isCorrectPassword) {
                // Update metadata and create click record atomically
                await Promise.all([
                    Short.updateOne(
                        {_id: url._id},
                        {
                            $push: {metadata},
                            $inc: {totalClicks: 1},
                            $set: {lastClick: new Date()}
                        }
                    ),
                    Click.create({
                        user: url.user,
                        guest: url.guest,
                        link: url._id,
                        date: new Date(),
                        metadata: {
                            country: metadata.country,
                            isMobile: metadata.isMobile,
                            referrerDomain: metadata.referrerDomain,
                            browser: metadata.browser,
                            os: metadata.os
                        }
                    })
                ]);
                return res.redirect(url.longUrl);
            }
        } else {
            // Update metadata and create click record atomically
            await Promise.all([
                Short.updateOne(
                    {_id: url._id},
                    {
                        $push: {metadata},
                        $inc: {totalClicks: 1},
                        $set: {lastClick: new Date()}
                    }
                ),
                Click.create({
                    user: url.user,
                    guest: url.guest,
                    link: url._id,
                    date: new Date(),
                    metadata: {
                        country: metadata.country,
                        isMobile: metadata.isMobile,
                        referrerDomain: metadata.referrerDomain,
                        browser: metadata.browser,
                        os: metadata.os
                    }
                })
            ]);

            return res.redirect(url.longUrl);
        }
    } catch (error) {
        console.error("Visit tracking error:", error);
        // Still redirect even if tracking fails
        return res.redirect(url.longUrl);
    }
};

const deleteUrl = async (req: Request, res: Response) => {
    const {short} = req.params;

    try {
        const deletedShort = await Short.findOneAndDelete({short});

    //Check if it was in a page and update the page
    const page = await Page.find({ user: deletedShort?.user }).populate(
      "links",
    );

    page.forEach(async (pag) => {
      const filter = pag.links.filter((x) => {
        console.log(x, deletedShort?._id);
        return x.link !== deletedShort?._id;
      });
      console.log("FILTER", filter);
      await Page.findOneAndUpdate({ _id: pag._id }, { links: filter });
    });

    res.status(StatusCodes.OK).send({ message: "Short deleted!" });
  } catch (err) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Smothing went wrong!" });
  }
};

const getClicks = async (req: any, res: Response) => {
    const user = req.user;

    try {
        const clicks = await Click.find({user: user._id});
        return res.status(StatusCodes.OK).json({clicks});
    } catch (err) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: "Something went wrong!"});
    }
};

export {create, getUrls, editUrl, visitUrl, getUrl, deleteUrl, getClicks};

// Helper functions for better data extraction
const extractBrowser = (userAgent: string): string => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Other';
};

const extractOS = (userAgent: string): string => {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
};

const generateSessionId = (req: Request): string => {
    // Generate a simple session identifier for tracking unique visits
    const ip = req.socket.remoteAddress || '';
    const ua = req.headers["user-agent"] || '';
    return require('crypto').createHash('md5').update(ip + ua + Date.now()).digest('hex').substring(0, 16);
};
