import { Locator, Page, expect, test, TestInfo } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // --- Locators (verified from DOM inspection) ---
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly languageSelect: Locator;
  readonly errorToast: Locator;
  readonly inlineError: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page, testInfo?: TestInfo) {
    super(page, testInfo);
    this.usernameInput = page.getByPlaceholder(/User ID|사용자 ID/);
    this.passwordInput = page.getByPlaceholder(/Password|비밀번호/);
    this.loginButton = page.locator('button.btn-login');
    this.languageSelect = page.locator('.ant-select-selector');
    this.errorToast = page.locator('.swal2-popup');
    this.inlineError = page.getByText('*** ID or PW is incorrect. ***');
    this.pageHeading = page.getByRole('heading', { name: 'X-Trace Management System' });
  }

  // --- Navigation ---
  async goto(): Promise<void> {
    await this.navigate('/xtrace-ui/login');
    await test.step(`Verify page heading element "${this.pageHeading}" is visible`, async () => {
      await expect(this.pageHeading).toBeVisible();
    });
  }

  // --- Actions ---
  async fillUsername(username: string): Promise<void> {
    await test.step(`Fill username "${username}" into input field: ${this.usernameInput}`, async () => {
      await this.usernameInput.clear();
      await this.usernameInput.fill(username);
    });
  }

  async fillPassword(password: string): Promise<void> {
    await test.step(`Fill password "${password}" into input field: ${this.passwordInput}`, async () => {
      await this.passwordInput.clear();
      await this.passwordInput.fill(password);
    });
  }

  async clickLogin(): Promise<void> {
    await test.step(`Click login button: ${this.loginButton}`, async () => {
      await this.loginButton.click();
    });
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async selectLanguage(language: 'English' | '한국어'): Promise<void> {
    const optionLocator = this.page.locator('.ant-select-item-option-content').getByText(language, { exact: true });
    await test.step(`Click language dropdown selector: ${this.languageSelect} and click option "${language}" selector: ${optionLocator}`, async () => {
      await this.languageSelect.click();
      await optionLocator.click();
    });
  }

  // --- Verifications ---
  async waitForToastVisible(timeout = 5000): Promise<void> {
    await test.step(`Wait for error toast element "${this.errorToast}" to be visible (timeout: ${timeout}ms)`, async () => {
      await expect(this.errorToast).toBeVisible({ timeout });
    });
  }

  async getToastText(): Promise<string> {
    return await test.step(`Retrieve text content of error toast header element: ${this.errorToast.locator('h2')}`, async () => {
      const text = (await this.errorToast.locator('h2').textContent())?.trim() ?? '';
      return text;
    });
  }

  async waitForInlineError(timeout = 5000): Promise<void> {
    await test.step(`Wait for inline error element "${this.inlineError}" to be visible (timeout: ${timeout}ms)`, async () => {
      await expect(this.inlineError).toBeVisible({ timeout });
    });
  }

  async isOnLoginPage(): Promise<boolean> {
    return await test.step('Check if current URL contains "/login"', async () => {
      return this.page.url().includes('/login');
    });
  }

  async getPasswordInputType(): Promise<string> {
    return await test.step(`Get "type" attribute of password field: ${this.passwordInput}`, async () => {
      return (await this.passwordInput.getAttribute('type')) ?? '';
    });
  }

  async getCurrentLanguageLabel(): Promise<string> {
    const selectedLangLocator = this.page.locator('.ant-select-selection-item');
    return await test.step(`Get text content of current language selector element: ${selectedLangLocator}`, async () => {
      return (await selectedLangLocator.textContent())?.trim() ?? '';
    });
  }

  async isKoreanModeActive(): Promise<boolean> {
    const checkLocator = this.page.getByPlaceholder('사용자 ID');
    return await test.step(`Verify visibility of Korean username placeholder element: ${checkLocator}`, async () => {
      return await checkLocator.isVisible();
    });
  }

  async isEnglishModeActive(): Promise<boolean> {
    const checkLocator = this.page.getByPlaceholder('User ID');
    return await test.step(`Verify visibility of English username placeholder element: ${checkLocator}`, async () => {
      return await checkLocator.isVisible();
    });
  }

  async isLoginButtonKorean(): Promise<boolean> {
    const checkLocator = this.page.getByRole('button', { name: '로그인' });
    return await test.step(`Verify visibility of Korean login button element: ${checkLocator}`, async () => {
      return await checkLocator.isVisible();
    });
  }
}
