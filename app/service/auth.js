const BaseService = require('../core/baseService');
const jwt = require('jsonwebtoken');
class AuthService extends BaseService {
  sign(user) {
    const userToken = {
      id: user.id,
    };
    const token = jwt.sign(userToken, this.app.config.auth.secret, {
      expiresIn: '7d',
    });
    return token;
  }

  verify(token) {
    const decoded = jwt.verify(token, this.app.config.auth.secret);
    return decoded;
  }
}

module.exports = AuthService;
