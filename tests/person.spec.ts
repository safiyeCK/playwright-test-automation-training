import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage';
import { PersonsPage } from '../pages/PersonsPage';

dotenv.config();
let personPage: PersonsPage;
let loginPage: LoginPage;
const username = process.env.LOGIN_USERNAME!;
const password = process.env.LOGIN_PASSWORD!;

test.describe('Persons Page', () => {

  test.describe.configure({ mode: 'serial' });
  
  test.beforeEach(async ({ page }) => {
    
    loginPage = new LoginPage(page);
    personPage = new PersonsPage(page);
    
    await loginPage.goto();
    await loginPage.login(username, password);
    await personPage.waitUntilLoaded();
  });
    

  test('should find Tineke de Jong and verify her age is 34', async ({ page }) => {
    const person = await personPage.findPersonByName('Tineke de Jong');
    expect(person).toBeDefined();
    expect(person?.age).toBe('34');
  });


  test('should find Jan de Vries and verify he has a pet', async ({ page }) => {
    const person = await personPage.findPersonByName('Jan de vries');
    expect(person).toBeDefined();
    expect(person?.hasPet).toBe('No');
  });

  test('should find Jan Smit and verify he is male', async ({ page }) => {
    const person = await personPage.findPersonByName('Jan Smit');
    expect(person).toBeDefined();
    expect(person?.sex).toBe('Male');

  });
  
  test('Should be updated to verify that all persons have a name, age, sex and hasPet value', async ({ page }) => {
    const persons = await personPage.getAllPersons(); 
    for (const person of persons) {
      expect(person.name).toBeTruthy();
      expect(person.age).toBeTruthy();
      expect(person.sex).toBeTruthy();
      expect(person.hasPet).toBeTruthy();
    }   
    

  });

  test('should update Jan de vries values and submit the form', async ({ page }) => {
    const updatedName = 'Jan de vries Updated';
    const updatedAge = '56';

    await test.step('Open Jan de vries in update form', async () => {
      await personPage.clickUpdateButtonForPerson('Jan de vries');
    });

    await test.step('Change form values and submit', async () => {
      await personPage.fillPersonForm(updatedName, updatedAge, 'Male', true);
      await personPage.submitPersonForm();
    });

    await test.step('Verify updated values in grid', async () => {
      const updatedPerson = await personPage.findPersonByName(updatedName);
      expect(updatedPerson).toBeDefined();
      expect(updatedPerson?.age).toBe(updatedAge);
      expect(updatedPerson?.sex).toBe('Male');
      expect(updatedPerson?.hasPet).toBe('Yes');
    });

    await test.step('Revert Jan de vries to original values', async () => {
      await personPage.clickUpdateButtonForPerson(updatedName);
      await personPage.fillPersonForm('Jan de vries', '55', 'Male', false);
      await personPage.submitPersonForm();
    });
  });

});

