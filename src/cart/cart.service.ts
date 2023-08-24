import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cart } from './interfaces/cart.interface';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
  filePath = path.join(__dirname, 'cart.json');

  constructor(private productService: ProductService) {}
  async getCart(): Promise<Cart> {
    try {
      // Get current cart data
      return this.getCurrentCartData();
    } catch (error) {
      console.error(error);
    }
  }

  async addItem(productId: string): Promise<Cart> {
    // Throw exception if productId empty/null/undefined
    if (!productId) throw new BadRequestException('productId cannot be empty.');

    // Select product from the database by product id
    const selectedProduct = await this.productService.getProductById(productId);

    // Get current cart data
    const currentCartData: Cart = await this.getCurrentCartData();

    // Add selected product to the cart items list
    currentCartData.cartItems.push({
      id: selectedProduct.id,
      title: selectedProduct.title,
      price: selectedProduct.variants[0].price,
      option1: selectedProduct.variants[0].option1,
      option2: selectedProduct.variants[0].option2,
    });

    // Calculate the total of all products in the cart
    currentCartData.total = currentCartData.cartItems.reduce(
      (previous, current) => previous + parseFloat(current.price),
      0,
    );

    // Update cart list on database
    await this.updateCartData(currentCartData);
    return currentCartData;
  }

  async removeItem(productId: string): Promise<Cart> {
    // Throw exception if productId empty/null/undefined
    if (!productId) throw new BadRequestException('productId cannot be empty.');

    // Get current cart data
    const currentCartData: Cart = await this.getCurrentCartData();
    // Search for product inside cart's item list
    const itemIndex = currentCartData.cartItems.findIndex(
      (item) => `${item.id}` === productId,
    );

    // If the product isn't found, throw exception
    if (itemIndex === -1)
      throw new NotFoundException('Item not found on cart.');

    // Recalculate cart total
    currentCartData.total =
      currentCartData.total -
      parseFloat(currentCartData.cartItems[itemIndex].price);

    // Remove product from cart's item list
    currentCartData.cartItems.splice(itemIndex, 1);
    // Update cart data
    await this.updateCartData(currentCartData);
    return currentCartData;
  }

  async getCurrentCartData(): Promise<Cart> {
    // check if cart's json file exists
    if (await this.isCartDataAvailable()) {
      // if it exists, get data from the json file
      return this.getCartData();
    }
    // if it doesn't exist, create a file with empty cart to avoid errors
    return this.createEmptyRecord();
  }

  async createEmptyRecord(): Promise<Cart> {
    try {
      const emptyRecord: Cart = { cartItems: [], total: 0 };
      // Create file with empty cart
      await this.updateCartData(emptyRecord);
      return emptyRecord;
    } catch (error) {
      console.error(error);
    }
  }

  async isCartDataAvailable(): Promise<boolean> {
    try {
      // Check if the file exists. In case it doesn't exist, an error will be thrown
      await fsPromises.access(this.filePath);
      return true;
    } catch (error) {
      // check if the error thrown was because of the non-existence of the file
      if (error.code === 'ENOENT') {
        return false;
      }
      console.error(error);
    }
  }

  async getCartData(): Promise<Cart> {
    // Read content from json file
    const data = await fsPromises.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  async updateCartData(updatedData: Cart): Promise<void> {
    // Write content on json file
    const convertedData = JSON.stringify(updatedData, null, 2);
    await fsPromises.writeFile(this.filePath, convertedData, 'utf-8');
  }
}
