import { Request, Response } from 'express';

import { ICreateUser, IDeleteUser, IFindUser, IUpdateUser, IUser } from './interface';

let users: IUser[] = [];

export const existsUserByNickName = () => {
  // 중복된 코드 따로 뺄수도 있음
};

export const findUsers = (req: Request, res: Response) => {
  return res.json({ users });
};

export const createUser = (req: ICreateUser, res: Response) => {
  const nickname = req.body.nickname?.trim();

  if (!nickname) {
    return res.status(400).send('Bad Request');
  }

  const isExistsNickName = users.find((user) => user.nickname === nickname);

  if (isExistsNickName) {
    return res.status(400).send('Bad Request');
  }

  const id = users.length ? users[users.length - 1].id + 1 : 1;

  const user: IUser = { id, nickname };

  users = [...users, user];

  return res.status(201).json(user);
};

export const findUser = (req: IFindUser, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Bad Request');
  }

  const findUser = users.find((user) => user.id === id);

  if (!findUser) {
    return res.status(404).send('Not Found');
  }

  return res.json(findUser);
};

export const updateUser = (req: IUpdateUser, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Bad Request');
  }

  const nickname = req.body.nickname?.trim();

  if (!nickname) {
    return res.status(400).send('Bad Request');
  }

  const isExistsNickName = users.find((user) => user.nickname === nickname);

  if (isExistsNickName) {
    return res.status(400).send('Bad Request');
  }

  const findUser = users.find((user) => user.id === id);

  if (!findUser) {
    return res.status(404).send('Not found');
  }

  users = users.map((user) => {
    return user.id === findUser.id ? { ...user, nickname } : user;
  });

  return res.status(204).json({});
};

export const deleteUser = (req: IDeleteUser, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Bad Request');
  }

  const findUser = users.find((user) => user.id === id);

  if (!findUser) {
    return res.status(404).send('Not found');
  }

  users = users.filter((user) => user.id !== findUser.id);

  return res.status(204).json({});
};
