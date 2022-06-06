import { worker } from "./__mocks__/browser"

const noop = () => {}

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms))

class CachedWorkerRequests {
  constructor(worker) {
    this.worker = worker

    this.allRequests = new Map()
    this.mockedRequests = new Map()
    this.activeRequests = new Map()

    this.requestByFileAndTestName = {
      app: {},
      navbar: {},
      home: {},
      addTransaction: {},
      bankActivity: {},
      transactionDetail: {},
      UNCLAIMED: {},
    }
    this.UNCLAIMED_REQUEST_ID = 0

    worker.events.on("request:start", (req) => {
      const { id } = req
      // Store this request by id in an internal Map.
      const host = req.url.host
      if (host.startsWith("localhost:3001")) {
        const ts = new Date()
        this.activeRequests.set(id, { ...req, ts })
        this.allRequests.set(id, { ...req, ts })
      }
      // console.log(`${id} - ${req.method} ${req.url.pathname}`)
    })

    worker.events.on("response:mocked", (res, reqId) => {
      // Get a request associated with this response.
      const req = this.allRequests.get(reqId)
      this.mockedRequests.set(reqId, req)
    })
  }

  async allRequestsForActiveTestsHaveBeenMocked() {
    // ensure requests have had time to get kicked off
    await sleep(100)

    const pendingRequestIds = [...this.activeRequests.keys()]
    const allFulfilled = pendingRequestIds.every((reqId) => this.mockedRequests.has(reqId))

    // console.log({ pendingRequestIds, mockedRequestIds, allRequestIds, allFulfilled })
    // await sleep(10)
    return Promise.resolve(allFulfilled)
  }

  initializeTestNameForFile(fileName, testName) {
    if (!this.requestByFileAndTestName[fileName]) {
      this.requestByFileAndTestName[fileName] = {}
    }
    this.requestByFileAndTestName[fileName][testName] = this.requestByFileAndTestName[fileName][testName] ?? {}
  }

  updateRequestWithTestName(reqId, fileName, testName) {
    const req = this.allRequests.get(reqId)
    if (req) {
      if (this.requestByFileAndTestName?.[fileName]?.[testName]) {
        this.requestByFileAndTestName[fileName][testName][reqId] = this.truncateReq(req)
      }
      return
    }

    console.log(`Request not found for id ${reqId} with fileName ${fileName} and testName ${testName}`)
  }

  updateAllRequestsForTest(fileName, testName) {
    for (const [reqId, value] of this.activeRequests) {
      this.updateRequestWithTestName(reqId, fileName, testName)
    }

    this.reset()
  }

  getRequestsByFileSummary() {
    return this.requestByFileAndTestName
  }

  truncateReq(req) {
    return {
      method: req.method,
      pathname: req.url.pathname,
      href: req.url.href,
      ts: req.ts,
    }
  }

  resetAllRequests() {
    this.allRequests.clear()
  }

  resetMockedRequests() {
    this.mockedRequests.clear()
  }

  reset() {
    this.activeRequests.clear()
  }

  resetHard() {
    this.resetAllRequests()
    this.resetMockedRequests()
    this.reset()
  }

  getWorker() {
    return this.worker
  }
}

const workerRequestCache = new CachedWorkerRequests(worker)

let hasStarted = false
async function prepareMockServiceWorker(config = {}) {
  if (!hasStarted) {
    // const shouldLog = Boolean(config?.debug || config?.verbose)
    const startedWorker = await worker.start({
      // quiet: !shouldLog,
      quiet: true,
      onUnhandledRequest: "bypass",
    })
    hasStarted = true

    return startedWorker
  }

  return Promise.resolve()
}

export { worker, workerRequestCache, prepareMockServiceWorker, noop, sleep }
