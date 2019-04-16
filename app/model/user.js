const bcrypt = require('bcryptjs');

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const User = app.model.define(
    'users',
    {
      id: {
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      }, // 用户ID
      nickname: STRING,
      username: STRING,
      email: STRING,
      password: STRING,
      avatar: STRING,
      sex: STRING,
      createTime: INTEGER,
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  // 密码hash
  User.hashPassword = function(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  // 查找用户
  User.checkUser = function(ctx, user) {
    const res = ctx.model.User.findByArgs({
      userName: user.userName,
      password: this.hashPassword(user.password),
      encode: user.encode,
    });

    return res;
  };

  return User;
};
