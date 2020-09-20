import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  protected readonly allowedApiKeys: string[] = [
    process.env.ADMIN_API_KEY,
    process.env.USER_API_KEY,
  ];

  protected readonly allowedOriginalUrls: string[] = [
    'USER',
    'TASK'
  ];

  use(req: Request, res: Response, next: NextFunction) {
    
    const originalUrl = req.originalUrl.replace(/\?.*$/g, '');
    const apiKey: string = req.headers['x-api-key'] as string;

    if (!this.validateApiKey(apiKey)) {
      throw new UnauthorizedException(`Authentication failed: incorrect api-key`);
    } else if (!this.validateOriginalUrl(originalUrl)) {
      throw new UnauthorizedException(`Authentication failed: invalid request`);
    }

    next();
  }

  /**
   * Indicates if the original url is allowed or not
   * 
   * @param originalUrl The original url of the request
   */
  protected validateOriginalUrl(originalUrl: string): boolean {
    const valid = (originalUrl && 
      this.allowedOriginalUrls.some(url => originalUrl.toLowerCase().endsWith(url.toLowerCase()))
    );
    
    return valid;
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
