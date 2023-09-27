const uid = require('uid-safe')

const { TODO_STATUS } = require('./models')

const requestHandler = function (req, res, next) {
    if (!req.session.todos) {
        req.session.todos = []
    }

    const newTodoText = req.body['new-todo']

    if (!newTodoText) {
        res.redirect(
            '/?e=' + encodeURIComponent('Missing new-todo field value')
        )
        return
    }

    if (newTodoText.trim().length === 0) {
        res.redirect(
            '/?e=' +
                encodeURIComponent('Empty or whitespace new-todo field value')
        )
        return
    }

    req.session.todos.push({
        id: uid.sync(18),
        text: req.body['new-todo'],
        status: TODO_STATUS.none,
    })

    res.redirect('/')
}

module.exports = requestHandler
