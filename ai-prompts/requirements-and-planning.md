# AI Prompts – Requirements and Planning

Record prompts and responses used for understanding the Toolshop flow, identifying risks, and drafting the test plan.

---

## Entry 1 — Application exploration before test design

### Prompt:

Now let's analyse the application before designing the final tests.

UI:
https://practicesoftwaretesting.com/

API documentation:
https://api.practicesoftwaretesting.com/api/documentation

Explore and document the confirmed behavior for:

- Registration
- Login
- Product browsing or search
- Product details
- Adding products to the cart
- Multiple products in the cart
- Quantity update
- Cart totals
- Checkout
- Cash on Delivery
- Invoice generation
- My Invoices
- Invoice confirmation behavior

Also, please inspect the API documentation and record only confirmed details:

- Endpoint paths
- HTTP methods
- Headers
- Authentication flow
- Request fields
- Response fields
- Expected status codes

Update the appropriate planning and requirements documentation. Also record this actual prompt and the validation notes in:
ai-prompts/requirements-and-planning.md

Do not write automation code yet.

### AI Response (short summary):

- Fetched OpenAPI 5.0.0 from `https://api.practicesoftwaretesting.com/docs` and exercised key endpoints live (register, login, products, cart, invoice).
- Ran headless Playwright exploration against the UI for registration, login, profile, search, cart, multi-step checkout, COD payment, double Confirm (`data-test="finish"`), and My Invoices listing.
- Updated `project-info.md` with confirmed UI flows, API contract details, risks, and smoke/regression scope.
- Removed temporary local exploration scripts (not committed as automation).

### Validation Notes:

| Area | How validated |
|------|----------------|
| API register/login | Live POST returned **201** / **200** with `access_token`; GET `/users/me` **200** |
| API products/cart | GET `/products` **200**; POST `/carts` **201**; add/update items **200**; GET cart shows `cart_items` with quantities |
| API invoice | POST `/invoices` **201** with assessment billing example (`TG` / Hesselbury); GET `/invoices` lists invoice with `AWAITING_FULFILLMENT` |
| API errors | **422** for mismatched `billing_country`; **401** without bearer token |
| UI registration/login | Redirect to `/auth/login` after register; login → `/account`; profile shows registered name/email |
| UI cart/totals | Two products added; quantity 2 on first line changed total to **$40.31** (14.15×2 + 12.01) |
| UI checkout | Wizard steps `proceed-1` → `proceed-2` (billing) → `proceed-3` (payment); `house_number` required to enable step 3 |
| UI COD | Payment select `cash-on-delivery` at `[data-test="payment-method"]` |
| Double confirm | Two clicks on `[data-test="finish"]`; invoice `INV-2026000004` on checkout page after second click |
| My Invoices | `/account/invoices` table row with invoice number, billing address, date, total **$14.15** (NL billing + valid postcode) |
| OpenAPI vs live | Invoice POST documented as 200 in OpenAPI but returned **201** in practice — documented both |

**Gaps / not fully confirmed:** Guest checkout UI path; Google OAuth login; exact invoice detail page after clicking "Details" in My Invoices (not opened in this pass).
