import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  HttpCode,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItem } from './interfaces/cart-item.interface';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(): Promise<CartItem[]> {
    return this.cartService.getCart();
  }

  @Post()
  async addItem(@Body('productId') productId: string): Promise<CartItem[]> {
    return this.cartService.addItem(productId);
  }

  @Delete(':productId')
  @HttpCode(204)
  async removeItem(@Param('productId') productId: string): Promise<void> {
    await this.cartService.removeItem(productId);
  }
}
