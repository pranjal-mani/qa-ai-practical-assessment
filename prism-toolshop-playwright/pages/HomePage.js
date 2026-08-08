const testConfig = require('../test-data/test-config.json');

class HomePage {
  constructor(page) {
    this.page = page;
    this.path = testConfig.ui.paths.home;
  }

  async goto() {
    await this.page.goto(this.path);
    await this.page.locator('[data-test="search-query"]').waitFor({ state: 'visible' });
    await this.productLinks().first().waitFor({ state: 'visible', timeout: 30000 });
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

  async openInStockProductByIndex(stockIndex) {
    await this.productLinks().first().waitFor({ state: 'visible', timeout: 30000 });
    const linkCount = await this.productLinks().count();
    let inStockCount = 0;

    for (let i = 0; i < linkCount; i++) {
      const href = await this.productLinks().nth(i).getAttribute('href');
      await this.page.goto(href);
      await this.page.waitForURL(/\/product\//);

      const addBtn = this.page.locator('[data-test="add-to-cart"]');
      try {
        await addBtn.waitFor({ state: 'visible', timeout: 15000 });
      } catch {
        await this.goto();
        continue;
      }
      if (await addBtn.isEnabled()) {
        if (inStockCount === stockIndex) {
          return href;
        }
        inStockCount += 1;
      }
      await this.goto();
    }

    throw new Error(`In-stock product not found for stock index ${stockIndex}`);
  }
}

module.exports = { HomePage };
