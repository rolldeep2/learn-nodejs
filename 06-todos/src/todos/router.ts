import { Router } from 'express';
import {
  createTodo,
  deleteTodos,
  findTodos,
  updateContent,
  updateIsComplete,
  updateOrder,
} from './service';

const TodosRouter = Router();

TodosRouter.get('/', (req, res) => {
  return findTodos(req, res);
});

TodosRouter.post('/', (req, res) => {
  return createTodo(req, res);
});

TodosRouter.delete('/', (req, res) => {
  return deleteTodos(req, res);
});

// put은 body로 한번에 여러 데이터를 받음. patch는 하나만 바꿀때
TodosRouter.patch('/:id/content', (req, res) => {
  return updateContent(req, res);
});

TodosRouter.patch('/:id/completion', (req, res) => {
  return updateIsComplete(req, res);
});

TodosRouter.patch('/:id/order', (req, res) => {
  return updateOrder(req, res);
});

export default TodosRouter;
