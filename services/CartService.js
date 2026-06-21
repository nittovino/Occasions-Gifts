import { calculateMinDeliveryDate, isDateBeforeMinDate } from '@/utils/dateUtils';

export const CartService = {
  createCartItem(product, quantity, deliveryMethod, deliveryDate, preferredTimeWindow, pickupCity, pickupPostalCode, leadTimeDays = 1) {
    const validMethods = ['standard', 'express', 'pickup_shop', 'pickup_location'];
    const validWindows = ['morning', 'afternoon', 'evening', 'anytime'];

    if (!validMethods.includes(deliveryMethod)) {
      throw new Error(`Invalid delivery method: ${deliveryMethod}`);
    }

    if (!deliveryDate || isNaN(new Date(deliveryDate).getTime())) {
      throw new Error('Invalid delivery date');
    }

    const minDate = calculateMinDeliveryDate(leadTimeDays);
    if (isDateBeforeMinDate(deliveryDate, minDate)) {
      throw new Error('Delivery date is before product preparation time');
    }

    if (!validWindows.includes(preferredTimeWindow)) {
      throw new Error(`Invalid time window: ${preferredTimeWindow}`);
    }

    if (deliveryMethod === 'pickup_location') {
      if (!pickupCity || pickupCity.trim().length < 2) {
        throw new Error('City is required for pickup location and must be at least 2 characters');
      }
      if (!pickupPostalCode || pickupPostalCode.trim().length < 2) {
        throw new Error('Postal Code is required for pickup location and must be at least 2 characters');
      }
    }

    return {
      ...product,
      quantity,
      deliveryMethod,
      deliveryDate: new Date(deliveryDate).toISOString(),
      timeWindow: preferredTimeWindow,
      pickupCity: deliveryMethod === 'pickup_location' ? pickupCity : null,
      pickupPostalCode: deliveryMethod === 'pickup_location' ? pickupPostalCode : null,
      leadTimeDays: parseInt(leadTimeDays, 10)
    };
  }
};