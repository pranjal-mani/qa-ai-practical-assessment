const testConfig = require('../test-data/test-config.json');

class InvoiceApi {
  constructor(request) {
    this.request = request;
    this.paths = testConfig.api.paths;
  }

  createInvoice(token, invoiceBody) {
    return this.request.post(this.paths.invoices, {
      data: invoiceBody,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  listInvoices(token, params = {}) {
    return this.request.get(this.paths.invoices, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getInvoice(token, invoiceId) {
    return this.request.get(`${this.paths.invoices}/${invoiceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

module.exports = { InvoiceApi };
