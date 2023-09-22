// @ts-check
const { test, expect } = require('@playwright/test')

const CONFIG = {
    home: {
        url: 'http://localhost:3000/',
        titlePattern: /Our Todos/,
        newTodo: {
            selector: 'input[name="new-todo"]',
        },
        newTodoSubmit: {
            text: 'Submit',
        },
        error: {
            selector: '#error',
        },
        main: {
            selector: '#main',
        },
        footer: {
            selector: '#footer',
        },
    },
}

test.beforeEach(async ({ page }) => {
    await page.goto(CONFIG.home.url)
})

test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(CONFIG.home.titlePattern)
})

// When there are no todos, #main and #footer should be hidden.
// https://github.com/tastejs/todomvc/blob/master/app-spec.md#no-todos
test.describe('No todos', () => {
    test('main is hidden without todos', async ({ page }) => {
        await expect(page.locator(CONFIG.home.main.selector)).toHaveCount(0)
    })

    test('footer is hidden without todos', async ({ page }) => {
        await expect(page.locator(CONFIG.home.footer.selector)).toHaveCount(0)
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
        const newTodoElement = page.locator(CONFIG.home.newTodo.selector)

        await expect(newTodoElement).toBeVisible()
        await expect(newTodoElement).toHaveValue('')
    })

    test('todo input has focus', async ({ page }) => {
        const newTodoElement = page.locator(CONFIG.home.newTodo.selector)

        const newTodoAutoFocusValue =
            await newTodoElement.getAttribute('autofocus')

        await expect(newTodoAutoFocusValue).toBe('')
    })

    test('missing new todo displays error', async ({ page }) => {
        const newTodoElement = page.locator(CONFIG.home.newTodo.selector)

        // submits the form
        await newTodoElement.press('Enter')

        await page.waitForSelector(CONFIG.home.error.selector)

        await page.screenshot({ path: 'empty-todo-error.png' })

        const errorElement = page.locator(CONFIG.home.error.selector)

        await expect(errorElement).toBeVisible()

        // BUG: not sure why `toHaveText(...)` is failing
        const errorText = await errorElement.textContent()

        expect(errorText).toBe('Missing new-todo field value')
    })

    test('empty new todo displays error', async ({ page }) => {
        const newTodoElement = page.locator(CONFIG.home.newTodo.selector)

        // fill with whitespace
        await newTodoElement.fill('  ')

        // submits the form
        await newTodoElement.press('Enter')

        await page.waitForSelector(CONFIG.home.error.selector)

        const errorElement = page.locator(CONFIG.home.error.selector)

        await expect(errorElement).toBeVisible()

        // BUG: not sure why `toHaveText(...)` is failing
        const errorText = await errorElement.textContent()

        expect(errorText).toBe('Empty or whitespace new-todo field value')
    })

    test('enter new todo; main and footer display', async ({ page }) => {
        const newTodoElement = page.locator(CONFIG.home.newTodo.selector)
        await newTodoElement.fill('testing a new todo')

        // submits the form
        await newTodoElement.press('Enter')

        await page.waitForSelector(CONFIG.home.main.selector)

        const newTodoElementAfterRedirect = page.locator(
            CONFIG.home.newTodo.selector
        )
        await expect(newTodoElementAfterRedirect).toHaveValue('')

        await expect(page.locator(CONFIG.home.error.selector)).not.toBeVisible()
        await expect(page.locator(CONFIG.home.main.selector)).toBeVisible()
        await expect(page.locator(CONFIG.home.footer.selector)).toBeVisible()
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
    // test('todo input exists', async ({ page }) => {
    //     const newTodoElement = page.locator(CONFIG.home.newTodo.selector)
    //     await expect(newTodoElement).toBeVisible()
    //     await expect(newTodoElement).toHaveValue('')
    // })
})

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
