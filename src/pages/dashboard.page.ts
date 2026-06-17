import { Page, expect, test, TestInfo } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  constructor(page: Page, testInfo?: TestInfo) {
    super(page, testInfo);
  }

  async goto(): Promise<void> {
    await this.navigate('/xtrace-ui/dashboard');
  }

  async isOnDashboardPage(): Promise<boolean> {
    return await test.step('Check if current URL contains "/dashboard"', async () => {
      return this.page.url().includes('/xtrace-ui/dashboard');
    });
  }

  async isOnLoginPage(): Promise<boolean> {
    return await test.step('Check if current URL contains "/login"', async () => {
      return this.page.url().includes('/xtrace-ui/login');
    });
  }

  async waitForRedirectToLogin(): Promise<void> {
    await test.step('Wait for browser URL to redirect to the Login page (timeout: 10000ms)', async () => {
      await expect(this.page).toHaveURL(/xtrace-ui\/login/, { timeout: 10_000 });
    });
  }
}
