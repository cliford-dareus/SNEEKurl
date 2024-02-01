import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequest } from "../lib/errors/index";
import Short from "../models/short";

// CREATE SHORTEN URL
const create = async (req: Request, res: Response) => {
  const { longUrl } = req.body;

  if (!longUrl)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Enter a long URL" });
    
};



export { create };
