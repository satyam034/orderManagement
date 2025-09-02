export function generateOrderId(): string {
  const ts = Date.now();
  const rand = Math.floor(Math.random()*1000);
  return `order_${ts}_${rand}`;
}
