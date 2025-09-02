import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private authService = new AuthService();
  use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];
    if (!auth) {
      return res.status(401).json({ ok: false, message: 'Missing authorization header' });
    }
    const parts = (auth as string).split(' ');
    if (parts.length !== 2) {
      return res.status(401).json({ ok: false, message: 'Bad authorization header' });
    }
    const token = parts[1];
    const result = this.authService.verifyToken(token);
    if (!result.ok) {
      return res.status(401).json({ ok: false, message: 'Invalid token', error: result.error });
    }
    // attach user to req
    (req as any).user = (result.decoded as any);
    next();
  }
}
