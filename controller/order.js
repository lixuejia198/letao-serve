const { createOrder } = require("../utils/index")
const { orderUrl } = require("../config/wx")

// 微信下单
module.exports.order = async () => {
  // 下单需要的参数
  const params = {
    appid, // 公众号ID
    mch_id, // 商户号
    nonce_str, // 随机字符串
    sign, // 签名
    body, // 商品描述
    out_trade_no, // 商户订单号
    total_fee, // 标价金额
    spbill_create_ip, // 终端IP
    notify_url, // 微信服务器回调的地址
    trade_type // 交易类型
  }

  const data = await createOrder(orderUrl, params);

  ctx.body = {
    status: 200,
    data
  }

}