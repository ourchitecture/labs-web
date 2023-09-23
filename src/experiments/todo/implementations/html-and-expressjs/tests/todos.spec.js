// @ts-check
const { test, expect } = require('@playwright/test')

import TodosViewModel from './todos'

test.beforeEach(async ({ page }) => {
    const vm = new TodosViewModel(page)
    await vm.navigateHome()
})

test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Our Todos/)
})

// When there are no todos, #main and #footer should be hidden.
// https://github.com/tastejs/todomvc/blob/master/app-spec.md#no-todos
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

/*
  New todos are entered in the input at the top of the app. The input element
  should be focused when the page is loaded, preferably by using the autofocus
  input attribute. Pressing Enter creates the todo, appends it to the todo
  list, and clears the input. Make sure to .trim() the input and then check
  that it's not empty before creating a new todo.
*/
// https://github.com/tastejs/todomvc/blob/master/app-spec.md#new-todo
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

/*
  This checkbox toggles all the todos to the same state as itself. Make sure
  to clear the checked state after the "Clear completed" button is clicked.
  The "Mark all as complete" checkbox should also be updated when single todo
  items are checked/unchecked. Eg. When all the todos are checked it should
  also get checked.
*/
// https://github.com/tastejs/todomvc/blob/master/app-spec.md#mark-all-as-complete
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
})

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
