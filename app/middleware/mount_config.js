const config = require('../../config/resCode');

module.exports = () => {
  return async function mount_config(ctx, next) {
    // ctx.config = config;
    await next();
  };
};
