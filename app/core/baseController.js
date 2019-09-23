const { Controller } = require('egg');
const config = require('../../config/resCode');
const _ = require('lodash');
class BaseController extends Controller {
  constructor(props) {
    super(props);
    _.assign(this, config);
  }
  success(data, state) {
    const { ctx } = this;
    ctx.body = {
      code: '0',
      msg: 'OK',
      result: data,
    };
    ctx.status = state || 200;
  }
  failure({ state, data, code, msg }) {
    const { ctx } = this;
    const defaultCode = state >= 200 && state < 300 ? 0 : state;

    ctx.body = {
      code: String(code || defaultCode || 500),
      msg: msg || ctx.helper.errorCode[String(state)],
      result: data,
    };
    ctx.status = state || 200;
  }
  validateError(err) {
    const ctx = this.ctx;
    ctx.body = {
      code: '422',
      msg: ctx.helper.errorCode['422'],
      result: err.errors,
    };
    ctx.status = 200;
  }
  microserviceError(err) {
    const ctx = this.ctx;

    ctx.logger.error('微服务调用异常', err);
    const isEnvProd = ctx.app.config.env === 'prod';

    this.failure({
      code: 900,
      state: 200,
      msg: ctx.helper.errorCode[900],
      data: !isEnvProd ? err : {},
    });
  }
  // 参数控制
  isPass(params, validateStr) {
    const obj = {};
    const paramArr = Object.keys(params);
    validateStr =
      typeof validateStr === 'string' ? validateStr.split(',') : validateStr;

    for (const item of validateStr) {
      if (!paramArr.includes(item)) {
        return false;
      }
      obj[item] = params[item];
    }
    return obj;
  }
  // 生成密码
  createPwd() {
    const num = '123456789'.split('');
    const letter = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(
      ''
    );
    const getValues = (char, num) => {
      let res = '';
      for (let i = 0; i < num; i++) {
        const index = Math.ceil(Math.random() * (char.length - 1));
        res += char[index];
      }
      return res;
    };
    return getValues(num, 2) + getValues(letter, 4);
  }

  // 专门为时间筛选写的
  stimeAndEtime(ctx, filter, atr) {
    const body = { ...Object.assign(ctx.request.body, ctx.request.query) };
    const { etime, stime } = body;
    const Op = ctx.app.Sequelize.Op;
    if (stime) filter[atr] = { [Op.gte]: stime };
    if (etime) filter[atr] = { [Op.lte]: etime };
    if (stime && etime) filter[atr] = { [Op.gte]: stime, [Op.lte]: etime };
  }

  tofilter(ctx, str, atr) {
    const filter = {};
    const list = str.split(',');
    const body = { ...Object.assign(ctx.request.body, ctx.request.query) };
    for (const item of list) {
      if (body[item]) filter[item] = body[item];
    }
    if (atr) this.stimeAndEtime(ctx, filter, atr);
    return filter;
  }
  addAtr(ctx, obj, str) {
    const list = str.split(',');
    const body = { ...Object.assign(ctx.request.body, ctx.request.query) };
    for (const item of list) {
      if (body[item]) obj[item] = body[item];
    }
  }
}
module.exports = BaseController;
