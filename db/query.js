var mysql = require('mysql');
const { mysqlConfig } = require("./config");
// console.log(mysqlConfig[process.env.DB_ENV]);
// 创建数据库池
var pool = mysql.createPool(mysqlConfig);

// 创建数据库连接
module.exports.query = (sql, payload) => {
  // console.log("sql", sql, "payload", payload);
  // 返回promise返回的结果
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err; // not connected! 没有连接上

      // Use the connection 使用连接 发送sql语句到数据库中 然后数据库会执行sql语句
      // 执行结果 在回调函数中返回
      connection.query(sql, payload, function (error, results, fields) {
        // When done with the connection, release it. 没连接上和拿到返回数据之后 会把当前连接释放掉
        connection.release();

        // Handle error after the release. 错误处理 抛出异常
        if (error) throw error;

        // 返回数据
        resolve(results)

        // Don't use the connection here, it has been returned to the pool.
      });
    });
  })

}