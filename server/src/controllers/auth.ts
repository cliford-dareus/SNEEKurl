import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Unauthenticated, BadRequest, NotFound } from "../errors";
import User from "../models/user";

const registerUser =async ( req:Request, res: Response ) => {
    const { name, email, password } = req.body;
    const isAlreadyExist = await User.findOne({ email });

    if(!isAlreadyExist){
        throw new BadRequest('Email already exists');
    };

    const user = await User.create({
        name,
        email,
        password
    })

    res.status(StatusCodes.CREATED).json({ user });
};

const loginUser =async ( req:Request, res: Response ) => {
    
};

export {
    registerUser,
    loginUser
};

