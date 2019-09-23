// const UN_AUTH_URL = require('./extend/un_auth_url');
/**
 * @param {Egg.Application} app - egg application
 */

// const permissionRouter = require('./routers/neoRouter');
// const userRouter = require('./routers/userRouter');
module.exports = app => {
  const { router, controller } = app;
  router.get('/enCode', controller.encode.encode);
  router.post('/login', controller.user.login);
};
