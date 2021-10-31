const Koa = require('koa')  // KOA包
const app = new Koa()  // 创建app服务
const views = require('koa-views') // 处理静态资源
const json = require('koa-json') // json格式化
const onerror = require('koa-onerror') // 处理异常
const bodyparser = require('koa-bodyparser') // 解析post请求
const logger = require('koa-logger') // 记录日志
const jwt = require('koa-jwt') // 引入koa-jwt
const xmlParser = require('koa-xml-body')

// 配置env
require('dotenv').config()
app.use(xmlParser())

// 加载路由
const index = require('./routes/index')
const users = require('./routes/users')
const category = require('./routes/category')
const sms = require("./routes/sms")
const order = require("./routes/order")

// error handler 错误处理
onerror(app)

// 使用koa-jwt中间件 未拦截客户端在调用接口时 如果请求头中没有设置token 返回401
app.use((ctx, next) => {
  return next().catch((err) => {
    if (err.status == 401) {
      ctx.status == 401;
      ctx.body = {
        status: 0,
        msg: "没有访问权限"
      }
    } else {
      throw err;
    }
  })
});
// 设置哪些接口需要带token
// jwt(加密信息) 加密信息一定要跟token生成时使用加密字符串保持一致
// unless 排除哪些不需要在请求时带token
app.use(jwt({ secret: process.env.tokenSecret }).unless({ path: [/^\/public/, /^\/users\/register/, /^\/users\/login/] }))

// middlewares 中间件
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger 记录操作日志
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes 注册路由
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(category.routes(), category.allowedMethods())
app.use(sms.routes(), sms.allowedMethods())
app.use(order.routes(), order.allowedMethods())

// error-handling 一旦监听到异常 就打印
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
