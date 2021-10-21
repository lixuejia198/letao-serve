// 微信下单
module.exports.orderUrl = "https://api.mch.weixin.qq.com/pay/unifiedorder"
// 微信下单成功后的回调地址(要实现这个接口)
module.exports.notify_url = "https://baidu.com/pay/notify"
// 微信订单查询
module.exports.queryOrder_url = "https://api.mch.weixin.qq.com/pay/orderquery"

// 公众号ID
module.exports.appid = process.env.WX_APPID
// 商户号
module.exports.mch_id = process.env.WX_MCHID
// 商户中的key
module.exports.wx_key = process.env.WX_APIKEY