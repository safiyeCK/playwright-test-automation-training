import { expect, Locator, Page } from '@playwright/test';

export type PersonRow = {
  name: string;
  age: string;
  sex: string;
  hasPet: string;
};

export class PersonsPage {
  readonly page: Page;
  readonly loadedMessage: Locator;
  readonly rowsPerson: Locator;
  readonly fullNameInput: Locator;
  readonly ageInput: Locator;
  readonly sexSelect: Locator;
  readonly hasPetCheckbox: Locator;
  readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loadedMessage = page.getByText('Persons are loaded');
        this.rowsPerson = page.getByRole('row');
        this.fullNameInput = page.locator('#fullName');
        this.ageInput = page.locator('#age');
        this.sexSelect = page.locator('#sex');
        this.hasPetCheckbox = page.locator('#hasPet');
        this.submitButton = page.getByRole('button', { name: 'Submit' });
    }

  async waitUntilLoaded(){
    await expect(this.loadedMessage).toBeVisible();
  }

  async getAllPersons(){
    const rowCount = await this.rowsPerson.count();
    const persons: PersonRow[] = [];

    for (let index = 1; index < rowCount; index++) {
      const row = this.rowsPerson.nth(index);
      const cells = row.getByRole('cell');

      persons.push({
        name: (await cells.nth(0).textContent())?.trim() ?? '',
        age: (await cells.nth(1).textContent())?.trim() ?? '',
        sex: (await cells.nth(2).textContent())?.trim() ?? '',
        hasPet: (await cells.nth(3).textContent())?.trim() ?? '',
      });
    }
    return persons;
  }

  async getPersonsSummary(){
    const persons = await this.getAllPersons();
    return persons.map(({ name, sex, hasPet }) => ({ name, sex, hasPet }));
  }

  async findPersonByName(name: string){
    const persons = await this.getAllPersons();
    return persons.find((person) => person.name === name);
  }

  async clickUpdateButtonForPerson(name: string) {
    const row = this.rowsPerson.filter({ has: this.page.getByRole('cell', { name }) });
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Update' }).click();
  }

  async fillPersonForm(fullName: string, age: string, sex: 'Male' | 'Female', hasPet: boolean) {
    await expect(this.fullNameInput).toBeVisible();
    await this.fullNameInput.fill(fullName);
    await this.ageInput.fill(age);
    await this.sexSelect.selectOption(sex);

    if ((await this.hasPetCheckbox.isChecked()) !== hasPet) {
      await this.hasPetCheckbox.click();
    }
  }

  async submitPersonForm() {
    await this.submitButton.click();
    await this.waitUntilLoaded();
  }
}
