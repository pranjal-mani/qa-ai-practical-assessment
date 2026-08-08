const testConfig = require('../test-data/test-config.json');

class ProductsApi {
  constructor(request) {
    this.request = request;
    this.paths = testConfig.api.paths;
  }

  listProducts(params = {}) {
    return this.request.get(this.paths.products, { params });
  }

  searchProducts(query, params = {}) {
    return this.request.get(this.paths.productSearch, {
      params: { q: query, ...params },
    });
  }

  getProduct(productId) {
    return this.request.get(`${this.paths.products}/${productId}`);
  }
}

module.exports = { ProductsApi };
