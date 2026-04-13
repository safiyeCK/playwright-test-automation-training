import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage';

dotenv.config();

  const username = process.env.LOGIN_USERNAME!;
  const password = process.env.LOGIN_PASSWORD!;
let loginPage: LoginPage;

test.describe('Login Positive Scenarios', () => {
   test.describe.configure({ mode: 'serial' });
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with Ok button', async ({ page }) => {
    
   

    await test.step('Verify login form is visible', async () => {
      await loginPage.isLoginBoxVisible();
    });

    await test.step('Fill valid credentials and click Ok', async () => {
      await loginPage.login(username, password);
     
    });

    await test.step('Verify user is redirected after login', async () => {
      await loginPage.isPersonsLinkVisible();

    });
  });

  test('should login successfully with Enter key', async ({ page }) => {
    
    await test.step('Verify login form is visible', async () => {
     await loginPage.isLoginBoxVisible();
    });

    await test.step('Fill valid credentials and submit with Enter', async () => {
      await loginPage.login(username, password);
      await loginPage.pressEnterOnPassword();
    });

    await test.step('Verify user is redirected after login', async () => {
      await loginPage.isPersonsLinkVisible();
    });
  });

  test('should show info message after clicking Info button', async ({ page }) => {

    await test.step('Click the Info button', async () => {
      await loginPage.clickInfoButton();
    });

    await test.step('Verify info/help text is displayed', async () => {
      await loginPage.getInfoMessage();
    });
  });

  test.describe('Login Negative Secenarios', () => {
    test('should show error message for invalid credentials', async ({ page }) => {
      loginPage = new LoginPage(page);

      await test.step('Fill invalid credentials and submit', async () => {
        await loginPage.login('invalidUser', 'invalidPass');
      });

      await test.step('Verify invalid user message', async () => {
        await loginPage.getInvalidUserMessage();
      });
    });

    test('should show error message for empty credentials', async ({ page }) => {
      loginPage = new LoginPage(page);

      await test.step('Submit login form with empty credentials', async () => {
        await loginPage.login('', '');
      });

      await test.step('Verify invalid user message', async () => {
        await loginPage.getInvalidUserMessage();
      });
    });

    test('should show error message for empty username', async ({ page }) => {
      loginPage = new LoginPage(page);

      await test.step('Fill password only and submit', async () => {
        await loginPage.login('', 'somepassword');
      });

      await test.step('Verify invalid user message', async () => {
        await loginPage.getInvalidUserMessage();
      });
    });

    test('should show error message for empty password', async ({ page }) => {
      loginPage = new LoginPage(page);

      await test.step('Fill username only and submit', async () => {
        await loginPage.login('someusername', '');
      });

      await test.step('Verify invalid user message', async () => {
        await loginPage.getInvalidUserMessage();
      });
    });
  });
});
