import { CREGEX } from '../../../../constants/cregex.contant';
import { generateOTP } from '..';

describe('.generateOTP', () => {
  it('should generate a 6-digit number', () => {
    const otp = generateOTP();
    expect(otp).toMatch(CREGEX.FIXED_DIGIT_NUMBER);
  });

  it('should always generate a 6-digit number within the range of 100000 ', () => {
    const otp = generateOTP();
    const otpNumber = parseInt(otp, 10);
    expect(otpNumber).toBeGreaterThanOrEqual(100000);
    expect(otpNumber).toBeLessThanOrEqual(999999);
  });

  it('should generate different OTPs on subsequent calls', () => {
    const otp1 = generateOTP();
    const otp2 = generateOTP();
    expect(otp1).not.toBe(otp2);
  });

  it('should generate a valid OTP each time it is called', () => {
    const otp1 = generateOTP();
    const otp2 = generateOTP();
    const otp3 = generateOTP();

    expect(otp1).toMatch(CREGEX.FIXED_DIGIT_NUMBER);
    expect(otp2).toMatch(CREGEX.FIXED_DIGIT_NUMBER);
    expect(otp3).toMatch(CREGEX.FIXED_DIGIT_NUMBER);
  });
});
