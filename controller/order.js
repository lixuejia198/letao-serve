const { createOrder, createSign, getTrade_no, getRandomStr, queryOrder } = require("../utils/index")
const { orderUrl, notify_url, appid, mch_id, queryOrder_url } = require("../config/wx")
const { query } = require("../db/query")
const Qrcode = require('qrcode')

let commonParams = {
  nonce_str: '', // 随机字符串
  out_trade_no: '' // 商户订单号
}

// 微信下单
module.exports.order = async (ctx) => {
  const { body, total_fee, spbill_create_ip, trade_type } = ctx.request.body;
  commonParams.nonce_str = getRandomStr();
  commonParams.out_trade_no = getTrade_no();
  // 生成需要的参数
  const params = {
    appid, // 公众号ID
    mch_id, // 商户号
    nonce_str: commonParams.nonce_str, // 随机字符串
    // sign, // 签名
    body, // 商品描述
    out_trade_no: commonParams.out_trade_no, // 商户订单号
    total_fee, // 标价金额
    spbill_create_ip, // 终端IP
    notify_url, // 微信服务器回调的地址
    trade_type // 交易类型
  }

  // console.log(params);

  // 生产签名 需要你发送的参数生成
  const sign = createSign(params)
  // 请求参数新增sign属性
  params.sign = sign
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
  // console.log(sendData);
  const data = await createOrder(orderUrl, sendData);

  // 下单成功
  const { result_code, return_msg, return_code, code_url } = data;
  if (result_code == 'SUCCESS' && return_msg == 'OK' && return_code == 'SUCCESS') {
    data.payUrl = await Qrcode.toDataURL(code_url)
  }

  ctx.body = {
    status: 200,
    data
  }

}

// 微信下单回调(需要部署服务器,我还没部署！！！)
module.exports.notify = async (ctx) => {
  // 打印微信服务器回调你的接口时的请求报文
  console.log(ctx.request.body.xml);
  const { appid, bank_type, cash_fee, fee_type, is_subscribe, mch_id, nonce_str, openid, out_trade_no, sign, time_end, total_fee, trade_type, transaction_id } = ctx.request.body.xml;
  // 根据商户订单号查询支付订单表是否存在此订单
  const result = await query('select out_trade_no from payorder')
  // 有的话 就退出程序(避免重复添加)
  if (result[0]) return;
  // 没有的话 就向支付订单表中添加此订单
  await query(`insert into payorder(appid, bank_type,cash_fee,fee_type,is_subscribe,mch_id,nonce_str,openid,out_trade_no,sign,time_end,total_fee,trade_type,transaction_id) values('${appid}','${bank_type}','${cash_fee}','${fee_type}','${is_subscribe}','${mch_id}','${nonce_str}','${openid}','${out_trade_no}','${sign}','${time_end}','${total_fee}','${trade_type}','${transaction_id}')`);

}

// 微信订单查询
module.exports.queryOrder = async (ctx) => {
  const { nonce_str, out_trade_no } = commonParams
  let params = {
    appid, // 公众号ID
    mch_id, // 商户号
    nonce_str, // 随机字符串
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
        <nonce_str>${nonce_str}</nonce_str>
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