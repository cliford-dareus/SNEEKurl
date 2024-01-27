import { ChangeEventHandler, ReactNode } from "react";
export interface UserInterface {
  email?: string;
  name?: string;
  userId?: string;
  password?: string;
  token?: string;
};
export interface Site {
  _id: string;
  full: string;
  favorite: boolean;
  clicks: number;
  isLogin: boolean;
  creatorId: string;
  short: string;
  __v: number;
};
export interface IProps {
  placeholder: string;
  type: string;
  name: string;
  value: string;
  fn: ChangeEventHandler;
};
export interface Props {
  children?: ReactNode;
};

export interface IModal {
  data: Site | undefined;
  close: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ITable {
  data: any;
  setIsModalOpen: any;
  setModalData: any;
};
