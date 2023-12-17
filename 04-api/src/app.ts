import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

interface IProduct {
  id: number;
  name: string;
  price: number;
  type: string;
  amount: number;
}

interface ICart {
  products: IProduct[];
  totalPrice: number;
}

const cart: ICart = { products: [], totalPrice: 0 };

const port = 8090;

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.get('/cart', (req, res) => {
  let totalPrice = 0;
  cart.products.forEach((product) => {
    totalPrice += product.price * product.amount;
  });

  cart.totalPrice = totalPrice;

  return res.json({ cart });
});

interface ICreateProduct extends Request {
  body: { name: string; price: string; type: string; amount: string };
}

app.post('/cart', (req: ICreateProduct, res) => {
  const name: string = req.body.name?.trim() ?? '';
  const price: number = parseInt(req.body?.price);
  const type: string = req.body.type?.trim() ?? '';
  const amount: number = parseInt(req.body.amount);

  if (!name || !type || isNaN(price) || isNaN(amount)) {
    return res.status(400).send('Bad Request');
  }

  const isExistsProduct = cart.products.find(
    (product) => product.name === name && product.type === type && product.price === price
  );

  if (isExistsProduct) {
    isExistsProduct.amount += amount;
    return res.status(201).json(isExistsProduct);
  } else {
    const id = cart.products.length ? cart.products[cart.products.length - 1].id + 1 : 1;
    const product: IProduct = { id, name, price, type, amount };
    cart.products = [...cart.products, product];
    return res.status(201).json(product);
  }
});

interface IFindProduct extends Request {
  params: { name: string };
}

app.get('/cart/:name', (req: IFindProduct, res) => {
  const name = req.params.name?.trim();

  if (!name) {
    return res.status(400).send('Bad Re1quest');
  }

  const findProduct = cart.products.find((product) => product.name === name);

  if (!findProduct) {
    return res.status(404).send('Not Found');
  }

  return res.json(findProduct);
});

interface IUpdateProduct extends Request {
  params: { id: string };
  body: { name?: string; price: string; type?: string; amount: string }; // price랑 amount에 ?를 넣으면 아래 parseInt에서 빨간줄이 그이넹..
}

app.put('/cart/:id', (req: IUpdateProduct, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Bad Re1quest');
  }

  const name = req.body.name?.trim();
  const price: number = parseInt(req.body?.price);
  const type: string = req.body.type?.trim() ?? '';
  const amount: number = parseInt(req.body.amount);

  if (!name || isNaN(price) || !type || isNaN(amount)) {
    return res.status(400).send('Bad R2equest');
  }

  const findProduct = cart.products.find((product) => product.id === id);

  if (!findProduct) {
    return res.status(404).send('Not Found');
  }

  cart.products = cart.products.map((product) => {
    return product.id === findProduct.id ? { ...product, name, price, type, amount } : product;
  });

  return res.status(204).json({}); // 빼먹었음.. 204번 추가해야함!
});

interface IDeleteProduct extends Request {
  params: { id: string };
}

app.delete('/cart/:id', (req: IDeleteProduct, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Bad Request');
  }

  const findProduct = cart.products.find((product) => product.id === id);

  if (!findProduct) {
    return res.status(404).send('Not Found');
  }

  cart.products = cart.products.filter((product) => product.id !== id);

  return res.status(204).send({});
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
