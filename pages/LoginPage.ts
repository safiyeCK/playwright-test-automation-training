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
    readonly loginBox: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly okButton: Locator;
    readonly infoButton: Locator;
    readonly invalidUserMessage: Locator;
    readonly personsLink: Locator;
    readonly infoMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginBox = page.locator('.login-box');
        this.usernameInput = this.loginBox.getByRole('textbox', { name: 'Username' });
        this.passwordInput = this.loginBox.getByRole('textbox', { name: 'Password' });
        this.okButton = this.loginBox.getByRole('button', { name: 'Ok' });
        this.infoButton = this.loginBox.getByRole('button', { name: 'Info' });
        this.invalidUserMessage = page.getByText(INVALID_USER_MESSAGE);
        this.personsLink = page.getByRole('link', { name: 'Persons' });
        this.infoMessage = page.getByText(INFO_MESSAGE);
    }

    async goto() {
        await this.page.goto(baseURL);   
     };

     async isLoginBoxVisible() {
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
     }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.okButton.click();
            
     }

     async getInvalidUserMessage() {
        return this.invalidUserMessage;
     }
  

     async isPersonsLinkVisible() {
        return await this.personsLink.isVisible();
     }
     async pressEnterOnPassword() {
        await this.passwordInput.press('Enter');   
     }

     async clickInfoButton() {
        await expect(this.infoButton).toBeVisible();
        await this.infoButton.click();
     }  
    
     async getInfoMessage() {
        return this.infoMessage;
     }

}
