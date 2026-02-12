import { test, expect } from '@playwright/test';

test.describe('Home', () => {
  test('should show the home page with FormCraft', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Crea formularios');
    await expect(page.getByRole('banner').getByText('FormCraft')).toBeVisible();
  });

  test('should navigate to login when clicking Sign in', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Iniciar sesión' }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to register when clicking Create account', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Crear cuenta' }).first().click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('should switch theme to dark and light', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');

    await page.getByRole('button', { name: 'Cambiar tema' }).click();
    await page.getByRole('menuitem', { name: 'Oscuro' }).click();
    await expect(html).toHaveClass(/dark/);

    await page.getByRole('button', { name: 'Cambiar tema' }).click();
    await page.getByRole('menuitem', { name: 'Claro' }).click();
    await expect(html).not.toHaveClass(/dark/);
  });
});
