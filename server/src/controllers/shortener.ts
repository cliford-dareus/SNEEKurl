import {Request, Response} from "express";
import geoip from "geoip-lite";
import {StatusCodes} from "http-status-codes";

import Short from "../models/short";
import User from "../models/user";
import jwt from "jsonwebtoken";
import Click from "../models/clicks";

const create = async (req: any, res: Response) => {
    const {longUrl, backhalf} = req.body;
    const guest_sid = req.signedCookies["guest.sid"];
    const auth_sid = req.signedCookies["auth.sid"];
    const isAuthenticated = req.session?.isAuthenticated;

    const guest =
        guest_sid &&
        (jwt.verify(guest_sid, process.env.JWT_SECRET!) as jwt.JwtPayload);
    const auth =
        auth_sid &&
        (jwt.verify(auth_sid, process.env.JWT_SECRET!) as jwt.JwtPayload);

    if (guest_sid && !isAuthenticated) {
        const short = await Short.create({
            longUrl,
            expired_in: new Date(Date.now() + 30 * 60 * 1000),
            guest: guest.client_id,
        });

        return res.status(StatusCodes.OK).json({short});
    } else if (auth_sid && isAuthenticated && auth) {
        const user = await User.findById(auth["user_id"]);

        if (!user || !longUrl) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send({message: "Enter a long URL"});
        }

        const isUrlExist = await Short.findOne({longUrl, user: user._id});
        if (isUrlExist) {
            return res.status(StatusCodes.BAD_REQUEST).json({short: isUrlExist});
        }

        const short = backhalf
            ? await Short.create({longUrl, short: backhalf, user: user._id})
            : await Short.create({longUrl, user: user._id});

        res.status(StatusCodes.OK).json({short});
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
            .send({message: "Something went wrong!"});
    }
};

const getGuestUrl = async (req: Request, res: Response) => {
    const guest_sid = req.signedCookies["guest.sid"];

    if (!guest_sid) {
        return;
    }

    const guest = jwt.verify(
        guest_sid,
        process.env.JWT_SECRET!,
    ) as jwt.JwtPayload;

    try {
        const shorts = await Short.find({
            guest: guest.client_id,
        });

        res.status(StatusCodes.OK).json({urls: shorts});
    } catch (error) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: "Something went wrong"});
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
    };

    // Check if user is on Mobile or not
    const userAgent = req.headers["user-agent"];
    const isMobile = userAgent
        ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            userAgent,
        ) : false;

    // const ipAddress = req.headers["x-forwarded-for"]
    const ipAddress = req.socket.remoteAddress;
    const geo = geoip.lookup(ipAddress as string);

    const metadata = {
        time: new Date(),
        userAgent: req.headers["user-agent"],
        referer: req.headers.referer,
        country: geo?.country || "Unknown",
        isMobile,
    };

    try {
        if (url.password && !providedPassword) {
            return res.status(StatusCodes.FORBIDDEN)
                        .send(`Link is protected by password`);
        } else if (url.password && providedPassword) {
            const isCorrectPassword = providedPassword === url.password;

            if (isCorrectPassword) {
                await Short.updateOne({_id: url._id}, {$push: {metadata}});

                await Click.create({
                    user: url.user,
                    link: url._id,
                    date: Date.now()
                });
                return res.redirect(url.longUrl);
            }
        } else {
            await Short.updateOne({_id: url._id}, {$push: {metadata}});

            await Click.create({
                user: url.user,
                link: url._id,
                date: Date.now()
            });

            return res.redirect(url.longUrl);
        }
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST)
            .send({message: "Something went wrong!"});
    }
};

const deleteUrl = async (req: Request, res: Response) => {
    const {short} = req.params;

    try {
        const deletedShort = await Short.findOneAndDelete({short});

        //Check if it was in a page and update the page

        res.status(StatusCodes.OK).send({message: "Short deleted!"});
    } catch (err) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: "Smothing went wrong!"});
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

export {create, getUrls, editUrl, visitUrl, getUrl, getGuestUrl, deleteUrl, getClicks};
