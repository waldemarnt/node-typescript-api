import * as http from 'http';
import { DecodedUser } from './services/auth';
<<<<<<< HEAD
// module augmentation
=======

>>>>>>> c5-s5-doing
declare module 'express-serve-static-core' {
  export interface Request extends http.IncomingMessage, Express.Request {
    decoded?: DecodedUser;
  }
}
