const express = require('express')
const app = express();
const ws = require('nodejs-websocket')

const cors = require('cors');
//ocrs是方法注意有括号
app.use(cors());


//导入生成token包
const jwt = require('jsonwebtoken');
//导入全局配置文件,有token密钥 

app.use(express.json())    //解析 json格式数据

//配置解析表单数据的中间件，注意只能解析application/x-www-from-urlencoded格式的表单数据(postman发起请求那个)
app.use(express.urlencoded({ extended: false }))

//封装，优化代码
app.use((req, res, next) => {
    //status 默认为1 ,err可能为错误对象/字符串
    res.cc = function (err, status = 1) {
        res.send({
            status,
            //message是否是Error的实例
            message: err instanceof Error ? err.message : err
        })
    }
    next();
})

//配置解析Token的中间件
const expressJWT = require('express-jwt');
const config = require('./config')
//凡是以/api开头的都不需要身份验证,意思是 除了/api/....下面的路由都需要进行身份认证，此时expressJWT中间
//件就会判断请求头里面有没有携带authorizion字段 值= 传递的token



app.use(expressJWT({ secret: config.jwtSeceretKey }).unless({ path: [/^\/api/] }))



//定义错误级别中间件
app.use((err, req, res, next) => {
    if (err) {
        // console.log(err)
        const expireHanddle = require("./router_handler/localserver_login")
        // console.log(req.body.username)
        // expireHanddle.expireToken(req)
        console.log(err)
        // conso
    }

    // console.log('hi')
    next()

})


//导入并注册用户路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);

//导入并注册个人中心的路由模块
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter);

//导入文章相关的路由模块

const artCateRouter = require('./router/artcate');
app.use('/my/article', artCateRouter);


//本地微信小程序路由
const localserver = require('./router/localserver');
app.use('/localserver', localserver)
app.use('/api/localserver', localserver)

app.use('/utils/localserver', localserver)


//管理系统。。。除了注册用户，都在下面这个路由中
const localserverManage = require('./router/localserverManage');
const Connection = require('nodejs-websocket/Connection');



// const { dbPig } = require('./db/index')

const utils = require('./tools/ararmScore')

app.use('/api/localserverManage', localserverManage)

app.listen(80, () => {
    //监听数据库更新，验证规则发送短信提醒
    // utils.monitorDb()
    console.log('server running in 127.0.0.1:80')

})
