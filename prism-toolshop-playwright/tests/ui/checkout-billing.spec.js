const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../../pages/RegisterPage');
const { LoginPage } = require('../../pages/LoginPage');
const { HomePage } = require('../../pages/HomePage');
const { ProductPage } = require('../../pages/ProductPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');
const userTemplate = require('../../test-data/user.template.json');
const billingUi = require('../../test-data/billing-ui.template.json');

async function loginAndAddProductToCart(page) {
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
  await homePage.openInStockProductByIndex(0);
  const productPage = new ProductPage(page);
  await productPage.waitForLoaded();
  await productPage.addToCart();
}

test('TC-UI-007 @regression checkout billing validation blocks invalid billing', async ({ page }) => {
  await loginAndAddProductToCart(page);

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.openCart();
  await checkoutPage.clickProceed1();
  await checkoutPage.clickProceed2();

  await test.step('missing house_number keeps proceed-3 disabled', async () => {
    await checkoutPage.fillBilling(billingUi.missingHouseNumber);
    await expect(checkoutPage.proceed3()).toBeDisabled();
  });

  await test.step('invalid postcode for country blocks checkout completion', async () => {
    await checkoutPage.fillBilling(billingUi.invalidPostcodeForCountry);
    await checkoutPage.fillBilling({ house_number: '1' });
    const hasPostcodeError = await checkoutPage.postcodeLookupError().isVisible();
    const proceedBlocked = await checkoutPage.proceed3().isDisabled();

    if (hasPostcodeError || proceedBlocked) {
      expect(hasPostcodeError || proceedBlocked).toBeTruthy();
      return;
    }

    await checkoutPage.clickProceed3();
    await checkoutPage.selectPaymentMethod(billingUi.paymentMethod);
    await checkoutPage.attemptPaymentDoubleConfirm();
    await expect.poll(async () => checkoutPage.getInvoiceNumberFromPage()).toBeNull();
  });
});
