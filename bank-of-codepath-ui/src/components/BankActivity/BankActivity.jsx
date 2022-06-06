import * as React from "react"
import { formatDate, formatAmount } from "../../utils/format"
import "./BankActivity.css"

export default function BankActivity() {
  return (
    <div className="bank-activity">
      <h2>Transactions</h2>
      <div className="table">
        <div className="table-header table-row">
          <span className="col x4">Description</span>
          <span className="col x2">Category</span>
          <span className="col x2">Amount</span>
          <span className="col x15">Date</span>
        </div>
        {/* */}
      </div>

      <h2>Transfers</h2>
      <div className="table">
        <div className="table-header table-row">
          <span className="col x4">Memo</span>
          <span className="col x2">Recipient</span>
          <span className="col x2">Amount</span>
          <span className="col x15">Date</span>
        </div>
        {/* */}
      </div>
    </div>
  )
}

export function TransactionRow({ transaction = {} }) {
  return (
    <div className="table-row transaction-row">
      <span className="col x4">
        <Arrow amount={transaction.amount} />
        {transaction.description}
      </span>
      <span className="col x2">{transaction.category}</span>
      <span className="col x2">{formatAmount(transaction.amount)}</span>
      <span className="col x15">{formatDate(transaction.postedAt)}</span>
    </div>
  )
}

export function TransferRow({ transfer = {} }) {
  return (
    <div className="table-row transfer-row">
      <span className="col x4">
        <Arrow amount={transfer.amount} />
        {transfer.memo}
      </span>
      <span className="col x2">{transfer.recipientEmail}</span>
      <span className="col x2">{formatAmount(transfer.amount)}</span>
      <span className="col x15">{formatDate(transfer.postedAt)}</span>
    </div>
  )
}

const Arrow = ({ amount = null }) => {
  return (
    <svg width="22" height="21" viewBox="0 0 22 21" fill="none" className={`arrow ${amount < 0 ? "flip" : ""}`}>
      <path
        d="M5.8301 14.7583L16.1012 8.82833L15.1375 14.4192C15.0926 14.6809 15.1535 14.9498 15.3068 15.1666C15.4602 15.3834 15.6933 15.5304 15.9551 15.5753C16.2168 15.6202 16.4856 15.5593 16.7024 15.4059C16.9193 15.2526 17.0663 15.0194 17.1112 14.7577L18.4413 7.06156C18.4466 7.00341 18.4475 6.94495 18.4442 6.88665C18.4192 6.84335 18.4042 6.81737 18.4399 6.73907C18.4218 6.61711 18.3813 6.49954 18.3205 6.3923C18.258 6.286 18.1764 6.19217 18.0799 6.11553C18.0549 6.07223 18.0399 6.04625 17.9542 6.03795C17.9054 6.00593 17.8543 5.97755 17.8013 5.95304L10.4712 3.25689C10.3333 3.20614 10.1859 3.1864 10.0396 3.19905C9.89321 3.21171 9.75144 3.25646 9.62433 3.33012C9.42175 3.44655 9.26634 3.63024 9.18507 3.84931C9.13935 3.97264 9.11842 4.10378 9.12346 4.23521C9.1285 4.36665 9.15942 4.4958 9.21445 4.61527C9.26948 4.73473 9.34754 4.84217 9.44415 4.93142C9.54077 5.02068 9.65404 5.08999 9.77749 5.1354L15.1012 7.09628L4.8301 13.0263C4.60041 13.1589 4.43282 13.3773 4.36417 13.6335C4.29553 13.8897 4.33147 14.1626 4.46407 14.3923C4.59668 14.622 4.8151 14.7896 5.07128 14.8582C5.32746 14.9269 5.60041 14.8909 5.8301 14.7583Z"
        fill={amount < 0 ? "#FF0000" : "green"}
      />
    </svg>
  )
}
