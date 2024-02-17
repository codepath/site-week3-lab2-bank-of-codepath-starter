import * as React from "react"
import "./AddTransfers.css"
import { API_BASE_URL } from "../../constants"
import { formatDate } from "../../utils/format"
import { v4 as uuidv4 } from 'uuid';
import {createTransfers} from "../../api"
import { useRef } from "react";

export default function AddTransfer(props) {
  return (
    <div className="add-transfer">
      <h2>Add Transfer</h2>

      <AddTransferForm transferFromServer={props.transferFromServer}  setTransferFromServer={props.setTransferFromServer}/>
    </div>
  )
}

export function AddTransferForm(props) {
  const formRef = useRef(null);

  const submitHandle=(e)=>{
    e.preventDefault();
    let formObject = {
      postedAt: new Date(),
      id: uuidv4()
    }
    const formData = new FormData(e.currentTarget) 
    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }
   
    createTransfers(formObject).then(data=>{
      console.log("data.transfer : ",data.transfer)
      if(props.transferFromServer){
        props.setTransferFromServer(prevState=>[...prevState, data.transfer])
      }
    }
    
    );
    formRef.current.reset();

   
  }
  return (
    <div className="form">
      <form className="fields" ref={formRef} onSubmit={submitHandle}>
        <div className="field">
          <label htmlFor="memo">Memo</label>
          <input id="memo" name="memo" type="text" />
        </div>
        <div className="field">
          <label htmlFor="recipientEmail">Recipient</label>
          <input  id="recipientEmail" name="recipientEmail" type="text"/>
        </div>
        <div className="field half-flex">
          <label htmlFor="amount">Amount (cents)</label>
          <input  id="amount" name="amount" type="text"/>
        </div>

        <button className="btn add-transfer" type="submit" >
          Add
        </button>
      </form>
    </div>
  )
}
