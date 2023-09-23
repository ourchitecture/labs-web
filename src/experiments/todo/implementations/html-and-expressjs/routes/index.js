var express = require('express')
var router = express.Router()

const TODO_STATUS = {
    none: 'none',
    completed: 'completed',
}

const mapServerTodosToClient = (serverTodos) => {
    return serverTodos.map((serverTodo) => {
        return {
            id: serverTodo.id,
            text: serverTodo.text,
            isCompleted: serverTodo.status == TODO_STATUS.completed,
        }
    })
}

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.todos) {
        req.session.todos = []
    }

    res.render('index', {
        title: 'Our Todos',
        todos: mapServerTodosToClient(req.session.todos),
        error: req.query.e || null,
    })
})

module.exports = router
