/**
 * Test Data Generator — unique, traceable data per test run
 */
export function timestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function invalidUsername(prefix = 'wrong_user'): string {
  return `${prefix}_${timestamp()}`;
}

export function invalidPassword(prefix = 'wrong_pass'): string {
  return `${prefix}_${timestamp()}!`;
}

export const SQL_INJECTION = "' OR '1'='1";
export const SQL_INJECTION_PASS = "' OR '1'='1' --";
export const XSS_PAYLOAD = "<script>alert('XSS_XTRACE')</script>";
export const PASSWORD_SPECIAL_CHARS = `P@ssw0rd!#$%^&*()_${timestamp()}`;
export const WHITESPACE_ONLY = '   ';
