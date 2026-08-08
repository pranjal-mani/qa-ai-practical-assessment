const { expect } = require('@playwright/test');

class ProductPage {
  constructor(page) {
    this.page = page;
  }

  async waitForLoaded() {
    await this.page.locator('[data-test="add-to-cart"]').waitFor({ state: 'visible' });
  }

  unitPrice() {
    return this.page.locator('[data-test="unit-price"]');
  }

  productDescription() {
    return this.page.locator('[data-test="product-description"]');
  }

  addToCartButton() {
    return this.page.locator('[data-test="add-to-cart"]');
  }

  async addToCart() {
    const cartQty = this.page.locator('[data-test="cart-quantity"]');
    const hadBadge = (await cartQty.count()) > 0;
    const before = hadBadge ? parseInt((await cartQty.textContent()) || '0', 10) : 0;
    await expect(this.addToCartButton()).toBeEnabled({ timeout: 15000 });
    await this.addToCartButton().click();
    await expect(cartQty).toHaveText(String(before + 1), { timeout: 15000 });
  }
}

module.exports = { ProductPage };
