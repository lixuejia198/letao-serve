const { createOrder, createSign, getTrade_no, getRandomStr, queryOrder } = require("../utils/index")
const { orderUrl, notify_url, appid, mch_id, queryOrder_url } = require("../config/wx")
const { query } = require("../db/query")
const Qrcode = require('qrcode')


// 微信下单
module.exports.order = async (ctx) => {
  console.log(ctx.request.body);
  const { body, total_fee, spbill_create_ip, trade_type } = ctx.request.body;
  // 生成需要的参数
  const params = {
    appid, // 公众号ID
    mch_id, // 商户号
    nonce_str: getRandomStr(), // 随机字符串
    body, // 商品描述
    out_trade_no: getTrade_no(), // 商户订单号
    total_fee, // 标价金额
    spbill_create_ip, // 终端IP
    notify_url, // 微信服务器回调的地址
    trade_type // 交易类型
  }

  // console.log(params);

  // 生成签名 需要你发送的参数生成
  const sign = createSign(params)
  // console.log("sssssssssss", sign);
  // 微信下单请求参数
  let sendData = `
   <xml>
      <appid>${appid}</appid>
      <body>${body}</body>
      <mch_id>${mch_id}</mch_id>
      <nonce_str>${params.nonce_str}</nonce_str>
      <notify_url>${notify_url}</notify_url>
      <out_trade_no>${params.out_trade_no}</out_trade_no>
      <spbill_create_ip>${spbill_create_ip}</spbill_create_ip>
      <total_fee>${total_fee}</total_fee>
      <trade_type>${trade_type}</trade_type>
      <sign>${sign}</sign>
  </xml>
  `
  console.log(sendData);
  const data = await createOrder(orderUrl, sendData);
  // console.log(data);

  // 下单成功
  const { result_code, return_msg, return_code, code_url } = data;
  if (result_code == 'SUCCESS' && return_msg == 'OK' && return_code == 'SUCCESS') {
    // 把订单数据写入到payorder
    await query(`insert into payorder(appid,body,mch_id,nonce_str,out_trade_no,spbill_create_ip,total_fee,trade_type,sign,trade_state) values('${appid}','${body}','${mch_id}','${params.nonce_str}','${params.out_trade_no}','${spbill_create_ip}','${total_fee}','${trade_type}','${sign}','NOTPAY')`)
    // 生成二维码图片
    data.payUrl = await Qrcode.toDataURL(code_url)
    data.out_trade_no = params.out_trade_no
  }

  ctx.body = {
    status: 200,
    data
  }

}

// 微信下单回调(需要部署服务器)
module.exports.notify = async (ctx) => {
  console.log(1111);
  // 打印微信服务器回调你的接口时的请求报文
  console.log(ctx.request.body);
  const { out_trade_no, bank_type, cash_fee, fee_type, is_subscribe, openid, time_end, transaction_id } = ctx.request.body.xml;
  await query(`update payorder set trade_state = 'SUCCESS',bank_type='${bank_type}',cash_fee='${cash_fee}',fee_type='${fee_type}',is_subscribe='${is_subscribe}',openid='${openid}',time_end='${time_end}',transaction_id='${transaction_id}' where out_trade_no = '${out_trade_no}'`)
  ctx.body = `
      <xml>
        <return_code><![CDATA[SUCCESS]]></return_code>
        <return_msg><![CDATA[OK]]></return_msg>
      </xml>
  `
}

// 微信订单查询
module.exports.queryOrder = async (ctx) => {
  const { out_trade_no } = ctx.request.body
  let params = {
    appid, // 公众号ID
    mch_id, // 商户号
    nonce_str: getRandomStr(), // 随机字符串
    out_trade_no // 订单商户号
  }

  // 签名
  const sign = createSign(params)
  // console.log(sign, "ssssssssssssssssss");
  // 微信订单查询请求参数
  let sendData = `
      <xml>
        <appid>${appid}</appid>
        <mch_id>${mch_id}</mch_id>
        <nonce_str>${params.nonce_str}</nonce_str>
        <out_trade_no>${out_trade_no}</out_trade_no>
        <sign>${sign}</sign>
      </xml>
  `
  // console.log(sendData, "sendData");
  // 微信订单查询结果
  const result = await queryOrder(queryOrder_url, sendData)
  console.log(result);

  ctx.body = {
    status: 200,
    data: result
  }
}