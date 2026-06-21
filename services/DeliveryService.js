export const DELIVERY_FEES = {
  standard: { EUR: 5, USD: 5.5, GBP: 4.5 },
  express: { EUR: 12, USD: 13, GBP: 10.5 },
  pickup_shop: { EUR: 0, USD: 0, GBP: 0 },
  pickup_location: { EUR: 2, USD: 2.2, GBP: 1.8 }
};

export const DeliveryService = {
  getDeliveryFees() {
    return DELIVERY_FEES;
  },

  getDeliveryFee(method, currency = 'EUR') {
    const fees = DELIVERY_FEES[method];
    if (!fees) return 0;
    return fees[currency] || fees['EUR'];
  },

  calculateTotal(subtotal, method, currency = 'EUR') {
    const fee = this.getDeliveryFee(method, currency);
    return subtotal + fee;
  },

  validateDeliveryMethod(method) {
    return Object.keys(DELIVERY_FEES).includes(method);
  },

  validatePickupLocation(address) {
    if (!address) return false;
    const len = address.trim().length;
    return len >= 2 && len <= 50;
  }
};