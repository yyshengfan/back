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
          database: 'tianhuiaccount',
          baseDir: 'model',
          delegate: 'model',
          host: 'localhost',
          port: '3306',
          username: 'root',
          password: '111111',
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

  config.cluster = {
    listen: {
      path: '',
      port: 7001,
      hostname: '127.0.0.1',
    },
  };
  // add your config here
  return config;
};
