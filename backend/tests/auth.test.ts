describe('Authentication Service', () => {
  it('should validate email format properly', () => {
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    expect(isValidEmail('farmer@sih.gov.in')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });

  it('should enforce password length requirement', () => {
    const isStrongPassword = (pass: string) => pass.length >= 8;
    expect(isStrongPassword('SecurePass123!')).toBe(true);
    expect(isStrongPassword('short')).toBe(false);
  });
});
