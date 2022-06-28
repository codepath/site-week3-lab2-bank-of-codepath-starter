import * as React from 'react';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from '../Navbar/Navbar';
import Home from '../Home/Home';
import TransactionDetail from '../TransactionDetail/TransactionDetail';
import './App.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [error, setError] = useState(null);
  const [filterInputValue, setFilterValue] = useState("");

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transaction/:transactionId" element={<TransactionDetail />} />
          </Routes>
          <Home />
        </main>
      </BrowserRouter>
    </div>
  );
}
