import { Request } from 'express';

export interface ITodo {
  id: number;
  content: string;
  isComplete: boolean;
}

export interface IUpdateComplete extends Request {
  params: { id: string };
  body: { isComplete?: boolean };
}
