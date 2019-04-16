// 授权拦截中间件
module.exports = options => {
  return async function auth(ctx, next) {
    // 没有传token，直接返回错误
    const token = ctx.header.authorization;
    const { auth: authService } = ctx.service;
    const request_url = ctx.request.url.split('?')[0];
    if (
      !ctx.helper.constant.UN_AUTH_URL.includes(request_url) &&
      request_url.split('/')[1] !== 'public'
    ) {
      if (!token) {
        ctx.body = {
          code: 401,
          msg: ctx.helper.errorCode[401],
        };
        return;
      }
      try {
        const user = authService.verify(token);
        ctx.request.token_user_id = user.id;
      } catch (error) {
        ctx.body = {
          code: 401,
          msg: ctx.helper.errorCode[401],
        };
        return;
      }
      await next();
    } else {
      await next();
    }
  };
};
