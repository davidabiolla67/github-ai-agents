const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://parabank.parasoft.com/parabank';

test('REG-TC-003 Successful Registration', async ({ page }) => {
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const username = `u${unique.slice(-10)}`;
  const password = 'Password123!';

  await page.goto(`${BASE_URL}/register.htm`);

  await page.locator('input[name="customer.firstName"]').fill('John');
  await page.locator('input[name="customer.lastName"]').fill('Doe');
  await page.locator('input[name="customer.address.street"]').fill('123 Main St');
  await page.locator('input[name="customer.address.city"]').fill('Toronto');
  await page.locator('input[name="customer.address.state"]').fill('ON');
  await page.locator('input[name="customer.address.zipCode"]').fill('M1A1A1');
  await page.locator('input[name="customer.phoneNumber"]').fill('1234567890');
  await page.locator('input[name="customer.ssn"]').fill(`123-45-${String(unique).slice(-4)}`);
  await page.locator('input[name="customer.username"]').fill(username);
  await page.locator('input[name="customer.password"]').fill(password);
  await page.locator('input[name="repeatedPassword"]').fill(password);

  await page.getByRole('button', { name: 'Register' }).click();

  await page.screenshot({ path: 'screenshots/REG-TC-003-success.png', fullPage: true });

  await expect(page.locator('#rightPanel')).toContainText('Your account was created successfully');
  await expect(page.locator('#rightPanel')).toContainText(username);
});
