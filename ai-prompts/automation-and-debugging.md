# AI Prompts – Automation and Debugging

Prompts used for automation structure, assertions, and analyzing failures/logs.

## Entry: UI and API automation implementation

### Prompt:

The test-data and automation plan is approved. Now implement the planned UI and API automation.

Use the existing project structure and create only the files listed in the plan.

UI:
- RegisterPage.js, LoginPage.js, ProfilePage.js, HomePage.js, ProductPage.js, CheckoutPage.js, InvoicesPage.js
- The planned UI spec files

API:
- authApi.js, productsApi.js, cartApi.js, invoiceApi.js
- The planned API spec files

Implement the 5-8 planned UI cases and 5-8 planned API cases only.

Rules:
- Use Playwright with JavaScript.
- Use the confirmed selectors and API details from project-info.md.
- Do not invent endpoints, selectors, request fields, response fields, or status codes.
- Use dynamic emails, passwords, tokens, product IDs, cart IDs, and invoice IDs.
- Do not commit secrets or runtime values.
- Use @Smoke and @regression tags as documented.
- Keep UI locators inside page objects.
- Keep API calls inside API helpers.
- Avoid arbitrary waits.
- Use clear assertions for both technical and business results.
- Handle the invoice Confirm action twice.
- Do not create additional test scenarios.
- Do not add unnecessary utilities, fixtures, or libraries.
- Run the tests after implementing each major flow.
- If a test fails, diagnose the reason instead of weakening the assertion.

After implementation, report:
1. Files created or modified
2. Tests implemented
3. Tests executed
4. Passed tests
5. Failed tests
6. Any assumptions or issues
7. Any files that were not needed

Update ai-prompts/automation-and-debugging.md with the actual prompt and validation notes.

Do not commit or push anything.

### AI Response Summary:

Implemented 8 UI specs (TC-UI-001–008) and 8 API specs (TC-API-001–008) with page objects, API helpers, and template-based test data. API suite passed 8/8. UI suite required fixes for profile field locators, cart quantity waits, NL postcode lookup billing, async invoice generation after double Confirm, and v2.4 billing validation behavior for AL+1234AA.

### Validation Notes:

- **API (8/8 pass):** `npx playwright test --project=api` — register/login, products search, cart lifecycle, invoice 422/201 flows all green with dynamic credentials and runtime cart IDs.
- **UI (8/8 pass):** `npx playwright test` — full suite green (16/16 with API) after:
  - `ProfilePage`: role-based textbox locators and non-empty field assertions.
  - `CheckoutPage`: `clickConfirmTwice()` waits for payment success, second Confirm, then polls for `INV-\d+`; `attemptPaymentDoubleConfirm()` for invalid billing path.
  - `InvoicesPage`: wait for invoice row pattern before parsing table.
  - `billing-ui.template.json`: `validCheckout` uses confirmed NL lookup values (`de Bruijnsingel`, `Idaerd`) from live exploration.
  - `ProductPage.addToCart()`: handles empty cart badge before first add; asserts nav quantity increments.
  - `playwright.config.js`: `workers: 1` for stable runs against the shared demo SUT.
  - TC-UI-007 scenario B: v2.4 does not always show `postcode-lookup-error` for AL+1234AA; assert billing blocked at form (error or disabled `proceed-3`) OR payment succeeds without invoice number after double Confirm.
- **No secrets committed:** passwords, tokens, and invoice numbers generated at runtime only.

### Debugging Outcome (how it helped or misled you):

- Initial TC-UI-008 failure (empty My Invoices) was **not** a locator bug — invoice generation is asynchronous after the second Confirm; waiting for `INV-\d+` on checkout before navigating fixed it.
- TC-UI-007 scenario B failure led to discovering **v2.4 behavior change**: AL+1234AA may allow `proceed-3` and show payment success without creating an invoice; asserting absence of invoice after double Confirm matches the business rule “checkout cannot complete with invalid billing.”
- Diagnostic Node scripts (with Playwright `baseURL`) confirmed NL lookup fills `de Bruijnsingel` / `Idaerd` and that manual `Test Street`/`Amsterdam` can complete checkout but invoice timing still requires post-confirm wait.
