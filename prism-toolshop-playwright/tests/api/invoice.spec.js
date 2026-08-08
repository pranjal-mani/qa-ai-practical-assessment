const { test, expect } = require('@playwright/test');
const { AuthApi } = require('../../api/authApi');
const { ProductsApi } = require('../../api/productsApi');
const { CartApi } = require('../../api/cartApi');
const { InvoiceApi } = require('../../api/invoiceApi');
const userTemplate = require('../../test-data/user.template.json');
const invoiceTemplate = require('../../test-data/invoice-payload.template.json');
const invalidBillingTemplate = require('../../test-data/billing-api-invalid.template.json');

function buildApiRegistration(uniqueSuffix, password) {
  const reg = userTemplate.registration;
  return {
    first_name: reg.first_name,
    last_name: reg.last_name,
    email: reg.email.replace('{unique}', uniqueSuffix),
    password,
    dob: reg.dob,
    phone: reg.phone,
    address: {
      street: reg.street,
      house_number: reg.house_number,
      city: reg.city,
      state: reg.state,
      country: 'Netherlands',
      postal_code: reg.postal_code,
    },
  };
}

async function registerAndLogin(request, unique, password) {
  const authApi = new AuthApi(request);
  const email = userTemplate.registration.email.replace('{unique}', unique);
  await authApi.register(buildApiRegistration(unique, password));
  const loginResponse = await authApi.login(email, password);
  expect(loginResponse.status()).toBe(200);
  const token = (await loginResponse.json()).access_token;
  return { authApi, token, email };
}

test.describe('Invoice API', () => {
  test('TC-API-007 @regression invalid billing on invoice returns 422', async ({ request }) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const password = `QaAuto!${unique}xY`;
    const { token } = await registerAndLogin(request, unique, password);
    const cartApi = new CartApi(request);
    const productsApi = new ProductsApi(request);
    const invoiceApi = new InvoiceApi(request);

    const products = (await (await productsApi.listProducts()).json()).data;
    const cartId = (await (await cartApi.createCart()).json()).id;
    await cartApi.addItem(cartId, products[0].id, 1);

    const invalidBody = {
      ...invalidBillingTemplate,
      cart_id: cartId,
    };
    delete invalidBody._note;

    const response = await invoiceApi.createInvoice(token, invalidBody);
    expect(response.status()).toBe(422);
  });

  test('TC-API-008 @Smoke @regression create COD invoice and list invoices', async ({ request }) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const password = `QaAuto!${unique}xY`;
    const { token } = await registerAndLogin(request, unique, password);
    const cartApi = new CartApi(request);
    const productsApi = new ProductsApi(request);
    const invoiceApi = new InvoiceApi(request);

    const products = (await (await productsApi.listProducts()).json()).data;
    const productA = products[0];
    const productB = products[1];

    const cartId = (await (await cartApi.createCart()).json()).id;
    await cartApi.addItem(cartId, productA.id, 3);
    await cartApi.addItem(cartId, productB.id, 2);

    const invoiceBody = {
      billing_street: invoiceTemplate.billing_street,
      billing_city: invoiceTemplate.billing_city,
      billing_state: invoiceTemplate.billing_state,
      billing_country: invoiceTemplate.billing_country,
      billing_postal_code: invoiceTemplate.billing_postal_code,
      payment_method: invoiceTemplate.payment_method,
      payment_details: invoiceTemplate.payment_details,
      cart_id: cartId,
    };

    const createResponse = await invoiceApi.createInvoice(token, invoiceBody);
    expect(createResponse.status()).toBe(201);
    const invoice = await createResponse.json();
    expect(invoice.invoice_number).toMatch(/^INV-/);
    expect(invoice.id).toBeTruthy();
    expect(invoice.total).toBeGreaterThan(0);

    const listResponse = await invoiceApi.listInvoices(token);
    expect(listResponse.status()).toBe(200);
    const listBody = await listResponse.json();
    const listed = listBody.data.find((row) => row.id === invoice.id);
    expect(listed).toBeTruthy();
    expect(listed.invoice_number).toBe(invoice.invoice_number);
    expect(listed.payment.payment_method).toBe('cash-on-delivery');

    const detailResponse = await invoiceApi.getInvoice(token, invoice.id);
    expect(detailResponse.status()).toBe(200);
    const detailBody = await detailResponse.json();
    expect(detailBody.id).toBe(invoice.id);
    expect(detailBody.invoicelines.length).toBeGreaterThan(0);
  });
});
