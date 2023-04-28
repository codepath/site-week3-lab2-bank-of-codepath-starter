import * as React from "react"
import AddTransaction from "../AddTransaction/AddTransaction"
import BankActivity from "../BankActivity/BankActivity"
import "./Home.css"

export default function Home() {
  return (
    <div className="home">
      <AddTransaction />
      <BankActivity />
    </div>
  )
}
