import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Swal from 'sweetalert2';

const PayPalPaymentButton = ({ 
  amount, 
  description, 
  onSuccess, 
  validate = () => true,
  disabled = false 
}) => {
  const paypalButtonConfig = {
    style: { 
      layout: "vertical",
      color: "gold",
      shape: "rect",
      label: "pay"
    },
    createOrder: (data, actions) => {
      if (!validate()) {
        return Promise.reject(new Error('Validation failed'));
      }
      
      return actions.order.create({
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: amount.toString()
          },
          description: description
        }],
        application_context: {
          shipping_preference: 'NO_SHIPPING'
        }
      });
    },
    onApprove: onSuccess,
    onError: (err) => {
      console.error('PayPal Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: 'There was an issue processing your payment. Please try again.',
        confirmButtonText: 'OK'
      });
    },
    onCancel: () => {
      Swal.fire({
        icon: 'info',
        title: 'Payment Cancelled',
        text: 'You have cancelled the payment process.',
        confirmButtonText: 'OK'
      });
    }
  };

  if (disabled) {
    return (
      <div className="form-warning">
        Please fill in all required fields to proceed with payment.
      </div>
    );
  }

  return (
    <PayPalScriptProvider 
      options={{
        "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture"
      }}
    >
      <PayPalButtons {...paypalButtonConfig} />
    </PayPalScriptProvider>
  );
};

export default PayPalPaymentButton; 