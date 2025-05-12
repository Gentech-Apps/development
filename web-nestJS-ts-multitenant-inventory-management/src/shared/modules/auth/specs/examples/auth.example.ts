export const AuthExamples = {
  authorize: {
    ok: {
      body: {
        email: 'john.doe@example.com',
        password: 'User@1234',
        companyName: 'companyaName',
      },
      expected: {
        output: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
          expireTime: 1685408400000,
        },
      },
    },
    badRequest: {
      body: {
        email: 'invalid@example.com',
        password: '',
        companyName: 'companyaName',
      },
      expected: {
        error: 'UnauthorizedException',
        message: 'Invalid credentials',
      },
    },
  },
  refreshToken: {
    ok: {
      body: {
        refreshToken: 'valid_refresh_token',
      },
      expected: {
        output: {
          accessToken: 'new_access_token',
          refreshToken: 'new_refresh_token',
          expireTime: 1685408400000,
        },
      },
    },
    unauthorized: {
      body: {
        refresh_token: 'invalid_refresh_token',
      },
    },
    missingToken: {
      body: {},
    },
  },
};
