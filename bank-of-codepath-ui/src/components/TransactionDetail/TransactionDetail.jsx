import * as React from "react"
import { useState } from "react"
import { formatAmount, formatDate } from "../../utils/format"
import {fetchTransactionDetails} from '../../api'
import "./TransactionDetail.css"
import {Link} from "react-router-dom"
import { markPaidOff } from "../../api"

export default function TransactionDetail({match}) {
  const {id} = match.params
  const [transaction, setTransaction] = React.useState({})
  const[paidOffFlag, setPaidOffFlag]=useState(false)

  React.useEffect(()=>{
    if(id){
    fetchTransactionDetails(id).then((data)=> setTransaction(data.transaction))
    }else {
      alert("Invalid ID provided")
    }
  },[])

  function handlePaidOff(transactionId){
    const updatedTransactions= async() =>{
      try{
        const data = await markPaidOff(transactionId, !paidOffFlag);
        setTransaction(data.transaction)
        setPaidOffFlag(data.transaction.paidOffFlag);
      }
      catch(error){
        console.error('Error fetching transaction data:', error);
      }
     } 
     updatedTransactions();
  }

  return (
    <div className="transaction-detail">
      <TransactionCard transactionId={id} transaction={transaction} handlePaidOff={handlePaidOff}/>
    </div>
  )
}

export function TransactionCard({ transaction, transactionId, handlePaidOff }) {
  return (
    <div className="transaction-card card">
      <div className="card-header">
        <h3>Transaction #{transactionId}</h3>
        <p className="category">{transaction?.category}</p>
      </div>

      <div className="card-content">
        <p className="description">{transaction?.description}</p>
      </div>

      <div className="card-footer">
        <p className={`amount ${transaction.amount < 0 ? "minus" : ""}`}>{formatAmount(transaction.amount)}</p>
        <p className="date">{formatDate(transaction?.postedAt)}</p>
        <button className="markPaidOff" onClick={(e)=>handlePaidOff(transaction.id)} >
          {transaction.paidOffFlag===true ?
            <div >PAID</div> : <div> NOT PAID</div> 
}
          </button>
      </div>
      <button>
        <Link to={`/`}>
         Back
        </Link>
        </button>
    </div>
  )
}
