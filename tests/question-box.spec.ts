import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Question Box', () => {
  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL!;
    await page.goto(baseURL);
  });

  test('should display question textbox and related buttons', async ({ page }) => {
    const questionTextbox = page.getByRole('textbox', {
      name: 'Do you have any questions',
    });
    const questionForm = page
      .locator('form')
      .filter({ hasText: 'Do you have any questions' });
    const questionFormButton = questionForm.getByRole('button').first();
    const infoButton = page.getByRole('button', { name: 'Info' });

    await test.step('Verify question section is visible', async () => {
      await expect(questionTextbox).toBeVisible();
      await expect(questionFormButton).toBeVisible();
      await expect(infoButton).toBeVisible();
    });
  });

  test('should allow entering text into question textbox', async ({ page }) => {
    const questionTextbox = page.getByRole('textbox', {
      name: 'Do you have any questions',
    });
    const sampleQuestion = 'How can I update my profile information?';

    await test.step('Enter question text', async () => {
      await questionTextbox.fill(sampleQuestion);
    });

    await test.step('Verify entered text is kept in the textbox', async () => {
      await expect(questionTextbox).toHaveValue(sampleQuestion);
    });
  });

  test('should show thank you message after submitting a question', async ({ page }) => {
    const questionTextbox = page.getByRole('textbox', {
      name: 'Do you have any questions',
    });
    const questionForm = page
      .locator('form')
      .filter({ hasText: 'Do you have any questions' });
    const submitButton = questionForm.getByRole('button').first();

    await test.step('Enter a sample question', async () => {
      await questionTextbox.fill('Can I export my data from this screen?');
    });

    await test.step('Submit the question', async () => {
      await submitButton.click();
    });

    await test.step('Verify thank you message is visible', async () => {
      await expect(page.getByText('Thank you for your question! We will never get back to you')).toBeVisible();
    });
  });
});