import { updateConfig } from "instant-noodles"
import * as serviceWorkerUtils from "./service-worker-utils"

// const config = { logger: true, debug: true }
const config = {}
updateConfig(config)

const worker = serviceWorkerUtils.worker
const workerWithRequests = serviceWorkerUtils.workerRequestCache
const prepareMockServiceWorker = serviceWorkerUtils.prepareMockServiceWorker
const sleep = serviceWorkerUtils.sleep
const noop = serviceWorkerUtils.noop

export { worker, workerWithRequests, config, prepareMockServiceWorker, sleep, noop }
