const { query } = require("../db/query")
// 一级分类数据层
module.exports.oneCategory = async () => {
  return await query("SELECT * FROM category")
}
// 二级分类数据层
module.exports.twoCategory = async (id) => {
  return await query("SELECT * FROM brand WHERE categoryId = ?", [id])
}