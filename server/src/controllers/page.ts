import {Request, Response} from 'express';
import Page from "../models/page";
import User from "../models/user";
import {StatusCodes} from "http-status-codes";

const getMyPages = async (req: any, res: Response) => {
    const client_id = req.session.client_id;
    const user = await User.findOne({clientId: client_id});

    if (!user) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({message: "Something went wrong ... "});
    }
    try {
        const pages = await Page.find({user: user._id});
        res.status(200).json(pages);
    } catch (e) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: "Something went wrong..."});
    }

};

const createPage = async (req: any, res: Response) => {
    const {title, description, slug, isPublic} = req.body;
    const client_id = req.session.client_id;
    const user = await User.findOne({clientId: client_id});

    if (!user) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({message: "Something went wrong... s"});
    }

    const isUnique = await Page.findOne({slug: slug});

    if (isUnique) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: "This slug is already in use"});
    }

    try {
        const page = await Page.create({
            title,
            description,
            slug,
            user: user._id,
        })

        res.status(StatusCodes.OK).json(page);
    } catch (e) {
        console.log(e)
        res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: "Something went wrong..."});
    }
};

const updatePage = async (req: any, res: Response) => {
    const {id, title, description, slug, isPublic, links} = req.body;

    if (!title && !description && !slug && !isPublic && !links) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: "Please provide a title, description, slug, isPublic and links"});
    }

    const client_id = req.session.client_id;
    const user = await User.findOne({clientId: client_id});

    if (!user) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({message: "Something went wrong..."});
    }

    const page = await Page.findOne({_id: id});

    if (!page) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({message: "Couldn't find this Page..."});
    }

    try {
        const uniqueLinks = new Set([...page.links,...links]);

        await page.updateOne({title, description, slug, isPublic, links: uniqueLinks}).exec();
        res.status(StatusCodes.OK).json(page);
    } catch (e) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .send({message: "Something went wrong..."});
    }
};

export {getMyPages, createPage, updatePage}