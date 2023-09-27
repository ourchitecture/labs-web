const express = require('express')

const { TODO_STATUS } = require('./todos/models')

const router = express.Router()

const createViewModel = (serverTodos, errorMessage) => {
    const areAllCompleted =
        serverTodos.filter((todo) => todo.status != TODO_STATUS.completed)
            .length == 0

    return {
        title: 'Web 1.0: Our Todos',
        areAllCompleted,
        todos: serverTodos.map((serverTodo) => {
            return {
                id: serverTodo.id,
                text: serverTodo.text,
                isCompleted: serverTodo.status == TODO_STATUS.completed,
            }
        }),
        error: errorMessage || null,
    }
}

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.todos) {
        req.session.todos = []
    }

    const viewModel = createViewModel(req.session.todos, req.query.e)

    res.render('index', viewModel)
})

module.exports = router
