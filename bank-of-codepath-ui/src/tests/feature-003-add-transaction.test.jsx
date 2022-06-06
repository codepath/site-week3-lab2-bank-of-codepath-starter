import * as React from "react"
import axios from "axios"
import { MockStateContext } from "instant-noodles"
import { configureSpecSuiteWithUtils, buildProxy, createAddTransactionProps, sleep } from "./utils"
import Home from "../components/Home/Home"
import AddTransaction from "../components/AddTransaction/AddTransaction"
import { AddTransactionForm } from "../components/AddTransaction/AddTransaction"

export function testAddTransaction(App) {
  const {
    assert,
    suite,
    // render,
    renderWithMSW,
    fireEvent,
    // customQueries,
    waitFor,
    workerWithRequests,
  } = configureSpecSuiteWithUtils(App)

  const FeatureTestSuite = suite(`FEATURE 003: The \`AddTransaction\` component`)

  FeatureTestSuite.before((ctx) => {
    // console.log("[BEFORE]: Running test for Home.test.jsx")

    const testInstances = ctx.getTestInstancesForRoot({
      RootComponent: App,
      singleComponentNames: ["AddTransaction", "AddTransactionForm", "BankActivity", "FilterInput", "Home", "Navbar"],
    })
    ctx.testInstances = testInstances
  })

  FeatureTestSuite.before.each((ctx) => {
    ctx.sandbox.restore()
    ctx.axiosGetSpy = ctx.sandbox.spy(axios, "get")
    ctx.axiosPostSpy = ctx.sandbox.spy(axios, "post")
    workerWithRequests.initializeTestNameForFile("addTransaction", ctx.__test__)
  })

  FeatureTestSuite.after.each((ctx) => {
    workerWithRequests.updateAllRequestsForTest("addTransaction", ctx.__test__)
  })

  FeatureTestSuite.after((ctx) => {
    //
  })

  FeatureTestSuite.test("The AddTransaction.jsx component exists and renders without crashing", async (ctx) => {
    const { container } = await renderWithMSW(<AddTransaction />)
    assert.ok(container, "The AddTransaction.jsx component should render without crashing.")
  })

  FeatureTestSuite.test("The `AddTransaction.jsx` component receives the correct props", async (ctx) => {
    ctx.testInstances.propAssertions.AddTransaction.assertComponentExistsAndHasProps()

    ctx.testInstances.propAssertions.AddTransaction.assertComponentExistsAndHasValueInProps("form")
    ctx.testInstances.propAssertions.AddTransaction.assertComponentExistsAndHasValueInProps("setForm")
    ctx.testInstances.propAssertions.AddTransaction.assertComponentExistsAndHasValueInProps("isCreating")
    ctx.testInstances.propAssertions.AddTransaction.assertComponentExistsAndHasValueInProps("setIsCreating")
    ctx.testInstances.propAssertions.AddTransaction.assertComponentExistsAndHasValueInProps("handleOnSubmit")

    ctx.testInstances.propAssertions.AddTransaction.assertComponentExistsAndHasPropOfType("isCreating", "boolean")
    ctx.testInstances.propAssertions.AddTransaction.assertComponentExistsAndHasPropOfType("setIsCreating", "function")
    ctx.testInstances.propAssertions.AddTransaction.assertComponentExistsAndHasPropOfType("setForm", "function")
    ctx.testInstances.propAssertions.AddTransaction.assertComponentExistsAndHasPropOfType("handleOnSubmit", "function")
    ctx.testInstances.propAssertions.AddTransaction.assertComponentExistsAndHasPropWithAttributeOfType({
      propName: "form",
      attributeName: "amount",
      attributeType: "number",
    })
    ctx.testInstances.propAssertions.AddTransaction.assertComponentExistsAndHasPropWithAttributeOfType({
      propName: "form",
      attributeName: "description",
      attributeType: "string",
    })
    ctx.testInstances.propAssertions.AddTransaction.assertComponentExistsAndHasPropWithAttributeOfType({
      propName: "form",
      attributeName: "category",
      attributeType: "string",
    })
  })

  FeatureTestSuite.test(
    "The `AddTransaction` component creates a `handleOnFormFieldChange` function that takes a change event as its single argument." +
      " That function then updates individual fields in the form using the `name` and `value` properties on `event.target`." +
      " That function is passed to the `AddTransactionForm` as its `handleOnFormFieldChange` prop.",
    async (ctx) => {
      //
      const proxyProps = buildProxy(ctx.AddTransactionFnProps)

      const setNewTransactionFormSpy = ctx.sandbox.spy(ctx.MockState, "setNewTransactionForm")

      const MockAddTransaction = () => (
        <React.Fragment>
          <MockStateContext>
            {() => <AddTransaction {...proxyProps} {...ctx.MockState} {...createAddTransactionProps(ctx.MockState)} />}
          </MockStateContext>
        </React.Fragment>
      )

      const { container } = await renderWithMSW(<MockAddTransaction />)

      assert.ok(container, "The AddTransaction.jsx component should render without crashing.")

      const testInstances = ctx.getTestInstancesForRoot({
        RootComponent: MockAddTransaction,
        singleComponentNames: ["AddTransaction", "AddTransactionForm"],
      })

      testInstances.propAssertions.AddTransactionForm.assertComponentExistsAndHasValueInProps("handleOnFormFieldChange")

      testInstances.AddTransactionForm.props.handleOnFormFieldChange?.({
        target: {
          name: "description",
          value: "test description",
        },
      })

      assert.ok(
        setNewTransactionFormSpy.calledOnce,
        "The `handleOnFormFieldChange` should call the `setForm` prop passed to the `AddTransaction` component."
      )

      assert.equal(
        ctx.MockState.newTransactionForm?.description,
        "test description",
        "The `handleOnFormFieldChange` function should update the correct field on the `form` prop passed to the `AddTransaction` component using the `setForm` prop."
      )
    }
  )

  FeatureTestSuite.test("The `AddTransactionForm` component receives the correct props", async (ctx) => {
    ctx.testInstances.propAssertions.AddTransactionForm.assertComponentExistsAndHasProps()

    ctx.testInstances.propAssertions.AddTransactionForm.assertComponentExistsAndHasValueInProps(
      "handleOnFormFieldChange"
    )
    ctx.testInstances.propAssertions.AddTransactionForm.assertComponentExistsAndHasValueInProps("handleOnSubmit")
    ctx.testInstances.propAssertions.AddTransactionForm.assertComponentExistsAndHasValueInProps("form")

    ctx.testInstances.propAssertions.AddTransactionForm.assertComponentExistsAndHasPropOfType("isCreating", "boolean")
    ctx.testInstances.propAssertions.AddTransactionForm.assertComponentExistsAndHasPropOfType(
      "handleOnSubmit",
      "function"
    )
    ctx.testInstances.propAssertions.AddTransactionForm.assertComponentExistsAndHasPropOfType(
      "handleOnFormFieldChange",
      "function"
    )

    ctx.testInstances.propAssertions.AddTransactionForm.assertComponentExistsAndHasPropWithAttributeOfType({
      propName: "form",
      attributeName: "amount",
      attributeType: "number",
    })
    ctx.testInstances.propAssertions.AddTransactionForm.assertComponentExistsAndHasPropWithAttributeOfType({
      propName: "form",
      attributeName: "description",
      attributeType: "string",
    })
    ctx.testInstances.propAssertions.AddTransactionForm.assertComponentExistsAndHasPropWithAttributeOfType({
      propName: "form",
      attributeName: "category",
      attributeType: "string",
    })
  })

  FeatureTestSuite.test(
    "The `description`, `category`, and `amount` input fields each get provided the proper `value`, `type`, and `onChange` props.",
    async (ctx) => {
      const proxyProps = buildProxy(ctx.AddTransactionFnProps)

      const sampleForm = { description: "hey", category: "hi", amount: 20 }

      const MockAddTransaction = () => (
        <React.Fragment>
          <MockStateContext>
            {() => (
              <AddTransaction
                {...proxyProps}
                {...ctx.MockState}
                {...createAddTransactionProps(ctx.MockState)}
                form={sampleForm}
              />
            )}
          </MockStateContext>
        </React.Fragment>
      )

      const { container } = await renderWithMSW(<MockAddTransaction />)

      assert.ok(container, "The AddTransaction.jsx component should render without crashing.")

      const descriptionInput = container.querySelector("input[name='description']")
      assert.ok(
        descriptionInput,
        "The AddTransaction.jsx component should render an input element with a name prop of `description`."
      )
      assert.equal(
        descriptionInput.type,
        "text",
        "The AddTransaction.jsx component should render an input element with a name prop of `description` that gets passed the proper `type` prop."
      )
      assert.equal(
        descriptionInput.value,
        sampleForm.description,
        "The AddTransaction.jsx component should render an input element with a name prop of `description` that gets passed a `value` prop equal to the `description` field of its `form` prop."
      )

      const categoryInput = container.querySelector("input[name='category']")
      assert.ok(
        categoryInput,
        "The AddTransaction.jsx component should render an input element with a name prop of `category`."
      )
      assert.equal(
        categoryInput.type,
        "text",
        "The AddTransaction.jsx component should render an input element with a name prop of `category` that gets passed the proper `type` prop."
      )
      assert.equal(
        categoryInput.value,
        sampleForm.category,
        "The AddTransaction.jsx component should render an input element with a name prop of `category` that gets passed a `value` prop equal to the `category` field of its `form` prop."
      )

      const amountInput = container.querySelector("input[name='amount']")
      assert.ok(
        amountInput,
        "The AddTransaction.jsx component should render an input element with a name prop of `amount`."
      )
      assert.equal(
        amountInput.type,
        "number",
        "The AddTransaction.jsx component should render an input element with a name prop of `number` that gets passed the proper `type` prop."
      )
      assert.equal(
        String(amountInput.value),
        String(sampleForm.amount),
        "The AddTransaction.jsx component should render an input element with a name prop of `amount` that gets passed a `value` prop equal to the `amount` field of its `form` prop."
      )
    }
  )

  FeatureTestSuite.test(
    "The `button` element with a `className` of `add-transaction` gets passed the `handleOnSubmit` function as its `onClick` prop.",
    async (ctx) => {
      const proxyProps = buildProxy(ctx.AddTransactionFnProps)
      const MockAddTransaction = () => (
        <React.Fragment>
          <MockStateContext>
            {() => <AddTransaction {...proxyProps} {...ctx.MockState} {...createAddTransactionProps(ctx.MockState)} />}
          </MockStateContext>
        </React.Fragment>
      )

      const testInstances = ctx.getTestInstancesForRoot({
        RootComponent: MockAddTransaction,
        singleComponentNames: ["AddTransaction", "AddTransactionForm"],
      })

      const addTransactionButtonInstance = testInstances.root.find(
        (node) => node.type === "button" && node.props.className?.split(" ")?.includes("add-transaction")
      )

      assert.ok(
        addTransactionButtonInstance,
        "The `AddTransactionForm` component should render a `button` element with the className of `add-transaction`."
      )

      testInstances.propAssertions.AddTransactionForm.assertComponentExistsAndHasPropOfType(
        "handleOnSubmit",
        "function"
      )

      const handleOnSubmitSpy = ctx.sandbox.spy()

      const MockAddTransactionForm = (props) => (
        <React.Fragment>
          <MockStateContext>
            {() => <AddTransactionForm form={{}} handleOnSubmit={handleOnSubmitSpy} {...props} />}
          </MockStateContext>
        </React.Fragment>
      )

      const { container } = await renderWithMSW(<MockAddTransactionForm />)

      assert.ok(container, "The `AddTransactionForm` component should render without crashing.")

      const addTransactionButtonElement = container.querySelector("button.add-transaction")
      assert.ok(
        addTransactionButtonElement,
        "The `AddTransactionForm` component should render a `button` element with the className of `add-transaction`."
      )

      fireEvent.click(addTransactionButtonElement)

      assert.ok(
        handleOnSubmitSpy.calledOnce,
        "The `handleOnSubmit` prop should be called when the `button` with the className of `add-transaction` is clicked."
      )
    }
  )

  FeatureTestSuite.test(
    "In the `Home.jsx` component, a `handleOnCreateTransaction` function is defined that starts by setting `isCreating` to `true`," +
      " and then makes a `POST` request to the `/transactions` endpoint with the contents of the `newTransactionForm` as its body." +
      " If anything goes wrong, it calls the `setError` function with the error and then sets `isCreating` to `false`." +
      " Otherwise, it takes the new transaction returned from the API and adds it to the `transactions` array in state," +
      " before resetting the `newTransactionForm` and setting `isCreating` back to `false`." +
      " That function is passed to the `AddTransaction` component as its `handleOnSubmit` prop.",
    async (ctx) => {
      const proxyProps = buildProxy(ctx.HomeFnProps)

      // const setIsCreatingSpy = ctx.sandbox.spy(ctx.MockState, "setIsCreating")
      const setIsCreatingSpy = ctx.MockState.__spies?.setIsCreating

      const sampleTransactionForm = { description: "hey", category: "hi", amount: 20 }

      ctx.MockState.setNewTransactionForm(sampleTransactionForm)

      const MockHome = () => (
        <React.Fragment>
          <MockStateContext>
            {() => (
              <Home
                {...proxyProps}
                {...ctx.MockState}
                // newTransactionForm={sampleTransactionForm}
              />
            )}
          </MockStateContext>
        </React.Fragment>
      )

      const { container, queryByText } = await renderWithMSW(<MockHome />)
      assert.ok(container, "The Home.jsx component should render without crashing.")

      // await sleep(15) // sleep 15 ms

      await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
        container,
      })

      const currentTransactions = [...ctx.MockState.transactions]

      const addTransactionButtonElement = container.querySelector("button.add-transaction")

      fireEvent.click(addTransactionButtonElement)

      await sleep(15) // sleep 15 ms

      await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
        container,
      })

      assert.ok(
        ctx.axiosPostSpy.calledOnce,
        "The `handleOnCreateTransaction` function should use `axios.post` to send a `POST` request to the `/transactions` endpoint with the new transaction."
      )

      assert.equal(
        setIsCreatingSpy?.getCalls?.()?.length,
        2,
        "The `setIsCreating` function should be called twice - once at the beginning of the `handleOnCreateTransaction` function and once at the end."
      )

      const expectedTransactions = [
        ...currentTransactions,
        { ...sampleTransactionForm, id: currentTransactions.length },
      ]

      assert.equal(
        ctx.MockState.transactions.length,
        expectedTransactions.length,
        "The new transaction should be added to the `transactions` array after the new transaction has been returned from the `POST` request."
      )

      // ensure the existing transactions are the same
      assert.equal(
        ctx.MockState.transactions.slice(0, 4),
        currentTransactions.slice(0, 4),
        "The original `transactions` in the `transactions` array should be still be in state even after the new transaction has been returned from the `POST` request."
      )

      const actualMockTransaction = ctx.MockState.transactions.slice(-1)?.[0]
      const actualExpectedTransaction = expectedTransactions.slice(-1)?.[0]
      for (const field of ["id", "description", "category", "amount"]) {
        assert.equal(
          actualMockTransaction?.[field],
          actualExpectedTransaction?.[field],
          `The \`${field}\` field of the new transaction should be the same as the \`${field}\` field in the \`newTransactionForm\`.`
        )
      }
    }
  )

  return FeatureTestSuite.run()
}
