import * as React from 'react';
import './FilterInput.css';

export default function FilterInput({ inputValue, handleOnChange }) {
  return (
    <div className="filter-input">
      <i className="material-icons">search</i>
      <input
        value={inputValue}
        onChange={handleOnChange}
        type="text"
        placeholder="Search transactions"
      />
    </div>
  );
}
