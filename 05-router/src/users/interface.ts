import { Request } from 'express';

export interface IUser {
  id: number;
  nickname: string;
}

export interface ICreateUser extends Request {
  body: { nickname?: string };
}

export interface IFindUser extends Request {
  params: { id: string };
}

export interface IUpdateUser extends Request {
  params: { id: string };
  body: { nickname?: string };
}

export interface IDeleteUser extends Request {
  params: { id: string };
}
