import { BaseDynamoModel } from '@core/models';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDB } from 'aws-sdk';
import { BaseDynamoService } from './base-dynamo.service';

class TestBaseDynamoService extends BaseDynamoService<BaseDynamoModel> {
  protected serviceSortKey = 'TEST';
  protected get db() { return new DynamoDB.DocumentClient(this.dynamoOptions); }

  protected applyExpandParameters(items: Array<BaseDynamoModel>, expands?: Array<string>): Array<BaseDynamoModel> {
    if ((expands || []).length > 0) {
      
    }
    return items;
  }
}

describe('BaseDynamoService', () => {
  let service: TestBaseDynamoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestBaseDynamoService],
    }).compile();

    service = module.get<TestBaseDynamoService>(TestBaseDynamoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
