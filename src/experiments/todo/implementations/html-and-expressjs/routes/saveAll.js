const express = require('express')

const { TODO_STATUS } = require('./todos')

const router = express.Router()

router.post('/', function (req, res, next) {
    if (!req.session.todos) {
        req.session.todos = []
    }

    const originalTodos = req.session.todos

    const completedTodoIds = req.body['completed-todo-id']
        ? Array.isArray(req.body['completed-todo-id'])
            ? req.body['completed-todo-id']
            : [req.body['completed-todo-id']]
        : []

    if (req.body['button-save']) {
        // start with every todo marked as "none"
        const updatedTodos = originalTodos.map((todo) => {
            todo.status = TODO_STATUS.none
            return todo
        })

        for (const completedTodoId of completedTodoIds) {
            const todosRequiringCompletion = updatedTodos.filter(
                (todo) => todo.id == completedTodoId
            )

            if (todosRequiringCompletion.length > 1) {
                res.status(403)
                res.send(
                    `Unexpected duplicate todos discovered with id: ${completedTodoId}`
                )
                return
            }

            if (todosRequiringCompletion.length === 0) {
                res.status(403)
                res.send(`Unexpected todo id: ${completedTodoId}`)
                return
            }

            todosRequiringCompletion[0].status = TODO_STATUS.completed
        }

        req.session.todos = updatedTodos
    } else if (req.body['button-clear-completed']) {
        const updatedTodos = originalTodos.filter((todo) => {
            const isCompleted = completedTodoIds.includes(todo.id)
            return !isCompleted
        })

        req.session.todos = updatedTodos
    }

    res.redirect('/')
})

module.exports = router
