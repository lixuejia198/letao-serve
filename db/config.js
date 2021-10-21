module.exports.mysqlConfig = {
  // 最大连接数量
  connectionLimit: 100,
  // 主机
  host: process.env[`${process.env.ENV}_MYSQL_POST`],
  // 用户名
  user: process.env[`${process.env.ENV}_MYSQL_USER`],
  // 密码
  password: process.env[`${process.env.ENV}_MYSQL_PASSWORD`],
  // 数据库
  database: process.env[`${process.env.ENV}_MYSQL_DATABASE`],
}