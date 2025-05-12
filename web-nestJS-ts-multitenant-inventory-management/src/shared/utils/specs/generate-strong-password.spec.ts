import { generateStrongPassword } from '../generate-strong-password';

describe('generateStrongPassword', () => {
  it('should generate a password of default length 10', () => {
    const password = generateStrongPassword();
    expect(password.length).toBe(10);
  });

  it('should generate a password of the specified length', () => {
    const length = 15;
    const password = generateStrongPassword(length);
    expect(password.length).toBe(length);
  });

  it('should contain only valid characters from the charset', () => {
    const password = generateStrongPassword(20);
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    for (let i = 0; i < password.length; i++) {
      expect(charset).toContain(password[i]);
    }
  });

  it('should generate different passwords each time', () => {
    const password1 = generateStrongPassword();
    const password2 = generateStrongPassword();
    expect(password1).not.toBe(password2);
  });
});
