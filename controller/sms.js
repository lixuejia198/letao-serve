const { sendsms, getRandomLength } = require("../utils/index")
// 发送短信
module.exports.sendsms = async (ctx) => {
  const code = getRandomLength(6);
  const { mobile } = ctx.request.body;
  const result = await sendsms(mobile, code);
  // 判断短信是否发送成功
  if (result.SendStatusSet[0].Code == 'Ok') {
    ctx.body = {
      status: 200,
      code: code,
      msg: "短信发送成功"
    }
  } else {
    ctx.body = {
      status: 0,
      msg: "短信发送失败"
    }
  }

}