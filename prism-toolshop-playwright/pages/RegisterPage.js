const testConfig = require('../test-data/test-config.json');
const { expect } = require('@playwright/test');

class RegisterPage {
  constructor(page) {
    this.page = page;
    this.path = testConfig.ui.paths.register;
  }

  async goto() {
    await this.page.goto(this.path);
    await this.page.locator('#first_name').waitFor({ state: 'visible' });
  }

  async fillForm(data) {
    await this.page.locator('#first_name').fill(data.first_name);
    await this.page.locator('#last_name').fill(data.last_name);
    await this.page.locator('#dob').fill(data.dob);
    await this.page.locator('#country').selectOption(data.country);
    await this.page.locator('#postal_code').fill(data.postal_code);
    await this.page.locator('#house_number').fill(data.house_number);
    if (data.country === 'NL') {
      const street = this.page.locator('#street');
      await expect
        .poll(async () => (await street.inputValue()).trim(), { timeout: 15000 })
        .not.toBe('');
      const city = this.page.locator('#city');
      await expect
        .poll(async () => (await city.inputValue()).trim(), { timeout: 15000 })
        .not.toBe('');
    } else {
      await this.page.locator('#street').fill(data.street);
      await this.page.locator('#city').fill(data.city);
    }
    await this.page.locator('#state').fill(data.state);
    await this.page.locator('#phone').fill(data.phone);
    await this.page.locator('#email').fill(data.email);
    await this.page.locator('#password').fill(data.password);
  }

  async submit() {
    await this.page.getByRole('button', { name: /^register$/i }).click();
  }
}

module.exports = { RegisterPage };
