import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

const port = 8090;

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
  interface ICloth {
    top: string;
    bottom: string;
    socks: string | null;
    hat?: string | null;
  }
  interface IUser {
    id: number;
    name: string;
    age: number;
    job: string;
    hairColor?: string;
    isGlasses: boolean;
    cloth: ICloth;
  }

  const fisrtUser: IUser = {
    id: 1,
    name: '이영우',
    age: 28,
    job: 'Developer',
    isGlasses: true,
    cloth: {
      top: 'Black Hooded zip-up',
      bottom: 'Red Checked Pants',
      socks: 'Black',
    },
  };

  return res.send(fisrtUser);
});

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
