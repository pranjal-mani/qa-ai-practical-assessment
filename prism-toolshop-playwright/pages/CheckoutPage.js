const testConfig = require('../test-data/test-config.json');
const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  async openCart() {
    await this.page.locator('[data-test="nav-cart"]').click();
    await this.page.locator('[data-test="proceed-1"], [data-test="product-quantity"]').first().waitFor({ state: 'visible' });
  }

  async clickProceed1() {
    await this.page.locator('[data-test="proceed-1"]').click();
  }

  async clickProceed2() {
    await this.page.locator('[data-test="proceed-2"]').click();
  }

  async clickProceed3() {
    const btn = this.proceed3();
    await expect(btn).toBeEnabled({ timeout: 15000 });
    await btn.click({ force: true });
  }

  proceed3() {
    return this.page.locator('[data-test="proceed-3"]');
  }

  async fillBilling(billing) {
    if (billing.country) {
      await this.page.locator('[data-test="country"]').selectOption(billing.country);
    }
    if (billing.postal_code !== undefined) {
      const postal = this.page.locator('[data-test="postal_code"]');
      await postal.fill(billing.postal_code);
      await postal.blur();
    }
    if (billing.house_number !== undefined) {
      const houseNumber = this.page.locator('[data-test="house_number"]');
      await houseNumber.fill(billing.house_number);
      await houseNumber.blur();
    }
    if (billing.street) {
      await this.page.locator('[data-test="street"]').fill(billing.street);
    }
    if (billing.city) {
      await this.page.locator('[data-test="city"]').fill(billing.city);
    }
    if (billing.state) {
      await this.page.locator('[data-test="state"]').fill(billing.state);
    }
  }

  postcodeLookupError() {
    return this.page.locator('[data-test="postcode-lookup-error"]');
  }

  async selectPaymentMethod(value) {
    await this.page.locator('[data-test="payment-method"]').selectOption(value);
  }

  finishButton() {
    return this.page.locator('[data-test="finish"]');
  }

  async clickConfirm() {
    const btn = this.finishButton();
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });
  }

  async clickConfirmTwice() {
    await this.clickConfirm();
    await this.page.locator('[data-test="payment-success-message"]').waitFor({
      state: 'visible',
      timeout: 15000,
    });
    const finish = this.finishButton();
    await expect(finish).toBeEnabled({ timeout: 10000 });
    await finish.click({ force: true });
    await expect.poll(async () => this.getInvoiceNumberFromPage(), { timeout: 30000 }).toMatch(/^INV-/);
  }

  async attemptPaymentDoubleConfirm() {
    await this.clickConfirm();
    await this.page.locator('[data-test="payment-success-message"]').waitFor({
      state: 'visible',
      timeout: 15000,
    });
    const finish = this.finishButton();
    if (await finish.isEnabled()) {
      await finish.click({ force: true });
    }
  }

  cartTotal() {
    return this.page.locator('[data-test="cart-total"]');
  }

  productQuantityInputs() {
    return this.page.locator('[data-test="product-quantity"]');
  }

  async setProductQuantity(index, quantity) {
    const input = this.productQuantityInputs().nth(index);
    await input.fill(String(quantity));
    await input.blur();
    await this.cartTotal().waitFor({ state: 'visible' });
  }

  async parseCartTotal() {
    const text = await this.cartTotal().textContent();
    return parseFloat(text.replace(/[^0.0-9.]/g, ''));
  }

  linePrices() {
    return this.page.locator('[data-test="product-price"], [data-test="line-price"]');
  }

  async getInvoiceNumberFromPage() {
    const bodyText = await this.page.locator('body').innerText();
    const match = bodyText.match(/INV-\d+/);
    return match ? match[0] : null;
  }
}

module.exports = { CheckoutPage };
