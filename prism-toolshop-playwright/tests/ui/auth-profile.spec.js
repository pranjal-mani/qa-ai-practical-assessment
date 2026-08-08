const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../../pages/RegisterPage');
const { LoginPage } = require('../../pages/LoginPage');
const { ProfilePage } = require('../../pages/ProfilePage');
const userTemplate = require('../../test-data/user.template.json');

function buildUiRegistration(uniqueSuffix, password) {
  const reg = userTemplate.registration;
  return {
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
    email: reg.email.replace('{unique}', uniqueSuffix),
    password,
  };
}

async function registerUser(page, unique, password) {
  const registerPage = new RegisterPage(page);
  const userData = buildUiRegistration(unique, password);
  await registerPage.goto();
  await registerPage.fillForm(userData);
  await registerPage.submit();
  await expect(page).toHaveURL(/\/auth\/login/);
  return userData;
}

test.describe('Auth and profile', () => {
  test('TC-UI-003 @Smoke @regression login and profile show registered user details', async ({ page }) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const password = `QaAuto!${unique}xY`;
    const userData = await registerUser(page, unique, password);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(userData.email, userData.password);
    await expect(page).toHaveURL(/\/account/);
    await page.waitForLoadState('networkidle');

    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await expect(await profilePage.getFirstName()).toBe(userData.first_name);
    await expect(await profilePage.getEmail()).toBe(userData.email);
  });

  test('TC-UI-004 @regression invalid login does not authenticate user', async ({ page }) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const password = `QaAuto!${unique}xY`;
    const userData = await registerUser(page, unique, password);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(userData.email, `WrongPass!${unique}`);
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
