import * as React from "react"
import * as sinon from "sinon"
import axios from "axios"
import { configureSpecSuiteWithUtils } from "./utils"
import TransactionDetail from "../components/TransactionDetail/TransactionDetail"
import * as transactionFixtures from "./__fixtures__/transactions"

const transactions = transactionFixtures.listTransactionsSuccess.slice()

export function testTransactionDetail(App) {
  const {
    assert,
    suite,
    // render,
    renderWithMSW,
    workerWithRequests,
    waitFor,
  } = configureSpecSuiteWithUtils(App)

  const FeatureTestSuite = suite(`FEATURE 005: The \`TransactionDetail\` component`)

  FeatureTestSuite.before((ctx) => {
    // console.log("[BEFORE]: Running test for Home.test.jsx")
  })

  FeatureTestSuite.before.each((ctx) => {
    ctx.sandbox.restore()
    ctx.axiosGetSpy = ctx.sandbox.spy(axios, "get")
    ctx.axiosPostSpy = ctx.sandbox.spy(axios, "post")
    workerWithRequests.initializeTestNameForFile("transactionDetail", ctx.__test__)
  })

  FeatureTestSuite.after.each((ctx) => {
    workerWithRequests.updateAllRequestsForTest("transactionDetail", ctx.__test__)
  })

  FeatureTestSuite.test("The `TransactionDetail.jsx` component exists and renders without crashing", async (ctx) => {
    const transaction = transactions[0]
    const { container } = await renderWithMSW(<TransactionDetail />, { route: `/transactions/${transaction.id}` })
    assert.ok(container, "The TransactionDetail.jsx component should render without crashing.")

    await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
      container,
    })
  })

  FeatureTestSuite.test(
    "The `TransactionDetail.jsx` component has a `useEffect` hook" +
      " that makes a GET request to the `transactions/:transactionId` endpoint" +
      " using the `axios.get` method as soon as it's mounted.",
    async (ctx) => {
      const transaction = transactions[0]
      const { MockAppProvider } = ctx.createMockStateAndApp()

      const { container, queryAllByText, ComponentWithStaticRouteData } = await renderWithMSW(<MockAppProvider />, {
        route: `/transactions/${transaction.id}`,
      })

      await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
        container,
      })

      await waitFor(
        () => {
          assert.ok(
            ctx.axiosGetSpy?.getCalls()?.length,
            "The `TransactionDetail` component should make a GET request to the Express API when mounted."
          )
        },
        {
          container,
          timeout: 25,
        }
      )
    }
  )

  FeatureTestSuite.test(
    "The `TransactionDetail.jsx` component extracts the `transactionId` parameter from the url" +
      " with the `useParams` hook form `react-router-dom`." +
      " It uses that to make a `GET` request to the proper path `transaction` endpoint.",
    async (ctx) => {
      const transaction = transactions[0]

      const { MockAppProvider } = ctx.createMockStateAndApp()

      const { container, queryAllByText, ComponentWithStaticRouteData } = await renderWithMSW(<MockAppProvider />, {
        route: `/transactions/${transaction.id}`,
      })

      assert.ok(container, "The `TransactionDetail` component should render without crashing.")

      await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
        container,
      })

      await waitFor(
        () => {
          assert.ok(
            ctx.axiosGetSpy?.getCalls()?.length,
            "The `TransactionDetail` component should make a GET request to the Express API when mounted."
          )
        },
        {
          container,
          timeout: 30,
        }
      )

      await waitFor(
        () => {
          assert.ok(
            ctx.axiosGetSpy.calledWith(sinon.match(ctx.transactionDetailsEndpointRegex)),
            "The `TransactionDetail` component should make a GET request to the `transaction` detail endpoint when mounted."
          )
        },
        {
          container,
          timeout: 30,
        }
      )
    }
  )

  FeatureTestSuite.test(
    "The `TransactionDetail` component passes the correct props to the `TransactionCard` component," +
      " which correctly renders the `transaction` data",
    async (ctx) => {
      const transaction = transactions[0]

      const { MockAppProvider } = ctx.createMockStateAndApp()

      const { container, queryAllByText, ComponentWithStaticRouteData } = await renderWithMSW(<MockAppProvider />, {
        route: `/transactions/${transaction.id}`,
      })

      assert.ok(container, "The `TransactionDetail` component should render without crashing.")

      await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
        container,
      })

      // check transaction id, category, and description exists
      const idInstances = queryAllByText(`Transaction #${transaction.id}`, { selector: "h3" })
      const categories = queryAllByText(transaction.category, { selector: "p.category" })
      const descriptions = queryAllByText(transaction.description, { selector: "p.description" })

      const tuples = [
        ["id", idInstances, "" + `Transaction #${transaction.id} in an ` + "`h3` element"],
        ["category", categories, "" + transaction.category + " in a `p` tag with the `className` of `category`"],
        [
          "description",
          descriptions,
          "" + transaction.description + " in a `p` tag with the `className` of `description`",
        ],
      ]

      for (const [label, nodeList, explanation] of tuples) {
        assert.ok(
          nodeList.length > 0,
          "The `TransactionDetail` component should pass the correct props to the `TransactionCard` component," +
            ` which should render the transaction ${label} of ${explanation}`
        )
      }
    }
  )

  FeatureTestSuite.test(
    "If no transaction exists for the `transactionId` found in the url, " +
      "then the page should display a `Not Found` error message.",
    async (ctx) => {
      const { MockAppProvider } = ctx.createMockStateAndApp()

      const { container, queryAllByText, ComponentWithStaticRouteData } = await renderWithMSW(<MockAppProvider />, {
        route: `/transactions/21`,
      })

      assert.ok(
        container,
        "The `TransactionDetail` component should render without crashing" +
          " even when the `transactionId` in the url doesn't correlate to a valid transaction."
      )

      await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
        container,
      })

      const notFoundMessages = queryAllByText("Not Found", { selector: "h1" })

      assert.ok(
        notFoundMessages.length > 0,
        "The page should display a `Not Found` error message  when the `transactionId` in the url doesn't correlate to a valid transaction."
      )
    }
  )

  return FeatureTestSuite.run()
}
