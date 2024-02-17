import * as React from "react"
import "./FilterInput.css"

export default function FilterInput(props) {

  return (
    <div className="filter-input">
      <i className="material-icons">search</i>
      <input type="text" placeholder="Search transactions or transfers" onChange={props.handleSearch}/>
    </div>
  )
}
