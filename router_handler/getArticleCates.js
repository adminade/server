const db = require('../db/index');


exports.getArticleCate = (req, res) => {
    const sql = `select * from ev_article_cate where is_delete = 0 order by id asc`
    db.query(sql, (error, resullt) => {
        if (error) return res.cc(err);
        else res.send({
            status: 0,
            message: '获取文章分类数据成功',
            data: resullt
        })
    })

    // res.send('王八羔子');
}

exports.addCates = (req, res) => {
    if (!req.body.name || !req.body.alias)
        return res.cc('错误！名字和类别不为空')

    //校验数据库是否有重名文章
    const sql_check = `select id from  ev_article_cate where name =?`
    db.query(sql_check, req.body.name, (error, resullt) => {
        if (error) return res.cc(res);
        else if (resullt.length >= 1) return res.cc('文章名字重复！');
        else {
            const sql = `insert into ev_article_cate set ?`;
            db.query(sql, { name: req.body.name, alias: req.body.alias, is_delete: 0 }, (error, resullt) => {
                if (error) return res.cc(res);
                //插入或更新要写affectedRows 查询才是resullt.lenght
                else if (resullt.affectedRows !== 1) {
                    console.log(resullt)
                    return res.cc('更新失败');

                } else res.cc('更新成功!', 0)
            })
        }

    })




    // res.send('ok')

}