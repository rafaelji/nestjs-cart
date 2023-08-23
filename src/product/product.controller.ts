import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './interfaces/product.interface';
import { Order, Parameter } from './enums/common';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(
    @Query('param') param: Parameter,
    @Query('order') order: Order,
  ): Promise<Product[]> {
    return this.productService.getAll(param, order);
  }
}
