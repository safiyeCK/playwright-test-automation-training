import { test, expect} from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Login Positive Scenarios', () => {
  test.beforeEach(async ({ page }) => {
      const baseURL= process.env.BASE_URL!;
      await page.goto(baseURL);
  });
  
  test('should login successfully with Ok button', async ({ page }) => {
  
    const username= process.env.LOGIN_USERNAME!;
    const password= process.env.LOGIN_PASSWORD!;    
    const loginbox = page.locator('.login-box');
    
    await expect(loginbox.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(loginbox.getByRole('textbox', { name: 'Password' })).toBeVisible();
    
    await loginbox.getByRole('textbox', { name: 'Username' }).fill(username);
    await loginbox.getByRole('textbox', { name: 'Password' }).fill(password);
    await loginbox.getByRole('button', { name: 'Ok' }).click();

    await expect(page.getByRole('link', { name: 'Persons' })).toBeVisible();
    
  });   

  test('should login successfully with Enter key', async ({ page }) => {

    const username= process.env.LOGIN_USERNAME!;
    const password= process.env.LOGIN_PASSWORD!;

    const loginbox = page.locator('.login-box');
    await expect(loginbox.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(loginbox.getByRole('textbox', { name: 'Password' })).toBeVisible();

    await loginbox.getByRole('textbox', { name: 'Username' }).fill(username);
    await loginbox.getByRole('textbox', { name: 'Password' }).fill(password);
    await loginbox.getByRole('textbox', { name: 'Password' }).press('Enter');

    await expect(page.getByRole('link', { name: 'Persons' })).toBeVisible();
  });

 

test.describe('Login Negative Secenarios' , () =>{
  
   test('should show error message for invalid credentials', async ({ page }) => { 
    const loginbox = page.locator('.login-box');
    await loginbox.getByRole('textbox', { name: 'Username' }).fill('invalidUser');
    await loginbox.getByRole('textbox', { name: 'Password' }).fill('invalidPass');
    await loginbox.getByRole('button', { name: 'Ok' }).click();
    await expect(loginbox.getByText('😕 Oeps! invalid user. Try again or contact the adminstrator')).toBeVisible();
 
 });
 test('should show error message for empty credentials', async ({ page }) => {
    const loginbox = page.locator('.login-box');
    await loginbox.getByRole('button', { name: 'Ok' }).click();
    await expect(loginbox.getByText('😕 Oeps! invalid user. Try again or contact the adminstrator')).toBeVisible()
    ;

});
test('should show error message for empty username', async ({ page }) => {
    const loginbox = page.locator('.login-box');
    await loginbox.getByRole('textbox', { name: 'Password' }).fill('somepassword');
    await loginbox.getByRole('button', { name: 'Ok' }).click();
    await expect(loginbox.getByText('😕 Oeps! invalid user. Try again or contact the adminstrator')).toBeVisible()
    ;

});
test('should show error message for empty password', async ({ page }) => {
    const loginbox = page.locator('.login-box');
    await loginbox.getByRole('textbox', { name: 'Username' }).fill('someusername');
    await loginbox.getByRole('button', { name: 'Ok' }).click();
    await expect(loginbox.getByText('😕 Oeps! invalid user. Try again or contact the adminstrator')).toBeVisible()
    ;
});


})

 




});
