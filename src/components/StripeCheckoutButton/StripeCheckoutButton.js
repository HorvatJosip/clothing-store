import React from 'react';
import StripeCheckout from 'react-stripe-checkout';

const StripeCheckoutButton = ({ price }) => {
  const onToken = token => {
    console.log(token);
    alert('Payment Successful!');
  };

  const priceForStripe = price * 100;
  const publishableKey = 'pk_test_UHFychOlrQIzD8Vf267WOwoq00Mbl9ZxvK';

  return (
    <StripeCheckout
      label='Pay Now'
      name='Clothing Store'
      billingAddress
      shippingAddress
      image='https://svgshare.com/i/CUz.svg'
      description={`Your total is $${price}`}
      amount={priceForStripe}
      panelLabel='Pay Now'
      token={onToken}
      stripeKey={publishableKey}
    />
  );
};

export default StripeCheckoutButton;
