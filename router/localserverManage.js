const express = require('express');
const router = express.Router()


// 导入用户路由处理函数对应的模块
const ManageHandler = require('../router_handler/Manage');

router.get('/aticle', ManageHandler.article)

router.post('/addArticle', ManageHandler.addArticle)

router.get('/aticleList', ManageHandler.aticleList)

router.post('/changeAticle', ManageHandler.changeAticle)

router.post('/dleAticle', ManageHandler.dleAticle)

//将路由对象共享出去
module.exports = router