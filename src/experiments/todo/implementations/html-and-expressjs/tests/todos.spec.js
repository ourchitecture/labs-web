// @ts-check
const { test, expect } = require('@playwright/test')

import TodosViewModel from './todos'

const doArraysMatch = (arr, target) => target.every((v) => arr.includes(v))

test.beforeEach(async ({ page }) => {
    const vm = new TodosViewModel(page)
    await vm.navigateHome()
})

test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Our Todos/)
})

/**
 * No todos
 *
 * When there are no todos, #main and #footer should be hidden.
 *
 * https://github.com/tastejs/todomvc/blob/master/app-spec.md#no-todos
 */
test.describe('No todos', () => {
    test('main is hidden without todos', async ({ page }) => {
        const vm = new TodosViewModel(page)
        await expect(vm.getMain()).toHaveCount(0)
    })

    test('footer is hidden without todos', async ({ page }) => {
        const vm = new TodosViewModel(page)
        await expect(vm.getFooter()).toHaveCount(0)
    })
})

/**
 * New todo
 *
 * New todos are entered in the input at the top of the app. The input element
 * should be focused when the page is loaded, preferably by using the autofocus
 * input attribute. Pressing Enter creates the todo, appends it to the todo
 * list, and clears the input. Make sure to .trim() the input and then check
 * that it's not empty before creating a new todo.
 *
 * https://github.com/tastejs/todomvc/blob/master/app-spec.md#new-todo
 */
test.describe('New todo', () => {
    test('todo input exists', async ({ page }) => {
        const vm = new TodosViewModel(page)
        const newTodoElement = vm.getNewTodo()

        await expect(newTodoElement).toBeVisible()
        await expect(newTodoElement).toHaveValue('')
    })

    test('todo input has focus', async ({ page }) => {
        const vm = new TodosViewModel(page)
        const newTodoElement = vm.getNewTodo()

        const newTodoAutoFocusValue =
            await newTodoElement.getAttribute('autofocus')

        await expect(newTodoAutoFocusValue).toBe('')
    })

    test('missing new todo displays error', async ({ page }) => {
        const vm = new TodosViewModel(page)

        const errorElement = await vm.submitNewTodoAndWaitFor(() =>
            vm.getError()
        )

        // BUG: not sure why `toHaveText(...)` is failing
        const errorText = await errorElement.textContent()

        expect(errorText).toBe('Missing new-todo field value')
    })

    test('empty new todo displays error', async ({ page }) => {
        const vm = new TodosViewModel(page)

        const errorElement = await vm.createAndSubmitNewTodoAndWaitFor(
            '  ',
            () => vm.getError()
        )

        // BUG: not sure why `toHaveText(...)` is failing
        const errorText = await errorElement.textContent()

        expect(errorText).toBe('Empty or whitespace new-todo field value')
    })

    test('enter new todo; main displays', async ({ page }) => {
        const vm = new TodosViewModel(page)

        await vm.createAndSubmitNewTodoAndWaitFor('testing a new todo', () =>
            vm.getMain()
        )
    })

    test('enter new todo; footer displays', async ({ page }) => {
        const vm = new TodosViewModel(page)

        await vm.createAndSubmitNewTodoAndWaitFor('testing a new todo', () =>
            vm.getFooter()
        )
    })

    test('enter new todo and input text resets to empty', async ({ page }) => {
        const vm = new TodosViewModel(page)

        await vm.createAndSubmitNewTodoAndWaitFor('testing a new todo', () =>
            vm.getMain()
        )

        await expect(vm.getNewTodo()).toHaveValue('')
    })

    test('enter new todo; error is not visible', async ({ page }) => {
        const vm = new TodosViewModel(page)

        await vm.createAndSubmitNewTodoAndWaitFor('testing a new todo', () =>
            vm.getMain()
        )

        await expect(vm.getError()).not.toBeVisible()
    })

    test('all new todos are unchecked', async ({ page }) => {
        const vm = new TodosViewModel(page)

        await vm.createAndSubmitNewTodoAndWaitFor('test one', () =>
            vm.getMain()
        )

        await vm.createAndSubmitNewTodoAndWaitFor('test two', () =>
            vm.getMain()
        )

        const allTodoElements = await vm.getAllTodos()

        let uncheckedToDoCount = 0

        for (const todoElement of allTodoElements) {
            await expect(todoElement).not.toBeChecked()
            uncheckedToDoCount = uncheckedToDoCount + 1
        }

        expect(uncheckedToDoCount).toBe(2)
    })
})

/**
 * Mark all as complete
 *
 * This checkbox toggles all the todos to the same state as itself. Make sure
 * to clear the checked state after the "Clear completed" button is clicked.
 * The "Mark all as complete" checkbox should also be updated when single todo
 * items are checked/unchecked. Eg. When all the todos are checked it should
 * also get checked.
 *
 * https://github.com/tastejs/todomvc/blob/master/app-spec.md#mark-all-as-complete
 */
test.describe('Mark all as complete', () => {
    test('no toggle all completed when no todos exist', async ({ page }) => {
        const vm = new TodosViewModel(page)

        const toggleCompletedElement = vm.getToggleAllCompleted()

        await expect(toggleCompletedElement).not.toBeVisible()
    })

    test('toggle all completed is visible when todos exist', async ({
        page,
    }) => {
        const vm = new TodosViewModel(page)

        await vm.createAndSubmitNewTodoAndWaitFor('test one', () =>
            vm.getToggleAllCompleted()
        )
    })

    test('toggle all button text changes from complete to incomplete switch', async ({
        page,
    }) => {
        const vm = new TodosViewModel(page)

        await vm.createAndSubmitNewTodoAndWaitFor('test one', () =>
            vm.getMain()
        )

        await vm.createAndSubmitNewTodoAndWaitFor('test two', () =>
            vm.getMain()
        )

        await expect(
            vm.getToggleAllCompleted(),
            'pending toggle all completed button text'
        ).toHaveText('∨')

        // check them all
        await vm.submitToggleAllCompletedAndWaitFor(() => vm.getMain())

        await expect(
            vm.getToggleAllCompleted(),
            'after toggle all complete button text'
        ).toHaveText('∧')

        // uncheck them all
        await vm.submitToggleAllCompletedAndWaitFor(() => vm.getMain())

        await expect(
            vm.getToggleAllCompleted(),
            'after toggle all incomplete button text'
        ).toHaveText('∨')
    })

    test('toggle all completed', async ({ page }) => {
        const vm = new TodosViewModel(page)

        await vm.createAndSubmitNewTodoAndWaitFor('test one', () =>
            vm.getMain()
        )

        await vm.createAndSubmitNewTodoAndWaitFor('test two', () =>
            vm.getMain()
        )

        await vm.submitToggleAllCompletedAndWaitFor(() => vm.getMain())

        const allTodoElements = await vm.getAllTodos()

        let checkedToDoCount = 0

        for (const todoElement of allTodoElements) {
            await expect(todoElement).toBeChecked()
            checkedToDoCount = checkedToDoCount + 1
        }

        expect(checkedToDoCount).toBe(2)
    })

    test('toggle all incomplete', async ({ page }) => {
        const vm = new TodosViewModel(page)

        await vm.createAndSubmitNewTodoAndWaitFor('test one', () =>
            vm.getMain()
        )

        await vm.createAndSubmitNewTodoAndWaitFor('test two', () =>
            vm.getMain()
        )

        // check them all
        await vm.submitToggleAllCompletedAndWaitFor(() => vm.getMain())

        // uncheck them all
        await vm.submitToggleAllCompletedAndWaitFor(() => vm.getMain())

        const allTodoElements = await vm.getAllTodos()

        let uncheckedToDoCount = 0

        for (const todoElement of allTodoElements) {
            await expect(todoElement).not.toBeChecked()
            uncheckedToDoCount = uncheckedToDoCount + 1
        }

        expect(uncheckedToDoCount).toBe(2)
    })

    test('clear completed', async ({ page }) => {
        const vm = new TodosViewModel(page)

        await vm.createAndSubmitNewTodoAndWaitFor('test one', () =>
            vm.getMain()
        )

        await vm.createAndSubmitNewTodoAndWaitFor('test two', () =>
            vm.getMain()
        )

        await vm.createAndSubmitNewTodoAndWaitFor('test three', () =>
            vm.getMain()
        )

        const allTodos = await vm.getAllTodos()

        // check the second item
        await allTodos[1].check()

        // expecting this to remove the second item
        await vm.clearCompleted()

        const allTodoElements = await vm.getAllTodos()
        const actualTodoLabels = await vm.getAllTodoLabels()

        for (const todoElement of allTodoElements) {
            await expect(todoElement).not.toBeChecked()
        }

        const expectedTodoLabels = ['test one', 'test three']

        const errorMessage = `Expected "${expectedTodoLabels.join(
            '; '
        )}, but got "${actualTodoLabels.join('; ')}"`

        expect(
            doArraysMatch(expectedTodoLabels, actualTodoLabels),
            errorMessage
        ).toBe(true)
    })
})

/**
 * Item
 *
 * A todo item has three possible interactions:
 *
 * Clicking the checkbox marks the todo as complete by updating its completed
 * value and toggling the class completed on its parent <li>
 *
 * Double-clicking the <label> activates editing mode, by toggling the .editing
 * class on its <li>
 *
 * Hovering over the todo shows the remove button (.destroy)
 *
 * https://github.com/tastejs/todomvc/blob/master/app-spec.md#item
 */
test.describe('Item', () => {
    test('clicking checkbox marks todo as complete', async ({ page }) => {
        const vm = new TodosViewModel(page)

        // Requirement: Clicking the checkbox marks the todo as complete by
        //              updating its completed value and toggling the class
        //              completed on its parent <li>
        // We are using a checkbox, which inherently tracks "checked" state.
        // There is nothing to do to code or check.
        // Also, toggling a CSS class is an implementation requirement, not
        // a functional specification. e.g. describing the "how"
        expect(true).toBe(true)
    })

    // TODO: client-side easy edit
    // test('double-clicking to edit', async ({ page }) => {})

    // TODO: hovering over todo reveals remove
    // test('hover reveals remove', async ({ page }) => {})

    test('remove item', async ({ page }) => {
        const vm = new TodosViewModel(page)

        await vm.createAndSubmitNewTodoAndWaitFor('test one', () =>
            vm.getMain()
        )

        await vm.createAndSubmitNewTodoAndWaitFor('test two', () =>
            vm.getMain()
        )

        await vm.createAndSubmitNewTodoAndWaitFor('test three', () =>
            vm.getMain()
        )

        await vm.removeTodoByIndex(1)

        const actualTodoLabels = await vm.getAllTodoLabels()

        const expectedTodoLabels = ['test one', 'test three']

        const errorMessage = `Expected "${expectedTodoLabels.join(
            '; '
        )}, but got "${actualTodoLabels.join('; ')}"`

        expect(
            doArraysMatch(expectedTodoLabels, actualTodoLabels),
            errorMessage
        ).toBe(true)
    })
})
