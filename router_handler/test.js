// const express = require('express')
// const https = require('https');
// const fs = require('fs')
// const app = express()
// const options = {
//     key: fs.readFileSync('/ssl/likeastar.top.key'),
//     cert: fs.readFileSync('/ssl/likeastar.top.cer')
// };


// const cors = require("cors");
// app.use(cors())
// app.use("/img", express.static("./img/desease_pic"))
// app.get("/deseaseImg", (req, res) => {
//     if (req.query.target == 'zhuwen')
//         res.send(
//             [{
//                 id: 1,
//                 name: "猪瘟1",
//                 img_url: 'http://127.0.0.1/img/猪瘟/1.jpeg',
//             }, {
//                 id: 2,
//                 name: "猪瘟2",
//                 img_url: 'http://127.0.0.1/img/猪瘟/2.jpeg',
//             }, {
//                 id: 3,
//                 name: "猪瘟3",
//                 img_url: 'http://127.0.0.1/img/猪瘟/3.jpeg',
//             }
//             ]
//         )
// })
// const server = https.createServer(options, app);

// server.listen(443, () => {
//     console.log('HTTPS server listening on  port 443')
// })



const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('/ssl/likeastar.top.key'),
    cert: fs.readFileSync('/ssl/likeastar.top.crt')
};


https.createServer(options, (req, res) => {
    res.end('hello world\n');
}).listen(443);

