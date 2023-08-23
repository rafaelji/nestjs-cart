import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Order, Parameter } from './enums/common';

describe('ProductController', () => {
  let productController: ProductController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    productController = app.get<ProductController>(ProductController);
  });

  describe('getAllProducts', () => {
    it('should return all available products ordered by Title Z-A', async () => {
      const result = await productController.getAllProducts(
        Parameter.Title,
        Order.DESC,
      );
      expect(result[0].title).toBe("Play On Player Women's Tee");
    });

    it('should return all available products ordered by Title A-Z', async () => {
      const result = await productController.getAllProducts(
        Parameter.Title,
        Order.ASC,
      );
      expect(result[0].title).toBe('Classic Sticker Pack');
    });

    it('should return all available products ordered by highest price', async () => {
      const result = await productController.getAllProducts(
        Parameter.Price,
        Order.DESC,
      );
      expect(result[0].variants[0].price).toBe('45.00');
    });

    it('should return all available products ordered by lowest price', async () => {
      const result = await productController.getAllProducts(
        Parameter.Price,
        Order.ASC,
      );
      expect(result[0].variants[0].price).toBe('8.00');
    });
  });
});
