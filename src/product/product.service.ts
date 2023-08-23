import { Injectable } from '@nestjs/common';
import * as data from './product-list.json';
import { Product } from './interfaces/product.interface';
import { Order, Parameter } from './enums/common';

@Injectable()
export class ProductService {
  async getAll(
    param: Parameter = Parameter.Title,
    order: Order = Order.ASC,
  ): Promise<Product[]> {
    try {
      const products = data.products as Product[];

      if (param === Parameter.Title) {
        return [...products].sort((prodA, prodB) =>
          order === Order.ASC
            ? prodA.title.localeCompare(prodB.title)
            : prodB.title.localeCompare(prodA.title),
        );
      }

      if (param === Parameter.Price) {
        return [...products].sort((prodA, prodB) => {
          const prodAPrice = parseFloat(prodA.variants[0].price);
          const prodBPrice = parseFloat(prodB.variants[0].price);

          if (order === Order.ASC) return prodAPrice - prodBPrice;

          return prodBPrice - prodAPrice;
        });
      }

      return products;
    } catch (error) {
      console.error(error);
    }
  }
}
