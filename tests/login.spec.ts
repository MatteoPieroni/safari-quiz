import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/signin');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Safari Guide Quiz/);

  await page
    .getByRole('textbox', { name: 'email' })
    .fill(process.env.TEST_USER_EMAIL || '');
  await page
    .getByRole('textbox', { name: 'password' })
    .fill(process.env.TEST_USER_PASSWORD || '');

  await page.getByRole('button').click();

  await page.waitForURL('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /Wildlife Quiz/
  );
});
