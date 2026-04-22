import {Page, Locator, expect }from 'playwright/test';
import dotenv from 'dotenv';

dotenv.config();
const baseURL = process.env.BASE_URL!;

export class QuestionBoxPage {
    readonly page: Page;
    readonly questionBox: Locator;  

    constructor(page: Page) {
        this.page = page;
        this.questionBox = page.locator('.question-box');
    }

    async goto() {
        await this.page.goto(baseURL);
    }

    async isQuestionBoxVisible() {
        await expect(this.questionBox).toBeVisible();
    }
}