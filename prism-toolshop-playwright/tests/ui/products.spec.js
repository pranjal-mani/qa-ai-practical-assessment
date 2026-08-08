const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../../pages/RegisterPage');
const { LoginPage } = require('../../pages/LoginPage');
const { HomePage } = require('../../pages/HomePage');
const { ProductPage } = require('../../pages/ProductPage');
const userTemplate = require('../../test-data/user.template.json');
const searchTemplate = require('../../test-data/search.template.json');

async function loginAsNewUser(page) {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const password = `QaAuto!${unique}xY`;
  const reg = userTemplate.registration;
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
    email: reg.email.replace('{unique}', unique),
    password,
  });
  await registerPage.submit();
  await expect(page).toHaveURL(/\/auth\/login/);

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(reg.email.replace('{unique}', unique), password);
  await expect(page).toHaveURL(/\/account/);
}

test('TC-UI-005 @regression search and product details show expected elements', async ({ page }) => {
  await loginAsNewUser(page);

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.search(searchTemplate.term);

  const resultCount = await homePage.productLinks().count();
  expect(resultCount).toBeGreaterThan(0);

  await homePage.openProductByIndex(0);
  const productPage = new ProductPage(page);
  await productPage.waitForLoaded();

  await expect(productPage.unitPrice()).toBeVisible();
  await expect(productPage.productDescription()).toBeVisible();
  await expect(productPage.addToCartButton()).toBeVisible();
});
