import { Router } from 'express';
import { findTodos, updateIsComplete } from './service';

const TodosRouter = Router();

TodosRouter.get('/', (req, res) => {
  return findTodos(req, res);
});

TodosRouter.patch('/:id/completion', (req, res) => {
  return updateIsComplete(req, res);
});

export default TodosRouter;
