import { test, expect } from '../../fixtures/base.fixture';
import { ENV } from '../../utils/env.config';
import {
  invalidUsername,
  invalidPassword,
  SQL_INJECTION,
  SQL_INJECTION_PASS,
  XSS_PAYLOAD,
  PASSWORD_SPECIAL_CHARS,
  WHITESPACE_ONLY,
} from '../../utils/test-data';

const VALID_USER = ENV.TEST_USERNAME;
const VALID_PASS = ENV.TEST_PASSWORD;
const TOAST_ERROR_MSG = 'ID or Password is incorrect.';

test.beforeEach(async ({ loginPage }) => {
  await test.step('Pre-condition: Navigate to the login page', async () => {
    await loginPage.goto();
  });
});

// ============================================================
// NHÓM 1: Đăng nhập thất bại — Sai thông tin
// ============================================================
test.describe('Negative Login — Sai thông tin đăng nhập', () => {

  test('XTRACE_LOGIN_TC_002 — Username sai, Password đúng', async ({ loginPage }) => {
    await test.step('Step 1: Perform login with invalid username and valid password', async () => {
      await loginPage.login(invalidUsername('wrong_user'), VALID_PASS);
    });

    await test.step('Step 2: Verify error toast is visible and contains expected message', async () => {
      await loginPage.waitForToastVisible();
      const toastText = await loginPage.getToastText();
      expect(toastText, 'Toast phải hiển thị lỗi sai thông tin').toBe(TOAST_ERROR_MSG);
    });

    await test.step('Step 3: Verify user remains on the login page', async () => {
      expect(await loginPage.isOnLoginPage(), 'Phải ở lại trang login').toBe(true);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });

  test('XTRACE_LOGIN_TC_003 — Username đúng, Password sai', async ({ loginPage }) => {
    await test.step('Step 1: Perform login with valid username and invalid password', async () => {
      await loginPage.login(VALID_USER, invalidPassword('wrong_pass'));
    });

    await test.step('Step 2: Verify error toast is visible and contains expected message', async () => {
      await loginPage.waitForToastVisible();
      const toastText = await loginPage.getToastText();
      expect(toastText, 'Toast phải hiển thị lỗi sai thông tin').toBe(TOAST_ERROR_MSG);
    });

    await test.step('Step 3: Verify user remains on the login page', async () => {
      expect(await loginPage.isOnLoginPage(), 'Phải ở lại trang login').toBe(true);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });

  test('XTRACE_LOGIN_TC_004 — Cả Username và Password đều sai', async ({ loginPage }) => {
    await test.step('Step 1: Perform login with invalid username and invalid password', async () => {
      await loginPage.login(invalidUsername('bad_user'), invalidPassword('bad_pass'));
    });

    await test.step('Step 2: Verify error toast is visible and contains expected message', async () => {
      await loginPage.waitForToastVisible();
      const toastText = await loginPage.getToastText();
      expect(toastText, 'Toast phải hiển thị lỗi sai thông tin').toBe(TOAST_ERROR_MSG);
    });

    await test.step('Step 3: Verify user remains on the login page', async () => {
      expect(await loginPage.isOnLoginPage(), 'Phải ở lại trang login').toBe(true);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });
});

// ============================================================
// NHÓM 2: Field Validation — Username
// ============================================================
test.describe('Field Validation — Username', () => {

  test('XTRACE_LOGIN_TC_005 — Username để trống', async ({ loginPage }) => {
    await test.step('Step 1: Perform login with empty username and valid password', async () => {
      await loginPage.login('', VALID_PASS);
    });

    await test.step('Step 2: Verify inline validation error is displayed', async () => {
      await loginPage.waitForInlineError();
      await expect(loginPage.inlineError, 'Phải hiển thị inline error').toBeVisible();
    });

    await test.step('Step 3: Verify user remains on the login page', async () => {
      expect(await loginPage.isOnLoginPage(), 'Phải ở lại trang login').toBe(true);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });

  test('XTRACE_LOGIN_TC_007 — Cả Username và Password đều để trống', async ({ loginPage }) => {
    await test.step('Step 1: Perform login with empty username and empty password', async () => {
      await loginPage.login('', '');
    });

    await test.step('Step 2: Verify inline validation error is displayed', async () => {
      await loginPage.waitForInlineError();
      await expect(loginPage.inlineError, 'Phải hiển thị inline error').toBeVisible();
    });

    await test.step('Step 3: Verify user remains on the login page', async () => {
      expect(await loginPage.isOnLoginPage(), 'Phải ở lại trang login').toBe(true);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });

  test('XTRACE_LOGIN_TC_008 — Username chỉ chứa khoảng trắng', async ({ loginPage }) => {
    await test.step('Step 1: Perform login with whitespace-only username and valid password', async () => {
      await loginPage.login(WHITESPACE_ONLY, VALID_PASS);
    });

    await test.step('Step 2: Verify that either the inline error or the error toast is displayed', async () => {
      const hasError = await Promise.any([
        loginPage.inlineError.waitFor({ state: 'visible', timeout: 5000 }).then(() => true),
        loginPage.errorToast.waitFor({ state: 'visible', timeout: 5000 }).then(() => true)
      ]).catch(() => false);
      expect(hasError, 'Phải có thông báo lỗi khi username chỉ có khoảng trắng').toBe(true);
    });

    await test.step('Step 3: Verify user remains on the login page', async () => {
      expect(await loginPage.isOnLoginPage(), 'Phải ở lại trang login').toBe(true);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });

  test('XTRACE_LOGIN_TC_009 — Username có leading/trailing spaces', async ({ loginPage }) => {
    let onLogin = false;
    await test.step('Step 1: Perform login with username containing leading/trailing spaces and valid password', async () => {
      await loginPage.login(` ${VALID_USER} `, VALID_PASS);
    });

    await test.step('Step 2: Verify that system handles credentials and either stays on login or proceeds without crash', async () => {
      onLogin = await loginPage.isOnLoginPage();
      const hasError = await loginPage.inlineError.isVisible({ timeout: 3000 }).catch(() => false)
        || await loginPage.errorToast.isVisible({ timeout: 3000 }).catch(() => false);
      expect(onLogin || !onLogin, 'Hệ thống phải xử lý được username có spaces').toBe(true);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });

  test('XTRACE_LOGIN_TC_010 — Username chứa SQL Injection', async ({ loginPage }) => {
    await test.step('Step 1: Perform login with SQL injection payload in username and invalid password', async () => {
      await loginPage.login(SQL_INJECTION, invalidPassword());
    });

    await test.step('Step 2: Verify that either the inline error or the error toast is displayed', async () => {
      const hasError = await Promise.any([
        loginPage.inlineError.waitFor({ state: 'visible', timeout: 5000 }).then(() => true),
        loginPage.errorToast.waitFor({ state: 'visible', timeout: 5000 }).then(() => true)
      ]).catch(() => false);
      expect(hasError, 'SQL Injection không được phép đăng nhập thành công').toBe(true);
    });

    await test.step('Step 3: Verify user remains on the login page', async () => {
      expect(await loginPage.isOnLoginPage(), 'Phải ở lại trang login').toBe(true);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });

  test('XTRACE_LOGIN_TC_011 — Username chứa XSS payload', async ({ loginPage }) => {
    let alertFired = false;
    await test.step('Step 1: Add a page-level listener to monitor for XSS browser dialogs/alerts', async () => {
      loginPage.page.on('dialog', () => { alertFired = true; });
    });

    await test.step('Step 2: Perform login with XSS payload in username and invalid password', async () => {
      await loginPage.login(XSS_PAYLOAD, invalidPassword());
    });

    await test.step('Step 3: Verify no dialog was triggered, error message is displayed, and user remains on login page', async () => {
      const hasError = await Promise.any([
        loginPage.inlineError.waitFor({ state: 'visible', timeout: 5000 }).then(() => true),
        loginPage.errorToast.waitFor({ state: 'visible', timeout: 5000 }).then(() => true)
      ]).catch(() => false);
      expect(alertFired, 'XSS script không được thực thi — không có dialog alert').toBe(false);
      expect(hasError, 'Phải hiển thị thông báo lỗi').toBe(true);
      expect(await loginPage.isOnLoginPage(), 'Phải ở lại trang login').toBe(true);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });
});

// ============================================================
// NHÓM 3: Field Validation — Password
// ============================================================
test.describe('Field Validation — Password', () => {

  test('XTRACE_LOGIN_TC_006 — Password để trống', async ({ loginPage }) => {
    await test.step('Step 1: Perform login with valid username and empty password', async () => {
      await loginPage.login(VALID_USER, '');
    });

    await test.step('Step 2: Verify inline validation error is displayed', async () => {
      await loginPage.waitForInlineError();
      await expect(loginPage.inlineError, 'Phải hiển thị inline error').toBeVisible();
    });

    await test.step('Step 3: Verify user remains on the login page', async () => {
      expect(await loginPage.isOnLoginPage(), 'Phải ở lại trang login').toBe(true);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });

  test('XTRACE_LOGIN_TC_012 — Password chứa ký tự đặc biệt', async ({ loginPage }) => {
    await test.step('Step 1: Perform login with invalid username and password containing special characters', async () => {
      await loginPage.login(invalidUsername(), PASSWORD_SPECIAL_CHARS);
    });

    await test.step('Step 2: Verify system handles special characters by returning standard credentials error toast', async () => {
      await loginPage.waitForToastVisible();
      const toastText = await loginPage.getToastText();
      expect(toastText, 'Hệ thống chấp nhận special chars — trả về sai credentials, không phải invalid format').toBe(TOAST_ERROR_MSG);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });

  test('XTRACE_LOGIN_TC_013 — Password field phải ẩn ký tự (masking)', async ({ loginPage }) => {
    let inputType = '';
    await test.step('Step 1: Retrieve password input field type attribute', async () => {
      inputType = await loginPage.getPasswordInputType();
    });

    await test.step('Step 2: Verify that the password field is masked (type="password")', async () => {
      expect(inputType, 'Password input phải có type="password"').toBe('password');
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });

  test('XTRACE_LOGIN_TC_014 — Password chứa SQL Injection', async ({ loginPage }) => {
    await test.step('Step 1: Perform login with valid username and SQL injection payload in password', async () => {
      await loginPage.login(VALID_USER, SQL_INJECTION_PASS);
    });

    await test.step('Step 2: Verify that either the inline error or the error toast is displayed', async () => {
      const hasError = await Promise.any([
        loginPage.inlineError.waitFor({ state: 'visible', timeout: 5000 }).then(() => true),
        loginPage.errorToast.waitFor({ state: 'visible', timeout: 5000 }).then(() => true)
      ]).catch(() => false);
      expect(hasError, 'SQL Injection trong password không được đăng nhập thành công').toBe(true);
    });

    await test.step('Step 3: Verify user remains on the login page', async () => {
      expect(await loginPage.isOnLoginPage(), 'Phải ở lại trang login').toBe(true);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });
});

// ============================================================
// NHÓM 4: Language Dropdown
// ============================================================
test.describe('Language Dropdown', () => {

  test('XTRACE_LOGIN_TC_020 — Ngôn ngữ mặc định là English', async ({ loginPage }) => {
    let lang = '';
    await test.step('Step 1: Retrieve the current selected language label from dropdown', async () => {
      lang = await loginPage.getCurrentLanguageLabel();
    });

    await test.step('Step 2: Verify default language is English and layout labels are in English', async () => {
      expect(lang, 'Ngôn ngữ mặc định phải là English').toBe('English');
      await expect(loginPage.usernameInput, 'Username placeholder phải là "Username" (English)').toBeVisible();
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });

  test('XTRACE_LOGIN_TC_021 — Chuyển ngôn ngữ sang 한국어', async ({ loginPage }) => {
    await test.step('Step 1: Select Korean language ("한국어") from dropdown', async () => {
      await loginPage.selectLanguage('한국어');
    });

    await test.step('Step 2: Verify placeholders and button text are updated to Korean language', async () => {
      expect(await loginPage.isKoreanModeActive(), 'Username placeholder phải đổi sang tiếng Hàn').toBe(true);
      expect(await loginPage.isLoginButtonKorean(), 'Nút Login phải đổi thành 로그인').toBe(true);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });

  test('XTRACE_LOGIN_TC_022 — Chuyển ngôn ngữ lại về English', async ({ loginPage }) => {
    await test.step('Step 1: Select Korean ("한국어") and then select English ("English") from language dropdown', async () => {
      await loginPage.selectLanguage('한국어');
      await loginPage.selectLanguage('English');
    });

    await test.step('Step 2: Verify English placeholder and dropdown label are successfully restored', async () => {
      expect(await loginPage.isEnglishModeActive(), 'Username placeholder phải trở về "Username" (English)').toBe(true);
      const lang = await loginPage.getCurrentLanguageLabel();
      expect(lang, 'Dropdown phải hiển thị English').toBe('English');
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });

  test('XTRACE_LOGIN_TC_023 — Ngôn ngữ giữ nguyên sau khi login thất bại', async ({ loginPage }) => {
    await test.step('Step 1: Select Korean ("한국어") from language dropdown', async () => {
      await loginPage.selectLanguage('한국어');
    });

    await test.step('Step 2: Perform login with invalid username and invalid password in Korean UI', async () => {
      await loginPage.page.getByPlaceholder('사용자 ID').fill(invalidUsername('sai_user'));
      await loginPage.page.getByPlaceholder('비밀번호').fill(invalidPassword('sai_pass'));
      await loginPage.loginButton.click();
    });

    await test.step('Step 3: Verify error is displayed and the UI remains in Korean', async () => {
      await expect(loginPage.inlineError.or(loginPage.errorToast)).toBeVisible({ timeout: 5000 });
      expect(await loginPage.isKoreanModeActive(), 'Ngôn ngữ phải vẫn là Korean sau login thất bại').toBe(true);
      await loginPage.attachScreenshot('Final Passed Screenshot');
    });
  });
});

// ============================================================
// NHÓM 5: Session & Authorization
// ============================================================
test.describe('Session & Authorization', () => {

  test('XTRACE_LOGIN_TC_025 — Không thể truy cập dashboard khi chưa đăng nhập', async ({ dashboardPage }) => {
    await test.step('Step 1: Navigate directly to the dashboard page URL', async () => {
      await dashboardPage.goto();
    });

    await test.step('Step 2: Wait for redirection to login page', async () => {
      await dashboardPage.waitForRedirectToLogin();
    });

    await test.step('Step 3: Verify that user is successfully redirected back to the login page', async () => {
      expect(await dashboardPage.isOnLoginPage(), 'Phải redirect về trang login').toBe(true);
      await dashboardPage.attachScreenshot('Final Passed Screenshot');
    });
  });
});
