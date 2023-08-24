import { Injectable, NotFoundException } from '@nestjs/common';
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
      // read data from json file
      const products = data.products as Product[];

      // check if query parameter param is 'title'
      if (param === Parameter.Title) {
        // sort result based on parameter order by asc or desc
        return [...products].sort((prodA, prodB) =>
          order === Order.ASC
            ? prodA.title.localeCompare(prodB.title)
            : prodB.title.localeCompare(prodA.title),
        );
      }

      // check if query parameter param is 'price'
      if (param === Parameter.Price) {
        // sort result based on parameter order by asc or desc
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

  async getProductById(productId: string): Promise<Product> {
    // Get all products
    const products = await this.getAll();
    // Find product by id
    const selectedProduct = products.find(
      (product) => `${product.id}` === productId,
    );

    // If product is not found throw exception
    if (!selectedProduct) throw new NotFoundException('productId not found.');

    return selectedProduct;
  }
}
