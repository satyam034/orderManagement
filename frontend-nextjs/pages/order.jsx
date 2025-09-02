import { useState, useEffect } from 'react';
import { createOrder } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function OrderPage() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
   const [token, setToken] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken) setToken(storedToken);
      else window.location.href = '/'; // redirect if no token
    }
  }, []);
  const handleCreateOrder = async () => {
    if (!amount) return setMessage('Enter order amount');
    const res = await createOrder(token, amount);
    if (res.ok) {
      setMessage(`Order created! Order ID: ${res.order_id}`);
      setAmount('');
    } else {
      setMessage('Failed to create order');
    }
  };

  return (
    <div className="page">
      <Header />
      <div className="card">
        <h2>Create Order</h2>
        {message && <p className="message">{message}</p>}
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleCreateOrder}>Place Order</button>
      </div>
      <Footer />
    </div>
  );
}
