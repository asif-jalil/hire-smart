import { doubleCsrf } from 'csrf-csrf';
import { Request } from 'express';

const isProd = process.env.NODE_ENV === 'production';

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  // @ts-expect-error csrf secret is required
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: isProd ? '__Host-hs.csrf' : 'hs.csrf',
  cookieOptions: {
    sameSite: 'strict',
    secure: isProd,
  },
  errorConfig: {
    message: 'Invalid request',
    code: 'InvalidCsrfToken',
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  getSessionIdentifier: (req: Request) => req.session.id,
  getCsrfTokenFromRequest: (req: Request) => req.headers['x-csrf-token'],
});

export { doubleCsrfProtection, generateCsrfToken };
