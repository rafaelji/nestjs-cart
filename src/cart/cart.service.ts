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

    await this.updateCartData(currentCartData);
    return currentCartData;
  }

  async removeItem(productId: string): Promise<void> {
    if (!productId) throw new BadRequestException('productId cannot be empty.');

    const currentCartData: CartItem[] = await this.getCurrentCartData();
    const itemIndex = currentCartData.findIndex(
      (item) => `${item.id}` === productId,
    );

    if (itemIndex === -1)
      throw new NotFoundException('Item not found on cart.');

    currentCartData.splice(itemIndex, 1);
    await this.updateCartData(currentCartData);
  }

  async getCurrentCartData(): Promise<CartItem[]> {
    if (await this.isCartDataAvailable()) {
      return this.getCartData();
    }
    return this.createEmptyRecord();
  }

  async createEmptyRecord(): Promise<CartItem[]> {
    try {
      await this.updateCartData([]);
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

  async updateCartData(updatedData: CartItem[]): Promise<void> {
    const convertedData = JSON.stringify(updatedData, null, 2);
    await fsPromises.writeFile(this.filePath, convertedData, 'utf-8');
  }
}
