import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequest } from '../errors/index';
import Short from "../models/short";

const getShortenUrl =async (req:Request, res:Response) => {
    const short = await Short.find({});
    res.status(StatusCodes.OK).json(short);
};

const shortenUrl =async (req:Request, res: Response ) => {
    const { full } = req.body;
    console.log(full);
    if(!full){
        throw new BadRequest('Enter a url to shorten')
    };

    const short = await Short.create({
        full
    }); 

    res.status(StatusCodes.CREATED).json(short);
};

const visitShort =async (req:Request, res:Response) => {
    const clicksUrl = req.params.shortUrl;

    const url = await Short.findOne({ short: clicksUrl});
    if (url == null) return res.sendStatus(404)

    url.clicks++;
    url.save()

    res.redirect(url.full!);
};

const getShort = async (req:Request, res:Response) => {
    console.log(req.query)
    const { favorite, clicks } = req.query;
    interface IShort {
        favorite?: boolean;
        clicks?: any
    };

    let shortObj: IShort ={};

    if(favorite){
        shortObj.favorite = favorite === 'true' ? true : false;
    };

    if(clicks){
        shortObj.clicks = {'$gt': Number(clicks)}
    };

    let short = await Short.find(shortObj);
    res.status(StatusCodes.OK).send(short);
};

const updateShort =async (req:Request, res: Response) => {
    const short = req.params.shortUrl;

    const clicksUrl = await Short.findOne({ short: short});
    if(clicksUrl == null)return res.status(StatusCodes.BAD_REQUEST);

    clicksUrl.favorite = !clicksUrl.favorite;
    clicksUrl.save();

    res.status(StatusCodes.OK).json(clicksUrl);
}

const deleteShort = async (req:Request, res: Response) => {
  const short = req.params.shortUrl;
  console.log(short)
  await Short.findOneAndDelete({ short: short});
  res.status(StatusCodes.OK).json({msg: 'Short deleted'});
}; 

export { getShortenUrl, shortenUrl, deleteShort, visitShort, getShort, updateShort };