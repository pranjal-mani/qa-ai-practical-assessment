const { test, expect } = require('@playwright/test');
const { ProductsApi } = require('../../api/productsApi');
const { CartApi } = require('../../api/cartApi');

test('TC-API-006 @regression cart lifecycle supports multiple products and quantity update', async ({ request }) => {
  const productsApi = new ProductsApi(request);
  const cartApi = new CartApi(request);

  const productsResponse = await productsApi.listProducts({ page: 1 });
  expect(productsResponse.status()).toBe(200);
  const products = (await productsResponse.json()).data;
  const productA = products[0];
  const productB = products[1];

  const createResponse = await cartApi.createCart();
  expect(createResponse.status()).toBe(201);
  const cartId = (await createResponse.json()).id;

  const addA = await cartApi.addItem(cartId, productA.id, 1);
  expect(addA.status()).toBe(200);
  const addB = await cartApi.addItem(cartId, productB.id, 2);
  expect(addB.status()).toBe(200);

  const updateResponse = await cartApi.updateQuantity(cartId, productA.id, 3);
  expect(updateResponse.status()).toBe(200);

  const cartResponse = await cartApi.getCart(cartId);
  expect(cartResponse.status()).toBe(200);
  const cartBody = await cartResponse.json();
  expect(cartBody.cart_items.length).toBe(2);

  const itemA = cartBody.cart_items.find((item) => item.product_id === productA.id);
  const itemB = cartBody.cart_items.find((item) => item.product_id === productB.id);
  expect(itemA.quantity).toBe(3);
  expect(itemB.quantity).toBe(2);
});
