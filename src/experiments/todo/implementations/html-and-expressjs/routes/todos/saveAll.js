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

    const allTodoIds = req.body['todo-id']
        ? Array.isArray(req.body['todo-id'])
            ? req.body['todo-id']
            : [req.body['todo-id']]
        : []

    const allTodoTexts = req.body['todo-text']
        ? Array.isArray(req.body['todo-text'])
            ? req.body['todo-text']
            : [req.body['todo-text']]
        : []

    if (allTodoIds.length != allTodoTexts.length) {
        res.status(403)
        res.send(`Mismatched number of "todo-id" and "todo-text" submissions`)
        return
    }

    if (req.body['button-save']) {
        // Start with every todo marked as "none"
        const updatedTodos = originalTodos.map((todo) => {
            todo.status = TODO_STATUS.none
            return todo
        })

        // For all the completed (checked) todos...
        // NOTE: Unchecked checkboxes are never included in the submission.
        //       Use the `<input type="hidden" name="todo-id"...>` to get
        //       all todo ids.
        for (const completedTodoId of completedTodoIds) {
            const todosRequiringCompletion = updatedTodos.filter(
                (todo) => todo.id == completedTodoId
            )

            if (
                !todosRequiringCompletion ||
                todosRequiringCompletion.length === 0
            ) {
                res.status(403)
                res.send(`Unexpected todo id: ${completedTodoId}`)
                return
            }

            if (todosRequiringCompletion.length > 1) {
                res.status(403)
                res.send(
                    `Unexpected duplicate todos discovered with id: ${completedTodoId}`
                )
                return
            }

            todosRequiringCompletion[0].status = TODO_STATUS.completed
        }

        for (let todoIndex = 0; todoIndex < allTodoIds.length; todoIndex++) {
            const todoId = allTodoIds[todoIndex]
            const todoText = allTodoTexts[todoIndex]

            if (todoText.trim().length === 0) {
                res.status(403)
                res.send(`Todo must not be empty: ${todoId}`)
                return
            }

            const matchedTodos = updatedTodos.filter(
                (todo) => todo.id == todoId
            )

            if (!matchedTodos || matchedTodos.length < 0) {
                res.status(403)
                res.send(`Unexpected todo id: ${todoId}`)
                return
            }

            if (matchedTodos.length > 1) {
                res.status(403)
                res.send(
                    `Unexpected duplicate todos discovered with id: ${todoId}`
                )
                return
            }

            matchedTodos[0].text = todoText
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
}

module.exports = requestHandler
