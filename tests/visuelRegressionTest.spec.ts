import { test, expect, type Locator, type Page } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage';
import { QuestionBoxPage } from '../pages/Question-boxPage';
import { NavbarPage } from '../pages/NavbarPage';
import { PersonsPage } from '../pages/PersonsPage';
dotenv.config();

const username = process.env.LOGIN_USERNAME!;
const password = process.env.LOGIN_PASSWORD!;
const backendBaseUrl = process.env.API_BASE_URL ?? 'http://localhost:3000';

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

let loginPage: LoginPage;
let questionBoxPage: QuestionBoxPage;
let navbarPage: NavbarPage;
let personsPage: PersonsPage;

test.describe('Visual regression tests', () => {
  test.beforeEach(async ({ page }) => {
    const resetResponse = await page.request.post(`${backendBaseUrl}/reset/all`);
    expect(resetResponse.ok()).toBeTruthy();

    loginPage = new LoginPage(page);
    
    await loginPage.goto();
    
  });
  
  test('login box should match snapshot', async ({ page }) => {
    await stabilizePage(page);
    await loginPage.isLoginBoxVisible();
    await expectStableScreenshot(loginPage.loginBox, 'login-box.png');
  });

  test('question box should match snapshot', async ({ page }) => {
    questionBoxPage = new QuestionBoxPage(page);
    await stabilizePage(page);

    await questionBoxPage.isQuestionBoxVisible();

    await expectStableScreenshot(questionBoxPage.questionBox, 'question-box.png');
  });

  test('navbar after login should match snapshot', async ({ page }) => {
    
    navbarPage =new NavbarPage(page);
   
    await loginPage.login(username, password);

    await stabilizePage(page);

    await navbarPage.isNavbarVisible();
    personsPage = new PersonsPage(page);

    await expectStableScreenshot(navbarPage.navbar, 'navbar-authenticated.png');
  });

  // test('persons table should match snapshot', async ({ page }) => {
  
  //   await loginPage.login(username, password);

  //   personsPage = new PersonsPage(page);
  //   await personsPage.isPersoneloadedMessageVisible();
  //   await stabilizePage(page);
  //   await page.waitForTimeout(500);

  //   await expectStableScreenshot(personsPage.personsTable, 'persons-table.png');
  // });
});