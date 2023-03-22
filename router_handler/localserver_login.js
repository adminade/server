
//导入加密包
const bcrypt = require('bcryptjs');
// 连接数据库  全局变量
const db = require('../db/index');
// const server_db = db.dbUser;

//服务器user数据库
const { dbUser } = require('../db/index');


//导入生成token包
const jwt = require('jsonwebtoken');
//导入全局配置文件,有token密钥 
const config = require('../config')


const request = require('request');
const { response } = require('express');

//这个函数没用--------------------------------
// exports.loginHandler = (req, res) => {
//     console.log(req.body.code);
//     const wx = {
//         appid: 'wx485f44817ba38593',
//         secret: "70a6a90fe0001fb49feea3fbcd549f43"
//     }
//     var url = `https://api.weixin.qq.com/sns/jscode2session?appid=${wx.appid}&secret=${wx.secret}&js_code=${req.body.code}&grant_type=authorization_code`
//     var session = '';

//     const requestPromise = new Promise((resolve, reject) => {
//         request(url, (error, response, body) => {
//             if (error) reject(error);
//             else resolve(body);
//         })
//     })

//     Promise.all([requestPromise])
//         .then(([body]) => {
//             console.log(body)
//             sql = 'select * from userInfo where userName = ?';
//             dbUser.query(sql,body.user)
//             session = JSON.parse(body);
//             console.log(session);

//             const tokenStr = jwt.sign(session, config.jwtSeceretKey, { expiresIn: 3600 });
//             console.log(tokenStr),
//                 res.json({
//                     token: tokenStr
//                 })
//         })
//         .catch((error) => {
//             console.error(error);
//         });

// request(url, (error, response, body) => {
//     //openid是用户在这个小程序上唯一的id，不同小程序用户的id都不一样，session_key是用户的会话信息记录
//     // console.log('session: ' + body)
//     session = JSON.parse(body);
//     // console.log(session);

// })

// res.send('ok')
// }

//-------------------------------------------


exports.login = (req, res) => {

    // 判断当前请求头是否有token
    console.log(req.headers['authorization'])


    console.log(req.body)
    const user = req.body;
    //前端已对数据检验是否为空，服务器无需校验
    //多种验证登录方式
    const sql = `select * from userInfo where countName =?`;
    dbUser.query(sql, user.user, (error, resullt) => {
        //resullt是从数据表拿出来的ROWDATA对象，不和普通对象相同  要经过JSON stringfly先转成字符串，再用parse转为对象
        // console.log(resullt[0]);

        if (error) return res.cc(error);
        else if (resullt.length > 1) {
            return res.cc('数据库账户重复');
        }
        else if (resullt.length == 0) {
            console.log('done')
            return res.cc('账户不存在');
            // return res.send({
            //     status: 1,
            //     message: '账户不存在'
            // })
        }
        else if (!bcrypt.compareSync(user.pwd, resullt[0].password)) return res.cc('密码错误');

        else {
            console.log(resullt)
            var session = resullt[0];
            session = JSON.parse(JSON.stringify(session))
            session.password = '';
            const tokenStr = jwt.sign(session, config.jwtSeceretKey);
            console.log(tokenStr);
            res.send({
                status: 0,
                message: '登录成功',
                token: 'Bearer ' + tokenStr
            })
        }
    })

    // res.send('ok');

}

exports.regUser = (req, res) => {
    console.log(req.body);
    const sql = `select * from userInfo where countName =?`;
    dbUser.query(sql, req.body.countName, (error, resullt) => {
        if (error) return res.cc(error);
        else if (resullt.length > 0) return res.send({
            status: 1,
            message: '账户已存在',
        });
        else {
            //对密码加密
            const password = bcrypt.hashSync(req.body.pwd);
            //插入新用户
            const sqlInsert = `insert into userInfo set ?`;
            dbUser.query(sqlInsert, { countName: req.body.countName, password: password, userName: req.body.userName, phone: req.body.phone, brand: req.body.brand }, (error, resullt) => {
                if (error) return res.cc(error);
                else if (resullt.affectedRows !== 1) {
                    return res.cc('注册用户失败,请稍后再试');
                }
                res.cc("恭喜您！注册成功", 0)

            })
        }
    })
    // res.send('ok')
}