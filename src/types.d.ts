import * as http from 'http';

// module augmentation
declare module 'express-serve-static-core' {
  export interface Request extends http.IncomingMessage, Express.Request {
    context?: {
      userId?: string;
    };
  }
}
