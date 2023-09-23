const { Locator, Page } = require('@playwright/test')

export default class TodosViewModel {
    /**
     * Builds a new view model.
     *
     * @param {Page} [page]
     */
    constructor(page) {
        this.page = page
    }

    async navigateHome() {
        await this.page.goto('http://localhost:3000/')
    }

    async getAllTodos() {
        return await this.getMain().getByRole('checkbox').all()
    }

    getError() {
        return this.page.getByTestId('error')
    }

    getFooter() {
        return this.page.getByTestId('footer')
    }

    getMain() {
        return this.page.getByTestId('main')
    }

    getNewTodo() {
        return this.page.locator('input[name="new-todo"]')
    }

    getToggleAllCompleted() {
        return this.page.locator('button[name="toggle-completed"]')
    }

    /**
     * Creates and submits a new todo and then waits for the list to display.
     *
     * @param {string} text
     * @param {Function} returns a locator
     * @returns {Locator} the locator.
     */
    async createAndSubmitNewTodoAndWaitFor(text, locatorFn) {
        const newTodoElement = this.getNewTodo()

        await newTodoElement.fill(text)

        return await this.submitNewTodoAndWaitFor(locatorFn)
    }

    /**
     * Submits the new todo and waits for the specified locator.
     *
     * @param {Function} returns a locator
     * @returns {Locator} the locator.
     */
    async submitNewTodoAndWaitFor(locatorFn) {
        await this.getNewTodo().press('Enter')
        const locator = locatorFn()
        await locator.waitFor()
        return locator
    }

    /**
     * Submits "toggle all completed" and waits for the specified locator.
     *
     * @param {Function} returns a locator
     * @returns {Locator} the locator.
     */
    async submitToggleAllCompletedAndWaitFor(locatorFn) {
        await this.getToggleAllCompleted().click()
        const locator = locatorFn()
        await locator.waitFor()
        return locator
    }
}
