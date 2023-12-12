import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import path from 'path';

const port = 8090;

const app = express();

app.use(morgan('dev')); // static 파일은 로깅하지 않으려면 아래로 내림

// static, /var/www ...
app.use('/public', express.static(path.join(__dirname, 'public'))); // path separator OS별로 자동으로 해줌

app.use((req, res) => {
  return res.status(404).send('Not Found');
});

// 에러 미들웨어 파라미터 4개 항상
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Listening and serving HTTP on : ${port}`);
});