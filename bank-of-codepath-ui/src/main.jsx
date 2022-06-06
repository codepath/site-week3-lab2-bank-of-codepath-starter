import * as React from "react"
import * as ReactDOM from "react-dom"
import { InstantNoodles } from "instant-noodles"
import App from "./components/App/App"
import "./globals.css"

import { prepareMockServiceWorker, config } from "./tests/setup"
import { testApp } from "./tests/feature-000-app.test"
import { testNavbar } from "./tests/feature-001-navbar.test"
import { testHome } from "./tests/feature-002-home.test"
import { testAddTransaction } from "./tests/feature-003-add-transaction.test"
import { testBankActivity } from "./tests/feature-004-bank-activity.test"
import { testTransactionDetail } from "./tests/feature-005-transaction-detail.test"

const tests = {
  app: testApp,
  navbar: testNavbar,
  home: testHome,
  addTransaction: testAddTransaction,
  bankActivity: testBankActivity,
  transactionDetail: testTransactionDetail,
}

const renderApp = () =>
  ReactDOM.render(
    <React.StrictMode>
      <App />
      {/* Leave this here for live test environment */}
      <InstantNoodles RootComponent={App} tests={tests} config={config} />
    </React.StrictMode>,
    document.getElementById("root")
  )

/* Comment out this next line to run against live Express API */
prepareMockServiceWorker().then(() => renderApp())
/* Uncomment this next line to run against live Express API */
// renderApp()
