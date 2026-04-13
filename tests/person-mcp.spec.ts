import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Persons Page Generated Scenario', () => {
  test('should login and verify Tineke de Jong age is 34', async ({ page }) => {
    const baseURL = process.env.BASE_URL!;
    const loginBox = page.locator('.login-box');

    await test.step('Open the local application', async () => {
      await page.goto(baseURL);
      await expect(loginBox).toBeVisible();
    });

    await test.step('Log in with user1 credentials', async () => {
      await loginBox.getByRole('textbox', { name: 'Username' }).fill('user1');
      await loginBox.getByRole('textbox', { name: 'Password' }).fill('welkom01');
      await loginBox.getByRole('button', { name: 'Ok' }).click();
    });

    await test.step('Verify Persons page is opened', async () => {
      await expect(page.getByRole('link', { name: 'Persons' })).toBeVisible();
      await expect(page.getByText('Persons are loaded')).toBeVisible();
    });

    await test.step('Find the row for Tineke de Jong', async () => {
      const personRow = page
        .getByRole('row')
        .filter({ has: page.getByRole('cell', { name: 'Tineke de Jong' }) });

      await expect(personRow).toBeVisible();
    });

    await test.step('Verify Tineke de Jong age is 34', async () => {
      const personRow = page
        .getByRole('row')
        .filter({ has: page.getByRole('cell', { name: 'Tineke de Jong' }) });

      await expect(personRow.getByRole('cell', { name: '34' })).toBeVisible();
    });
  });
});
