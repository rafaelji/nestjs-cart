import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ProductModule, CartModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
