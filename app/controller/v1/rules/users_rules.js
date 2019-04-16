exports.loginRule = {
  email: {
    type: 'email',
    required: true,
  },
  password: {
    type: 'string',
    required: true,
  },
};

exports.registerRule = {
  email: {
    type: 'email',
    required: true,
  },
  phone: 'string',
  password: 'password',
  chineseName: 'string',
  nationality: 'string',
  livingState: 'string',
  province: 'string',
  city: 'string',
  bankName: 'string',
  accountNum: 'string',
  bankCardPic: 'string',
  identity: 'string',
  idCardFront: 'string',
  idCardBack: 'string',
  invite_code: 'string',
};
const requiredString = {
  type: 'string',
  required: true,
};
const nullableString = {
  type: 'string',
  required: false,
};
exports.updateRule = {
  avater: nullableString,
  nickname: requiredString,
  chineseName: nullableString,
  nationality: nullableString,
  birthDate: nullableString,
  livingState: nullableString,
  province: nullableString,
  city: nullableString,
  address: nullableString,
  residenceTime: nullableString, // 居住年限
  residentialTelephone: nullableString, // 住宅电话
  bankBranch: nullableString, // 开户支行
  accountName: nullableString, // 银行开户姓名
  accountNum: nullableString, // 银行账号
  bankCardPic: nullableString, // 银行卡照片
  realname: nullableString, // 真实姓名
  identity: nullableString, // 证件号码
  idCardFront: nullableString,
  idCardBack: nullableString,
  addressProof: nullableString, // 地址证明照片
};
