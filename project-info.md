# Project Info

Primary AI Tool(s) Used: Cursor

Application Under Test: Practice Software Testing Toolshop – Checkout & Application Flow

Assessment Start Date: 2026-08-08

Submission Date:

## Project Summary

Exploration and test planning for the Toolshop ecommerce application (UI + API): user registration/login, product browse/search, cart management, multi-step checkout with Cash on Delivery, double-confirm invoice generation, and My Invoices verification.

## Tools Used

- Cursor (requirements analysis, exploration)
- Playwright (exploration scripts — not committed)
- OpenAPI spec: `https://api.practicesoftwaretesting.com/docs`

## Requirement and Risk Analysis

### Confirmed functional scope (assignment)

- AC1 UI: Registration, login, profile verification
- AC2 UI: Browse products, cart (multiple items, quantity update), COD checkout, invoice, My Invoices
- AC1 API: Register, login, bearer token, create cart
- AC2 API: List products, add to cart, verify cart, generate invoice

### Risks and test considerations

| Risk | Impact | Notes (confirmed) |
|------|--------|-----------------|
| Billing address validation | Checkout blocked or invoice fails | UI validates postcode against country; API returns 422 if `billing_country` does not match city/postcode |
| `house_number` required at checkout | `proceed-3` stays disabled | Profile address may omit house number on billing step until filled |
| Double Confirm on invoice | Automation fails if only one click | UI uses `[data-test="finish"]` ("Confirm") twice; invoice number appears after second confirm |
| Password policy / leak check | Registration fails (422) | API rejects passwords appearing in breach lists; use unique strong passwords |
| Auth required for invoices | 401 without token | UI `/account/invoices` redirects to login when unauthenticated |
| Live SUT dependency | Flaky runs | Third-party hosted app; product IDs and stock change over time |
| Cart session | Stale cart state | UI `nav-cart` badge reflects quantity; successful checkout should clear cart |

### Smoke vs regression (planned)

| Tag | Planned focus |
|-----|----------------|
| `@Smoke` | Login, single product add-to-cart, COD checkout, invoice visible |
| `@regression` | Registration, search, multi-product cart, quantity update, profile check, API full lifecycle |

---

## Application Behavior Analysis (Confirmed 2026-08-08)

Exploration method: live UI (Playwright headless) + live API calls + OpenAPI 5.0.0 at `https://api.practicesoftwaretesting.com/docs`.

### UI — General

| Item | Confirmed behavior |
|------|-------------------|
| Base URL | `https://practicesoftwaretesting.com` |
| App version | Toolshop v5.0 (page title) |
| Auth guard | `/account/*` routes require login (e.g. `/account/invoices` → `/auth/login` when unauthenticated) |

### Registration

| Item | Detail |
|------|--------|
| URL | `/auth/register` |
| Required fields | `first_name`, `last_name`, `dob` (YYYY-MM-DD), `country` (select), `postal_code`, `house_number`, `street`, `city`, `state`, `phone`, `email`, `password` |
| `data-test` ids | `first-name`, `last-name`, `dob`, `country`, `postal_code`, `house_number`, `street`, `city`, `state`, `phone`, `email`, `password` |
| Submit | Button labeled "Register" |
| After success | Redirects to `/auth/login` (does **not** auto-login) |

### Login

| Item | Detail |
|------|--------|
| URL | `/auth/login` |
| Fields | `email`, `password` — `data-test`: `email`, `password` |
| Submit | `input[type="submit"][data-test="login-submit"]` (value "Login") |
| After success | Redirects to `/account` |
| OAuth | "Sign in with Google" button present (out of scope for assignment) |

### Profile verification

| Item | Detail |
|------|--------|
| URL | `/account/profile` |
| Confirmed | Displays registered `first_name` and `email` matching registration |

### Product browsing / search

| Item | Detail |
|------|--------|
| Home `/` | Paginated product grid (~9 products per page); category nav (Hand Tools, Power Tools, etc.) |
| Product links | `/product/{productId}` |
| Search | `input[data-test="search-query"]` — searching "Pliers" filters listing (confirmed 4 matches) |
| Sort / filters | Sort (name/price/CO₂), price range slider, category/brand/sustainability filters on home |
| Product detail | `data-test`: `product-name`, `unit-price`, `product-description`, `co2-rating-badge`, `quantity`, `increase-quantity`, `decrease-quantity`, `add-to-cart`, `add-to-favorites` |

### Add to cart

| Item | Detail |
|------|--------|
| Action | Click `[data-test="add-to-cart"]` on product detail |
| Cart access | `[data-test="nav-cart"]` — opens checkout/cart view when items present |
| Badge | `[data-test="cart-quantity"]` shows item count |

### Cart (multiple products, quantity, totals)

| Item | Detail |
|------|--------|
| View | `nav-cart` navigates to checkout flow (URL `/checkout`) with cart contents |
| Line items | `data-test`: `product-title` / `product-name`, `product-quantity`, `product-price`, `line-price` |
| Quantity update | Edit `[data-test="product-quantity"]` — total recalculates on blur (confirmed: 2× $14.15 + 1× $12.01 = **$40.31**) |
| Total | `[data-test="cart-total"]` (subtotal `data-test="cart-subtotal"` not always present) |
| Empty cart | Navigating to `/cart` without items redirects to home |

### Checkout (multi-step wizard)

| Step | Control | Confirmed behavior |
|------|---------|-------------------|
| 1 – Cart review | `[data-test="proceed-1"]` | "Proceed to checkout" |
| 2 – Billing | `[data-test="proceed-2"]` | Billing fields: `country`, `postal_code`, `house_number`, `street`, `city`, `state`; postcode lookup hint/error (`postcode-lookup-hint`, `postcode-lookup-error`) |
| 3 – Enable payment | `[data-test="proceed-3"]` | Enabled only when billing valid (including `house_number`) |
| 4 – Payment | `[data-test="payment-method"]` select | Options: `bank-transfer`, `cash-on-delivery`, `credit-card`, `buy-now-pay-later`, `gift-card` |
| Confirm | `[data-test="finish"]` | Label "Confirm" |

### Cash on Delivery

| Item | Detail |
|------|--------|
| UI | Select `cash-on-delivery` in `[data-test="payment-method"]` |
| API | `payment_method: "cash-on-delivery"` with `payment_details: {}` |

### Invoice generation & double confirm

| Item | Detail |
|------|--------|
| First Confirm | Click `[data-test="finish"]` — advances payment confirmation step |
| Second Confirm | Click `[data-test="finish"]` again — invoice generated |
| Success signals | Invoice number pattern `INV-YYYY######` on checkout page; `[data-test="payment-success-message"]` may show "Payment was successful" |
| Valid billing example (UI) | Country `NL`, postal `1234AA`, house `42` — postcode lookup may auto-fill street (e.g. "de Bruijnsingel") |

### My Invoices

| Item | Detail |
|------|--------|
| URL | `/account/invoices` (nav: `[data-test="nav-my-invoices"]`) |
| Layout | Table columns: Invoice Number, Billing Address, Invoice Date, Total, Details |
| Confirmed row | `INV-2026000004`, billing address, `2026-08-08 08:55:27`, `$14.15`, Details link |

---

## API Behavior Analysis (OpenAPI + live verification)

Base URL: `https://api.practicesoftwaretesting.com`

OpenAPI: `https://api.practicesoftwaretesting.com/docs` (Toolshop API v5.0.0)

### Authentication flow

| Step | Endpoint | Method | Headers | Body | Success response |
|------|----------|--------|---------|------|------------------|
| Register | `/users/register` | POST | `Content-Type: application/json` | `UserRequest` | **201** + `UserResponse` |
| Login | `/users/login` | POST | `Content-Type: application/json` | `email`, `password` (required) | **200** + `access_token`, `token_type` (`bearer`), `expires_in` (300s observed) |
| Current user | `/users/me` | GET | `Authorization: Bearer {token}` | — | **200** + `UserResponse` |

Security scheme: HTTP Bearer JWT (`apiAuth`).

### Products

| Endpoint | Method | Auth | Query/body | Success |
|----------|--------|------|------------|---------|
| `/products` | GET | No | `by_brand`, `by_category`, `is_rental`, `between`, `sort`, `page` | **200** paginated `ProductResponse[]` |
| `/products/{productId}` | GET | No | path `productId` | **200** `ProductResponse` |
| `/products/search` | GET | No | `q` (required), `page` | **200** paginated (search on `name`) |

`ProductResponse` fields (confirmed): `id`, `name`, `description`, `price`, `is_location_offer`, `is_rental`, `in_stock`, `co2_rating`, `is_eco_friendly`, `brand`, `category`, `product_image`.

### Cart lifecycle

| Endpoint | Method | Auth | Request body | Success |
|----------|--------|------|--------------|---------|
| `/carts` | POST | No | — | **201** `{ "id": "<cartId>" }` |
| `/carts/{id}` | POST | No | `product_id`, `quantity` (required) | **200** `{ "result": "item added or updated" }` |
| `/carts/{cartId}` | GET | No | — | **200** `CartResponse` with `cart_items[]` (quantity, product_id, nested `product`) |
| `/carts/{cartId}/product/quantity` | PUT | No | `product_id`, `quantity` | **200** update result |
| `/carts/{cartId}/product/{productId}` | DELETE | Yes | — | **204** |

### Invoice lifecycle

| Endpoint | Method | Auth | Request body | Success |
|----------|--------|------|--------------|---------|
| `/invoices` | POST | Yes | `InvoiceRequest` (see below) | **201** observed (OpenAPI documents 200) |
| `/invoices` | GET | Yes | query `page` | **200** paginated `InvoiceResponse[]` |
| `/invoices/{invoiceId}` | GET | Yes | — | **200** `InvoiceResponse` |

`InvoiceRequest` required fields: `billing_street`, `billing_city`, `billing_state`, `billing_country`, `billing_postal_code`, `payment_method`, `payment_details`, `cart_id`.

`payment_method` enum: `bank-transfer`, `cash-on-delivery`, `credit-card`, `buy-now-pay-later`, `gift-card`.

Confirmed COD payload example (live **201**):

```json
{
  "billing_street": "Zoey Shore",
  "billing_city": "Hesselbury",
  "billing_state": "Florida",
  "billing_country": "TG",
  "billing_postal_code": "1234AA",
  "payment_method": "cash-on-delivery",
  "cart_id": "<cartId>",
  "payment_details": {}
}
```

`InvoiceResponse` fields (confirmed): `id`, `user_id`, `invoice_number`, `invoice_date`, `billing_*`, `subtotal`, `total`, `status` (e.g. `AWAITING_FULFILLMENT`), `invoicelines[]`, `payment.payment_method`.

Error codes observed: **401** unauthorized, **422** validation (billing country mismatch, password policy).

---

## AI Workflow (Setup Summary)

1. How you provide **project and system-under-test context** to the tool.
2. How you use AI for **requirement analysis**.
3. How you use AI for **test planning and strategy** (UI vs API, smoke vs regression, etc.).
4. How you use AI for **manual test case design** (functional, edge, negative, non-functional).
5. How you use AI for **automation design** (framework choice, structure, data, reusable utilities).
6. How you validate and refine **AI-generated test cases and scripts**.
7. How you use AI for **test data generation**, environment assumptions, and API payloads.
8. How you use AI for **debugging failing tests** and interpreting logs.
9. What information you avoid sharing unnecessarily with AI tools.
10. How you would **reuse this QA workflow** in a real project.

## Test Scope

### UI (Smoke / Regression)

- Smoke: login (existing user or register+login), add one product, COD checkout with double confirm, invoice in My Invoices
- Regression: registration, profile check, search, two products in cart, quantity update and total verification, full checkout wizard steps

### API (Smoke / Regression)

- Smoke: login → token → create cart → add product → POST invoice (COD)
- Regression: register → login → list/search products → multi-item cart → quantity PUT → GET cart → POST invoice → GET invoices list → GET invoice by id

### Positive / Negative / Edge Coverage

- Positive: valid registration, valid billing (NL+1234AA or assessment TG example), in-stock products
- Negative: invalid login (401), invalid billing country (422), weak/leaked password (422), checkout without house_number
- Edge: quantity update on cart line, multiple products, double confirm before invoice id appears
