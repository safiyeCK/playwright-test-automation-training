import {Page, Locator, expect, test } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from './LoginPage';
import { QuestionBoxPage } from './Question-boxPage';
dotenv.config();

export class NavbarPage {
    readonly page: Page;
    readonly navbar: Locator;   
    constructor(page: Page) {
        this.page = page;
        this.navbar = page.locator('nav');
    }

    async isNavbarVisible() {
        await expect(this.navbar).toBeVisible();
    }           
}