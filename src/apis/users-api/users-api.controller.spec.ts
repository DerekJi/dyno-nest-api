import { Test, TestingModule } from '@nestjs/testing';
import { UserApiController } from './users-api.controller';

describe('UsersApiController', () => {
  let controller: UserApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserApiController],
    }).compile();

    controller = module.get<UserApiController>(UserApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
