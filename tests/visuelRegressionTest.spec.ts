import { test, expect, type Locator, type Page } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage';

dotenv.config();

const username = process.env.LOGIN_USERNAME!;
const password = process.env.LOGIN_PASSWORD!;

async function stabilizePage(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => {
    const activeElement = document.activeElement as HTMLElement | null;
    activeElement?.blur?.();
  });
  await page.waitForTimeout(250);
}

async function expectStableScreenshot(locator: Locator, snapshotName: string) {
  await expect(locator).toHaveScreenshot(snapshotName, {
    animations: 'disabled',
    caret: 'hide',
    scale: 'css',
    timeout: 10000,
  });
}

test.describe('Visual regression tests', () => {
  test('login box should match snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await stabilizePage(page);

    const loginBox = page.locator('.login-box');
    await expect(loginBox).toBeVisible();

    await expectStableScreenshot(loginBox, 'login-box.png');
  });

  test('question box should match snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await stabilizePage(page);

    const questionBox = page.locator('.question-box');
    await expect(questionBox).toBeVisible();

    await expectStableScreenshot(questionBox, 'question-box.png');
  });

  test('navbar after login should match snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(username, password);
    await stabilizePage(page);

    const navbar = page.locator('nav');
    await expect(page.getByRole('link', { name: 'Persons' })).toBeVisible();

    await expectStableScreenshot(navbar, 'navbar-authenticated.png');
  });

  test('persons table should match snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(username, password);

    await expect(page.getByText('Persons are loaded')).toBeVisible();
    await page.waitForTimeout(3500);
    await stabilizePage(page);

    const table = page.locator('table').first();
    await expect(table).toBeVisible();

    await expectStableScreenshot(table, 'persons-table.png');
  });
});