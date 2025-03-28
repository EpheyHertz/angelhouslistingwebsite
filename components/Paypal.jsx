'use client'
import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { 
  Check, 
  AlertCircle, 
  Loader, 
  User, 
  Mail, 
  MapPin, 
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

const useInputState = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  return {
    value,
    onChange: (e) => setValue(e.target.value),
  };
};

const PayPalCheckoutForm = ({ 
  amount: propAmount, 
  currency: propCurrency = 'USD', 
  description, 
  onSuccess, 
  onCancel 
}) => {
  const [amount] = useState(propAmount || 19.99);
  const [currency] = useState(propCurrency);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  const name = useInputState();
  const email = useInputState();
  const address = useInputState();
  const city = useInputState();
  const state = useInputState();
  const postalCode = useInputState();

  const isValidForm = () => {
    return (
      name.value &&
      email.value &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
      address.value &&
      city.value &&
      state.value &&
      postalCode.value
    );
  };

  const createOrder = async () => {
    if (!isValidForm()) {
      setError('Please fill out all required fields');
      toast.error('Please fill out all required fields');
      throw new Error('Invalid form');
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/apis/payments/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          name: name.value,
          email: email.value,
          description: description || 'Payment',
          billingAddress: {
            street: address.value,
            city: city.value,
            state: state.value,
            postalCode: postalCode.value,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Order creation failed');
      }

      const orderData = await response.json();
      
      if (orderData.status === 'error') {
        throw new Error(orderData.message || 'Order creation failed');
      }

      // Ensure we're returning the correct order ID (should be EC-XXX)
      if (!orderData.data?.order_id || !orderData.data?.ec_token) {
        throw new Error('No order ID or EC Token returned from server');
      }

      return orderData.data?.ec_token // This should be the EC-XXX token
    } catch (err) {
      // console.error('Order creation error:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error(err.message || 'Order creation failed');
      setProcessing(false);
      if (typeof onCancel === 'function') onCancel(err);
      throw err;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      // console.log("Data:", data);
      // console.log("Actions:", actions);
      const response = await fetch('/apis/payments/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID: data.orderID, // This will be the PAYID-XXX
          email: email.value,
          payer_id:data.payerID,
          payment_id:data.paymentID,
}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment capture failed');
      }

      const captureData = await response.json();
      
      setSucceeded(true);
      setTransactionDetails({
        ...captureData,
        transaction_id: data.orderID,
      });
      
      if (typeof onSuccess === 'function') {
        onSuccess({
          ec_token: data.orderID,
          id: captureData.transaction_id,
          transaction_id:data.paymentID
        });
      }

      toast.success('Payment Successful!');
      return captureData;
    } catch (err) {
      console.error('Payment capture error:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error(err.message || 'Payment capture failed');
      if (typeof onCancel === 'function') onCancel(err);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <SuccessScreen 
        email={email.value}
        amount={amount}
        currency={currency}
        transactionId={transactionDetails?.transaction_id}
      />
    );
  }

  return (
    <CheckoutForm 
      description={description}
      error={error}
      isPending={isPending}
      isRejected={isRejected}
      isValidForm={isValidForm()}
      processing={processing}
      amount={amount}
      currency={currency}
      name={name}
      email={email}
      address={address}
      city={city}
      state={state}
      postalCode={postalCode}
      createOrder={createOrder}
      onApprove={onApprove}
    />
  );
};

const SuccessScreen = ({ email, amount, currency, transactionId }) => (
  <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-6">
        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Payment Successful!
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        A receipt has been sent to {email}
      </p>

      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Amount:</span>
          <span className="font-medium dark:text-white">
            {currency.toUpperCase() === "USD" ? `$${amount}` : `${amount} ${currency.toUpperCase()}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Transaction ID:</span>
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {transactionId}
          </span>
        </div>
      </div>

      <button
        onClick={() => (window.location.href = '/dashboard')}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        Return to Dashboard
      </button>
    </div>
  </div>
);

const CheckoutForm = ({
  description,
  error,
  isPending,
  isRejected,
  isValidForm,
  processing,
  amount,
  currency,
  name,
  email,
  address,
  city,
  state,
  postalCode,
  createOrder,
  onApprove
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    
    setIsDarkMode(darkModeQuery.matches);
    darkModeQuery.addEventListener('change', handleChange);
    
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PayPal Checkout</h1>
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
          <Lock className="w-5 h-5" />
          <span className="text-sm font-medium">Secure Payment</span>
        </div>
      </div>

      {description && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <span className="text-gray-700 dark:text-gray-300">{description}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-3" />
          <span className="text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      <form className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              Full Name
            </label>
            <input
              id="name"
              type="text"
              {...name}
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...email}
              placeholder="john.doe@example.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              Street Address
            </label>
            <input
              id="address"
              type="text"
              {...address}
              placeholder="123 Main St"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <input
                id="city"
                type="text"
                {...city}
                placeholder="San Francisco"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State
              </label>
              <input
                id="state"
                type="text"
                {...state}
                placeholder="CA"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Postal Code
              </label>
              <input
                id="postalCode"
                type="text"
                {...postalCode}
                placeholder="94105"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 dark:text-gray-300">Total:</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {currency.toUpperCase() === "USD" ? `$${amount}` : `${amount} ${currency.toUpperCase()}`}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            By continuing, you agree to our Terms of Service
          </p>
        </div>

        {isRejected ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-3 inline" />
            <span className="text-red-700 dark:text-red-300">
              Failed to load PayPal. Please refresh the page or try again later.
            </span>
          </div>
        ) : isPending ? (
          <div className="flex justify-center items-center p-4">
            <Loader className="animate-spin w-8 h-8 text-blue-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading PayPal...</span>
          </div>
        ) : (
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={(err) => {
              console.error('PayPal Error:', err);
              toast.error('An error occurred with PayPal');
            }}
            style={{
              layout: 'vertical',
              color: isDarkMode ? 'black' : 'blue',
              shape: 'rect',
              label: 'paypal'
            }}
            disabled={!isValidForm || processing}
          />
        )}
      </form>
    </div>
  );
};

export default function PayPalTokenCheckout({
  amount,
  currency = 'USD',
  description,
  onSuccess,
  onCancel,
  clientId
}) {
  const finalClientId = clientId || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!finalClientId) {
    return (
      <div className="dark:text-gray-200 text-red-500 p-4 bg-red-50 rounded-lg">
        PayPal Client ID is required. Please configure your environment variables.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: finalClientId,
        currency: currency.toUpperCase(),
        "data-sdk-integration-source": "integrationbuilder_sc"
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8 transition-colors">
        <PayPalCheckoutForm 
          amount={amount} 
          currency={currency}
          description={description}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>
    </PayPalScriptProvider>
  );
}