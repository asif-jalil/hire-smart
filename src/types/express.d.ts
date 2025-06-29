import { User } from 'src/modules/user/entities/user.entity';

declare module 'express' {
  export interface Request {
    user?: Partial<User>;
    token?: string;
  }
}
