const db = require('../db/index');
const bcrypt = require('bcryptjs');

//获取用户基本信息的函数
exports.getuserInfo = (req, res) => {
    const sql = `select id, username ,password, nickname, email, user_pic from ev_users where id =?`;
    //如果经过token的身份验证，token会自动对请求对象添加user属性，包含加密为token前的有用信息！！！
    db.query(sql, req.user.id, (error, resullt) => {
        // console.log(req.user)  //所以可以打印req.user试试
        if (error) return res.cc(err);

        //执行sql语句成功，但查询条数不唯一
        else if (resullt.length !== 1) return res.cc('获取用户信息失败');

        //将用户信息响应给客户端
        else res.send({
            status: 0,
            message: '获取用户基本信息成功',
            data: resullt[0]
        })
    })


}

//前端做好限制，提交表单能修改哪些数据。。这里不能修改密码，修改密码需要加密！！ 
exports.updateUserInfo = (req, res) => {
    //对更新用户信息，定义验证规则,  暂时忽略，可以写前台啊，

    const sql = `update ev_users set ? where id =?`;  //这里有些不合理，用户提交的表单应该不用含id,
    //而是根据用户登录时的token,记录好id 
    //     console.log(req.user.id)

    db.query(sql, [req.body, req.user.id], (error, resullt) => {
        if (error) return res.cc(error);
        else if (resullt.affectedRows !== 1) return res.cc('修改用户信息失败');
        else return res.cc('修改用户信息成功', 0)
    }

    )
}

exports.updateUserPasseword = (req, res) => {
    const password = bcrypt.hashSync(req.body.password, 10);
    // console.log(passoword);

    const sql = 'update ev_users set password =?  where id =?';
    db.query(sql, [password, req.user.id], (error, resullt) => {
        if (error) return res.cc(error);
        else if (resullt.affectedRows != 1) return res.cc('修改密码失败！');
        else return res.cc('修改密码成功', 0);
    })

}