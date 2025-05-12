import { createHash } from 'crypto';

export function generateEncryptedString(input: string): string {
  const hash = createHash('sha256');

  hash.update(input);
  const hashedString = hash.digest('hex');
  // Encode the hashed string to Base64
  const base64Encoded = Buffer.from(hashedString, 'hex').toString('base64');

  return base64Encoded;
}

export function transformHeader(headers: Record<string, string>): Record<string, string> {
  const apiKey = headers['x-account-key'];
  if (apiKey) {
    headers['x-account-key'] = generateEncryptedString(apiKey);
  }

  const token = headers.authorization;

  if (token) {
    headers.authorization = generateEncryptedString(token);
  }
  return { ...headers };
}
