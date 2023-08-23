import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './interfaces/product.interface';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(
    @Query('param') param: string,
    @Query('order') order: string,
  ): Promise<Product[]> {
    return this.productService.getAll(param, order);
  }
}
