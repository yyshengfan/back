const BaseController = require('../core/baseController');
const svgCaptcha = require('svg-captcha');

class EncodeController extends BaseController {
  async encode() {
    // 获取图形验证码
    const codeConfig = {
      size: 4, // 验证码长度
      ignoreChars: 'qwertyuiopasdfghjklzxcvbnm', // 验证码中排除的字符
      noise: 4, // 干扰线数量
      height: 44,
    };

    const captcha = svgCaptcha.create(codeConfig);
    return this.success({ img: captcha.data });
  }
}

module.exports = EncodeController;
