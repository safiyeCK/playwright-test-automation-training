# Playwright Training

## Setup and Run

1. For the initial setup:

```bash
npm run installWebsite
```

This command does the following:

- Installs backend packages (`demoplaywright/back`)
- Builds the backend (TypeScript -> JavaScript)
- Installs frontend packages (`demoplaywright/vite-app`)

2. To start the website:

```bash
npm run runWebsite
```

This command starts both backend and frontend in new PowerShell windows.

3. To run them separately:

```bash
npm run runBackend
npm run runFrontend
```

4. To reset the data:

```bash
npm run clearDatabase
```

## Test Commands

```bash
npx playwright test
npx playwright test --ui
npx playwright test --headed
npx playwright test --debug
```

## Exercise Checklist

We can use the checklist below to progress step by step.

### 0) Preparation

- [ ] `npm run installWebsite` runs successfully
- [ ] `npm run runWebsite` brings up backend + frontend
- [ ] Login screen opens manually
- [ ] Existing tests run with `npx playwright test`

### 1) Login Tests (`tests/login.spec.ts`)

- [x] Positive login (OK button)
- [x] Positive login (Enter key)
- [x] Negative login (invalid username/password)
- [x] Empty credential scenarios
- [ ] Make test steps more readable with `test.step()`
- [ ] Move repeated login steps to helper/POM

### 2) Navigation and Basic UI Checks

- [ ] `Persons` link visibility after login
- [ ] `Persons <-> Pets` navigation
- [ ] Table column visibility (`Full Name`, `Age`, `Sex`, etc.)
- [ ] Logout flow

### 3) Persons CRUD Tests

- [ ] Verify person list loads (`/items/person` result appears in table)
- [ ] Add new person
- [ ] Update person (`Update`)
- [ ] Delete person (`Delete`)
- [ ] Form validations (required fields)

### 4) Pets CRUD Tests

- [ ] Verify pets list loads (`/items/pets`)
- [ ] Add new pet
- [ ] Update pet
- [ ] Delete pet
- [ ] Verify `ownerId` and `hasPet` relationship is correct

### 5) Test Data Management

- [ ] Define a data reset strategy before each test (script or API)
- [ ] Clean up records created during tests
- [ ] Ensure tests are independent from each other

### 6) Framework Improvements

- [ ] Standardize `.env` usage
- [ ] Create shared fixture/helper files
- [ ] Improve locator quality (`getByRole`, `data-test`)
- [ ] Use meaningful assertions (not only visibility, also data validation)

### 7) Reporting and Failure Analysis

- [ ] Review HTML report (`playwright-report/index.html`)
- [ ] Perform root-cause analysis for failing tests with retry/trace enabled
- [ ] Stabilize flaky tests

### 8) Completion Criteria

- [ ] All critical scenarios are green
- [ ] Tests remain stable on repeated runs
- [ ] README and test structure are clear

### 9) API Tests

- [ ] Validate status code and response body for `GET /items/person`
- [ ] Validate status code and response body for `GET /items/pets`
- [ ] Create record test with `POST /save/person`
- [ ] Create record test with `POST /save/pets`
- [ ] Test `DELETE /delete/person/:id` and `DELETE /delete/pets/:id`
- [ ] Negative API tests (invalid payload, non-existing id, 4xx/5xx checks)
- [ ] Set up create/cleanup test data flow in API tests

### 10) Database Tests

- [ ] Reset DB state before tests (`npm run clearDatabase` or similar)
- [ ] Verify data created via API is actually created in DB
- [ ] Verify DB record is updated correctly after update
- [ ] Verify DB record is removed after delete
- [ ] Check referential integrity (what happens to pet relation when person is deleted)
- [ ] Strategy to reduce DB conflict risk in parallel tests
- [ ] Clean shutdown at the end of tests (data should return to initial state)

## Collaboration Plan

Suggested sequence:

1. Refactor login spec first (`step + helper`)
2. Write Persons CRUD tests
3. Add Pets CRUD tests
4. Add API tests
5. Add database validation tests
6. Finalize data reset and reporting

If you want, in the next step we can start directly with `tests/login.spec.ts` and refactor it together.
