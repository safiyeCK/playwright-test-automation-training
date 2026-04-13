import { Page } from '@playwright/test';

/**
 * Extract person data from the Persons grid table
 * Returns an array of person objects with name, age, sex, and hasPet status
 */
export async function extractPersonsData(page: Page) {
  const rows = page.getByRole('row');
  const rowCount = await rows.count();

  const persons = [];

  // Skip header row (index 0), iterate through data rows
  for (let i = 1; i < rowCount; i++) {
    const row = rows.nth(i);
    const cells = row.getByRole('cell');

    // Extract data from cells
    // Typical order: Name, Age, Sex, HasPet (adjust indices based on actual grid)
    const name = await cells.nth(0).textContent();
    const age = await cells.nth(1).textContent();
    const sex = await cells.nth(2).textContent();
    const hasPet = await cells.nth(3).textContent();

    persons.push({
      name: name?.trim() || '',
      age: age?.trim() || '',
      sex: sex?.trim() || '',
      hasPet: hasPet?.trim() || '',
    });
  }

  return persons;
}

/**
 * Find a person by name in the Persons grid
 */
export async function findPersonByName(page: Page, name: string) {
  const persons = await extractPersonsData(page);
  return persons.find((p) => p.name === name);
}

/**
 * Get a specific person's row element for further interactions
 */
export async function getPersonRowByName(page: Page, name: string) {
  return page.getByRole('row').filter({ has: page.getByRole('cell', { name }) });
}
