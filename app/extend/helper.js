/* eslint-disable no-undef */
const moment = require('moment');
const fs = require('fs');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const uuid = require('node-uuid');
const urls = require('./un_auth_url');
module.exports = {
  /**
   * 产生随机数
   *
   * @param {Number} n - 指定n位数
   * @returns {String} see 返回指定长度的字符串
   */
  randomNumber(n) {
    let str = '';

    for (let i = 0; i < n; i++) {
      str += Math.floor(Math.random() * 10);
    }

    return str;
  },
  relativeTime: time => moment(new Date(time * 1000)).fromNow(),
  errorCode: {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
    NOTLOGIN: 'notLoginError',
    PERMISSION: 'permissionError',
    CONNECTIONTIMEOUT: 'connectionTimeoutError',
    FORMAT: 'formatError',
    FOUND: 'notFoundError',
  },
  constant: {
    UN_AUTH_URL: urls,
  },
  ip() {
    const ctx = this.ctx;
    const ip = ctx.ips.length > 0 ? ctx.ips[ctx.ips.length - 1] : ctx.ip;
    return ip;
  },
  checkDirExist: folderpath => {
    const pathArr = folderpath.split('\\');
    let _path = '';
    pathArr.forEach((x, i) => {
      if (pathArr[i]) {
        _path += i === 0 ? `${pathArr[i]}` : `\\${pathArr[i]}`;
        if (!fs.existsSync(_path)) {
          fs.mkdirSync(_path);
        }
      }
    });
  },
  async doTran(cb) {
    const ctx = this.ctx;
    const transaction = await ctx.model.transaction();
    try {
      const returnValue = await cb(transaction);
      await transaction.commit();
      return returnValue;
    } catch (error) {
      if (error) await transaction.rollback();
      throw '数据库异常';
    }
  },
  transporter() {
    const ctx = this.ctx;
    return nodemailer.createTransport({
      host: ctx.app.email.host,
      secureConnection: false, // use SSL
      port: ctx.app.email.port,
      secure: false, // secure:true for port 465, secure:false for port 587
      auth: {
        user: ctx.app.email.email,
        pass: ctx.app.email.password, // QQ邮箱需要使用授权码
      },
    });
  },
  sendMail(recipient, subject, text) {
    const ctx = this.ctx;
    return new Promise(resovle => {
      ctx.helper.transporter().sendMail(
        {
          from: `${ctx.app.email.honer} <${ctx.app.email.email}>`,
          to: recipient,
          subject,
          html: text,
        },
        function(error) {
          if (error) {
            resovle(error.response);
          } else {
            resovle(200);
          }
        }
      );
    });
  },
  unescapeHTML: str =>
    str.replace(
      /&amp;|&lt;|&gt;|&#39;|&quot;/g,
      tag =>
        ({
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&#39;': "'",
          '&quot;': '"',
        }[tag] || tag)
    ),
  // replacements为要替换的变量的键值对
  replaceHtmlVar(template, replacements) {
    const ctx = this.ctx;
    template = ctx.helper.unescapeHTML(template);
    const templateReplace = handlebars.compile(template);
    const htmlToSend = templateReplace(replacements);
    return htmlToSend;
  },
  uuid: () => {
    return uuid.v4().replace(/\-/gi, '');
  },
};
