const { register, findUserByUserName, findUserByUP } = require("../model/users")
const Joi = require('joi');
const { cryptoPassword } = require("../utils/index")
const jwt = require("jsonwebtoken")
// 用户注册
module.exports.register = async (ctx) => {
  // console.log(ctx.request.body);
  const { username, password, mobile } = ctx.request.body;
  const schema = Joi.object({
    // 校验用户名
    username: Joi.string().min(2).max(20).required(),
    // 校验密码
    password: Joi.string().pattern(/^[a-zA-Z0-9]{6,30}$/),
    // 再次校验密码
    repeat_password: Joi.ref('password'),
    // 校验手机号
    mobile: Joi.string().pattern(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/)
  })
  // 校验结果
  const verify = schema.validate({ username, password, mobile })
  // console.dir(verify.error.details[0].message);
  // 校验失败 提示错误消息
  if (verify.error) {
    ctx.body = {
      status: 0,
      message: verify.error.details[0].message
    }
    return;
  }

  // 查询当前用户是否已注册
  const user = await findUserByUserName(username)
  console.log(user);

  // 已注册
  if (user[0]) {
    ctx.body = {
      status: 0,
      message: "您已注册，无需重复注册"
    }
    return;
  }

  // 用户注册
  await register(username, cryptoPassword(password), mobile)

  ctx.body = {
    status: 200,
    msg: "注册成功"
  }
}

// 用户登录
module.exports.login = async (ctx) => {
  console.log(ctx.request.body);
  const { username, password } = ctx.request.body;
  const user = await findUserByUP(username, cryptoPassword(password));
  // console.log(user);
  // console.log(process.env.DB_SALT);
  // console.log(cryptoPassword(password));
  if (user[0]) {
    // 利用jsonwebtoken(jwt)生成token(令牌)
    const token = jwt.sign({
      data: {
        username
      }
    }, process.env.tokenSecret, { expiresIn: '24h' });
    ctx.body = {
      status: 200,
      token: token,
      msg: "登录成功"
    }
  } else {
    ctx.body = {
      status: 0,
      msg: "登录失败，请检查用户名或密码"
    }
  }
}