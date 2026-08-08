const testConfig = require('../test-data/test-config.json');

class HomePage {
  constructor(page) {
    this.page = page;
    this.path = testConfig.ui.paths.home;
  }

  async goto() {
    await this.page.goto(this.path);
    await this.page.locator('[data-test="search-query"]').waitFor({ state: 'visible' });
  }

  async search(term) {
    const searchInput = this.page.locator('[data-test="search-query"]');
    await searchInput.fill(term);
    await searchInput.press('Enter');
    await this.page.locator('a[href*="/product/"]').first().waitFor({ state: 'visible' });
  }

  productLinks() {
    return this.page.locator('a[href*="/product/"]');
  }

  async openProductByIndex(index) {
    const link = this.productLinks().nth(index);
    await link.waitFor({ state: 'visible' });
    const href = await link.getAttribute('href');
    await this.page.goto(href);
    await this.page.waitForURL(/\/product\//);
  }
}

module.exports = { HomePage };
