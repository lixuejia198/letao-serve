const router = require("koa-router")();
const { oneCategory, twoCategory } = require("../controller/category")

// 一级分类接口
router.get("/oneCategory", oneCategory)
// 二级分类接口
router.get("/twoCategory", twoCategory)

module.exports = router