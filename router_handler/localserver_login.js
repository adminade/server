
//导入加密包
const bcrypt = require('bcryptjs');
// 连接数据库  全局变量
const db = require('../db/index');
// const server_db = db.dbUser;

//服务器user数据库
const { dbUser } = require('../db/index');
const { dbPig } = require('../db/index')


//导入生成token包
const jwt = require('jsonwebtoken');
//导入全局配置文件,有token密钥 
const config = require('../config')


const request = require('request');
const { response } = require('express');
const { escape } = require('mysql');

const alarmscore = require('../tools/ararmScore')

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
            const tokenStr = jwt.sign(session, config.jwtSeceretKey, { expiresIn: config.expiresIn });
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

exports.keywordSearch = (req, res) => {
    // console.log(req.query)
    console.log(typeof (req.query.kw))
    const kw = "'%" + req.query.kw.replace(/'/g, '') + "%'"
    // const kw1 = escape(req.body.kw)
    console.log(kw)
    // const sql = `SELECT name, bx FROM desease_know WHERE MATCH (name, bx) 
    // AGAINST (? IN NATURAL LANGUAGE MODE) LIMIT 2`;
    // '"${kw}"'
    const sql1 = `SELECT * FROM desease_know WHERE name LIKE ${kw} `
    dbUser.query(sql1, (error, resullt) => {
        console.log(sql1)
        if (error) {
            // console.log(error)
            res.cc(error)
        }
        else res.send(resullt)

    })

    // res.send('ok')
}


exports.upkeepQuery = (req, res) => {
    // console.log(req.query)
    const pigNumber = req.query.value;
    // var RESULLT = [];
    const sql1 = `SELECT
    base_info.cate,
    base_info.comeTime,
    base_info.comeWeight,
    base_info.pigHouse,
    (
      SELECT tizhong
      FROM body_parm
      WHERE pigNumber = base_info.pigNumber
      ORDER BY time DESC
      LIMIT 1
    ) AS last_tizhong,
    base_info.injectRecord,
    base_info.deseaseHistory,
    (
      SELECT time
      FROM other_info
      WHERE pigNumber = base_info.pigNumber
      ORDER BY time DESC
      LIMIT 1
    ) AS last_deseaseHistory_time
  FROM base_info
  LEFT JOIN body_parm ON base_info.pigNumber = body_parm.pigNumber
  LEFT JOIN other_info ON base_info.pigNumber = other_info.pigNumber
  WHERE base_info.pigNumber = ?;`
    dbPig.query(sql1, pigNumber, (error, resullt) => {
        if (error) {
            console.log(error)
            res.cc(error)
        }
        else if (resullt[0] == undefined) res.cc('no')
        else {
            console.log(resullt)
            res.send({
                status: 0,
                message: resullt[0]
            })
        }
    })

    // res.send('ok')
}

exports.cateNumber = (req, res) => {
    const sql = `SELECT hc.HouseCate, bi.cate, COUNT(*) AS count
    FROM base_info AS bi
    JOIN housecate AS hc ON bi.pigHouse = hc.id
    GROUP BY bi.cate, hc.HouseCate;`
    dbPig.query(sql, (error, resullt) => {
        if (error) {
            console.log(error);
            res.cc(error)
        }
        else {
            console.log(resullt)
            res.send({
                status: 0,
                message: resullt
            })
        }
    })


}
exports.getCate = (req, res) => {
    var RESULLT = [];
    const sql1 = `select *  from housecate`
    dbPig.query(sql1, (error, resullt) => {
        if (error) res.cc(error)
        else {
            // console.log(resullt)
            RESULLT.push(resullt)
            res.send({
                status: 0,
                message: RESULLT
            })

        }
    })

}
exports.addPig = (req, res) => {
    console.log(req.body)
    const sql_query = `select id from base_info where pigNumber =? `
    dbPig.query(sql_query, req.body.number, (error, resullt) => {
        if (error) res.send(error)
        else if (resullt.length >= 1) res.cc('not unique')
        else {
            sql_insert = `insert into base_info set ?`
            dbPig.query(sql_insert, { pigHouse: req.body.houseCateId, pigNumber: req.body.number, age: req.body.age, cate: req.body.pigCate, comeTime: req.body.comeTime, comeWeight: req.body.weight, injectRecord: req.body.inject },
                (erro, resu) => {
                    if (erro) res.cc(erro)
                    else if (resu.affectedRows == 1) {
                        res.cc('add ok')
                    }
                    else res.send('add fail')
                }
            )
        }
    })
    // res.send("ok")
}
exports.transferHistory = (req, res) => {
    const sql = ` select pigNumber,time ,transfer_aim, reason,user from transfer_history `
    dbPig.query(sql, (error, resullt) => {
        if (error) res.cc(error)
        else {
            // console.log(resullt)
            res.send({
                status: 0,
                message: resullt
            })
        }
    })
}
exports.getCate_pigSum = (rea, res) => {
    const sql = `SELECT housecate.*, SUM(base_info.pigNumber) AS totalPigNumber, COUNT(base_info.id) AS totalCount
    FROM housecate
    LEFT JOIN base_info ON housecate.id = base_info.pigHouse
    GROUP BY housecate.id`
    dbPig.query(sql, (error, resullt) => {
        if (error) res.cc(error)
        else {
            console.log(resullt)
            res.send({
                status: 0,
                message: resullt
            })
        }
    })

    // res.send('ok')
}
exports.deleteHouse = (req, res) => {
    console.log(req.body.index)
    const slq_del = `delete from housecate where id = ?`
    // 前端以作校验，该猪舍没有猪，可以放心删除
    dbPig.query(slq_del, req.body.index, (error, resullt) => {
        if (error) res.cc(error)
        else if (resullt.affectedRows != 1) res.cc('del not only one')
        else {
            res.send({
                status: 0,
                message: 'del success'
            })
        }
    })
    // res.send("ok")
}
exports.addHouse = (req, res) => {
    console.log(req.body.HouseCate)
    const sql_query = `select id from housecate where HouseCate = ?`
    dbPig.query(sql_query, req.body.HouseCate, (erro, resu) => {
        if (erro) res.cc(erro)
        else if (resu.length > 0) {
            res.cc('exited')
        }
        else {

            const sql = `insert into housecate set HouseCate = ?`
            dbPig.query(sql, req.body.HouseCate, (error, resullt) => {
                if (error) res.cc(error)
                else if (resullt.affectedRows != 1) {
                    res.cc('add not only one ')
                }
                else {
                    res.cc('add success')
                }
            })

        }
    })
}

exports.checkPigNumber = (req, res) => {
    const pigNum = req.body.pigNumber
    console.log(pigNum)
    const sql = `select id from base_info where pigNumber =?`
    dbPig.query(sql, pigNum, (error, resullt) => {
        if (error) res.cc(error)
        else if (resullt.length == 0) res.cc('nopigNumber')
        else res.cc('ok')
    })

    // res.send('ok') 
}
exports.addTransfer = (req, res) => {
    console.log(req.body)
    const data = req.body
    //更新base_info表,需要先查询cateid
    const sql_cateId = `select id from housecate where HouseCate = ?`
    dbPig.query(sql_cateId, data.housecate, (er, re) => {
        if (er) res.cc(er)
        else {
            // console.log(re[0].id)
            const houseId = re[0].id
            const sql_change = `update base_info set pigHouse= ? where pigNumber = ?`
            dbPig.query(sql_change, [houseId, req.body.pigNumber], (error, resullt) => {
                if (error) res.cc(error)
                else if (resullt.affectedRows != 1) res.cc('update fail')
                else {
                    //更新transfer_history表
                    const sql_insert = `insert into transfer_history set pigNumber =? , time = ? , reason = ?, transfer_aim = ? , user =?`
                    dbPig.query(sql_insert, [data.pigNumber, data.time, data.reason, data.housecate, data.user], (erro, resu) => {
                        if (erro) res.cc(erro)
                        else if (resu.affectedRows != 1) res.cc('insert into tran_history fail')
                        else {
                            res.cc('ok')
                        }
                    })
                }
            })


        }
    })

    // res.send('ok')
}
exports.operateHistory = (req, res) => {
    const sql = ` select user,time,detail from operate_history `
    dbPig.query(sql, (error, resullt) => {
        if (error) res.cc(error)
        else res.cc(resullt)
    })
    // res.send('ok')
}
exports.addOperateDairy = (req, res) => {
    // console.log(req.body)
    const data = req.body
    // console.log(data.time)
    const sql = `insert into  operate_history set ?`

    dbPig.query(sql, { time: data.time, user: data.user, detail: data.detail }, (error, resullt) => {
        if (error) res.cc(error)
        else if (resullt.affectedRows != 1) res.cc('error')
        else res.cc('ok')
    })
    // res.send('ok')
}

exports.deseaseHistory = (req, res) => {
    const sql = ` select pigNumber, user,time,detail from desease_history`
    dbPig.query(sql, (error, resullt) => {
        if (error) res.cc(error)
        else res.cc(resullt)
    })
    // res.send('ok')
}

exports.adddeseaseDairy = (req, res) => {
    console.log(req.body)
    var data = req.body
    data.pigNumber = parseInt(data.pigNumber, 10)
    const sql_que = `select id from desease where pigNumber =?`
    dbPig.query(sql_que, data.pigNumber, (er, su) => {
        if (er) res.cc(er)

        else if (su.length > 0) {
            //以有该数据
            // console.log('有数据')
            const sql_base = ` update  desease set deseaseDetail = ?  where pigNumber =? `
            dbPig.query(sql_base, [data.detail, data.pigNumber], (error, resullt) => {
                if (error) res.cc(resullt)
                else if (resullt.affectedRows != 1) res.cc('fail_step1')
                else {
                    const sql_desHis = `insert into desease_history set pigNumber=?,time =?,user=?,detail=?`
                    dbPig.query(sql_desHis, [data.pigNumber, data.time, data.user, data.detail], (erro, resu) => {
                        if (erro) res.cc(erro)
                        else if (resu.affectedRows != 1) res.cc('fail_step3')
                        else res.cc('all_ok')
                    })
                }
            })
        }
        else {
            // console.log('没有有数据')
            const sql_inser = ` insert into  desease set deseaseDetail =?,pigNumber =? `
            dbPig.query(sql_inser, [data.detail, data.pigNumber], (error1, resullt1) => {
                if (error1) res.cc(error1)
                else if (resullt1.affectedRows != 1) res.cc('fail_step2')
                else {
                    //插入desease_history
                    // console.log('到我了')
                    const sql_desHis = `insert into desease_history set pigNumber=?,time =?,user=?,detail=?`
                    dbPig.query(sql_desHis, [data.pigNumber, data.time, data.user, data.detail], (erro, resu) => {
                        if (erro) res.cc(erro)
                        else if (resu.affectedRows != 1) res.cc('fail_step3')
                        else res.cc('all_ok')
                    })
                }
            })
        }
    })
    // res.send("ok")
}

exports.getDieOutHistory = (req, res) => {
    const sql = ` select pigNumber, user,time,detail,belongcate from die_out_history`
    dbPig.query(sql, (error, resullt) => {
        if (error) res.cc(error)
        else res.cc(resullt)
    })
    // res.send('ok')
}

exports.getPigNumber = (req, res) => {
    const sql = `select pigNumber from base_info `
    dbPig.query(sql, (error, resullt) => {
        if (error) RegExp.cc(eroor)
        else res.cc(resullt)
    })
    // res.send('ok')
}
exports.addDieOut = (req, res) => {
    console.log(req.body)
    var data = req.body
    const sql = `
    DELETE FROM desease WHERE pigNumber = ?;
    DELETE FROM other_info WHERE pigNumber = ?;
    DELETE FROM body_parm WHERE pigNumber = ?;
    DELETE FROM desease_predict WHERE pigNumber = ?;
    DELETE FROM base_info WHERE pigNumber = ?;
    `
    dbPig.query(sql, [data.pigId, data.pigId, data.pigId, data.pigId, data.pigId], (error, resullt) => {
        if (error) res.cc(error)
        else {
            data.pigId = parseInt(data.pigId)
            const sql_inert = `insert into die_out_history set ?`
            dbPig.query(sql_inert, { pigNumber: data.pigId, belongcate: data.outcate, time: data.time, user: data.user, detail: data.detail, bz: data.explain },
                (erro, resu) => {
                    if (erro) res.cc(erro)
                    else if (resu.affectedRows != 1) res.cc('insert not only')
                    else res.cc('ok')
                })

        }
    })
}

exports.getDrugs = (req, res) => {
    const sql = ` select drugs from drug`
    dbPig.query(sql, (error, resullt) => {
        if (error) res.cc(error)
        else res.cc(resullt)
    })
    // res.send('ok')
}

exports.getDrugHistory = (req, res) => {
    const sql = ` select pigNumber, user,time,detail from drug_history`
    dbPig.query(sql, (error, resullt) => {
        if (error) res.cc(error)
        else res.cc(resullt)
    })
    // res.send('ok')
}
exports.addDrugDairy = (req, res) => {
    var data = req.body
    data.pigId = parseInt(data.pigId)
    //实现拼接记录的功能
    const sql1 = `SELECT injectRecord FROM base_info WHERE pigNumber = ?`
    dbPig.query(sql1, data.pigId, (error, resullt) => {
        if (error) res.cc(error)
        else {
            const originalValue = resullt[0].injectRecord; // 获取原有的值
            const newValue = originalValue ? `${originalValue}, ${data.drugcate.drugs}` : data.drugcate.drugs; // 拼接新值
            console.log(newValue)
            const sql_update = `update base_info set injectRecord =? where pigNumber =? `
            dbPig.query(sql_update, [newValue, data.pigId], (erro, resu) => {
                if (error) res.cc(resu)
                else {
                    const sql_insert = `insert into drug_history set ?`
                    dbPig.query(sql_insert, { pigNumber: data.pigId, time: data.time, user: data.user, detail: data.drugcate.drugs, bz: data.explain }, (er, su) => {
                        if (er) res.cc(er)
                        else if (su.affectedRows == 1) res.cc('ok')
                        else res.cc(' insert fail')
                    })
                }
            })
        }
    })

}

exports.getbuyData = (req, res) => {
    const sql = `select * from buypig_manage`
    dbUser.query(sql, (error, resullt) => {
        if (error) res.cc(error)
        else res.cc(resullt)
    })
}
exports.addBuyData = (req, res) => {
    console.log(req.body)
    const data = req.body
    const sql = `insert into  buypig_manage set ?`
    dbUser.query(sql, data, (error, resullt) => {
        if (error) res.cc(error)
        else if (resullt.affectedRows == 1) res.cc('ok')
        else res.cc('inert fail')
    })
    // res.send('ok')
}

exports.getSoldData = (req, res) => {
    const sql = `select * from soldpig_manage`
    dbUser.query(sql, (error, resullt) => {
        if (error) res.cc(error)
        else res.cc(resullt)
    })
}

exports.addSoldData = (req, res) => {
    console.log(req.body)
    const data = req.body
    const sql = `insert into  soldpig_manage set ?`
    dbUser.query(sql, data, (error, resullt) => {
        if (error) res.cc(error)
        else if (resullt.affectedRows == 1) res.cc('ok')
        else res.cc('inert fail')
    })
    // res.send('ok')
}

exports.getDeviceStatus = (req, res) => {
    const sql = `select * from device_house where deviceStatus = 0`
    dbUser.query(sql, (error, resullt) => {
        if (error) res.cc(error)
        else res.cc(resullt)
    })
    // res.send('ok')
}
exports.addDevice = (req, res) => {
    console.log(req.body)
    const data = req.body
    const sql = `insert into device_house set ?`
    dbUser.query(sql, { pigHouse: data.houseCateId, deviceCate: data.deviceCate, deviceId: data.number, time: data.comeTime, deviceStatus: 1 }, (error, resullt) => {
        if (error) res.cc(error)
        else if (resullt.affectedRows == 1) res.cc('ok')
        else res.cc('fail')
    })
    // res.cc('ok')
}
exports.getenv = (req, res) => {
    console.log(req.body)
    const sql = `SELECT *
    FROM device_env_history
    WHERE id IN (
        SELECT MAX(id)
        FROM device_env_history
        WHERE pigHouse LIKE '${req.body.house}%'
        GROUP BY device
    )`
    dbUser.query(sql, (error, resullt) => {
        if (error) res.cc(error)
        else {
            console.log(resullt)
            res.cc(resullt)
        }
    })


}

exports.getUserInfo = (req, res) => {
    console.log(req.user)
    res.send({
        status: 0,
        message: req.user
    })
    // res.cc('ok')
}

exports.addfix = (req, res) => {
    console.log(req.body)
    const sql = `insert into baoxiu set ?`
    dbUser.query(sql, req.body, (error, resullt) => {
        if (error) res.cc(error)
        else if (resullt.affectedRows == 1) res.cc('ok')
        else res.cc('fail')
    })
}

exports.getAlarm = (req, res) => {
    const sql = ` select * from monitor ORDER BY id DESC LIMIT 5; `
    dbPig.query(sql, (error, resullt) => {
        if (error) res.cc(error)
        else {
            //计算警告等级，分数结果用了 数据表的bz1栏
            for (let i = 0; i < resullt.length; i++) {
                alarmscore.ararmScore(resullt[i])
            }
            res.cc(resullt)
        }
    })
    // res.send('ok')
}