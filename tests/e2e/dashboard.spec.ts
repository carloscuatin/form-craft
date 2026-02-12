import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const CREDENTIALS_REQUIRED = 'E2E_TEST_EMAIL and E2E_TEST_PASSWORD must be set';

const getTestCredentials = (): { email: string; password: string } | null => {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;
  return email && password ? { email, password } : null;
};

const skipWhenNoCredentials = (): void => {
  test.skip(!getTestCredentials(), CREDENTIALS_REQUIRED);
};

const loginAsTestUser = async (
  page: Page,
  credentials: { email: string; password: string },
): Promise<void> => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(credentials.email);
  await page.getByLabel('Contraseña').fill(credentials.password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
};

test.describe('Dashboard', () => {
  test('should not allow access to dashboard without auth', async ({
    page,
  }) => {
    await page.goto('/dashboard');
    const redirectedToLogin = page.url().includes('/login');
    if (redirectedToLogin) {
      await expect(page).toHaveURL(/\/login/);
      return;
    }
    await expect(
      page.getByText(/Error al cargar formularios|No autenticado/),
    ).toBeVisible();
  });

  test.describe('when authenticated', () => {
    test('should show dashboard with empty state after login', async ({
      page,
    }) => {
      skipWhenNoCredentials();
      const credentials = getTestCredentials()!;
      await loginAsTestUser(page, credentials);
      await expect(
        page.getByRole('heading', { name: 'Mis formularios' }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'No tienes formularios aún' }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'Crear mi primer formulario' }),
      ).toBeVisible();
    });

    test('should navigate to new form builder from dashboard empty state', async ({
      page,
    }) => {
      skipWhenNoCredentials();
      const credentials = getTestCredentials()!;
      await loginAsTestUser(page, credentials);
      await page
        .getByRole('link', { name: 'Crear mi primer formulario' })
        .click();
      await expect(page).toHaveURL(/\/builder\/new/);
    });
  });
});
