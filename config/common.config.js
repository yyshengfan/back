const config = {
  MISSPARAMS: {
    code: '002',
    msg: '缺少参数',
  },
  ERRPARAMTYPE: {
    code: '003',
    msg: '参数类型错误',
  },
  SQLFAIL: {
    code: '004',
    msg: '数据库操作失败',
  },
  SUCCESS: {
    code: '005',
    msg: '操作成功',
  },
  BEYONGID: {
    code: '006',
    msg: 'ID已用完,请向管理员申请',
  },
  INVALIDID: {
    code: '007',
    msg: '无效ID',
  },
  MT4IP: '218.242.245.218',
  LOGIN: 1,
  PASSWORD: 'manager',
  PASSWORD_INVESTOR: '111111',
};

module.exports = config;
