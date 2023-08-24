import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductModule } from '../product/product.module';

describe('CartController', () => {
  let cartController: CartController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ProductModule],
      controllers: [CartController],
      providers: [CartService],
    }).compile();

    cartController = app.get<CartController>(CartController);
  });

  describe('getCart', () => {
    it('should return empty cart', async () => {
      const result = await cartController.getCart();
      expect(result).toBeTruthy();
    });

    it('should add one item and return cart list', async () => {
      const result = await cartController.addItem('7596624904422');
      expect(result.cartItems.length).toBeGreaterThan(0);
    });

    it('should remove one item', async () => {
      await cartController.removeItem('7596624904422');
      const result = await cartController.getCart();
      expect(result.cartItems.length).toBe(0);
    });
  });

  describe('getCart', () => {});
});
