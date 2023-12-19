import { Router } from 'express';

import { createUser, deleteUser, findUser, findUsers, updateUser } from './service';

const UsersRouter = Router();

UsersRouter.get('/', (req, res) => {
  return findUsers(req, res);
});

UsersRouter.post('/', (req, res) => {
  return createUser(req, res);
});

UsersRouter.get('/:id', (req, res) => {
  return findUser(req, res);
});

UsersRouter.put('/:id', (req, res) => {
  return updateUser(req, res);
});

UsersRouter.delete('/:id', (req, res) => {
  return deleteUser(req, res);
});

export default UsersRouter;

// 컨트롤러 (라우터) 부분 NestJS는 모듈단위로, NodeJs는 Interfaces, Services... 등 기능 위주로 아키텍쳐를 짬
// 오스틴님 깃허브에서 NodeJS 방식은 nodebird 레포지토리, NestJS는 auth-backend 레포지토리
