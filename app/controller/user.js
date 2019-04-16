const BaseController = require('../core/baseController');

class UserController extends BaseController {
  async login(ctx) {
    // 验证参数
    const isPass = ctx.isPass(ctx.request.body, [
      'loginName',
      'password',
      'encode',
    ]);
    if (!isPass) return this.failure(ctx.config.MISSPARAMS);

    const { loginName, password, encode } = ctx.request.body;
  }
}

module.exports = UserController;
