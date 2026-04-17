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
  readonly rows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loadedMessage = page.getByText('Persons are loaded');
        this.rows = page.getByRole('row');
    }

  async waitUntilLoaded(): Promise<void> {
    await expect(this.loadedMessage).toBeVisible();
  }

  async getAllPersons(): Promise<PersonRow[]> {
    const rowCount = await this.rows.count();
    const persons: PersonRow[] = [];

    for (let index = 1; index < rowCount; index++) {
      const row = this.rows.nth(index);
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

  async getPersonsSummary(): Promise<Array<Pick<PersonRow, 'name' | 'sex' | 'hasPet'>>> {
    const persons = await this.getAllPersons();
    return persons.map(({ name, sex, hasPet }) => ({ name, sex, hasPet }));
  }

  async findPersonByName(name: string): Promise<PersonRow | undefined> {
    const persons = await this.getAllPersons();
    return persons.find((person) => person.name === name);
  }
}
