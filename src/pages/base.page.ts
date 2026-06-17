import { Page, test, TestInfo } from '@playwright/test';

export abstract class BasePage {
  constructor(
    public readonly page: Page,
    public readonly testInfo?: TestInfo
  ) {}

  async navigate(path: string): Promise<void> {
    await test.step(`Navigate to path "${path}"`, async () => {
      await this.page.goto(path);
    });
  }

  async waitForPageLoad(): Promise<void> {
    await test.step('Wait for page DOM content load state', async () => {
      await this.page.waitForLoadState('domcontentloaded');
    });
  }

  async attachScreenshot(name: string = 'Final Passed Screenshot'): Promise<void> {
    if (this.testInfo) {
      const screenshot = await this.page.screenshot({ fullPage: true });
      await this.testInfo.attach(name, {
        body: screenshot,
        contentType: 'image/png',
      });
    }
  }

  getCurrentUrl(): string {
    return this.page.url();
  }
}
