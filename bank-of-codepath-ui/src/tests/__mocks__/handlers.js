import { rest } from "msw"
import * as transactionFixtures from "../__fixtures__/transactions"
import * as transferFixtures from "../__fixtures__/transfers"
import * as constants from "../../constants"

export const handlers = [
  // list transactions
  rest.get(`${constants.API_BASE_URL}/bank/transactions`, (req, res, ctx) => {
    return res(
      ctx.delay(1), // delay for 1 ms
      ctx.status(200),
      ctx.json({ transactions: [...transactionFixtures.listTransactionsSuccess] })
    )
  }),
  // list transfers
  rest.get(`${constants.API_BASE_URL}/bank/transfers`, (req, res, ctx) => {
    return res(
      ctx.delay(1), // delay for 1 ms
      ctx.status(200),
      ctx.json({ transfers: [...transferFixtures.listTransfersSuccess] })
    )
  }),
  // get transaction by id
  rest.get(`${constants.API_BASE_URL}/bank/transactions/:transactionId`, (req, res, ctx) => {
    const { transactionId } = req.params
    const transactionIdParam = Number(transactionId)
    const transaction = transactionFixtures.listTransactionsSuccess.find((t) => t.id === transactionIdParam) ?? null

    // doing this to prevent XHR logging errors in console that might confuse interns
    if (transactionIdParam === 21) {
      return res(
        ctx.delay(1), // delay for 1 ms
        ctx.status(200),
        ctx.json({ error: { status: 404, message: "Transaction not found" } })
      )
    }

    return res(
      ctx.delay(1), // delay for 1 ms
      ctx.status(transaction ? 200 : 404),
      ctx.json(
        transaction
          ? { transaction: transaction ?? null }
          : { error: { status: 404, message: "Transaction not found" } }
      )
    )
  }),
  // create transaction
  rest.post(`${constants.API_BASE_URL}/bank/transactions`, (req, res, ctx) => {
    const { transaction } = req.body
    return res(
      ctx.delay(1), // delay for 1 ms
      ctx.status(201),
      ctx.json({
        transaction: {
          ...transaction,
          id: transactionFixtures.listTransactionsSuccess.length,
          postedAt: new Date().toISOString(),
        },
      })
    )
  }),
]
