import { ChangeEventHandler } from "react";

export interface Site {
    _id: string;
    full: string;
    favorite: boolean;
    clicks: number;
    isLogin: boolean;
    creatorId: string;
    short: string;
    __v: number
};

export interface IProps {
    placeholder: string;
    type: string;
    name: string;
    value: string;
    fn: ChangeEventHandler
}