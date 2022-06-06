import * as React from "react"
import { MockStateContext } from "instant-noodles"
import axios from "axios"
import { configureSpecSuiteWithUtils } from "./utils"
import Navbar from "../components/Navbar/Navbar"
import * as transactionFixtures from "./__fixtures__/transactions"
import { sleep } from "./service-worker-utils"

const transactions = transactionFixtures.listTransactionsSuccess.slice()

export function testNavbar(App) {
  const {
    assert,
    suite,
    // render,
    renderWithMSW,
    fireEvent,
    customQueries,
    waitFor,
    // within,
    workerWithRequests,
  } = configureSpecSuiteWithUtils(App)

  const FeatureTestSuite = suite(`FEATURE 001: The \`Navbar\` component`)

  FeatureTestSuite.before((ctx) => {
    // console.log("[BEFORE]: Running test for Navbar.test.jsx")
    const testInstances = ctx.getTestInstancesForRoot({
      RootComponent: App,
      singleComponentNames: ["FilterInput", "Navbar", "Logo", "Link"],
    })
    ctx.testInstances = testInstances
  })

  FeatureTestSuite.beforeEach((ctx) => {
    ctx.sandbox.restore()
    ctx.axiosGetSpy = ctx.sandbox.spy(axios, "get")
    ctx.axiosPostSpy = ctx.sandbox.spy(axios, "post")
    workerWithRequests.initializeTestNameForFile("navbar", ctx.__test__)
  })

  FeatureTestSuite.after.each((ctx) => {
    ctx.sandbox.restore()
    workerWithRequests.updateAllRequestsForTest("navbar", ctx.__test__)
  })

  FeatureTestSuite.after((ctx) => {
    ctx.sandbox.restore()
    // console.log("[AFTER]: Finished running test for App.test.jsx")
  })

  FeatureTestSuite.test("The Navbar.jsx component exists and renders without crashing", async (ctx) => {
    const { container } = await renderWithMSW(
      <React.Fragment>
        <MockStateContext>{() => <Navbar />}</MockStateContext>
      </React.Fragment>
    )
    assert.ok(container, "The Navbar.jsx component should render without crashing.")
  })

  FeatureTestSuite.test("The Navbar.jsx component should receive the correct props", async (ctx) => {
    //
    ctx.testInstances.propAssertions.Navbar.assertComponentExistsAndHasProps()

    ctx.testInstances.propAssertions.Navbar.assertComponentExistsAndHasValueInProps("filterInputValue")
    ctx.testInstances.propAssertions.Navbar.assertComponentExistsAndHasValueInProps("setFilterInputValue")

    ctx.testInstances.propAssertions.Navbar.assertComponentExistsAndHasPropOfType("filterInputValue", "string")
    ctx.testInstances.propAssertions.Navbar.assertComponentExistsAndHasPropOfType("setFilterInputValue", "function")
  })

  FeatureTestSuite.test(
    "The Navbar.jsx component should render the `Logo` component and pass it a `path` prop." +
      " That path prop should be passed to a React Router `Link` component's `to` prop that navigates to the home route when clicked.",
    async (ctx) => {
      ctx.testInstances.propAssertions.Logo.assertComponentExistsAndHasProps()
      ctx.testInstances.propAssertions.Logo.assertComponentExistsAndHasValueInProps("path")
      ctx.testInstances.propAssertions.Logo.assertComponentExistsAndHasPropWithValue("path", "/")

      ctx.testInstances.propAssertions.Link.assertComponentExistsAndHasProps()
      ctx.testInstances.propAssertions.Link.assertComponentExistsAndHasValueInProps("to")
      ctx.testInstances.propAssertions.Link.assertComponentExistsAndHasPropWithValue("to", "/")
    }
  )

  FeatureTestSuite.test("Clicking on the `Logo` image should navigate to the home route.", async (ctx) => {
    //
    const transaction = transactions[0]
    //
    ctx.testInstances.propAssertions.Logo.assertComponentExistsAndHasProps()
    ctx.testInstances.propAssertions.Logo.assertComponentExistsAndHasValueInProps("path")
    ctx.testInstances.propAssertions.Logo.assertComponentExistsAndHasPropWithValue("path", "/")

    ctx.testInstances.propAssertions.Link.assertComponentExistsAndHasProps()
    ctx.testInstances.propAssertions.Link.assertComponentExistsAndHasValueInProps("to")
    ctx.testInstances.propAssertions.Link.assertComponentExistsAndHasPropWithValue("to", "/")

    const { MockAppProvider } = ctx.createMockStateAndApp()

    const { container, queryAllByText, ComponentWithStaticRouteData } = await renderWithMSW(<MockAppProvider />, {
      route: `/transactions/${transaction.id}`,
    })

    assert.ok(container, "The Navbar.jsx component should render without crashing.")

    await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
      container,
    })

    await waitFor(
      () => {
        const elements = queryAllByText(`Transaction #`, { exact: false })
        if (!elements.length)
          throw new Error(
            "The Browser Router should render a different page when navigating" +
              ` to the \`/transactions/${transaction.id}\` route.`
          )
      },
      {
        container,
      }
    )

    assert.ok(
      ComponentWithStaticRouteData.location.pathname === `/transactions/${transaction.id}`,
      `The Browser Router should render a different page when navigating to the \`/transactions/${transaction.id}\` route`
    )

    const logoImageLink = customQueries.getLogoLinkImage(container)

    assert.ok(
      logoImageLink,
      "The Navbar.jsx component should render the `Logo` component with an `img` element inside the link with a className of `logo`."
    )

    fireEvent.click(logoImageLink)

    await waitFor(
      () => {
        const elements = queryAllByText(`Add Transaction`, { exact: false })
        if (!elements.length) throw new Error("Clicking on the `Logo` component should navigate to the home page.")
      },
      {
        container,
      }
    )

    await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
      container,
    })

    assert.ok(
      ComponentWithStaticRouteData.location.pathname === "/",
      "Clicking on the `Logo` component should navigate to the home page. [ACTUAL]: " +
        ComponentWithStaticRouteData.location.pathname
    )

    await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
      container,
    })
  })

  FeatureTestSuite.test(
    "The `Navbar` component renders the `FilterInput` component and should pass it the `filterInputValue` and `handleOnInputChange` props",
    async (ctx) => {
      //
      ctx.testInstances.propAssertions.Navbar.assertComponentExistsAndHasProps()
      ctx.testInstances.propAssertions.FilterInput.assertComponentExistsAndHasProps()

      ctx.testInstances.propAssertions.Navbar.assertComponentExistsAndHasValueInProps("filterInputValue")
      ctx.testInstances.propAssertions.Navbar.assertComponentExistsAndHasValueInProps("setFilterInputValue")
      ctx.testInstances.propAssertions.Navbar.assertComponentExistsAndHasPropOfType("filterInputValue", "string")
      ctx.testInstances.propAssertions.Navbar.assertComponentExistsAndHasPropOfType("setFilterInputValue", "function")

      ctx.testInstances.propAssertions.FilterInput.assertComponentExistsAndHasPropOfType("inputValue", "string")
      ctx.testInstances.propAssertions.FilterInput.assertComponentExistsAndHasPropOfType("handleOnChange", "function")
    }
  )

  FeatureTestSuite.test(
    "The FilterInput.jsx component should call its `handleOnChange` prop whenever the input value changes." +
      " This should call the  `setFilterInputValue` function, which should update the `filterInputValue` state variable stored in the `App.jsx` component.",
    async (ctx) => {
      const { MockAppProvider, RoutedMockAppProvider } = ctx.createMockStateAndApp()

      const testInstances = ctx.getTestInstancesForRoot({
        RootComponent: RoutedMockAppProvider,
        singleComponentNames: ["FilterInput", "Navbar", "Logo", "Link"],
      })

      const { container, location, navigate, queryByPlaceholderText } = await renderWithMSW(<MockAppProvider />, {
        // route: "/transactions/6",
      })

      await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
        container,
        // timeout: 10,
      })

      testInstances.propAssertions.Navbar.assertComponentExistsAndHasPropOfType("filterInputValue", "string")
      testInstances.propAssertions.Navbar.assertComponentExistsAndHasPropOfType("setFilterInputValue", "function")

      testInstances.propAssertions.FilterInput.assertComponentExistsAndHasPropOfType("inputValue", "string")
      testInstances.propAssertions.FilterInput.assertComponentExistsAndHasPropOfType("handleOnChange", "function")

      const inputFiber = testInstances.root.find(
        (node) =>
          node?.type === "input" && node?.parent?.type === "div" && node?.parent?.parent?.type?.name === "FilterInput"
      )

      assert.ok(inputFiber, "The `FilterInput.jsx` component should render an `input` element inside a `div` element.")

      assert.equal(
        inputFiber?.props?.value,
        "",
        "The `FilterInput` component should have an `input` element with a `value` attribute initially set to an empty string." +
          ` [ACTUAL]: ${inputFiber?.props?.value}`
      )
      assert.type(
        inputFiber?.props?.onChange,
        "function",
        "The `input` element inside the `FilterInput.jsx` component should have an `onChange` prop that is a function."
      )
      assert.equal(
        testInstances.FilterInput?.props?.handleOnChange,
        inputFiber?.props?.onChange,
        "The `FilterInput.jsx` component should pass the `handleOnInputChange` prop to the `input` element as the `onChange` prop."
      )

      const filterInputEl = queryByPlaceholderText("Search transactions")
      assert.ok(
        filterInputEl,
        'The `FilterInput` component should render an `input` element with a placeholder text of "Search transactions".'
      )

      assert.equal(
        filterInputEl.value,
        "",
        "The `FilterInput` component should have an `input` element with a `value` attribute initially set to an empty string."
      )

      const newSearchValue = "coffee"

      fireEvent.change(filterInputEl, { target: { value: newSearchValue } })

      await sleep(15)

      assert.ok(
        ctx.MockState.__spies.setFilterInputValue.calledOnce,
        "The `setFilterInputValue` function should have been called when the `handleOnInputChange` function was called. It was not."
      )

      assert.equal(
        ctx.MockState.__spies.setFilterInputValue?.args?.[0]?.[0],
        newSearchValue,
        "The `setFilterInputValue` function should have been called with the new `value` from the `input` element when the `handleOnInputChange` function was called."
      )

      await waitFor(() => assert.ok(ctx.MockState.filterInputValue === newSearchValue), { timeout: 10 })
      assert.equal(
        ctx.MockState.filterInputValue,
        newSearchValue,
        `The \`filterInputValue\` state variable should have been updated to the new value entered into the input.` +
          ` [ACTUAL]: "${ctx.MockState.filterInputValue}"`
      )

      await waitFor(async () => assert.ok(await workerWithRequests.allRequestsForActiveTestsHaveBeenMocked()), {
        container,
      })
    }
  )

  return FeatureTestSuite.run()
}
