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

    async getAllTodoLabels() {
        const allTodoElements = await this.getAllTodoInputs()

        const allTodoLabels = []

        for (const todoInput of allTodoElements) {
            const todoLabel = await todoInput.inputValue()
            allTodoLabels.push(todoLabel)
        }

        return allTodoLabels
    }

    async getAllTodoInputs() {
        const allTodoElements = await this.getAllTodos()

        const allTodoLabels = []

        for (const todoElement of allTodoElements) {
            const todoLabel = await todoElement.locator(
                '//parent::label/following-sibling::input[@name="todo-text"]'
            )

            allTodoLabels.push(todoLabel)
        }

        return allTodoLabels
    }

    async clearTodoByIndex(index) {
        const allTodoElements = await this.getAllTodoInputs()

        const todo = allTodoElements.at(index)

        await todo.clear()
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

    getClearCompleted() {
        return this.page.locator('input[name="button-clear-completed"]')
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

    async clearCompleted() {
        await this.getClearCompleted().click()

        // Wait for submission to complete...
        await this.getMain().waitFor()
    }

    async removeTodoByIndex(index) {
        const allRemoveButtons = await this.getMain()
            .getByTestId('button-remove-todo')
            .all()

        const removeButton = allRemoveButtons.at(index)

        await removeButton.click()

        // Wait for submission to complete...
        await this.getMain().waitFor()
    }

    async save() {
        const saveButton = this.page.locator('input[name="button-save"]')

        await saveButton.click()

        // Wait for submission to complete...
        await this.getMain().waitFor()
    }
}
