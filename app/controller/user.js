const BaseController = require('../core/baseController');

class UserController extends BaseController {
  async login(ctx) {
    // 验证参数
    const isPass = this.isPass(ctx.request.body, [
      'username',
      'password',
    ]);
    if (!isPass) return this.failure(this.MISSPARAMS);

    const user = await ctx.model.User.find({ ...isPass });
    if (user) {
      this.success(user);
    } else {
      this.failure(ctx.config.MISSPARAMS);
    }
  }
}

module.exports = UserController;
