var express = require('express')

var router = express.Router()

const TODO_STATUS = {
    none: 'none',
    completed: 'completed',
}

router.post('/', function (req, res, next) {
    // not sure how they got here
    if (!req.session.todos) {
        res.redirect('/')
        return
    }

    const targetStatus = req.body['are-all-complete']
        ? TODO_STATUS.none
        : TODO_STATUS.completed

    req.session.todos = req.session.todos.map((todo) => {
        todo.status = targetStatus
        return todo
    })

    res.redirect('/')
})

module.exports = router
