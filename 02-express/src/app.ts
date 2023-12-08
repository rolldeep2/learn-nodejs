import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

const port = 8090;

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
  return res.send('Hello Express!');
});

app.use((req, res) => {
  return res.status(404).send('Not Found');
});

// 에러 미들웨어 파라미터 4개 항상ddd
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Listening and serving HTTP on : ${port}`);
});
