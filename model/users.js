const { query } = require("../db/query")
// 用户注册数据层
module.exports.register = async (username, password, mobile) => {
  return await query(`INSERT INTO user (username,password,mobile) VALUES("${username}","${password}","${mobile}")`)
}
// 查询用户名
module.exports.findUserByUserName = async (username) => {
  return await query("SELECT * FROM user WHERE username = ?", [username])
}
// 查询用户名和密码
module.exports.findUserByUP = async (username, password) => {
  return await query("SELECT * FROM user WHERE username = ? AND `password` = ?", [username, password])
}