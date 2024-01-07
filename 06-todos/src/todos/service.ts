/* eslint-disable @typescript-eslint/comma-dangle */
import { Request, Response } from 'express';

import {
  ICreateTodo,
  IDeleteTodos,
  ITodo,
  IUpdateComplete,
  IUpdateContent,
  IUpdateOrder,
} from './interface';

// eslint-disable-next-line prefer-const
let todos: ITodo[] = [];

export const findTodos = (req: Request, res: Response) => {
  todos = todos.sort((a, b) => a.order - b.order);
  return res.json({ todos });
};

export const createTodo = (req: ICreateTodo, res: Response) => {
  const content = req.body.content?.trim();

  if (content === undefined) {
    return res.status(400).send('Bad Request');
  }

  const id = todos.length ? todos[todos.length - 1].id + 1 : 1;

  const todo: ITodo = { id, content, isComplete: false, order: id };

  todos = [...todos, todo];

  return res.status(201).json(todo);
};

export const deleteTodos = (req: IDeleteTodos, res: Response) => {
  const ids = req.query.ids?.split(',');

  // localhost:8090?ids= or localhost:8090?ids=
  if (ids === undefined || ids[0].trim() === '') {
    todos = [];
    return res.status(204).json({});
  }

  // localhost:8090:?ids=1,2,3 => ['1', '2', '3']
  // reduce : 첫번째 파라미터는 결과값, 두번째값은 배열의 원소하나(현재값)
  // 쿼리스트링으로 받은 값이 실제로 데이터에 존재하는지 확인
  const deleteIds = todos.reduce((result: number[], todo) => {
    return ids.includes(`${todo.id}`) ? [...result, todo.id] : result;
  }, []);

  // 쿼리스트링으로 받은 값의 갯수와 실제로 데이터가 존재하는 값의 갯수가 같지않으면 Bad Request
  if (ids.length !== deleteIds.length) {
    return res.status(400).send('Bad Request');
  }

  // todos에서 deleteIds에 포함된것은 필터링
  todos = todos.filter((todo) => !deleteIds.includes(todo.id));

  return res.status(204).json({});
};

export const updateContent = (req: IUpdateContent, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Bad Request');
  }

  const content = req.body.content?.trim();

  if (content === undefined) {
    return res.status(400).send('Bad Request');
  }

  const findTodo = todos.find((todo) => todo.id === id);

  if (!findTodo) {
    return res.status(404).send('Not Found');
  }

  todos = todos.map((todo) => {
    return todo.id === findTodo.id ? { ...todo, content } : todo;
  });

  return res.status(204).json({});
};

export const updateIsComplete = (req: IUpdateComplete, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Bad Request');
  }

  const { isComplete } = req.body;

  if (isComplete === undefined) {
    return res.status(400).send('Bad Request');
  }

  const findTodo = todos.find((todo) => todo.id === id);

  if (!findTodo) {
    return res.status(404).send('Not Found');
  }

  todos = todos.map((todo) => {
    return todo.id === findTodo.id ? { ...todo, isComplete } : todo;
  });

  return res.status(204).json({});
};

export const updateOrder = (req: IUpdateOrder, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Bad Request');
  }

  const { order } = req.body;

  if (order === undefined) {
    return res.status(400).send('Bad Request');
  }

  const findTodo = todos.find((todo) => todo.id === id);

  if (!findTodo) {
    return res.status(404).send('Not Found');
  }

  findTodo.order = order;
  return res.status(204).json({});
};
