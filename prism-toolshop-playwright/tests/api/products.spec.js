const { test, expect } = require('@playwright/test');
const { ProductsApi } = require('../../api/productsApi');
const searchTemplate = require('../../test-data/search.template.json');

test('TC-API-005 @regression list and search products return matching results', async ({ request }) => {
  const productsApi = new ProductsApi(request);

  const listResponse = await productsApi.listProducts({ page: 1 });
  expect(listResponse.status()).toBe(200);
  const listBody = await listResponse.json();
  expect(listBody.data.length).toBeGreaterThan(0);
  const productId = listBody.data[0].id;
  expect(productId).toBeTruthy();

  const searchResponse = await productsApi.searchProducts(searchTemplate.term);
  expect(searchResponse.status()).toBe(200);
  const searchBody = await searchResponse.json();
  expect(searchBody.data.length).toBeGreaterThan(0);
  for (const product of searchBody.data) {
    expect(product.name.toLowerCase()).toContain(searchTemplate.term.toLowerCase());
  }

  const detailResponse = await productsApi.getProduct(productId);
  expect(detailResponse.status()).toBe(200);
  const detailBody = await detailResponse.json();
  expect(detailBody.id).toBe(productId);
  expect(detailBody.name).toBeTruthy();
  expect(detailBody.price).toBeGreaterThan(0);
});
