const bcrypt = require('bcryptjs');
const BaseService = require('../core/baseService');
class UserService extends BaseService {
  hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  compareSync(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }

  async userCheck(email, password) {
    const ctx = this.ctx;
    const user = await ctx.model.User.getUserByArgs(
      {
        email,
      },
      'id,password,status'
    );
    if (!user) {
      throw 'email not found';
    }
    if (~~user.status === 0) {
      throw '账户未激活';
    }
    if (!ctx.service.user.compareSync(password, user.password)) {
      throw 'password wrong';
    }
    delete user.dataValues.password;
    return user;
  }
}

module.exports = UserService;
