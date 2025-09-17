import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );

    // 2) Redirect to Stripe Checkout
    const checkoutPageUrl = session.data.session.url;
    window.location.assign(checkoutPageUrl);
  } catch (err) {
    console.error('Booking failed:', err);
    showAlert('error', err);
  }
};
