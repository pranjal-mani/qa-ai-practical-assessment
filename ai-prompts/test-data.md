# AI Prompts – Test Data

Prompts used to generate test data for UI + API.

---

## Entry 1 — Minimum test data and automation plan

### Prompt:

Prepare the minimum test data and automation plan using project-info.md and FunctionalTestCase.csv.

Cover all 8 drafted manual cases (registration, duplicate, login/profile, invalid login, search/details, cart qty/total, billing validation, COD double Confirm + My Invoices).

Update only necessary documentation and prompt-history files.

Do not create UI/API test code, unnecessary files, invented selectors/endpoints, or hardcoded passwords/tokens/product/cart/invoice IDs.

Show: test-data files, UI cases, API cases, smoke/regression, page objects, API helpers.

### AI Response Summary:

- Extended `test-config.json` with confirmed UI/API paths only.
- Added four template files: `user.template.json`, `billing-ui.template.json`, `search.template.json`, `billing-api-invalid.template.json`.
- Updated `invoice-payload.template.json` to use `{cartId}` placeholder.
- Documented test data strategy, 8 UI + 8 API automation cases, smoke/regression split, and planned page objects/API helpers in `project-info.md`.

### Validation Notes:

| Check | Result |
|-------|--------|
| No hardcoded secrets | Passwords use `{generatedPassword}` / `{invalidPassword}`; tokens/IDs use runtime placeholders |
| Selectors/endpoints | Only from `project-info.md` Application Behavior Analysis |
| Manual coverage | Each TC-MAN-001–008 maps to TC-UI-xxx and TC-API-xxx |
| File minimization | Reused existing `invoice-payload.template.json`; no duplicate API valid billing file (TG example already there) |
| UI billing negatives | `billing-ui.template.json` only; API 422 uses separate invalid template |

### Changes Made:

| File | Change |
|------|--------|
| `test-config.json` | Added confirmed `paths` for UI and API |
| `user.template.json` | Registration + invalid-login placeholders |
| `billing-ui.template.json` | Valid NL, missing house_number, invalid AL+postcode, COD method |
| `search.template.json` | Search term `Pliers` |
| `billing-api-invalid.template.json` | API invoice body for billing validation negative |
| `invoice-payload.template.json` | `cart_id` → `{cartId}` |
| `project-info.md` | Test Data Strategy + Automation Plan sections |
| `ai-prompts/test-data.md` | This entry |

### Reasons for Changes:

- **Templates vs committed credentials:** Assessment and security rules require runtime generation for email/password/token/IDs.
- **Separate UI vs API billing files:** UI uses NL/AL scenarios from exploration; API valid COD uses confirmed TG example in `invoice-payload.template.json`; invalid API billing is a distinct negative payload.
- **8+8 automation cases:** Mirrors manual suite within assessment limits; smoke subset matches `project-info.md` (login/profile + full checkout/invoice path).
- **Seven page objects / four API helpers:** Minimum Prism-style split aligned to confirmed routes without duplicate cart/checkout layers.
