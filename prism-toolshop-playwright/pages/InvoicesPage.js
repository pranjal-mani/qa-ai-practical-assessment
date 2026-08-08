const testConfig = require('../test-data/test-config.json');

class InvoicesPage {
  constructor(page) {
    this.page = page;
    this.path = testConfig.ui.paths.invoices;
  }

  async goto() {
    await this.page.goto(this.path);
    await this.page.locator('[data-test="page-title"]').waitFor({ state: 'visible' });
  }

  invoiceRows() {
    return this.page.locator('table tbody tr');
  }

  async getInvoiceNumbers() {
    await this.page.getByText(/INV-\d+/).first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => null);
    const rows = this.invoiceRows();
    const count = await rows.count();
    const numbers = [];
    for (let i = 0; i < count; i++) {
      const firstCell = await rows.nth(i).locator('td').first().textContent();
      if (firstCell && /INV-/.test(firstCell)) {
        numbers.push(firstCell.trim());
      }
    }
    return numbers;
  }
}

module.exports = { InvoicesPage };
