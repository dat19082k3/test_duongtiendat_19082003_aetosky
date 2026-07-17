# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: jobs.spec.ts >> Job List/Detail Flow >> should display job list and open details drawer
- Location: e2e/jobs.spec.ts:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'View Details' }).first() to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "Background Jobs Monitor" [level=3] [ref=e5]
  - main [ref=e6]:
    - generic [ref=e7]:
      - alert [ref=e8]:
        - img "close-circle" [ref=e10]:
          - img [ref=e11]
        - generic [ref=e13]:
          - generic [ref=e14]: Error
          - generic [ref=e15]: Network Error
        - button "Retry" [ref=e17] [cursor=pointer]:
          - generic [ref=e18]: Retry
      - generic [ref=e19]:
        - generic [ref=e22]: Recent Jobs
        - table [ref=e30]:
          - rowgroup [ref=e31]:
            - row "Job ID Status Created At Action" [ref=e32]:
              - columnheader "Job ID" [ref=e33]
              - columnheader "Status" [ref=e34]
              - columnheader "Created At" [ref=e35]
              - columnheader "Action" [ref=e36]
          - rowgroup [ref=e37]:
            - row "No data No data" [ref=e38]:
              - cell "No data No data" [ref=e39]:
                - generic [ref=e40]:
                  - img "No data" [ref=e42]
                  - generic [ref=e48]: No data
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Job List/Detail Flow', () => {
  4  |   test('should display job list and open details drawer', async ({ page }) => {
  5  |     // Navigate to app
  6  |     await page.goto('/');
  7  | 
  8  |     // Wait for the title
  9  |     await expect(page.getByRole('heading', { name: 'Background Jobs Monitor' })).toBeVisible({ timeout: 15000 });
  10 | 
  11 |     // Verify a loading state exists briefly or data is fetched
  12 |     // Since mock data or local DB is fast, we might skip loading assertion 
  13 |     // and wait for the table row.
  14 |     const table = page.locator('.ant-table');
  15 |     await expect(table).toBeVisible({ timeout: 15000 });
  16 | 
  17 |     // Find the first "View Details" button and click it
  18 |     const firstViewBtn = page.getByRole('button', { name: 'View Details' }).first();
> 19 |     await firstViewBtn.waitFor({ state: 'visible' });
     |                        ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  20 |     await firstViewBtn.click();
  21 | 
  22 |     // Verify the Drawer opens
  23 |     const drawer = page.locator('.ant-drawer-content');
  24 |     await expect(drawer).toBeVisible({ timeout: 15000 });
  25 | 
  26 |     // Verify basic info in drawer
  27 |     await expect(page.getByText('Job Details:')).toBeVisible({ timeout: 15000 });
  28 |     await expect(page.getByText('Status')).toBeVisible({ timeout: 15000 });
  29 |     await expect(page.getByText('Created At')).toBeVisible({ timeout: 15000 });
  30 | 
  31 |     // Close the drawer
  32 |     const closeBtn = page.locator('.ant-drawer-close');
  33 |     await closeBtn.click();
  34 |     await expect(drawer).toBeHidden();
  35 |   });
  36 | });
  37 | 
```