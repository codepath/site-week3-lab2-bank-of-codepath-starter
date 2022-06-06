import * as React from "react"
import { configureSpecSuiteWithUtils } from "./utils"

export function testApp(App) {
  const {
    assert,
    suite,
    // render,
    // renderWithMSW,
    noRouterRenderWithMSW,
    // fireEvent,
    // customQueries,
    waitFor,
    workerWithRequests,
  } = configureSpecSuiteWithUtils(App)

  const FeatureTestSuite = suite(`FEATURE 000: The \`App\` component`)

  FeatureTestSuite.before.each((ctx) => {
    workerWithRequests.initializeTestNameForFile("app", ctx.__test__)
  })

  FeatureTestSuite.after.each((ctx) => {
    workerWithRequests.updateAllRequestsForTest("app", ctx.__test__)
  })

  FeatureTestSuite.test("The App.jsx component exists and renders without crashing", async (ctx) => {
    const { container } = await noRouterRenderWithMSW(<App />)
    assert.ok(container, "The App.jsx component should render without crashing.")

    await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
      container,
    })
  })

  FeatureTestSuite.test(
    "The App.jsx component renders a `BrowserRouter` component inside the `div` tag with a `className` of `app`." +
      " The `Navbar` component and a `main` tag are nested inside the `BrowserRouter` component.",
    async (ctx) => {
      const { container, queryAllByText } = await noRouterRenderWithMSW(<App />)
      assert.ok(container, "The App.jsx component should render without crashing.")

      await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
        container,
      })

      const navComponent = container.querySelector(".app > nav")
      assert.ok(
        navComponent,
        "The App.jsx component should render a `nav` tag inside the `div` tag with a `className` of `app`."
      )

      const mainComponent = container.querySelector(".app > main")
      assert.ok(
        navComponent,
        "The App.jsx component should render a `main` tag inside the `div` tag with a `className` of `app`."
      )
    }
  )

  return FeatureTestSuite.run()
}
