const testConfig = require('../test-data/test-config.json');

class CartApi {
  constructor(request) {
    this.request = request;
    this.paths = testConfig.api.paths;
  }

  createCart() {
    return this.request.post(this.paths.carts);
  }

  addItem(cartId, productId, quantity) {
    return this.request.post(`${this.paths.carts}/${cartId}`, {
      data: { product_id: productId, quantity },
    });
  }

  getCart(cartId) {
    return this.request.get(`${this.paths.carts}/${cartId}`);
  }

  updateQuantity(cartId, productId, quantity) {
    return this.request.put(`${this.paths.carts}/${cartId}/product/quantity`, {
      data: { product_id: productId, quantity },
    });
  }
}

module.exports = { CartApi };
