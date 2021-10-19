const router = require('koa-router')()

const { gridlist, banners, sports } = require("../controller/index")

// router.get('/', async (ctx, next) => {
//   await ctx.render('index', {
//     title: 'Hello Koa 2!'
//   })
//   console.log(ctx);
// })

// router.get('/string', async (ctx, next) => {
//   ctx.body = 'koa2 string'
// })

// router.get('/json', async (ctx, next) => {
//   ctx.body = {
//     title: 'koa2 json'
//   }
// })

// 首页宫格数据
router.get('/gridlist', gridlist)

// 轮播图接口
router.get('/banners', banners)

// 运动专区接口
router.get('/sports', sports)

module.exports = router