const testConfig = require('../test-data/test-config.json');
const { expect } = require('@playwright/test');

class ProfilePage {
  constructor(page) {
    this.page = page;
    this.path = testConfig.ui.paths.profile;
  }

  async goto() {
    await this.page.goto(this.path);
    await this.page.getByRole('textbox', { name: 'First name' }).waitFor({ state: 'visible' });
  }

  async getFirstName() {
    const field = this.page.getByRole('textbox', { name: 'First name' });
    await expect(field).not.toHaveValue('', { timeout: 15000 });
    return field.inputValue();
  }

  async getEmail() {
    const field = this.page.getByRole('textbox', { name: 'Email address' });
    await expect(field).not.toHaveValue('', { timeout: 15000 });
    return field.inputValue();
  }
}

module.exports = { ProfilePage };
