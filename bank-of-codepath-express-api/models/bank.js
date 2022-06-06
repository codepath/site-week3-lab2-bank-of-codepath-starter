const { BadRequestError } = require("../utils/errors")
const { storage } = require("../data/storage")

class Bank {
  static async listTransactions() {
    // list all items in the transactions array
    const transactions = storage.get("transactions").value()
    return transactions
  }

  static async listTransfers() {
    // list all items in the transfers array
    const transfers = storage.get("transfers").value()
    return transfers
  }

  static async fetchTransactionById(transactionId) {
    // fetch a single transaction
    const transaction = storage
      .get("transactions")
      .find({ id: Number(transactionId) })
      .value()
    return transaction
  }

  static async fetchTransferById(transferId) {
    // fetch a single transfer
    const transfer = storage
      .get("transfers")
      .find({ id: Number(transferId) })
      .value()
    return transfer
  }

  static async recordTransaction(transaction) {
    // create a new transaction

    if (!transaction) {
      throw new BadRequestError(`No transaction sent.`)
    }
    const requiredFields = ["description", "category", "amount"]
    requiredFields.forEach((field) => {
      if (!transaction[field] && transaction[field] !== 0) {
        throw new BadRequestError(`Field: "${field}" is required in transaction`)
      }
    })

    const transactions = await Bank.listTransactions()
    const transactionId = transactions.length + 1
    const postedAt = new Date().toISOString()

    const newTransaction = { id: transactionId, postedAt, ...transaction }

    storage.get("transactions").push(newTransaction).write()

    return newTransaction
  }

  static async recordTransfer(transfer) {
    // create a new transfer

    if (!transfer) {
      throw new BadRequestError(`No transfer sent.`)
    }
    const requiredFields = ["recipientEmail", "memo", "amount"]
    requiredFields.forEach((field) => {
      if (!transfer[field] && transaction[field] !== 0) {
        throw new BadRequestError(`Field: "${field}" is required in transfer`)
      }
    })

    const transfers = await Bank.listTransfers()
    const transferId = transfers.length + 1
    const postedAt = new Date().toISOString()

    const newTransfer = { id: transferId, postedAt, ...transfer }

    storage.get("transfers").push(newTransfer).write()

    return newTransfer
  }
}

module.exports = Bank
