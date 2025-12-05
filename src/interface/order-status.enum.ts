export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Processing = 'processing',
  Shipping = 'shipping',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Đang chờ xử lý',
  [OrderStatus.Confirmed]: 'Đã xác nhận',
  [OrderStatus.Processing]: 'Đang xử lý',
  [OrderStatus.Shipping]: 'Đang giao hàng',
  [OrderStatus.Delivered]: 'Đã giao',
  [OrderStatus.Cancelled]: 'Đã hủy',
};
