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

    const user = await ctx.model.user.checkUser({ ...ctx.request.body });
    if (user) {
      this.success();
    } else {
      this.failure(ctx.config.MISSPARAMS);
    }
  }
}

module.exports = UserController;
