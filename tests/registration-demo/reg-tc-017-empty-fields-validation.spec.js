const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://parabank.parasoft.com/parabank';

test('REG-TC-017 Negative Testing: All fields empty', async ({ page }) => {
  await page.goto(`${BASE_URL}/register.htm`);

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('[id="customer.firstName.errors"]')).toContainText(/required/i);
  await expect(page.locator('[id="customer.lastName.errors"]')).toContainText(/required/i);
  await expect(page.locator('[id="customer.address.street.errors"]')).toContainText(/required/i);
  await expect(page.locator('[id="customer.address.city.errors"]')).toContainText(/required/i);
  await expect(page.locator('[id="customer.address.state.errors"]')).toContainText(/required/i);
  await expect(page.locator('[id="customer.address.zipCode.errors"]')).toContainText(/required/i);
  await expect(page.locator('[id="customer.ssn.errors"]')).toContainText(/required/i);
  await expect(page.locator('[id="customer.username.errors"]')).toContainText(/required/i);
  await expect(page.locator('[id="customer.password.errors"]')).toContainText(/required/i);
  await expect(page.locator('[id="repeatedPassword.errors"]')).toContainText(/required/i);

  await page.screenshot({ path: 'screenshots/REG-TC-017-empty-fields.png', fullPage: true });
});

