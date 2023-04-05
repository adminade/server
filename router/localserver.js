const express = require('express');
const router = express.Router()


// 导入用户路由处理函数对应的模块
const user_routerHandler = require('../router_handler/user');

//注册新用户
router.post('/localserver', (req, res) => {
    res.send("ok")

});
//登录用户
router.get('/localserver', (req, res) => {
    res.send("ok")

});

router.get('/checklogin', (req, res) => {
    res.send('ok')
})

//------------------------------------------------------------------------------


const loginHandler = require('../router_handler/localserver_login');
const SMSHandler = require('../router_handler/localserver_SMS')
const { route } = require('./user');
// router.post('/onlogin', loginHandler.loginHandler)

//-----------------------------------------------------
//登录
router.post('/login', loginHandler.login)
//注册
router.post('/regUser', loginHandler.regUser)

//短信路由
router.get('/requestSMS', SMSHandler.sendSMS)
//搜索文章路由
router.get('/keywordSearch', loginHandler.keywordSearch)

router.get('/upkeepQuery', loginHandler.upkeepQuery)

router.get('/cateNumber', loginHandler.cateNumber)

router.get('/getCate', loginHandler.getCate)

router.post('/addPig', loginHandler.addPig)

router.get('/transferHistory', loginHandler.transferHistory)

router.get('/getCatepigSum', loginHandler.getCate_pigSum)

router.post('/deleteHouse', loginHandler.deleteHouse)

router.post('/addHouse', loginHandler.addHouse)

router.post('/checkPigNumber', loginHandler.checkPigNumber)

router.post('/addTransfer', loginHandler.addTransfer)

router.get('/operateHistory', loginHandler.operateHistory)

router.post('/addOperateDairy', loginHandler.addOperateDairy)

router.get('/deseaseHistory', loginHandler.deseaseHistory)

router.post('/adddeseaseDairy', loginHandler.adddeseaseDairy)

router.get('/getDieOutHistory', loginHandler.getDieOutHistory)

router.get('/getPigNumber', loginHandler.getPigNumber)

router.post('/addDieOut', loginHandler.addDieOut)

router.get('/getDrugs', loginHandler.getDrugs)

router.get('/getDrugHistory', loginHandler.getDrugHistory)

router.post('/addDrugDairy', loginHandler.addDrugDairy)

router.get('/getbuyData', loginHandler.getbuyData)

router.post('/addBuyData', loginHandler.addBuyData)

router.get('/getSoldData', loginHandler.getSoldData)

router.post('/addSoldData', loginHandler.addSoldData)

router.get('/getDeviceStatus', loginHandler.getDeviceStatus)

router.post('/addDevice', loginHandler.addDevice)

router.post('/getenv', loginHandler.getenv)

router.get('/getUserInfo', loginHandler.getUserInfo)


router.post('/addfix', loginHandler.addfix)

router.get('/getAlarm', loginHandler.getAlarm)
//将路由对象共享出去
module.exports = router