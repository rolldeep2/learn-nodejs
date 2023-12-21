/* eslint-disable @typescript-eslint/comma-dangle */
import { Request, Response } from 'express';

import { ITodo, IUpdateComplete } from './interface';

// eslint-disable-next-line prefer-const
let todos: ITodo[] = [
  { id: 1, content: 'Content 1', isComplete: false },
  { id: 2, content: 'Content 2', isComplete: false },
  { id: 3, content: 'Content 3', isComplete: false },
  { id: 4, content: 'Content 4', isComplete: false },
  { id: 5, content: 'Content 5', isComplete: false },
];

export const findTodos = (req: Request, res: Response) => {
  return res.json({ todos });
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
