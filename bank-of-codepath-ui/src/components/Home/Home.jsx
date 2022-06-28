import * as React from 'react';
import { useEffect } from 'react';
import axios from 'axios';

import { API_PORT } from '../../../constants';
import AddTransaction from '../AddTransaction/AddTransaction';
import BankActivity from '../BankActivity/BankActivity';
import './Home.css';

export default function Home({
  transactions,
  setTransactions,
  transfers,
  setTransfers,
  error,
  setError,
  isLoading,
  setIsLoading,
  filterInputValue,
  isCreating,
  setIsCreating,
  newTransactionForm,
  setNewTransactionForm,
}) {
  useEffect(async () => {
    setIsLoading(true);
    
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:${API_PORT}/bank/transactions`
        );
        setTransactions(response.data.transactions);
      } catch (e) {
        setError(e);
        console.log('transaction error: ', e);
      }
    };

    const fetchTransfers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:${API_PORT}/bank/transfers`
        );
        setTransfers(response.data.transfers);
      } catch (e) {
        setError(e);
      }
    };

    fetchTransactions();
    await fetchTransfers();
    setIsLoading(false);
  }, []);

  const handleOnSubmitNewTransaction = async (e) => {};

  let filteredTransactions = transactions;

  if (filterInputValue) {
    filteredTransactions = transactions.filter((trans) => {
      return trans.description
        .toLowerCase()
        .contains(filterInputValue.toLowerCase());
    });
  }

  return (
    <div className="home">
      <AddTransaction
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        form={newTransactionForm}
        setForm={setNewTransactionForm}
        handleOnSubmit={handleOnSubmitNewTransaction}
      />
      {error && <h2>{error}</h2>}
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <BankActivity transactions={filteredTransactions} />
      )}
    </div>
  );
}
