module.exports = appInfo => {
  const config = (exports = {
    static: {
      // 配置静态文件请求
      prefix: '/',
    },
    sequelize: {
      datasources: [
        {
          dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
          database: 'crm',
          baseDir: 'model',
          delegate: 'model',
          host: '218.242.245.217',
          port: '3306',
          username: 'admin',
          password: 'CMMIjTE2ON1UeNjZ',
        },
        {
          dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
          database: 'mt4dps',
          baseDir: 'report',
          delegate: 'report',
          host: '218.242.245.218',
          port: '3306',
          username: 'root',
          password: 'root',
        },
      ],
    },
    security: {
      csrf: {
        enable: false,
      },
    },
    multipart: {
      fileSize: '20mb',
      whitelist: [ '.png', '.jpg', '.jpeg' ],
    },
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },
    auth: {
      secret: '11111',
    },
    middleware: [ 'auth', 'mountConfig', 'errorHandler' ],
  });

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1513142797863_8350';
  config.proxy = true;
  config.webname = 'blgmtech';
  config.active_url = 'http://192.168.1.25:7001/api/v1/user/active';
  config.login_url = 'http://localhost:8080/#/login';
  config.cluster = {
    listen: {
      path: '',
      port: 3000,
      hostname: '127.0.0.1',
    },
  };
  // add your config here
  // config.middleware = ['errorHandler', 'auth'];
  return config;
};
