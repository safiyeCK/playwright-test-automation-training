import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { extractPersonsData, findPersonByName } from '../helpers/personHelpers';

dotenv.config();

test.describe('Persons Page', () => {
  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL!;
    await page.goto(baseURL);
    const username = 'user1';
    const password = process.env.LOGIN_PASSWORD!;
    const loginbox = page.locator('.login-box');

    await test.step('Login as user1', async () => {
      await loginbox.getByRole('textbox', { name: 'Username' }).fill(username);
      await loginbox.getByRole('textbox', { name: 'Password' }).fill(password);
      await loginbox.getByRole('button', { name: 'Ok' }).click();
    });

    await test.step('Wait for Persons page to load', async () => {
      await expect(page.getByText('Persons are loaded')).toBeVisible();
    });
  });

  test('should find Tineke de Jong and verify her age is 34', async ({ page }) => {
    await test.step('Extract all persons data from grid', async () => {
      const allPersons = await extractPersonsData(page);
      console.log('All persons:', allPersons);
      expect(allPersons.length).toBeGreaterThan(0);
    });

    await test.step('Find person by name using helper', async () => {
      const tinieke = await findPersonByName(page, 'Tineke de Jong');
      expect(tinieke).toBeDefined();
    });

    await test.step('Verify age is 34', async () => {
      const tinieke = await findPersonByName(page, 'Tineke de Jong');
      expect(tinieke?.age).toBe('34');
    });

    await test.step('Log all person details', async () => {
      const allPersons = await extractPersonsData(page);
      allPersons.forEach((person) => {
        console.log(`Name: ${person.name}, Age: ${person.age}, Sex: ${person.sex}, HasPet: ${person.hasPet}`);
      });
    });
  });

  test('should display all persons with name, sex, and hasPet info', async ({ page }) => {
    await test.step('Extract and verify persons data', async () => {
      const allPersons = await extractPersonsData(page);

      expect(allPersons.length).toBeGreaterThan(0);

      allPersons.forEach((person) => {
        expect(person).toHaveProperty('name');
        expect(person).toHaveProperty('sex');
        expect(person).toHaveProperty('hasPet');
        expect(person.name).not.toBe('');
      });

      console.log(`Total persons loaded: ${allPersons.length}`);
    });
  });
});
