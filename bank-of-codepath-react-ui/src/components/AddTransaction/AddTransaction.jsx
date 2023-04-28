import * as React from "react"
import "./AddTransaction.css"

export default function AddTransaction() {
  return (
    <div className="add-transaction">
      <h2>Add Transaction</h2>

      <AddTransactionForm />
    </div>
  )
}

export function AddTransactionForm() {
  return (
    <div className="form">
      <div className="fields">
        <div className="field">
          <label>Description</label>
          <input />
        </div>
        <div className="field">
          <label>Category</label>
          <input />
        </div>
        <div className="field half-flex">
          <label>Amount (cents)</label>
          <input />
        </div>

        <button className="btn add-transaction" type="submit">
          Add
        </button>
      </div>
    </div>
  )
}
