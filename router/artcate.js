const express = require('express');

const router = express.Router();

const getArticleHandle = require('../router_handler/getArticleCates')

router.get('/cates', getArticleHandle.getArticleCate);


router.post('/addcates', getArticleHandle.addCates);

module.exports = router