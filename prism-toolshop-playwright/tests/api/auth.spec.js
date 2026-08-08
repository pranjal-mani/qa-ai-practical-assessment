const { test, expect } = require('@playwright/test');
const { AuthApi } = require('../../api/authApi');
const userTemplate = require('../../test-data/user.template.json');

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

test.describe('Auth API', () => {
  test('TC-API-001 @regression register user returns 201', async ({ request }) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const password = `QaAuto!${unique}xY`;
    const authApi = new AuthApi(request);
    const response = await authApi.register(buildApiRegistration(unique, password));

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.email).toBe(userTemplate.registration.email.replace('{unique}', unique));
    expect(body.first_name).toBe(userTemplate.registration.first_name);
  });

  test('TC-API-002 @regression duplicate registration returns 409', async ({ request }) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const password = `QaAuto!${unique}xY`;
    const userBody = buildApiRegistration(unique, password);
    const authApi = new AuthApi(request);

    const first = await authApi.register(userBody);
    expect(first.status()).toBe(201);

    const duplicate = await authApi.register(userBody);
    expect(duplicate.status()).toBe(409);
  });

  test('TC-API-003 @Smoke @regression login returns token and me returns user profile', async ({ request }) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const password = `QaAuto!${unique}xY`;
    const email = userTemplate.registration.email.replace('{unique}', unique);
    const authApi = new AuthApi(request);

    const registerResponse = await authApi.register(buildApiRegistration(unique, password));
    expect(registerResponse.status()).toBe(201);

    const loginResponse = await authApi.login(email, password);
    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    expect(loginBody.access_token).toBeTruthy();
    expect(loginBody.token_type).toBe('bearer');
    expect(loginBody.expires_in).toBeGreaterThan(0);

    const meResponse = await authApi.getMe(loginBody.access_token);
    expect(meResponse.status()).toBe(200);
    const meBody = await meResponse.json();
    expect(meBody.email).toBe(email);
    expect(meBody.first_name).toBe(userTemplate.registration.first_name);
  });

  test('TC-API-004 @regression invalid login returns 401', async ({ request }) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const password = `QaAuto!${unique}xY`;
    const email = userTemplate.registration.email.replace('{unique}', unique);
    const authApi = new AuthApi(request);

    await authApi.register(buildApiRegistration(unique, password));

    const loginResponse = await authApi.login(email, `WrongPass!${unique}`);
    expect(loginResponse.status()).toBe(401);
  });
});
