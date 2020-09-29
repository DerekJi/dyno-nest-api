import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AuthMiddleware } from './auth.middleware';
import env from 'src/env/environment';

let configService: ConfigService;

beforeEach(async () => {
  const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [env],
        }),
      ]
  }).compile();

  configService = module.get<ConfigService>(ConfigService);
});

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    const middleware = new AuthMiddleware(configService);
    expect(middleware).toBeDefined();
  });
});