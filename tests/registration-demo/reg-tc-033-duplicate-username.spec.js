const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://parabank.parasoft.com/parabank';

test('REG-TC-033 Edge Case: duplicate username', async ({ page }) => {
  const existingUsername = 'testuser123';
  const password = 'Password123!';

  await page.goto(`${BASE_URL}/register.htm`);

  await page.locator('input[name="customer.firstName"]').fill('Jane');
  await page.locator('input[name="customer.lastName"]').fill('Duplicate');
  await page.locator('input[name="customer.address.street"]').fill('500 Dup Street');
  await page.locator('input[name="customer.address.city"]').fill('Toronto');
  await page.locator('input[name="customer.address.state"]').fill('ON');
  await page.locator('input[name="customer.address.zipCode"]').fill('M2B2B2');
  await page.locator('input[name="customer.phoneNumber"]').fill('5554443333');
  await page.locator('input[name="customer.ssn"]').fill('987-65-4321');
  await page.locator('input[name="customer.username"]').fill(existingUsername);
  await page.locator('input[name="customer.password"]').fill(password);
  await page.locator('input[name="repeatedPassword"]').fill(password);

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('[id="customer.username.errors"]')).toContainText(/already exists/i);

  await page.screenshot({ path: 'screenshots/REG-TC-033-duplicate-username.png', fullPage: true });
});
