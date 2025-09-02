import { useEffect, useState } from 'react';
import { getOrderHistory } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrderCard from '../components/OrderCard';

export default function HistoryPage() {
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Run only on client
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        window.location.href = '/'; // redirect if no token
        return;
      }
      setToken(storedToken);

      // fetch orders
      async function fetchOrders() {
        const res = await getOrderHistory(storedToken);
        setOrders(res);
      }
      fetchOrders();
    }
  }, []);

  return (
    <div className="page">
      <Header />
      <div className="card">
        <h2>Order History</h2>
        {orders.length === 0 && <p>No orders yet.</p>}
        {orders.map((order) => (
          <OrderCard key={order.order_id} order={order} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
