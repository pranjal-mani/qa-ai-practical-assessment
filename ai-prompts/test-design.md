# AI Prompts – Test Design

Prompts used to generate or refine test scenarios and test cases for UI + API.

---

## Entry 1 — Manual test suite (FunctionalTestCase.csv)

### Prompt:

The application analysis phase is complete and committed. Now let's create the manual test suite based only on the confirmed behavior in project-info.md.

Keep it focused and within the assessment limit. Create approximately 5-8 test cases covering the highest-value Toolshop flows:

1. Valid user registration
2. Duplicate registration or invalid registration
3. Valid login and profile verification
4. Invalid login
5. Product search and product details
6. Add multiple products and update quantity
7. Checkout with Cash on Delivery, including the required house_number field
8. Invoice generation, including pressing Confirm twice, followed by My Invoices verification

Use a balanced mix of:
- @Smoke
- @regression
- Positive
- Negative
- Edge cases

Follow the CSV structure:

Test Case ID, Title/Description, Precondition, Test Data, Steps, Expected Result, Actual Result, Status, Type, Priority, Remarks

Also update requirement-to-test traceability matrix in project-info.md.

Update ai-prompts/test-design.md with prompt, summary, validation notes, changes, and reasons.

Do not create UI or API automation yet. Do not commit or push.

### AI Response Summary:

- Designed **8 manual test cases** in `FunctionalTestCase.csv` aligned to `project-info.md` only (no speculative flows).
- Mapped each case to AC1/AC2 UI acceptance criteria and confirmed risks (duplicate registration, invalid login, search, cart totals, house_number, billing validation, double Confirm, My Invoices).
- Tag mix: **@Smoke** on TC-MAN-003 and TC-MAN-008; **@regression** on all; types Positive (4), Negative (3), Edge (1).
- All **Status = ToDo** — no manual execution claimed.
- Added requirement-to-test traceability table to `project-info.md`.

### Validation Notes:

| Check | Result |
|-------|--------|
| Count within 5–8 | 8 cases |
| Steps executable | Steps reference confirmed URLs, `data-test` ids, and wizard buttons from exploration |
| Expected results observable | Redirects, table columns, disabled `proceed-3`, invoice pattern `INV-YYYY######`, cart total formula |
| No false PASS | Actual Result blank; Status ToDo for every case |
| Risk coverage | TC-MAN-002 duplicate; TC-MAN-004 invalid login; TC-MAN-007 house_number + postcode/country; TC-MAN-008 double Confirm + My Invoices |
| Source of truth | Only `project-info.md` confirmed behavior (no Google OAuth, guest checkout, or unverified API UI paths) |

### Changes Made:

| File | Change |
|------|--------|
| `FunctionalTestCase.csv` | Replaced header row; added 8 manual test cases with full columns |
| `project-info.md` | Added Requirement-to-Test Traceability Matrix (Manual UI) |
| `ai-prompts/test-design.md` | This entry |

### Reasons for Changes:

- **8 cases vs merging flows:** User listed 8 distinct flows; each maps to one case while staying within the assessment cap (5–8 per type).
- **TC-MAN-007 combines billing negatives:** Missing `house_number` and AL+1234AA postcode mismatch are two scenarios in one case to avoid exceeding 8 cases while covering both confirmed risks.
- **TC-MAN-008 is @Smoke E2E:** Single highest-value path (COD + double Confirm + My Invoices) per smoke scope in `project-info.md`.
- **Duplicate vs invalid registration:** TC-MAN-002 targets duplicate email (confirmed API 409 pattern); invalid format noted in remarks rather than a separate case to limit count.
- **ToDo status:** Exploration during analysis phase is not manual test execution; cases remain not run until explicit manual QA pass.
