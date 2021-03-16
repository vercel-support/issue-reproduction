const jwt = require('jsonwebtoken');

class JwtTokenService {
  constructor() {
    this.privateKEY = '1234';
    this.publicKEY = '34556';
    this.admin_privateKEY = '23585';
    this.admin_publicKEY = '23292';

    this.signOptions = {
      algorithm: 'RS256',
      expiresIn: '1h',
      issuer: 'test',
    };
  }

  async verifyToken(request) {
    try {
      const token =
        request.headers.authorization ||
        request.headers.Authorization ||
        request.query['token'];
      const verified = await jwt.verify(
        token,
        Buffer.from(this.publicKEY, 'base64'),
        this.signOptions
      );
      console.log(verified);

      return verified;
    } catch (err) {
      switch (true) {
        case err instanceof jwt.TokenExpiredError:
          throw { name: 'JWT_Expired', message: 'Invalid Token' };
        case err instanceof jwt.JsonWebTokenError:
          throw { name: 'JsonWebTokenError', message: 'Invalid signature' };
        case err instanceof TypeError:
          throw { name: 'INVALID_PARAMETER', message: 'Please provide token' };
        default:
          throw { name: 'JWT_Expired', message: 'Invalid Token' };
      }
    }
  }

  async generateJwt(payload) {
    payload = {
      userType: 2,
      natsToken: 'defaultFissionAuthToken',
      ...payload,
      // We don't wan to log these test accounts, because they tend to fill up the
      // the LogRocket session recordings
      doNotLog:
        payload?.username &&
        (payload.username === 'OATestAccount' ||
          payload.username === 'OrchardAlliance'),
    }; // userType 2 indicates a customer
    const token = await jwt.sign(
      payload,
      Buffer.from(this.privateKEY, 'base64'),
      this.signOptions
    );
    return token;
  }

  async verifyAdminToken(request) {
    try {
      const token =
        request.headers.authorization ||
        request.headers.Authorization ||
        request.query['token'];
      const verified = await jwt.verify(
        token,
        Buffer.from(this.admin_publicKEY, 'base64'),
        this.signOptions
      );
      console.log('jwt-token', verified);
      return verified;
    } catch (err) {
      console.log('errrr', err);
      switch (true) {
        case err instanceof jwt.TokenExpiredError:
          throw { name: 'JWT_Expired', message: 'Invalid Token' };
        case err instanceof jwt.JsonWebTokenError:
          throw { name: 'JsonWebTokenError', message: 'Invalid signature' };
        case err instanceof TypeError:
          throw { name: 'INVALID_PARAMETER', message: 'Please provide token' };
        default:
          throw { name: 'JWT_Expired', message: 'Invalid Token' };
      }
    }
  }

  async generateAdminJwt(payload) {
    payload = { userType: 1, natsToken: '', ...payload }; // userType 1 indicates an admin
    const token = await jwt.sign(
      payload,
      Buffer.from(this.admin_privateKEY, 'base64'),
      this.signOptions
    );
    return token;
  }
}

module.exports = {
  authService: new JwtTokenService(),
};
