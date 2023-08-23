import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartItem } from './interfaces/cart-item.interface';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
  filePath = path.join(__dirname, 'cart.json');

  constructor(private productService: ProductService) {}
  async getCart(): Promise<CartItem[]> {
    try {
      return this.getCurrentCartData();
    } catch (error) {
      console.error(error);
    }
  }

  async addItem(productId: string): Promise<CartItem[]> {
    if (!productId) throw new BadRequestException('productId cannot be empty.');

    const products = await this.productService.getAll();
    const selectedProduct = products.find(
      (product) => `${product.id}` === productId,
    );

    if (!selectedProduct) throw new NotFoundException('productId not found.');

    const currentCartData: CartItem[] = await this.getCurrentCartData();

    currentCartData.push({
      id: selectedProduct.id,
      title: selectedProduct.title,
      price: selectedProduct.variants[0].price,
      option1: selectedProduct.variants[0].option1,
      option2: selectedProduct.variants[0].option2,
    });

    const updatedCartData = JSON.stringify(currentCartData, null, 2);
    await this.updateCartData(updatedCartData);
    return currentCartData;
  }

  async getCurrentCartData(): Promise<CartItem[]> {
    if (await this.isCartDataAvailable()) {
      return this.getCartData();
    }
    return this.createEmptyRecord();
  }

  async createEmptyRecord(): Promise<CartItem[]> {
    try {
      await this.updateCartData('[]');
      return [];
    } catch (error) {
      console.error(error);
    }
  }

  async isCartDataAvailable(): Promise<boolean> {
    try {
      await fsPromises.access(this.filePath);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      }
      console.error(error);
    }
  }

  async getCartData(): Promise<CartItem[]> {
    const data = await fsPromises.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  async updateCartData(updatedData: string): Promise<void> {
    await fsPromises.writeFile(this.filePath, updatedData, 'utf-8');
  }
}
