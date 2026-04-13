import { Page, Locator, expect } from 'playwright/test';
import dotenv from 'dotenv';

dotenv.config();
const INVALID_USER_MESSAGE =
  '😕 Oeps! invalid user. Try again or contact the adminstrator';
const INFO_MESSAGE =
  process.env.LOGIN_INFO_MESSAGE ??
  'Use your assigned training credentials. Contact the admin if needed.';
const baseURL = process.env.BASE_URL!;


export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        
    }

    async goto() {
        await this.page.goto(baseURL);   
     };

     async isLoginBoxVisible() {
        const loginbox = this.page.locator('.login-box');
        await expect(loginbox.getByRole('textbox', { name: 'Username' })).toBeVisible();
        await expect(loginbox.getByRole('textbox', { name: 'Password' })).toBeVisible();
     }

    async login(username: string, password: string) {
        const loginbox = this.page.locator('.login-box');
        await loginbox.getByRole('textbox', { name: 'Username' }).fill(username);
        await loginbox.getByRole('textbox', { name: 'Password' }).fill(password);
        await loginbox.getByRole('button', { name: 'Ok' }).click();
            
     }

     async getInvalidUserMessage() {
        return await this.page.getByText(INVALID_USER_MESSAGE);
     }
  

     async isPersonsLinkVisible() {
        return await this.page.getByRole('link', { name: 'Persons' }).isVisible();
     }
     async pressEnterOnPassword() {
        const loginbox = this.page.locator('.login-box');
        await loginbox.getByRole('textbox', { name: 'Password' }).press('Enter');   
     }

     async clickInfoButton() {
        const loginbox = this.page.locator('.login-box');
        const infoButton = loginbox.getByRole('button', { name: 'Info' });
        await expect(infoButton).toBeVisible();
        await infoButton.click();
     }  
    
     async getInfoMessage() {
        return await this.page.getByText(INFO_MESSAGE);
     }

}
