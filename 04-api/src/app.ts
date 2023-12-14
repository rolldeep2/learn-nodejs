import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

const port = 8080;

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
  return res.send('Hello Express');
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
