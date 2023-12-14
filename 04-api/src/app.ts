import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
// 인터페이스 같은 페이지에 할거면 최상단
interface IUser {
  id: number;
  nickname: string;
}

let users: IUser[] = [];

const port = 8090;

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.get('/users', (req, res) => {
  return res.json({ users });
});

interface ICreateUser extends Request {
  body: { nickname?: string };
}

app.post('/users', (req: ICreateUser, res) => {
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

  return res.status(201).json(user); // create 하면 201번
});

interface IFindUser extends Request {
  params: { id: string };
}

app.get('/users/:id', (req: IFindUser, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Bad Request');
  }

  const findUser = users.find((user) => user.id === id);

  if (!findUser) {
    return res.status(404).send('Not Found');
  }

  return res.json(findUser); // status 가 없으면 200번.
});

interface IUpdateUser extends Request {
  params: { id: string };
  body: { nickname?: string };
}

app.put('/users/:id', (req: IUpdateUser, res) => {
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
    return user.id === findUser.id ? { ...user, nickname } : user; // user 풀고, nickname을 덮어씀.
  });

  return res.status(204).json({}); // response가 없을땐 204번.
});

interface IDeleteUser extends Request {
  params: { id: string };
}

app.delete('/users/:id', (req: IDeleteUser, res) => {
  // request가 인터페이스랑 안맞으면, 일단은 그냥 통과됨. 나중에 DTO에서 처리해야하는 부분
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Bad Request');
  }

  const findUser = users.find((user) => user.id === id);

  if (!findUser) {
    return res.status(404).send('Not found'); // 보안상 안알려줄수도 있다.
  }

  users = users.filter((user) => user.id !== findUser.id); // params로 받은 id와 다른 유저는 걸러냄.

  return res.status(204).json({});
});

app.use((req, res) => {
  return res.status(404).send('Not Found');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  return res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Listening and serving HTTP on :${port}`);
});

// crud 주말에 또 한번 만들어보기. users 말고 하나 만들어보자. Rest Client도 사용해보자.
