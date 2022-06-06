import * as React from "react"
import { configureSpecSuiteWithUtils } from "./utils"
import BankActivity from "../components/BankActivity/BankActivity"
import * as transactionFixtures from "./__fixtures__/transactions"
import * as transferFixtures from "./__fixtures__/transfers"

export function testBankActivity(App) {
  const {
    assert,
    suite,
    // render,
    renderWithMSW,
    RouterProvider,
    // fireEvent,
    customQueries,
    workerWithRequests,
  } = configureSpecSuiteWithUtils(App)

  const FeatureTestSuite = suite(`FEATURE 004: The \`BankActivity\` component`)

  FeatureTestSuite.before.each((ctx) => {
    workerWithRequests.initializeTestNameForFile("bankActivity", ctx.__test__)
  })

  FeatureTestSuite.after.each((ctx) => {
    workerWithRequests.updateAllRequestsForTest("bankActivity", ctx.__test__)
  })

  FeatureTestSuite.test("The `BankActivity.jsx` component exists and renders without crashing", async (ctx) => {
    const { container, queryAllByText } = await renderWithMSW(<BankActivity />)
    assert.ok(container, "The `BankActivity.jsx` component should render without crashing.")
  })

  FeatureTestSuite.test(
    "The `BankActivity.jsx` iterates over its `transactions` prop and renders a `TransactionRow` for each one.",
    async (ctx) => {
      const transactions = transactionFixtures.listTransactionsSuccess.slice()
      const MockComponent = () => <BankActivity transactions={transactions} />

      const testInstances = ctx.getTestInstancesForRoot({
        RootComponent: () => (
          <RouterProvider>
            <MockComponent />
          </RouterProvider>
        ),
        singleComponentNames: ["BankActivity"],
        multiComponentNames: ["TransactionRow", "TransferRow"],
      })

      const transactionRowPropAssertions = testInstances.propAssertions?.TransactionRow ?? []
      assert.equal(
        transactionRowPropAssertions?.length,
        transactions.length,
        "The `BankActivity.jsx` component should render a `TransactionRow` component for each transaction in its `transactions` prop array." +
          " That component should render JSX wrapped by an element with the `className` of `transaction-row`."
      )

      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i]
        testInstances.propAssertions?.TransactionRow[i].assertComponentExistsAndHasPropWithValue(
          "transaction",
          transaction
        )
      }
    }
  )

  FeatureTestSuite.test(
    "The `BankActivity.jsx` iterates over its `transfers` prop and renders a `TransferRow` for each one.",
    async (ctx) => {
      const transfers = transferFixtures.listTransfersSuccess.slice()
      const MockComponent = () => <BankActivity transfers={transfers} />

      const testInstances = ctx.getTestInstancesForRoot({
        RootComponent: () => (
          <RouterProvider>
            <MockComponent />
          </RouterProvider>
        ),
        singleComponentNames: ["BankActivity"],
        multiComponentNames: ["TransactionRow", "TransferRow"],
      })

      assert.equal(
        testInstances.TransferRow?.length ?? 0,
        transfers.length,
        "The `BankActivity.jsx` component should render a `TransferRow` component for each transfer in its `transfers` prop array." +
          " That component should render JSX wrapped by an element with the `className` of `transfer-row`."
      )

      const transferRowPropAssertions = testInstances.propAssertions?.TransferRow ?? []
      assert.equal(
        transferRowPropAssertions?.length,
        transfers.length,
        "The `BankActivity.jsx` component should render a `TransferRow` component for each transfer in its `transfers` prop array." +
          " That component should render JSX wrapped by an element with the `className` of `transfer-row`."
      )

      for (let i = 0; i < transfers.length; i++) {
        const transfer = transfers[i]
        testInstances.propAssertions?.TransferRow[i].assertComponentExistsAndHasPropWithValue("transfer", transfer)
      }

      const { container, queryAllByText } = await renderWithMSW(<MockComponent />)
      assert.ok(container, "The `BankActivity.jsx` component should render without crashing.")

      const transferRows = customQueries.getTransferRows(container)
      assert.equal(
        Array.from(transferRows).length,
        transfers.length,
        "The `BankActivity.jsx` component should render a `TransferRow` component for each transfer in its `transfers` prop array." +
          " That component should render JSX wrapped by an element with the `className` of `transfer-row`."
      )
    }
  )

  FeatureTestSuite.test(
    "The `TransactionRow` component in the `BankActivity.jsx` file renders JSX" +
      " wrapped by a `Link` component from `react-router-dom` that links to the correct transaction detail page",
    async (ctx) => {
      const transactions = transactionFixtures.listTransactionsSuccess.slice(1)
      const MockComponent = () => <BankActivity transactions={transactions} />

      const testInstances = ctx.getTestInstancesForRoot({
        RootComponent: () => (
          <RouterProvider>
            <MockComponent />
          </RouterProvider>
        ),
        singleComponentNames: ["BankActivity"],
        multiComponentNames: ["TransactionRow", "TransferRow", "Link"],
      })

      assert.equal(
        testInstances.TransactionRow?.length ?? 0,
        transactions.length,
        "The `BankActivity.jsx` component should render a `TransactionRow` component for each transaction in its `transactions` prop array." +
          " That component should render JSX wrapped by an element with the `className` of `transaction-row`."
      )

      assert.equal(
        testInstances.Link?.length ?? 0,
        transactions.length,
        "The `BankActivity.jsx` component should render a `TransactionRow` component for each transaction in its `transactions` prop array." +
          " That component should render JSX wrapped by a `Link` component from `react-router-dom` with the `className` of `transaction-row`."
      )

      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i]
        testInstances.propAssertions?.TransactionRow[i].assertComponentExistsAndHasPropWithValue(
          "transaction",
          transaction
        )
        testInstances.propAssertions?.Link[i].assertComponentExistsAndHasPropWithValue(
          "to",
          `/transactions/${transaction.id}`
        )
      }
    }
  )

  FeatureTestSuite.test(
    "Clicking on the `TransactionRow` component redirects to the `TransactionDetail` page",
    async (ctx) => {
      const transactions = transactionFixtures.listTransactionsSuccess.slice(1)

      const { container } = await renderWithMSW(<BankActivity transactions={transactions} />)
      assert.ok(container, "The BankActivity.jsx component should render without crashing.")

      const transactionRows = customQueries.getTransactionRows(container)

      assert.equal(
        Array.from(transactionRows).length,
        transactions.length,
        "The `BankActivity.jsx` component should render a `TransactionRow` component for each transaction in its `transactions` prop array." +
          " That component should render JSX wrapped by an element with the `className` of `transaction-row`."
      )

      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i]
        const el = customQueries.getTransactionRows(container)?.[i]
        const hrefAttr = el?.getAttribute?.("href")
        assert.equal(
          hrefAttr,
          `/transactions/${transaction.id}`,
          "Clicking on the transaction row should navigate to the correct transactions detail route." +
            ` Expected to be routed to the \`/transactions/${transaction.id}\` route. [ACTUAL: ${hrefAttr}]`
        )
      }
    }
  )

  return FeatureTestSuite.run()
}
