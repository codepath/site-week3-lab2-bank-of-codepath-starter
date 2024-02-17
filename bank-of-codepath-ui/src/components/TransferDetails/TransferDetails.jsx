import * as React from "react"
import { formatAmount, formatDate } from "../../utils/format"
import {fetchTransferDetails} from '../../api'
import "./TransferDetails.css"
import {Link} from "react-router-dom"

export default function TransferDetail({match}) {
  const {id} = match.params
  const [transfer, setTransfer] = React.useState({})

  React.useEffect(()=>{
    if(id){
    fetchTransferDetails(id).then((data)=> setTransfer(data.transfer))
    }else {
      alert("Invalid ID provided")
    }
  },[])

  return (
    <div className="transfer-detail">
      <TransferCard transferId={id} transfer={transfer}/>
    </div>
  )
}

export function TransferCard({ transfer, transferId }) {
  return (
    <div className="transfer-card card">
      <div className="card-header">
        <h3>Transfer #{transferId}</h3>
        <p className="category">{transfer?.recipientEmail}</p>
      </div>

      <div className="card-content">
        <p className="description">{transfer?.memo}</p>
      </div>

      <div className="card-footer">
        <p className={`amount ${transfer.amount < 0 ? "minus" : ""}`}>{formatAmount(transfer.amount)}</p>
        <p className="date">{formatDate(transfer?.postedAt)}</p>
      </div>
      <button>
        <Link to={`/`}>
         Back
        </Link>
        </button>
    </div>
  )
}
