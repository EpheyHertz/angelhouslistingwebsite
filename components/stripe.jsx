'use client'
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Check, AlertCircle, Loader, User, Mail, MapPin, Lock } from 'lucide-react';

const NEXT_PUBLIC_STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const useInputState = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  return { value, onChange: (e) => setValue(e.target.value) };
};

function CheckoutForm({ amount: propAmount, currency: propCurrency, description, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(propAmount || 1999);
  const [currency, setCurrency] = useState(propCurrency || 'usd');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Update state when props change
  useEffect(() => {
    if (propAmount) setAmount(propAmount);
    if (propCurrency) setCurrency(propCurrency);
  }, [propAmount, propCurrency]);

  // Check for dark mode preference
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    
    const handleChange = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleChange);
    
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  // Form state
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
      typeof email.value === 'string' &&
      email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
      address.value &&
      city.value &&
      state.value &&
      postalCode.value
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !isValidForm()) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, token } = await stripe.createToken(
        elements.getElement(CardNumberElement),
        {
          name: name.value,
          address_line1: address.value,
          address_city: city.value,
          address_state: state.value,
          address_zip: postalCode.value,
          address_country: 'Kenya',
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      const response = await fetch('/apis/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          name: name.value,
          city: city.value,
          currency,
          token: token.id,
          email: email.value,
          description: description || 'Payment',
          billingAddress: {
            street: address.value,
            state: state.value,
            postalCode: postalCode.value,
          },
        }),
      });

      const responseData = await response.json();
      // console.log('Payment Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Payment processing failed');
      }

      if (responseData.status === 'success') {
        setSucceeded(true);
        setTransactionDetails({
          ...responseData.data,
          last4: token.card.last4,
          brand: token.card.brand,
        });
        
        // Call the onSuccess callback if provided
        if (typeof onSuccess === 'function') {
          onSuccess({transaction_id:responseData.data.charge_id, id:responseData.data.transaction_id});
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An unexpected error occurred');
      
      // Call the onCancel callback if provided
      if (typeof onCancel === 'function') {
        onCancel(err);
      }
    } finally {
      setProcessing(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: isDarkMode ? '#e2e8f0' : '#1a202c',
        '::placeholder': { color: isDarkMode ? '#718096' : '#a0aec0' },
      },
      invalid: {
        color: '#e53e3e',
      },
    },
  };

  if (succeeded) {
    return (
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-6">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            A receipt has been sent to {email.value}
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Amount:</span>
              <span className="font-medium dark:text-white">{currency.toUpperCase() === "USD" ? `$${(amount).toFixed(2)}` : `${(amount).toFixed(2)}}`}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Card:</span>
              <span className="font-medium dark:text-white">
                **** **** **** {transactionDetails?.last4}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Transaction ID:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {transactionDetails?.charge_id}
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
  }

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h1>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Cardholder Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
              <input
                {...name}
                required
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:text-white transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
              <input
                {...email}
                required
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:text-white transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Street Address
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                <input
                  {...address}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:text-white transition-colors"
                  placeholder="123 Main St"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                City
              </label>
              <input
                {...city}
                required
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:text-white transition-colors"
                placeholder="New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                State
              </label>
              <input
                {...state}
                required
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:text-white transition-colors"
                placeholder="NY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                ZIP Code
              </label>
              <input
                {...postalCode}
                required
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:text-white transition-colors"
                placeholder="10001"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Card Details
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 space-y-3 bg-white dark:bg-gray-700 transition-colors">
              <div className="relative">
                <CreditCard className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                <CardNumberElement
                  options={elementOptions}
                  className="w-full pl-10 pr-4 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <CardExpiryElement
                    options={elementOptions}
                    className="w-full px-4 py-2"
                  />
                </div>
                <div className="relative">
                  <CardCvcElement
                    options={elementOptions}
                    className="w-full px-4 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 dark:text-gray-300">Total:</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
            {currency.toUpperCase() === "USD" ? `$${(amount).toFixed(2)}` : `${(amount).toFixed(2)} ${currency.toUpperCase()}`}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            By continuing, you agree to our Terms of Service
          </p>
        </div>

        <button
          type="submit"
          disabled={!stripe || processing || !isValidForm()}
          className={`w-full py-4 px-6 flex justify-center items-center rounded-lg text-white font-medium transition-all ${
            processing || !isValidForm()
              ? 'bg-blue-300 dark:bg-blue-700/50 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
          }`}
        >
          {processing ? (
            <>
              <Loader className="animate-spin w-5 h-5 mr-2" />
              Processing Payment...
            </>
          ) : (
            'Confirm Payment'
          )}
        </button>
      </form>
    </div>
  );
}

export default function StripeTokenCheckout({
  amount,
  currency,
  description,
  onSuccess,
  onCancel
}) {
  if (!stripePromise) {
    return <div className="dark:text-gray-200">Stripe.js could not be loaded</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <Elements stripe={stripePromise}>
        <CheckoutForm 
          amount={amount} 
          currency={currency} 
          description={description}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </Elements>
    </div>
  );
}