// lib/session.ts
import { SessionOptions } from 'iron-session';
import { v4 as uuidv4} from 'uuid';

export const sessionOptions: SessionOptions = {
  password: uuidv4(),
  cookieName: 'test_production',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // temporary cookie
  },
};

export interface IronSessionData {
    id: string;
}

