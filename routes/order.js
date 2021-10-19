const router = require('koa-router')()
const { order } = require("../controller/order")

// 微信下单
router.post("/order", order)

module.exports = router;