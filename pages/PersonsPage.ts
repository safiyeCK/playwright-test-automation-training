import { expect, Page } from '@playwright/test';

export type PersonRow = {
  name: string;
  age: string;
  sex: string;
  hasPet: string;
};

export class PersonsPage {
  readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        
    }

  async waitUntilLoaded(): Promise<void> {
    await expect(this.page.getByText('Persons are loaded')).toBeVisible();
  }

  async getAllPersons(): Promise<PersonRow[]> {
    const rows = this.page.getByRole('row');
    const rowCount = await rows.count();
    const persons: PersonRow[] = [];

    for (let index = 1; index < rowCount; index++) {
      const row = rows.nth(index);
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
