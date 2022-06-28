import * as React from 'react';
import './AddTransaction.css';

export default function AddTransaction(props) {
  const handleOnFormFieldChange = (change) => {
    console.log(change);
    if (change.target.name === 'category') {
      props.form({
        ...props.newTransactionForm,
        category: change.target.value,
      });
    } else if (change.target.name === 'description') {
      props.form({
        ...props.newTransactionForm,
        description: change.target.value,
      });
    } else {
      props.form({
        ...props.newTransactionForm,
        amount: change.target.value,
      });
    }
  };

  return (
    <div className="add-transaction">
      <h2>Add Transaction</h2>

      <AddTransactionForm
        handleOnFormFieldChange={handleOnFormFieldChange}
        handleOnSubmit={props.handleOnSubmit}
        form={props.form}
        isCreating={props.isCreating}
        setIsCreating={props.setIsCreating}
      />
    </div>
  );
}

export function AddTransactionForm({ handleOnFormFieldChange, form, ...props }) {
  console.log('props.form', form)
  return (
    <div className="form">
      <div className="fields">
        <div className="field">
          <label>Description</label>
          <input
            name="description"
            value={props.form.description}
            onChange={handleOnFormFieldChange}
          />
        </div>
        <div className="field">
          <label>Category</label>
          <input
            name="category"
            value={props.form.category}
            onChange={handleOnFormFieldChange}
          />
        </div>
        <div className="field half-flex">
          <label>Amount (cents)</label>
          <input
            name="amount"
            value={props.form.amount}
            type="number"
            onChange={handleOnFormFieldChange}
          />
        </div>

        <button className="btn add-transaction" type="submit">
          Add
        </button>
      </div>
    </div>
  );
}
