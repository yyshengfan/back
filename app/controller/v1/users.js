const BaseController = require('../../core/baseController');
const users_rules = require('./rules/users_rules');
const _ = require('lodash');
class UsersController extends BaseController {
  // post /login
  async login() {
    const ctx = this.ctx;
    ctx.validate(users_rules.loginRule, ctx.request.body);
    const { user: userService, auth: authService } = ctx.service;
    const { email, password } = ctx.request.body;
    let user;
    try {
      user = await userService.userCheck(email, password);
      this.success({
        user,
        token: await authService.sign(user),
      });
    } catch (error) {
      this.failure({ msg: error });
    }
  }

  async checkEmail(ctx) {
    const { email } = ctx.request.query;
    const userDao = ctx.model.User;
    const user = await userDao.findOne({
      where: { email },
      attributes: [ 'id' ],
    });
    if (!user) {
      this.success();
    } else {
      this.failure({ msg: '邮箱已存在' });
    }
  }

  async register() {
    const ctx = this.ctx;
    try {
      ctx.validate(users_rules.registerRule, ctx.request.body);
    } catch (error) {
      this.validateError(error);
      return;
    }
    const userDao = ctx.model.User;
    const { user: userService, mail: mailService } = ctx.service;
    const register_ip = ctx.helper.ip();
    // 根据用户的推荐码查询用户的代理
    let { invite_code, chineseName: username, email } = ctx.request.body;
    const userInfo = await userDao.findOne({
      where: { email },
      attributes: [ 'id' ],
    });
    if (userInfo) {
      this.failure({ msg: '邮箱已存在' });
      return;
    }
    const active_code = ctx.helper.uuid();
    const replace = {
      username,
      email,
      active_url: `${ctx.app.config.active_url}?active_code=${active_code}`,
    };
    const res = await mailService.sendMail('active_reg_email', replace, email);
    if (res !== 200) {
      this.failure({ msg: res });
      return 0;
    }
    const parentUser = await userDao.getUserByArgs(
      {
        invite_code,
      },
      'id,agent_code'
    );
    if (!parentUser.id) {
      this.failure({ msg: '推荐码不存在' });
      return;
    }
    const user = ctx.request.body;
    _.pick(user, ...Object.keys(users_rules));
    user.register_ip = register_ip;
    user.status = 0;
    user.password = userService.hashPassword(user.password);
    user.parent_id = parentUser.id;
    const ids = await userDao.create(user);
    const agent_code = `${parentUser.agent_code}${ids.id
      .toString()
      .padStart(5, 0)}`;
    invite_code = ctx.helper.uuid();
    const updateFlag = await userDao.update(
      { agent_code, invite_code, active_code },
      {
        where: {
          id: ids.id,
        },
      }
    );
    if (updateFlag) {
      this.success();
    } else {
      this.failure();
    }
  }
  // 获取所有的用户
  async list() {
    const ctx = this.ctx;
    const userDao = ctx.model.User;
    const query = ctx.request.query;
    const rows = await userDao.getPaging(query);
    const count = await userDao.count();
    this.success({ list: { rows, count } });
  }
  // 修改用户  //post
  async update() {
    const ctx = this.ctx;
    const userDao = ctx.model.User;
    const user = ctx.request.body;
    try {
      ctx.validate(users_rules.updateRule, user);
    } catch (error) {
      this.validateError(error);
    }
    _.pick(user, Object.keys(users_rules.updateRule));
    userDao.update(user, { where: { id: user.id } });
    this.success();
  }
  async active() {
    const ctx = this.ctx;
    const { active_code } = ctx.request.query;
    const userDao = ctx.model.User;
    await userDao.update({ status: 1 }, { where: { active_code } });
    this.success();
  }

  async getUserInfo() {
    const ctx = this.ctx;
    let { id, login } = ctx.request.query;
    const userDao = ctx.model.User;
    const mt4accountDao = ctx.model.Mt4account;
    if (login) {
      const account = await mt4accountDao.findOne({ where: { id: login } });
      id = account.member_id;
    }
    const user = await userDao.findOne({
      where: { id },
    });
    this.success({ user });
  }
}

module.exports = UsersController;
