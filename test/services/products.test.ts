import assert from 'assert';
import { before } from 'mocha';
import app from '../../src/app';

describe('\'products\' service - Valid', () => {
  const service = app.service('products');
  const authors = app.service('authors');

  let author;

  const productData = {
    price: 100,
    quantity: 10
  };

  before(async () => {
    await authors.Model.deleteMany({});
    author = await authors.create({ email: 'test@mail.com', password: '12345678' });
  });

  beforeEach(async () => {
    await service.Model.collection.deleteMany({});
  });

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it('should create new product', async () => {
    const newProduct = await service.create(productData);

    assert.strictEqual(newProduct.quantity, productData.quantity);
    assert.strictEqual(newProduct.price, productData.price);
  });

  it('should update existing product', async () => {
    const newProduct = await service.create(productData);

    assert.strictEqual(newProduct.price, productData.price);

    const newPrice = 50;

    const updatedProduct = await service.update(newProduct._id, { price: newPrice });

    assert.strictEqual(updatedProduct.price, newPrice);
  });

  it('should edit existing product', async () => {
    const newProduct = await service.create(productData);

    assert.strictEqual(newProduct.price, productData.price);

    const newPrice = 50;

    await service.patch(newProduct._id, { price: newPrice });

    const updatedProduct = await service.get(newProduct._id);

    assert.strictEqual(updatedProduct.price, newPrice);
  });

  it('should return populated product', async () => {
    const product = await service.create({ ...productData });

    await service.patch(product._id, { author });

    const populatedProduct = await service.get(product._id, { query: { $populate: 'author' } });

    assert.notStrictEqual(populatedProduct.author._id, author._id);
  });

  it('should not show error when data is correct', async () => {
    try {
      await service.create(productData);
    } catch (error) {
      return assert.fail('Product should be created');
    }
  });
});

describe('\'products\' service - Unvalid', () => {
  const service = app.service('products');

  beforeEach(async () => {
    service.Model.collection.deleteMany({});
  });

  it('should show error when price is undefined', async () => {
    const productData = {
      quantity: 10
    };

    try {
      await service.create(productData);
    } catch (error) {
      return assert.ok('products validation failed: price: Path `price` is required', error.message);
    }

    assert.fail('Should show error');
  });
});
