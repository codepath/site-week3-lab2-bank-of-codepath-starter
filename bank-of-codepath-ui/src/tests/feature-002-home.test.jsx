import * as React from "react"
import * as sinon from "sinon"
import axios from "axios"
import { configureSpecSuiteWithUtils, buildProxy } from "./utils"
import Home from "../components/Home/Home"
import * as transactionFixtures from "./__fixtures__/transactions"

export function testHome(App) {
  const {
    assert,
    suite,
    // render,
    renderWithMSW,
    RouterProvider,
    // fireEvent,
    // customQueries,
    waitFor,
    workerWithRequests,
  } = configureSpecSuiteWithUtils(App)

  const FeatureTestSuite = suite(`FEATURE 002: The \`Home\` component`)

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
    workerWithRequests.initializeTestNameForFile("home", ctx.__test__)
  })

  FeatureTestSuite.after.each((ctx) => {
    workerWithRequests.updateAllRequestsForTest("home", ctx.__test__)
  })

  FeatureTestSuite.after((ctx) => {
    // console.log("[AFTER]: Finished running test for Home.test.jsx")
  })

  FeatureTestSuite.test("The Home.jsx component exists and renders without crashing", async (ctx) => {
    const proxyProps = buildProxy(ctx.HomeFnProps)
    const { container } = await renderWithMSW(<Home {...proxyProps} />)
    assert.ok(container, "The Home.jsx component should render without crashing.")

    await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
      container,
    })
  })

  FeatureTestSuite.test("The Home.jsx component should receive the correct props", async (ctx) => {
    ctx.testInstances.propAssertions.Home.assertComponentExistsAndHasProps()
    //
    const homeProps = [
      "transactions",
      "transfers",
      "setTransactions",
      "setTransfers",
      "setError",
      "setIsLoading",
      "filterInputValue",
      "isLoading",
      // "addTransaction",
    ]

    for (const prop of homeProps) {
      ctx.testInstances.propAssertions.Home.assertComponentExistsAndHasValueInProps(prop)
    }
    for (const prop in ctx.HomeFnProps) {
      ctx.testInstances.propAssertions.Home.assertComponentExistsAndHasPropOfType(prop, "function")
    }
    // simple
    ctx.testInstances.propAssertions.Home.assertComponentExistsAndHasPropOfType("isLoading", "boolean")
  })

  FeatureTestSuite.test(
    "The Home.jsx component has a `useEffect` hook that makes a GET request to the `transactions` endpoint" +
      " using the `axios.get` method as soon as it's mounted.",
    async (ctx) => {
      const proxyProps = buildProxy(ctx.HomeFnProps)
      const { container } = await renderWithMSW(<Home {...proxyProps} />)
      assert.ok(container, "The Home.jsx component should render without crashing.")

      await waitFor(
        () => {
          assert.ok(
            ctx.axiosGetSpy?.getCalls()?.length,
            "The Home.jsx component should make GET requests to the Express API when mounted."
          )
        },
        {
          container,
          timeout: 10,
        }
      )

      await waitFor(
        () => {
          assert.ok(
            ctx.axiosGetSpy.calledWith(sinon.match(ctx.listTransactionsEndpointRegex)),
            "The Home.jsx component should make a GET request to the `transactions` endpoint when mounted."
          )
        },
        {
          container,
          timeout: 10,
        }
      )
    }
  )

  FeatureTestSuite.test(
    "The Home.jsx component has a `useEffect` hook that makes a GET request to the `transfers` endpoint using the `axios.get` method as soon as it's mounted.",
    async (ctx) => {
      const proxyProps = buildProxy(ctx.HomeFnProps)
      const { container } = await renderWithMSW(<Home {...proxyProps} />)

      assert.ok(container, "The Home.jsx component should render without crashing.")

      await waitFor(
        () => {
          assert.ok(
            ctx.axiosGetSpy?.getCalls()?.length,
            "The Home.jsx component should make GET requests to the Express API when mounted."
          )
        },
        {
          container,
        }
      )

      await waitFor(
        () => {
          assert.ok(
            ctx.axiosGetSpy.calledWith(sinon.match(ctx.listTransfersEndpointRegex)),
            "The Home.jsx component should make a GET request to the `transfers` endpoint when mounted."
          )
        },
        {
          container,
        }
      )

      await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
        container,
      })
    }
  )

  FeatureTestSuite.test(
    "While the app is fetching data, the `Home.jsx` component should have an `isLoading` prop equal to `true`. " +
      'When that prop is true, it should render an `h1` element with the text: `"Loading..."`.' +
      " Otherwise, render the `BankActivity` component. It should always render the `AddTransaction` component.",
    async (ctx) => {
      const proxyProps = buildProxy(ctx.HomeFnProps)
      const { rerender, container, queryByText } = await renderWithMSW(<Home {...proxyProps} isLoading={true} />)

      assert.ok(
        queryByText("Loading...", { selector: "h1" }),
        "The Home.jsx component should render the `Loading...` text inside an `h1` element while it's fetching data."
      )

      assert.not.ok(
        queryByText("Transfers", { selector: "h2" }),
        "The Home.jsx component should not render the `BankActivity.jsx` component while it's fetching data."
      )
      assert.ok(
        queryByText("Add Transaction", { selector: "h2" }),
        "The Home.jsx component should not render the `AddTransaction.jsx` component while it's fetching data."
      )

      rerender(<Home {...proxyProps} isLoading={false} />)

      assert.not.ok(
        queryByText("Loading...", { selector: "h1" }),
        "The Home.jsx component should render the `Loading...` text inside an `h1` element while it's fetching data."
      )

      assert.ok(
        queryByText("Transfers", { selector: "h2" }),
        "The Home.jsx component should not render the `BankActivity.jsx` component while it's fetching data."
      )
      assert.ok(
        queryByText("Add Transaction", { selector: "h2" }),
        "The Home.jsx component should not render the `AddTransaction.jsx` component while it's fetching data."
      )

      await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
        container,
      })
    }
  )

  FeatureTestSuite.test(
    "The `Home.jsx` component should create a `filteredTransactions` array using its `transactions` prop." +
      " If its `filterInputValue` prop is NOT an empty string," +
      " it should filter the transactions based on whether or not the lowercased `description` property of a transaction contains the lowercased `filterInputValue`." +
      " Otherwise, it should just be the `transactions` prop. The `filteredTransactions` array should be passed to the `BankActivity` component as its `transactions` prop.",
    async (ctx) => {
      //
      let filterInputValue = ""

      function RoutedHome(props) {
        return (
          <RouterProvider>
            <Home {...props} />
          </RouterProvider>
        )
      }

      const proxyProps = buildProxy(ctx.HomeFnProps)
      const transactionsNoFilter = [...transactionFixtures.listTransactionsSuccess]
      const propsWithTransactionsAndNoFilterInput = {
        ...proxyProps,
        transactions: transactionsNoFilter,
        filterInputValue,
      }

      function HomeWithNoFilterInput() {
        return <RoutedHome {...propsWithTransactionsAndNoFilterInput} isLoading={false} />
      }

      const noFilterValue = ctx.getTestInstancesForRoot({
        RootComponent: HomeWithNoFilterInput,
        singleComponentNames: ["BankActivity", "Home"],
      })

      noFilterValue.propAssertions.Home.assertComponentExistsAndHasPropWithValue("transactions", transactionsNoFilter)

      assert.equal(
        noFilterValue.Home?.props?.transactions?.length,
        noFilterValue.BankActivity?.props?.transactions?.length,
        "The `Home.jsx` component should pass the same array of transactions to the `BankActivity.jsx` component " +
          " as its own `transactions` prop when the `inputFilterValue` prop is an empty string."
      )

      noFilterValue.propAssertions.BankActivity.assertComponentExistsAndHasPropWithValue(
        "transactions",
        transactionsNoFilter
      )

      filterInputValue = "Programming"
      const transactionsWithFilterProgramming = [...transactionFixtures.listTransactionsSuccess]
      const filteredTransactionsWithFilterProgramming = transactionsWithFilterProgramming.filter((transaction) =>
        transaction.description.toLowerCase().includes(filterInputValue.toLowerCase())
      )
      const filteredTransactionsWithFilterProgrammingIds = filteredTransactionsWithFilterProgramming.map((t) => t.id)
      const propsWithTransactionsAndFilterInputProgramming = {
        ...proxyProps,
        transactions: transactionsWithFilterProgramming,
        filterInputValue,
      }

      function HomeWithFilterInputProgramming() {
        return <RoutedHome {...propsWithTransactionsAndFilterInputProgramming} isLoading={false} />
      }

      const filterValueProgramming = ctx.getTestInstancesForRoot({
        RootComponent: HomeWithFilterInputProgramming,
        singleComponentNames: ["BankActivity", "Home"],
      })

      filterValueProgramming.propAssertions.Home.assertComponentExistsAndHasPropWithValue(
        "transactions",
        transactionsWithFilterProgramming
      )

      assert.equal(
        filterValueProgramming.Home?.props?.transactions?.length,
        transactionsWithFilterProgramming?.length,
        "The `Home.jsx` component should pass the same array of transactions to the `BankActivity.jsx` component " +
          "as its own `transactions` prop when the `inputFilterValue` prop is an empty string."
      )
      assert.equal(
        filterValueProgramming.BankActivity?.props?.transactions?.length,
        filteredTransactionsWithFilterProgramming?.length,
        "When the `Home.jsx` component has a non-empty string for its `filterInputValue` prop, " +
          "it should filter the array of transactions and pass the new array to the `BankActivity.jsx` component as its own `transactions` prop."
      )

      for (const transaction of filterValueProgramming.BankActivity?.props?.transactions) {
        assert.ok(
          filteredTransactionsWithFilterProgrammingIds?.includes(transaction.id),
          `Transaction with id of ${transaction.id} should not be in the filtered array passed to the \`BankActivity\` component` +
            ` as its \`transactions\` prop when the \`filterInputValue\` is ${filterInputValue}.`
        )
      }

      filterInputValue = "prograMMing"
      const transactionsWithFilterProgrammingWeirdCases = [...transactionFixtures.listTransactionsSuccess]
      const filteredTransactionsWithFilterProgrammingWeirdCases = transactionsWithFilterProgrammingWeirdCases.filter(
        (transaction) => transaction.description.toLowerCase().includes(filterInputValue.toLowerCase())
      )
      const filteredTransactionsWithFilterProgrammingWeirdCasesIds =
        filteredTransactionsWithFilterProgrammingWeirdCases.map((t) => t.id)
      const propsWithTransactionsAndFilterInputProgrammingWeirdCases = {
        ...proxyProps,
        transactions: transactionsWithFilterProgrammingWeirdCases,
        filterInputValue,
      }

      function HomeWithFilterInputProgrammingWeirdCases() {
        return <RoutedHome {...propsWithTransactionsAndFilterInputProgrammingWeirdCases} isLoading={false} />
      }

      const filterValueProgrammingWeirdCases = ctx.getTestInstancesForRoot({
        RootComponent: HomeWithFilterInputProgrammingWeirdCases,
        singleComponentNames: ["BankActivity", "Home"],
      })

      filterValueProgrammingWeirdCases.propAssertions.Home.assertComponentExistsAndHasPropWithValue(
        "transactions",
        transactionsWithFilterProgrammingWeirdCases
      )

      assert.equal(
        filterValueProgrammingWeirdCases.Home?.props?.transactions?.length,
        transactionsWithFilterProgrammingWeirdCases?.length,
        "The `Home.jsx` component should pass the same array of transactions to the `BankActivity.jsx` component " +
          "as its own `transactions` prop when the `inputFilterValue` prop is an empty string."
      )
      assert.equal(
        filterValueProgrammingWeirdCases.BankActivity?.props?.transactions?.length,
        filteredTransactionsWithFilterProgrammingWeirdCases?.length,
        "When the `Home.jsx` component has a non-empty string for its `filterInputValue` prop, " +
          "it should filter the array of transactions and pass the new array to the `BankActivity.jsx` component as its own `transactions` prop."
      )

      for (const transaction of filterValueProgrammingWeirdCases.BankActivity?.props?.transactions) {
        assert.ok(
          filteredTransactionsWithFilterProgrammingWeirdCasesIds?.includes(transaction.id),
          `Transaction with id of ${transaction.id} should not be in the filtered array passed to the \`BankActivity\` component ` +
            ` as its \`transactions\` prop when the \`filterInputValue\` is ${filterInputValue}.`
        )
      }

      filterInputValue = "coffee"
      const transactionsWithFilterCoffee = [...transactionFixtures.listTransactionsSuccess]
      const filteredTransactionsWithFilterCoffee = transactionsWithFilterCoffee.filter((transaction) =>
        transaction.description.toLowerCase().includes(filterInputValue.toLowerCase())
      )
      const filteredTransactionsWithFilterCoffeeIds = filteredTransactionsWithFilterCoffee.map((t) => t.id)
      const propsWithTransactionsAndFilterInputCoffee = {
        ...proxyProps,
        transactions: transactionsWithFilterCoffee,
        filterInputValue,
      }

      function HomeWithFilterInputCoffee() {
        return <RoutedHome {...propsWithTransactionsAndFilterInputCoffee} isLoading={false} />
      }

      const filterValueCoffee = ctx.getTestInstancesForRoot({
        RootComponent: HomeWithFilterInputCoffee,
        singleComponentNames: ["BankActivity", "Home"],
      })

      filterValueCoffee.propAssertions.Home.assertComponentExistsAndHasPropWithValue(
        "transactions",
        transactionsWithFilterCoffee
      )

      assert.equal(
        filterValueCoffee.Home?.props?.transactions?.length,
        transactionsWithFilterCoffee?.length,
        "The `Home.jsx` component should pass the same array of transactions to the BankActivity.jsx component as its own" +
          " `transactions` prop when the `inputFilterValue` prop is an empty string."
      )
      assert.equal(
        filterValueCoffee.BankActivity?.props?.transactions?.length,
        filteredTransactionsWithFilterCoffee?.length,
        "When the `Home.jsx` component has a non-empty string for its `filterInputValue` prop, it should filter the array of " +
          " transactions and pass the new array to the `BankActivity.jsx` component as its own `transactions` prop."
      )

      for (const transaction of filterValueCoffee.BankActivity?.props?.transactions) {
        assert.ok(
          filteredTransactionsWithFilterCoffeeIds?.includes(transaction.id),
          `Transaction with id of ${transaction.id} should not be in the filtered array passed to the \`BankActivity\` component` +
            ` as its \`transactions\` prop when the \`filterInputValue\` is ${filterInputValue}.`
        )
      }
    }
  )

  FeatureTestSuite.test(
    "If the `Home.jsx` component receives any defined value for its `error` prop, " +
      "it should render an error message inside of an `h2` element with the className of `error`.",
    async (ctx) => {
      //
      const errorMessage = "Error message"
      const proxyProps = buildProxy(ctx.HomeFnProps)
      const { container, queryByText } = await renderWithMSW(
        <Home {...proxyProps} isLoading={false} error={errorMessage} />
      )

      assert.ok(
        queryByText(errorMessage, { selector: "h2" }),
        "The `Home.jsx` component should render an error message inside of an `h2` element" +
          " with the className of `error` when a valid `error` prop is supplied."
      )

      await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
        container,
      })
    }
  )

  return FeatureTestSuite.run()
}
