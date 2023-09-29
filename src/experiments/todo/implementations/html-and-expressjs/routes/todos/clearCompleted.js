const { TODO_STATUS } = require('./models')

const requestHandler = function (req, res, next) {
    if (!req.session.todos) {
        req.session.todos = []
    }

    const originalTodos = req.session.todos

    const completedTodoIds = req.body['completed-todo-id']
        ? Array.isArray(req.body['completed-todo-id'])
            ? req.body['completed-todo-id']
            : [req.body['completed-todo-id']]
        : []

    const updatedTodos = originalTodos.filter((todo) => {
        const isCompleted = completedTodoIds.includes(todo.id)
        return !isCompleted
    })

    req.session.todos = updatedTodos

    res.redirect('/')
}

module.exports = requestHandler
