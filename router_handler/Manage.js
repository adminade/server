//服务器user数据库
const { dbUser } = require('../db/index');



exports.article = (req, res) => {
    const sql = `select * from desease_know`;
    dbUser.query(sql, (error, resullt) => {
        if (error) return res.cc(res)
        else res.send(resullt)


    })
}

exports.addArticle = (req, res) => {
    console.log(req.body.bz)
    const sql = `select * from desease_know where name = ?`;
    dbUser.query(sql, req.body.title, (error, resullt) => {
        if (resullt.length > 0) {  //如果查询的结果>1， res返回错误
            return res.cc('已有该标题，请更换标题!')
        }


        const sqlInsert = `insert into desease_know set ?`;
        dbUser.query(sqlInsert, { name: req.body.title, bx: req.body.bx, cs: req.body.fz, bz: req.body.bz }, (error, resullt) => {
            if (error) return res.cc(error);
            else if (resullt.affectedRows !== 1) {
                return res.cc('添加文章失败,请稍后再试');
            }
            res.cc("恭喜您！添加成功", 0)

        })
    })





    // res.send('ok');

}

exports.aticleList = (req, res) => {
    const name = req.query.name
    const sql = `select * from desease_know  where name = ?`;
    dbUser.query(sql, name, (error, resullt) => {
        if (error) return res.cc(res)
        else {
            console.log(resullt)
            res.send(resullt[0])
        }


    })
    // res.send('ok')
}

exports.changeAticle = (req, res) => {
    // console.log(req.body.bz)

    const sqlInsert = `update desease_know set ? where name = ?`;
    dbUser.query(sqlInsert, [{ name: req.body.title, bx: req.body.bx, cs: req.body.fz, bz: req.body.bz }, req.body.title], (error, resullt) => {
        if (error) return res.cc(error);
        else if (resullt.affectedRows !== 1) {
            return res.cc('添加文章失败,请稍后再试');
        }
        res.cc("恭喜您！添加成功", 0)

    })



    // res.send('ok');

}
exports.dleAticle = (req, res) => {
    console.log(req.body)
    const sql = `delete from desease_know where name = ?`
    dbUser.query(sql, req.body.title, (error, resullt) => {
        if (error) res.send(error)
        else if (resullt.affectedRows !== 1) {
            return res.cc('删除文章失败,请稍后再试');
        }
        res.cc("恭喜您！删除成功", 0)

    })
    // res.send('ok')
}

