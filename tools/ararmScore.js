// const { dbUser } = require('../db/index');
// const { dbPig } = require('../db/index')
const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
const sendtip = require('../router_handler/localserver_SMS')
exports.ararmScore = (options) => {
    var score = parseInt(options.score)   //分数,
    var durationTime = parseInt(options.durationTime)  //持续时间
    durationScore = Math.floor(durationTime / 12) * 10
    options.bz1 = durationScore + score
}


exports.sendsms = (req, res) => {
    //由于短信验证码内容限制，所以统一发送短信通知内容
    console.log('send sms')
    console.log(req)
    var data = {}
    if (req.bz2 == null)
        data.phone = '18325125535'
    else
        data.phone = req.bz2.phone
    // data.phone = '18325125535'
    // console.log(data.phone)
    if (parseInt(req.durationTime) > 24)  //如果监测行为持续24小时发送提醒
    {
        // data.message = `监测到${req.detail},持续时间${req.durationTime}!`
        sendtip.tip(data)
        console.log('1')
    }
    else if (req.bz1 > 30)   //如果分数大于30，发送提醒
    {
        // data.message = `监测到${req.detail},持续时间${req.durationTime}!`
        sendtip.tip(data)
        console.log('2')
    }
    else console.log('nothing ')
}

//监听数据表更新
exports.monitorDb = () => {
    const program = async () => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root'
        });

        const instance = new MySQLEvents(connection, {
            startAtEnd: true // to record only the new binary logs, if set to false or you didn'y provide it all the events will be console.logged after you start the app
        });

        await instance.start();

        instance.addTrigger({
            name: 'monitoring all statments',
            expression: 'pig.monitor', // listen to TEST database !!!
            statement: MySQLEvents.STATEMENTS.INSERT, // you can choose only insert for example MySQLEvents.STATEMENTS.INSERT, but here we are choosing everything
            onEvent: e => {
                // console.log(e);
                // console.log('Inserted rows:', e.affectedRows);
                console.log('监控到插入记录')
                const insertData = e.affectedRows[0].after
                console.log(insertData)
                //计算分数
                this.ararmScore(insertData)
                console.log(insertData)
                //判断发送短信
                this.sendsms(insertData)

            }
        });

        instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
        instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
    };

    program()
        .catch(console.error);






}