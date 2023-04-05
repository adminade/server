global.require = require;
// 调用sdk
const SMSClient = require('@alicloud/sms-sdk');




exports.sendSMS = (req, res) => {
    // console.log(req)
    let smsCode = Math.random().toString().slice(-6);
    let accessKeyId = ''
    let secretAccessKey = ''
    let signName = "您的养殖场"; // 签名名称
    let templateCode = "SMS_274640408";// 短信模板code

    // 初始化sms_client
    const smsClient = new SMSClient({ accessKeyId, secretAccessKey })

    let phoneNum = '18325125535';//手机号
    console.log("smsCode:", smsCode);

    // 开始发送短信
    smsClient.sendSMS({
        PhoneNumbers: phoneNum,
        SignName: signName, //签名名称 前面提到要准备的
        TemplateCode: templateCode, //模版CODE  前面提到要准备的
        // TemplateParam: `{"code":'${str}'}`, // 短信模板变量对应的实际值，JSON格式
        TemplateParam: `{"code":'${smsCode}'}`, // 短信模板变量对应的实际值，JSON格式
    }).then(result => {
        console.log("result：", result)
        let { Code } = result;
        if (Code == 'OK') {
            res.json({
                code: 0,
                msg: 'success',
                sms: smsCode
            })
            console.log("result:", result);
        }
    }).catch(err => {
        console.log("报错：", err);
        res.json({
            code: 1,
            msg: 'fail: ' + err.data.Message
        })
    })

}


exports.tip = (req, res) => {
    // console.log(req)
    let smsCode = Math.random().toString().slice(-6);
    let accessKeyId = 'LTAI5t6Bevr22idfyURGWwd1'
    let secretAccessKey = 'P4fl5qn6dCCckYW9RwgTZMsG42ldLj'
    let signName = "您的养殖场"; // 签名名称
    let templateCode = "SMS_274640408";// 短信模板code

    // 初始化sms_client
    const smsClient = new SMSClient({ accessKeyId, secretAccessKey })

    let phoneNum = req.phone;//手机号
    console.log("smsCode:", smsCode);

    // 开始发送短信
    smsClient.sendSMS({
        PhoneNumbers: phoneNum,
        SignName: signName, //签名名称 前面提到要准备的
        TemplateCode: templateCode, //模版CODE  前面提到要准备的
        // TemplateParam: `{"code":'${str}'}`, // 短信模板变量对应的实际值，JSON格式
        TemplateParam: `{"code":'${smsCode}'}`, // 短信模板变量对应的实际值，JSON格式
    }).then(result => {
        console.log("result：", result)
        let { Code } = result;

        console.log("result:", result);
    }).catch(err => {
        console.log("报错：", err);

    })

}
