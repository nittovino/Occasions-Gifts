import { subDays } from 'date-fns';

export const kpiData = {
  todayOrders: 5,
  pendingOrders: 3,
  revenue: 2450.00,
  activeProducts: 12,
};

export const recentOrders = [
  { id: 'ORD-051', customer: 'John Doe', product: 'Roses Bouquet', amount: 45.99, status: 'Delivered', date: subDays(new Date(), 1) },
  { id: 'ORD-050', customer: 'Jane Smith', product: 'Gourmet Basket', amount: 89.50, status: 'Out for Delivery', date: new Date() },
  { id: 'ORD-049', customer: 'Alex Johnson', product: 'Wellness Box', amount: 65.00, status: 'Prepared', date: new Date() },
  { id: 'ORD-048', customer: 'Emily White', product: 'Birthday Cake', amount: 35.00, status: 'Accepted', date: new Date() },
  { id: 'ORD-047', customer: 'Michael Brown', product: 'Sympathy Flowers', amount: 75.00, status: 'Pending', date: new Date() },
  { id: 'ORD-046', customer: 'Sarah Green', product: 'Jewelry Box', amount: 120.00, status: 'Delivered', date: subDays(new Date(), 2) },
  { id: 'ORD-045', customer: 'David Black', product: 'Wine Selection', amount: 55.75, status: 'Cancelled', date: subDays(new Date(), 1) },
];

export const productsData = [
    // Will be filled in a future step
];

export const payoutsData = [
    // Will be filled in a future step
];