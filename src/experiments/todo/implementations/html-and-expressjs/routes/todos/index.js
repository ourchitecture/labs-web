const express = require('express')

const clearCompleted = require('./clearCompleted')
const createTodo = require('./createTodo')
const removeTodo = require('./removeTodo')
const saveAll = require('./saveAll')
const toggleCompleted = require('./toggleCompleted')

const router = express.Router()

router.post('/clear-completed', clearCompleted)
router.post('/create', createTodo)
router.post('/toggle-completed', toggleCompleted)
router.post('/save-all', saveAll)
// BUG: after a few decades, basic HTML form methods still don't support "DELETE" ?!
router.post('/:id/remove', removeTodo)

module.exports = router
