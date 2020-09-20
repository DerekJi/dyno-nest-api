import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  protected readonly allowedApiKeys: string[] = [
    process.env.ADMIN_API_KEY,
    process.env.USER_API_KEY,
  ];

  use(req: Request, res: Response, next: NextFunction) {
    const apiKey: string = req.headers['x-api-key'] as string;
    if (this.validateApiKey(apiKey)) {
      next();
    } else {
      console.error(`Authentication failed`);
      throw new UnauthorizedException();
    }

  }

  /**
   * Indicates if the api-key is valid or not
   * 
   * @param reqApiKey api-key from the request header
   */
  protected validateApiKey(reqApiKey: string): boolean {
    if (reqApiKey) {
      return this.allowedApiKeys.some(key => reqApiKey === key);
    }
    return false;
  }
}
