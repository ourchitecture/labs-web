var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.todos) {
        req.session.todos = []
    }

    res.render('index', {
        title: 'Our Todos',
        todos: req.session.todos,
    })
})

module.exports = router
