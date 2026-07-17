import { test, expect } from '@playwright/test';

test.describe('Job List/Detail Flow', () => {
  test('should display job list and open details drawer', async ({ page }) => {
    // Navigate to app
    await page.goto('/');

    // Wait for the title
    await expect(page.getByRole('heading', { name: 'Background Jobs Monitor' })).toBeVisible({ timeout: 15000 });

    // Verify a loading state exists briefly or data is fetched
    // Since mock data or local DB is fast, we might skip loading assertion 
    // and wait for the table row.
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible({ timeout: 15000 });

    // Find the first "View Details" button and click it
    const firstViewBtn = page.getByRole('button', { name: 'View Details' }).first();
    await firstViewBtn.waitFor({ state: 'visible' });
    await firstViewBtn.click();

    // Verify page navigated to detail view
    await expect(page).toHaveURL(/\/jobs\/.+/);

    // Verify basic info in detail page
    await expect(page.getByText('Job Details:')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Status')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Created At')).toBeVisible({ timeout: 15000 });

    // Go back using the Back button (using LeftOutlined icon button)
    const backBtn = page.getByRole('button').first();
    await backBtn.click();
    await expect(page).toHaveURL(/\/jobs/);
  });
});
