import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
// 공식적인 라이브러리는 최상단 , 아래 하나 띄우고 만든것

import UsersRouter from './users/router';

const port = 8090;

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use('/users', UsersRouter); // Users 모듈

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
