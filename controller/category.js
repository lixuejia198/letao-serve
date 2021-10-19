const { oneCategory, twoCategory } = require("../model/category")
// 一级分类的业务逻辑处理
module.exports.oneCategory = async (ctx) => {
  const result = await oneCategory()
  // console.log(result);
  // 返回数据
  ctx.body = {
    status: 200,
    oneCategoryList: result
  }
}
// 二级分类发业务逻辑处理
module.exports.twoCategory = async (ctx) => {
  console.log(ctx.request.query);
  const { id } = ctx.request.query;
  console.log(id, "id");
  const result = await twoCategory(id)
  // console.log(result);
  // 返回数据
  ctx.body = {
    status: 200,
    twoCategoryList: result
  }
}