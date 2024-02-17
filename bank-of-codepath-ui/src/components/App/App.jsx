import * as React from "react"
import {useState} from "react"
import Navbar from "../Navbar/Navbar"
import Home from "../Home/Home"
import "./App.css"
import { fetchTransactions } from "../../api"


export default function App() {
  const[transactionsFromServer, setTransactionsFromServer]=useState([]);
  const[enableFilteredList, setEnableFilteredList]=useState(false)
  const[filteredListState, setFilteredListState]=useState([])
  const[filteredTransferListState, setFilteredTransferListState]=useState([])
  const[totalBalance, setTotalBalance] =useState(0)
  const[transferFromServer, setTransferFromServer]=useState([])
  let sum=0;
  function handleSearch(e){
    const searchInput=e.target.value.toLowerCase();
    if(searchInput){   
      const filteredListTransaction= transactionsFromServer.filter(list=> {
        return list.category.toLowerCase().includes(searchInput) ||  list.description.toLowerCase().includes(searchInput)})
      setFilteredListState(filteredListTransaction)
      const filteredListTransfer= transferFromServer.filter(list=> {
        return list.memo.toLowerCase().includes(searchInput) ||  list.recipientEmail.toLowerCase().includes(searchInput)})
      setFilteredTransferListState(filteredListTransfer)
    
      setEnableFilteredList(true)
    }else{
      setEnableFilteredList(false)
    }
  }
  return (
    <div className="App">
      <Navbar handleSearch={handleSearch} totalBalance={totalBalance}/>
      <Home  transactionsFromServer={transactionsFromServer} setTransactionsFromServer={setTransactionsFromServer}
      enableFilteredList={enableFilteredList} filteredListState={filteredListState} setTotalBalance={setTotalBalance} transferFromServer={transferFromServer} setTransferFromServer={setTransferFromServer} filteredTransferListState={filteredTransferListState}/>
    </div>

  )
}
