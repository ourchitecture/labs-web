// @ts-check
const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/')
})

test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Our Todos/)
})

test('main is hidden without todos', async ({ page }) => {
    await expect(page.locator('#main')).toHaveCount(0)
})

test('footer is hidden without todos', async ({ page }) => {
    await expect(page.locator('#footer')).toHaveCount(0)
})

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
