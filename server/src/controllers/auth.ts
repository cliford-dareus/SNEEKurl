import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Unauthenticated, BadRequest, NotFound } from "../errors";
import jwt from 'jsonwebtoken';
import User from "../models/user";

const registerUser = async ( req:Request, res: Response ) => {
    const { name, email, password } = req.body;

    const isAlreadyExist = await User.find({ email });

    if(isAlreadyExist.length > 0){
        throw new BadRequest('Email already exists');
    };

    const user = await User.create({
        name,
        email,
        password
    });
    
    res.status(StatusCodes.CREATED).json(user);
};

const loginUser = async ( req:Request, res: Response ) => {
    const { name, password } = req.body;

    if(!name || !password ){
        throw new BadRequest('Please Provide a name and Password!');
    };

    const user = await User.findOne({ name });

    if(!user) {
        throw new Unauthenticated('Credentials Invalid');
    };

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
        throw new BadRequest('Credentials Invalid');
    };

    const accessTokenJWT = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET!);
    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true,
        secure: false,
        signed: true,
        expires: new Date(Date.now() + oneDay),
      });

    res.status(StatusCodes.OK).json({ userName: user.name, userId: user._id });
};

export {
    registerUser,
    loginUser
};

