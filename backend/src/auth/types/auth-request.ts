import { Request as ExpressRequest } from 'express';

export interface AuthRequest extends ExpressRequest {
  user?: UserRequest;
}

export interface UserRequest {
  id: number;
  username: string;
}
