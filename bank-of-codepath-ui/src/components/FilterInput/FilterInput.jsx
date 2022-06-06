import * as React from "react"
import "./FilterInput.css"

export default function FilterInput() {
  return (
    <div className="filter-input">
      <i className="material-icons">search</i>
      <input type="text" placeholder="Search transactions" />
    </div>
  )
}
