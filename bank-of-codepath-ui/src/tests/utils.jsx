import * as React from "react"
import * as sinon from "sinon"
import axios from "axios"
import {
  configureSpecSuite,
  MockStateContext as PureMockStateContext,
  MockState,
  specSuiteUtils,
} from "instant-noodles"
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom"
import { useLocation, useNavigate } from "react-router-dom"
import { worker, workerWithRequests, prepareMockServiceWorker, noop, sleep } from "./setup"

import Navbar from "../components/Navbar/Navbar"
import Home from "../components/Home/Home"
import TransactionDetail from "../components/TransactionDetail/TransactionDetail"

const expectedNavBarProps = ["filterInputValue", "setFilterInputValue"]
const createNavbarProps = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => expectedNavBarProps.includes(key)))
const createHomeProps = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => key === expectedNavBarProps[0] || !expectedNavBarProps.includes(key))
  )
const expectedAddTransactionProps = ["isCreating"]
const createAddTransactionProps = (mockState) => ({
  ...Object.fromEntries(Object.entries(mockState).filter(([key]) => expectedAddTransactionProps.includes(key))),
  form: mockState.newTransactionForm,
  setForm: mockState.setNewTransactionForm,
})
const alternateRoute = `transactions`
const composeAlternateRoute = (root) => `/${root}/:transactionId`

// some proxy props objects
const NavbarFnProps = {
  handleOnInputChange: noop,
}
const HomeFnProps = {
  setIsLoading: noop,
  setTransactions: noop,
  setTransfers: noop,
  setError: noop,
  setNewTransactionForm: noop,
}
const AddTransactionFnProps = {
  setForm: noop,
  handleOnSubmit: noop,
}

const pureMockAppRoutes = (s) => [
  { id: 1, path: "/", render: () => <Home {...createHomeProps(s)} /> },
  { id: 2, path: composeAlternateRoute(alternateRoute), render: () => <TransactionDetail /> },
]

const MockStateValues = {
  error: null,
  isLoading: false,
  isCreating: false,
  transactions: [],
  transfers: [],
  filterInputValue: "",
  newTransactionForm: {
    amount: 0,
    description: "",
    category: "",
  },
}
const MockStateHandlers = {
  setError(error) {
    this.__mockSetState(error, "error")
  },
  setIsLoading(isLoading) {
    this.__mockSetState(isLoading, "isLoading")
  },
  setIsCreating(isCreating) {
    this.__spies?.setIsCreating?.(isCreating)
    this.__mockSetState(isCreating, "isCreating")
  },
  setTransactions(transactions) {
    this.__mockSetState(transactions, "transactions")
  },
  setTransfers(transfers) {
    this.__mockSetState(transfers, "transfers")
  },
  setFilterInputValue(filterInputValue) {
    this.__spies?.setFilterInputValue?.(filterInputValue)
    this.__mockSetState(filterInputValue, "filterInputValue")
  },
  setNewTransactionForm(formOrFn) {
    this.__mockSetState(formOrFn, "newTransactionForm")
  },
  addTransaction(transactionOrFn) {
    this.setTransactions(transactionOrFn)
  },
  handleOnInputChange(e) {
    this.setFilterInputValue(e.target.value)
  },
}

const constructMockBuilder = (ctx) => {
  const mockStateInstance = new MockState(MockStateValues, MockStateHandlers)
  ctx.MockState = mockStateInstance.serialize()

  ctx.MockState.__spies = {
    setFilterInputValue: ctx.sandbox.spy(),
    setIsCreating: ctx.sandbox.spy(),
  }

  ctx.MockState.__reset = () => {
    for (let key in MockStateValues) {
      ctx.MockState[key] = MockStateValues[key]
    }
    for (let spyKey in ctx.MockState?.__spies ?? {}) {
      ctx.MockState.__spies?.[spyKey]?.resetHistory?.()
    }
  }

  const MockStateContext = ({ defaultMockState = ctx.MockState, ...props }) => (
    <PureMockStateContext defaultMockState={defaultMockState} {...props} />
  )

  const createMockStateAndApp = () => {
    // console.log("RESETTING MOCK STATE")
    ctx.MockState.__reset()

    const mapRouteToComponent = (props) => <Route key={props.id} {...props} />
    const constructRoutes = (routes) => (
      <Routes>{routes.map(({ render, ...route }) => mapRouteToComponent({ ...route, element: render() }))}</Routes>
    )

    function MockApp(props) {
      const { mockState } = props
      const routes = constructRoutes(pureMockAppRoutes(mockState))

      return (
        <React.Fragment>
          <Navbar {...createNavbarProps(mockState)} />
          {routes}
        </React.Fragment>
      )
    }

    function MockAppProvider() {
      return <MockStateContext>{({ mockState }) => <MockApp mockState={mockState} />}</MockStateContext>
    }

    function RoutedMockAppProvider() {
      return (
        <MemoryRouter>
          <MockAppProvider />
        </MemoryRouter>
      )
    }

    return {
      MockApp,
      MockAppProvider,
      RoutedMockAppProvider,
    }
  }

  ctx.createMockStateAndApp = createMockStateAndApp
}

export function configureSpecSuiteWithUtils(App) {
  const specSuite = configureSpecSuite()

  const {
    assert,
    suite,
    render,
    cleanup,
    fireEvent,
    prettyDOM,
    // queryHelpers,
    // buildQueries,
    reactTestRenderer,
    within,
    waitFor,
  } = specSuite

  const createRouterRenderer = (RouteWrapper) => {
    return (ui, { route = "/", log, ...options } = {}) => {
      function Wrap({ children }) {
        const currentLocation = useLocation()
        const navigate = useNavigate()

        React.useEffect(() => {
          Wrap.location = currentLocation
          Wrap.navigate = navigate
        })

        return <>{children}</>
      }

      let Wrapper

      if (options?.transactionRoute) {
        Wrapper = ({ children }) => (
          <RouteWrapper>
            <Wrap>
              <Routes>
                <Route path="/" element={<Home {...createHomeProps(ctx.MockState)} />} />
                <Route
                  path={composeAlternateRoute(alternateRoute)}
                  element={<React.Fragment>{children}</React.Fragment>}
                />
                <Route path="*" element={<h1>Not Found</h1>} />
              </Routes>
            </Wrap>
          </RouteWrapper>
        )
      } else {
        Wrapper = ({ children }) => (
          <RouteWrapper>
            <Wrap>{children}</Wrap>
          </RouteWrapper>
        )
      }

      return {
        ...render(ui, { wrapper: Wrapper, ...options }),
        ComponentWithStaticRouteData: Wrap,
      }
    }
  }

  const renderWithRouter = (ui, { route = "/", ...options } = {}) => {
    function RouteWrapper({ children }) {
      return <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    }
    return createRouterRenderer(RouteWrapper)(ui, { route, ...options })
  }

  function RouterProvider({ children }) {
    return <BrowserRouter>{children}</BrowserRouter>
  }

  const renderWithBrowserRouter = (ui, { route = "/", ...options } = {}) => {
    return createRouterRenderer(RouterProvider)(ui, { route, ...options })
  }

  const noRouterRenderWithMSW = async (...args) => {
    await prepareMockServiceWorker()
    return render(...args)
  }

  const renderWithMSW = async (...args) => {
    await prepareMockServiceWorker()
    return renderWithRouter(...args)
  }

  const renderWithMSWBrowserRouter = async (...args) => {
    await prepareMockServiceWorker()
    return renderWithBrowserRouter(...args)
  }

  const bootstrapTestSuiteContext = (ctx) => {
    ctx.sandbox = sinon.createSandbox()
    constructMockBuilder(ctx)

    // get endpoints
    ctx.listTransactionsEndpointRegex = new RegExp("bank/transactions/?$")
    ctx.listTransfersEndpointRegex = new RegExp("bank/transfers/?$")
    ctx.transactionDetailsEndpointRegex = new RegExp("bank/transactions/[0-9]+/?$")
    // post endpoints
    ctx.createTransactionEndpointRegex = new RegExp("bank/transactions/?$")

    // proxy props
    ctx.NavbarFnProps = NavbarFnProps
    ctx.HomeFnProps = HomeFnProps
    ctx.AddTransactionFnProps = AddTransactionFnProps

    ctx.getTestInstancesForRoot = (props) => specSuiteUtils.getTestInstancesForRoot(props, specSuite)

    workerWithRequests.updateAllRequestsForTest(
      "UNCLAIMED",
      ctx.__suite__ + "-" + workerWithRequests.UNCLAIMED_REQUEST_ID++
    )
  }

  const suiteWithHooks = (name) => {
    const FeatureSuite = suite(name)

    FeatureSuite.before((ctx) => {
      bootstrapTestSuiteContext(ctx)
      ctx.sandbox.restore()
    })

    FeatureSuite.beforeEach((ctx) => {
      ctx.sandbox.restore()
      ctx.axiosGetSpy = ctx.sandbox.spy(axios, "get")
      ctx.axiosPostSpy = ctx.sandbox.spy(axios, "post")
    })

    FeatureSuite.afterEach((ctx) => {
      ctx.sandbox.restore()
    })

    FeatureSuite.after((ctx) => {
      ctx.sandbox.restore()
      console.log("[AFTER]: Finished running test for suite: " + ctx.__suite__)
    })

    return FeatureSuite
  }

  const customQueries = {
    getLogoLink: (container) => container.querySelector("a.logo"),
    getLogoLinkImage: (container) => container.querySelector("a.logo img"),
    getTextInputWithinFilterInput: (container) => container.querySelector(".FilterInput input"),
    getTransactionRows: (container) => container.querySelectorAll(".transaction-row"),
    getTransferRows: (container) => container.querySelectorAll(".transfer-row"),
  }

  const advancedCustomQueries = {
    ...customQueries,
  }

  return {
    assert,
    // suite,
    suite: suiteWithHooks,
    render,
    renderWithRouter,
    renderWithMSW,
    noRouterRenderWithMSW,
    renderWithMSWBrowserRouter,
    RouterProvider,
    cleanup,
    fireEvent,
    customQueries: advancedCustomQueries,
    bootstrapTestSuiteContext,
    reactTestRenderer,
    within,
    waitFor,
    prettyDOM,
    // mock service worker
    worker,
    workerWithRequests,
  }
}

const buildProxy = (...args) => specSuiteUtils.buildProxy(...args)
export { sleep, buildProxy, createAddTransactionProps }
