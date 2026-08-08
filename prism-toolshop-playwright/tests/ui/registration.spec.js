const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../../pages/RegisterPage');
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

test.describe('Registration', () => {
  test('TC-UI-001 @regression valid registration redirects to login', async ({ page }) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const password = `QaAuto!${unique}xY`;
    const userData = buildUiRegistration(unique, password);
    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.fillForm(userData);
    await registerPage.submit();

    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('TC-UI-002 @regression duplicate registration shows error and stays on register page', async ({ page }) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const password = `QaAuto!${unique}xY`;
    const userData = buildUiRegistration(unique, password);
    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.fillForm(userData);
    await registerPage.submit();
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30000 });

    await registerPage.goto();
    await registerPage.fillForm(userData);
    await registerPage.submit();

    await expect(page).toHaveURL(/\/auth\/register/);
    await expect(page.getByText(/already|exist|duplicate|registered/i)).toBeVisible();
  });
});
