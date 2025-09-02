export default function OrderCard({ order }) {
  return (
    <div className="order-card">
      <p><strong>Order ID:</strong> {order.order_id}</p>
      <p><strong>Amount:</strong> &#8377;{order.amount}</p>
      <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
    </div>
  );
}
