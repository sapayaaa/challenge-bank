import { useState, useEffect } from 'react';
import './App.css';

function Transaction() {
  const [transactions, setTransactions] = useState([]); // Changed initial state to []
  const [searchTerm, setSearchTerm] = useState(''); // Added state variable for search term

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    fetch('https://my-json-server.typicode.com/sapayaaa/challenge-bank/transactions')
      .then((response) => response.json())
      .then((transactions) => setTransactions(transactions))
      .catch((error) => console.error('Error fetching transactions:', error.statusText));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const newTransaction = {
      date: form.date.value,
      description: form.description.value,
      category: form.category.value,
      amount: parseFloat(form.amount.value),
    };

    fetch('https://my-json-server.typicode.com/sapayaaa/challenge-bank/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTransaction),
    })
      .then((response) => response.json())
      .then((createdTransaction) => {
        // Update transactions state directly with the new transaction
        setTransactions([...transactions, createdTransaction]);
        form.reset();
      })
      .catch((error) => console.error('Error adding transaction:', error.statusText));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); // Set search term using state variable
  };

  const handleDelete = (id) => {
    fetch(`https://my-json-server.typicode.com/sapayaaa/challenge-bank/transactions/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        // Update transactions state by filtering out the deleted transaction
        setTransactions(transactions.filter((transaction) => transaction.id !== id));
      })
      .catch((error) => console.error('Error deleting transaction:', error.statusText));
  };

  let filteredTransactions = [];
  if (transactions.length > 0) {
    filteredTransactions = transactions.filter( // Use search term from state variable
      (transaction) =>
        transaction.description.toLowerCase().includes(searchTerm) ||
        transaction.category.toLowerCase().includes(searchTerm)
    );
  }

  return (
    <div className='app-container'>
      <h2>Add Transaction</h2>
      <form onSubmit={handleFormSubmit}>
        <input type="date" name="date" placeholder="Date" />
        <input type="text" name="description" placeholder="Description" />
        <input type="text" name="category" placeholder="Category" />
        <input type="number" name="amount" placeholder="Amount" />
        <button type="submit">ADD TRANSACTION</button>
      </form>
      <h2>Search Transactions</h2>
      <input type="text" placeholder="Search for transactions ..." onChange={handleSearch} />

      <h2>All Transactions</h2>
      <ol className="transaction-details">
        {filteredTransactions.length === 0 ? (
          <li>No transactions to display.</li>
        ) : (
          filteredTransactions.map((transaction) => (
            <li key={transaction.id}>
              <div className='transactions-list'>
                <span className='item'>{transaction.description}</span>
                <span className='item'>{transaction.category}</span>
                <span className='item'>{transaction.amount}</span>
                <button onClick={() => handleDelete(transaction.id)}>Delete</button>
              </div>
            </li>
          ))
        )}
      </ol>
    </div>
  );
}

export default Transaction;
