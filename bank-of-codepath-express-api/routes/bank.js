const express = require("express")
const Bank = require("../models/bank")
const { NotFoundError } = require("../utils/errors")
const router = express.Router()

// list all transactions
router.get("/transactions", async (req, res, next) => {
  try {
    const transactions = await Bank.listTransactions()
    res.status(200).json({ transactions })
  } catch (err) {
    next(err)
  }
})

// create new transaction
router.post("/transactions", async (req, res, next) => {
  try {
    const transaction = req.body.transaction
    const newTransaction = await Bank.recordTransaction(transaction)
    res.status(201).json({ transaction: newTransaction })
  } catch (err) {
    next(err)
  }
})

// fetch single transaction
router.get("/transactions/:transactionId", async (req, res, next) => {
  try {
    const transactionId = req.params.transactionId
    const transaction = await Bank.fetchTransactionById(transactionId)
    if (!transaction) {
      throw new NotFoundError("Transaction not found")
    }
    res.status(200).json({ transaction })
  } catch (err) {
    next(err)
  }
})

// list all transfers
router.get("/transfers", async (req, res, next) => {
  try {
    const transfers = await Bank.listTransfers()
    res.status(200).json({ transfers })
  } catch (err) {
    next(err)
  }
})

// create a new transfer
router.post("/transfers", async (req, res, next) => {
  try {
    const transfer = req.body.transfer
    const newTransfer = await Bank.recordTransfer(transfer)
    res.status(201).json({ transfer: newTransfer })
  } catch (err) {
    next(err)
  }
})

// fetch single transfer
router.get("/transfers/:transferId", async (req, res, next) => {
  try {
    const transferId = req.params.transferId
    const transfer = await Bank.fetchTransferById(transferId)
    if (!transfer) {
      throw new NotFoundError("Transfer not found")
    }
    res.status(200).json({ transfer })
  } catch (err) {
    next(err)
  }
})

module.exports = router
