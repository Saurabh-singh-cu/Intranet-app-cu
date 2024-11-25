import React, { useState } from 'react';
import './Payment.css';
import barcoder from "../../assets/images/barcode.jpeg"

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment submitted', { paymentMethod, cardNumber, expirationDate, cvv });
  };

  return (
    <div className="payment-container">
      <div className="payment-content">
        <div className="payment-header">
          <h1>Payment Gateway Design.</h1>
          <p>A simple and responsive payment checkout experience designed in Figma.</p>
        </div>
        <div className="payment-form">
          <h2>Payment</h2>
          <form onSubmit={handleSubmit}>
            <img src={barcoder} />
            <button type="submit" className="pay-button">Pay USD250.28</button>
          </form>
          <p className="terms">
            Your personal data will be used to process your order, support your
            experience throughout this website, and for other purposes
            described in our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;