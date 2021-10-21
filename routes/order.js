const router = require('koa-router')()
const { order, notify, queryOrder } = require("../controller/order")

// 微信下单
router.post("/order", order)
// 微信下单回调
router.post("/pay/notify", notify)
// 微信订单查询
router.post("/queryOrder", queryOrder)

module.exports = router;