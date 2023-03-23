//用户注册路由处理函数

//导入加密包
const bcrypt = require('bcryptjs');
// 连接数据库  全局变量
const db = require('../db/index');

//导入生成token包
const jwt = require('jsonwebtoken');
//导入全局配置文件,有token密钥 
const config = require('../config')

exports.regUser = (req, res) => {
    //拿到用户端提供的信息
    const userinfo = req.body;
    //对表单中数据进行校验
    if (!userinfo.username || !userinfo.password) {
        // return res.send({ status: 1, message: '用户名/密码不合法!' })
        return res.cc('用户名/密码不合法!');

    }
    console.log(userinfo);

    const sql = `select * from ev_users where username = ?`;
    db.query(sql, [userinfo.username], (err, resullt) => {  //注意这里的resullt只是接收query的结果！不要写成res，res是最大的,不要重名
        //查询失败
        if (err) {
            // return res.send({ status: 1, message: err.message }) 优化为 ：
            return res.cc(err);  //这是个中间件
        }
        // 用户名被占用
        if (resullt.length > 0) {  //如果查询的结果>1， res返回错误
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        //对密码加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        console.log(userinfo)

        //插入新用户
        const sqlInsert = `insert into ev_users set ?`;
        db.query(sqlInsert, { username: userinfo.username, password: userinfo.password, nickname: userinfo.nickname, email: userinfo.email, user_pic: userinfo.user_pic },
            (error, resullt) => {
                if (error) {
                    // return res.send({ status: 1, message: error.message });
                    return res.cc(error)
                }
                //判断影响行数
                if (resullt.affectedRows !== 1) {
                    // return res.send({ status: 1, message: '注册用户失败,请稍后再试' });
                    return res.cc('注册用户失败,请稍后再试');
                }
                //注册用户成功！
                // res.send({ status: 0, message: "恭喜您！注册成功" });  //res.send()才是出口
                res.cc("恭喜您！注册成功", 0)
            })



    })


}
// 用户登录路由处理函数
exports.login = (req, res) => {
    //拿到用户端提供的信息
    const userinfo = req.body;
    //对表单中数据进行校验
    if (!userinfo.username || !userinfo.password) {
        return res.cc('用户名/密码不合法!');
    }
    const sql = `select * from ev_users where username = ?`;
    db.query(sql, userinfo.username, (error, resullt) => {
        if (error) return res.cc(err);
        //但是获取到的数据条数不为1
        else if (resullt.length != 1) return res.cc('登录失败');
        //注意有个非哈,resullt是个数组!!
        else if (!bcrypt.compareSync(userinfo.password, resullt[0].password)) return res.cc('密码错误');


        //在服务器端生成Token字符串

        //展开字符串,把密码和用户头之类的敏感信息像清空
        const user = { ...resullt[0], password: '', user_pic: '' };

        //d对用户的信息加密，生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSeceretKey, { expiresIn: config.expiresIn });
        console.log(tokenStr);

        res.cc({
            status: 0,
            message: '登录成功！',
            token: 'Bearer ' + tokenStr
        });
    })



}

