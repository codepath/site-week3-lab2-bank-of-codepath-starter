import * as React from "react"
import AddTransaction from "../AddTransaction/AddTransaction"
import AddTransfer from "../AddTransfers/AddTransfers"
import BankActivity from "../BankActivity/BankActivity"
import "./Home.css"

export default function Home(props) {
  return (
    <div className="home">
      <AddTransaction transactionsFromServer={props.transactionsFromServer}  setTransactionsFromServer={props.setTransactionsFromServer}  />
      <AddTransfer transferFromServer={props.transferFromServer} setTransferFromServer={props.setTransferFromServer}/>
      <BankActivity enableFilteredList={props.enableFilteredList} filteredTransferListState={props.filteredTransferListState} filteredListState={props.filteredListState} transactionsFromServer={props.transactionsFromServer} setTransactionsFromServer={props.setTransactionsFromServer} setTotalBalance={props.setTotalBalance} transferFromServer={props.transferFromServer} setTransferFromServer={props.setTransferFromServer}x/>
    </div>
  )
}
