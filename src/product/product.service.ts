import { Injectable } from '@nestjs/common';
import * as data from './product-list.json';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductService {
  async getAll(param?: string, order?: string): Promise<Product[]> {
    try {
      const products = data.products as Product[];

      if (param === 'title') {
        return [...products].sort((prodA, prodB) =>
          order === 'ASC'
            ? prodA.title.localeCompare(prodB.title)
            : prodB.title.localeCompare(prodA.title),
        );
      }

      if (param === 'price') {
        return [...products].sort((prodA, prodB) => {
          const prodAPrice = parseFloat(prodA.variants[0].price);
          const prodBPrice = parseFloat(prodB.variants[0].price);

          if (order === 'ASC') return prodAPrice - prodBPrice;

          return prodBPrice - prodAPrice;
        });
      }

      return products;
    } catch (error) {
      console.error(error);
    }
  }
}
