import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppModule (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/product (GET)', () => {
    return request(app.getHttpServer()).get('/product').expect(200);
  });

  it('/cart (GET)', () => {
    return request(app.getHttpServer()).get('/cart').expect(200);
  });

  it('/cart (POST)', () => {
    return request(app.getHttpServer())
      .post('/cart')
      .send({
        productId: '7596624904422',
      })
      .expect(201);
  });

  it('/cart (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/cart/7596624904422')
      .expect(204);
  });
});
``;
