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
import { Cart } from './interfaces/cart.interface';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(): Promise<Cart> {
    return this.cartService.getCart();
  }

  @Post()
  async addItem(@Body('productId') productId: string): Promise<Cart> {
    return this.cartService.addItem(productId);
  }

  @Delete(':productId')
  async removeItem(@Param('productId') productId: string): Promise<Cart> {
    return await this.cartService.removeItem(productId);
  }
}
