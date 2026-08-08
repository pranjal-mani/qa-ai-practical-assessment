const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../../pages/RegisterPage');
const { LoginPage } = require('../../pages/LoginPage');
const { HomePage } = require('../../pages/HomePage');
const { ProductPage } = require('../../pages/ProductPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');
const { InvoicesPage } = require('../../pages/InvoicesPage');
const userTemplate = require('../../test-data/user.template.json');
const billingUi = require('../../test-data/billing-ui.template.json');

test('TC-UI-008 @Smoke @regression COD checkout with double confirm and My Invoices listing', async ({ page }) => {
  test.setTimeout(120000);
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const password = `QaAuto!${unique}xY`;
  const reg = userTemplate.registration;
  const email = reg.email.replace('{unique}', unique);

  const registerPage = new RegisterPage(page);
  await registerPage.goto();
  await registerPage.fillForm({
    first_name: reg.first_name,
    last_name: reg.last_name,
    dob: reg.dob,
    country: reg.country,
    postal_code: reg.postal_code,
    house_number: reg.house_number,
    street: reg.street,
    city: reg.city,
    state: reg.state,
    phone: reg.phone,
    email,
    password,
  });
  await registerPage.submit();
  await expect(page).toHaveURL(/\/auth\/login/);

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
  await expect(page).toHaveURL(/\/account/);

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.openProductByIndex(0);
  const productPage = new ProductPage(page);
  await productPage.waitForLoaded();
  await productPage.addToCart();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.openCart();
  await checkoutPage.clickProceed1();
  await checkoutPage.clickProceed2();
  await checkoutPage.fillBilling(billingUi.validCheckout);
  await expect(checkoutPage.proceed3()).toBeEnabled({ timeout: 15000 });
  await checkoutPage.clickProceed3();
  await checkoutPage.selectPaymentMethod(billingUi.paymentMethod);
  await checkoutPage.clickConfirmTwice();

  const invoiceNumber = await checkoutPage.getInvoiceNumberFromPage();
  expect(invoiceNumber).toMatch(/^INV-\d+/);

  const invoicesPage = new InvoicesPage(page);
  await invoicesPage.goto();
  const listedNumbers = await invoicesPage.getInvoiceNumbers();
  expect(listedNumbers.length).toBeGreaterThan(0);
  expect(listedNumbers).toContain(invoiceNumber);

  const rows = invoicesPage.invoiceRows();
  await expect(rows.first()).toBeVisible();
  const rowText = await rows.first().textContent();
  expect(rowText).toContain(invoiceNumber);
  expect(rowText).toMatch(/\$\d+\.\d{2}/);
});
