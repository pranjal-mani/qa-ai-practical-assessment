const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../../pages/RegisterPage');
const { LoginPage } = require('../../pages/LoginPage');
const { HomePage } = require('../../pages/HomePage');
const { ProductPage } = require('../../pages/ProductPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');
const userTemplate = require('../../test-data/user.template.json');

async function loginAsNewUser(page) {
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
}

test('TC-UI-006 @regression multi-product cart recalculates total after quantity update', async ({ page }) => {
  await loginAsNewUser(page);

  const homePage = new HomePage(page);
  await homePage.goto();
  const firstHref = await homePage.openInStockProductByIndex(0);

  const productPage = new ProductPage(page);
  await productPage.waitForLoaded();
  const priceA = parseFloat(await productPage.unitPrice().textContent());
  await productPage.addToCart();

  await homePage.goto();
  const secondHref = await homePage.openInStockProductByIndex(1);
  expect(secondHref).not.toBe(firstHref);
  await productPage.waitForLoaded();
  const priceB = parseFloat(await productPage.unitPrice().textContent());
  await productPage.addToCart();
  await expect(page.locator('[data-test="cart-quantity"]')).toHaveText('2');

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.openCart();
  const initialTotal = await checkoutPage.parseCartTotal();
  expect(initialTotal).toBeCloseTo(priceA + priceB, 2);

  await checkoutPage.setProductQuantity(0, 2);
  await expect.poll(async () => checkoutPage.parseCartTotal(), { timeout: 10000 }).toBeCloseTo(
    priceA * 2 + priceB,
    2,
  );
});
