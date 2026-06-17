import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use, testInfo) => {
    const loginPage = new LoginPage(page, testInfo);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use, testInfo) => {
    const dashboardPage = new DashboardPage(page, testInfo);
    await use(dashboardPage);
  },
});

export { expect } from '@playwright/test';
