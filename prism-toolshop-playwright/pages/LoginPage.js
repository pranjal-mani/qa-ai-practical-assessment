const testConfig = require('../test-data/test-config.json');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.path = testConfig.ui.paths.login;
  }

  async goto() {
    await this.page.goto(this.path);
    await this.page.locator('#email').waitFor({ state: 'visible' });
  }

  async login(email, password) {
    await this.page.locator('#email').fill(email);
    await this.page.locator('#password').fill(password);
    await this.page.locator('[data-test="login-submit"]').click();
  }
}

module.exports = { LoginPage };
