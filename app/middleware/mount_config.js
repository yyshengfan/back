const config = require('../../config/common.config');

// 参数控制
const isPass = (params, validateStr) => {
  const paramArr = Object.keys(params);
  for (const item of validateStr) {
    if (!paramArr.includes(item)) {
      return false;
    }
  }
  return true;
};

// 生成密码
const createPwd = () => {
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
};

// 合成查询语句
const stimeAndEtime = function(ctx, filter, atr) {
  const body = { ...Object.assign(ctx.request.body, ctx.request.query) };
  const { etime, stime } = body;
  const Op = ctx.app.Sequelize.Op;
  if (stime) filter[atr] = { [Op.gte]: stime };
  if (etime) filter[atr] = { [Op.lte]: etime };
  if (stime && etime) filter[atr] = { [Op.gte]: stime, [Op.lte]: etime };
};

const tofilter = (ctx, str, atr) => {
  const filter = {};
  const list = str.split(',');
  const body = { ...Object.assign(ctx.request.body, ctx.request.query) };
  for (const item of list) {
    if (body[item]) filter[item] = body[item];
  }
  if (atr) stimeAndEtime(ctx, filter, atr);
  return filter;
};

const addAtr = (ctx, obj, str) => {
  const list = str.split(',');
  const body = { ...Object.assign(ctx.request.body, ctx.request.query) };
  for (const item of list) {
    if (body[item]) obj[item] = body[item];
  }
};

module.exports = () => {
  return async function mount_config(ctx, next) {
    ctx.config = config;
    ctx.isPass = isPass;
    ctx.createPwd = createPwd;
    ctx.tofilter = tofilter;
    ctx.addAtr = addAtr;
    ctx.stimeAndEtime = stimeAndEtime;
    await next();
  };
};
