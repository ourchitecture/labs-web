const requestHandler = function (req, res, next) {
    if (!req.session.todos) {
        req.session.todos = []
    }

    if (!req.params.id) {
        res.status(403)
        res.send('Missing required todo identifier')
        return
    }

    if (req.params.id.trim().length === 0) {
        res.status(403)
        res.send('Missing required todo identifier. Identifier is empty.')
        return
    }

    const originalTodos = req.session.todos
    const updatedTodos = originalTodos

    // find the todo
    const todoIndex = updatedTodos.findIndex((todo) => todo.id == req.params.id)

    if (todoIndex < 0) {
        res.status(404)
        res.send(`No todo found with the identifier "${req.params.id}"`)
        return
    }

    // remove the todo
    updatedTodos.splice(todoIndex, 1)

    req.session.todos = updatedTodos

    res.redirect('/')
}

module.exports = requestHandler
