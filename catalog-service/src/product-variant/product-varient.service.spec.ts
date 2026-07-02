import { Test, TestingModule } from '@nestjs/testing';
import { ProductVarientService } from './product-variant.service';

describe('ProductVarientService', () => {
  let service: ProductVarientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVarientService],
    }).compile();

    service = module.get<ProductVarientService>(ProductVarientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
