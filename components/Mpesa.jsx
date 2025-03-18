// Code for the Mpesa component
import React, { useState, useEffect } from 'react';

// Helper function to detect dark mode
const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
};

// Custom Icons
const Icons = {
  CreditCard: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  ),
  Phone: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  DollarSign: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" x2="12" y1="2" y2="22"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  CheckCircle: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  XCircle: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" x2="9" y1="9" y2="15"/>
      <line x1="9" x2="15" y1="9" y2="15"/>
    </svg>
  ),
  Loader: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" {...props}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
  RefreshCw: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 2v6h-6"/>
      <path d="M3 12a9 9 0 0 1 15-6.7l3-3"/>
      <path d="M3 22v-6h6"/>
      <path d="M21 12a9 9 0 0 1-15 6.7l-3 3"/>
    </svg>
  )
};

// Custom Button Component
const Button = ({ 
  children, 
  onClick, 
  disabled, 
  variant = 'primary', 
  className = '', 
  type = 'button' 
}) => {
  const baseStyles = `
    inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium 
    transition-colors focus-visible:outline-none focus-visible:ring-1 
    focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
  `;
  
  const variants = {
    primary: `
      bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 
      text-white shadow-sm
    `,
    outline: `
      border border-gray-300 bg-white hover:bg-gray-100 text-gray-700
      dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200
    `
  };
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Custom Input Component
const Input = ({ 
  type = 'text', 
  id, 
  value, 
  onChange, 
  placeholder, 
  disabled,
  className = '' 
}) => {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
        placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 
        disabled:cursor-not-allowed disabled:opacity-50
        dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500
        dark:focus:ring-green-400 ${className}
      `}
    />
  );
};

// Custom Label Component
const Label = ({ htmlFor, children, className = '' }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
    >
      {children}
    </label>
  );
};

// Custom Alert Component
const Alert = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const variants = {
    default: `bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200`,
    success: `bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300`,
    error: `bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300`,
    warning: `bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`,
    info: `bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`
  };
  
  return (
    <div className={`rounded-md p-4 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// MPesa Payment Component
const MPesaPayment = ({ 
  amount: initialAmount = '', 
  onSuccess, 
  onCancel, 
  propertyTitle,
  readOnlyAmount = false  // Add a prop to control if amount is editable
}) => {
  const [amount, setAmount] = useState(initialAmount.toString());
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, pending, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [checkoutId, setCheckoutId] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const isDarkMode = useDarkMode();

  // Function to handle payment initiation
  const handlePayment = async () => {
    // Validate inputs
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid amount');
      setStatus('error');
      return;
    }

    if (!phoneNumber || !/^(?:254|\+254|0)([7-9][0-9]{8})$/.test(phoneNumber)) {
      setErrorMessage('Please enter a valid Kenyan phone number');
      setStatus('error');
      return;
    }

    // Normalize phone number to format expected by M-Pesa API
    let normalizedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      normalizedPhone = '254' + phoneNumber.substring(1);
    } else if (phoneNumber.startsWith('+')) {
      normalizedPhone = phoneNumber.substring(1);
    }

    setLoading(true);
    setStatus('pending');
    setErrorMessage('');

    try {
      const response = await fetch('/apis/payments/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          phone_number: normalizedPhone,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setStatus('success');
        setCheckoutId(data.checkout_request_id);
        // Start polling for payment status
        checkPaymentStatus(data.checkout_request_id);
      } else {
        setStatus('error');
        setErrorMessage(data.detail || 'Failed to initiate payment. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to check payment status
  const checkPaymentStatus = async (id, onSuccess) => {
    setCheckingStatus(true);
  
    const statusInterval = setInterval(async () => {
      try {
        const response = await fetch(`/apis/payments/mpesa/status/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
  
        const data = await response.json();
        console.log('Payment status:', data);
  
        if (response.status === 200) {
          if (data.message === 'STK query successful') {
            clearInterval(statusInterval);
            setPaymentVerified(true);
            setCheckingStatus(false);
            if (onSuccess && typeof onSuccess === 'function') {
              onSuccess({ transaction_id: id, amount });
            }
          }
        } else if (response.status === 400) {
          clearInterval(statusInterval);
          setStatus('error');
  
          // Map backend errors to user-friendly messages
          let errorMsg = data.message || 'Payment failed. Please try again.';
  
          if (errorMsg.includes('timeout')) {
            errorMsg = 'Your payment request timed out. Please try again.';
          } else if (errorMsg.includes('canceled')) {
            errorMsg = 'You canceled the payment. Please initiate a new request.';
          } else if (errorMsg.includes('Insufficient balance')) {
            errorMsg = 'You do not have enough balance to complete this transaction.';
          } else if (errorMsg.includes('expired')) {
            errorMsg = 'Your payment request has expired. Please start a new request.';
          } else if (errorMsg.includes('Invalid initiator')) {
            errorMsg = 'There was an issue with the payment request. Contact support.';
          } else if (errorMsg.includes('Transaction already in process')) {
            errorMsg = 'A transaction is already in process for this number.';
          }
  
          setErrorMessage(errorMsg);
          setCheckingStatus(false);
        }
      } catch (error) {
        console.error('Network error while checking payment status:', error);
        setStatus('error');
        setErrorMessage('Network error. Please check your internet connection and try again.');
        setCheckingStatus(false);
        clearInterval(statusInterval);
      }
    }, 5000);
  
    // Stop polling after 2 minutes if payment is not completed or failed
    setTimeout(() => {
      clearInterval(statusInterval);
      if (!paymentVerified && status !== 'error') {
        setCheckingStatus(false);
        setStatus('error');
        setErrorMessage(
          'Payment verification timed out. If you completed the payment, contact support with your M-Pesa reference.'
        );
      }
    }, 120000);
  };
    
  const resetForm = () => {
    setStatus('idle');
    setErrorMessage('');
    setPaymentVerified(false);
    setCheckoutId('');
    // Only reset amount if it's not a fixed value from props
    if (!readOnlyAmount) {
      setAmount('');
    }
    setPhoneNumber('');
    
    // Call onCancel callback if provided
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      {/* Gradient Top Bar */}
      <div className="h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
      
      {!paymentVerified ? (
        <div>
          {/* Header */}
          <div className="px-6 py-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/50">
                <Icons.CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center">M-Pesa Payment</h2>
            {propertyTitle && (
              <p className="text-md text-center font-medium mt-1">
                {propertyTitle}
              </p>
            )}
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1">
              Fast, secure payments via M-Pesa
            </p>
          </div>
          
          {/* Form */}
          <div className="px-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <Icons.DollarSign className="h-4 w-4" />
                Amount (KES)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => !readOnlyAmount && setAmount(e.target.value)}
                disabled={loading || status === 'success' || checkingStatus || readOnlyAmount}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Icons.Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="text"
                placeholder="e.g. 07XXXXXXXX or 254XXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading || status === 'success' || checkingStatus}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Format: 07XXXXXXXX or 254XXXXXXXXX
              </p>
            </div>

            {status === 'error' && (
              <Alert variant="error" className="flex gap-2">
                <Icons.XCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Error</h3>
                  <p className="text-sm">{errorMessage}</p>
                </div>
              </Alert>
            )}

            {status === 'success' && !checkingStatus && (
              <Alert variant="info" className="flex gap-2">
                <Icons.CheckCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Payment Initiated</h3>
                  <p className="text-sm">
                    Please check your phone and enter your M-Pesa PIN to complete payment.
                  </p>
                </div>
              </Alert>
            )}

            {checkingStatus && (
              <Alert variant="warning" className="flex gap-2">
                <Icons.Loader className="h-5 w-5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Verifying Payment</h3>
                  <p className="text-sm">
                    We're confirming your payment. This may take a moment...
                  </p>
                </div>
              </Alert>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-6 py-6 mt-4">
            {status === 'error' ? (
              <Button variant="outline" onClick={resetForm} className="w-full">
                Try Again
              </Button>
            ) : (
              <Button 
                onClick={handlePayment}
                disabled={loading || status === 'success' || checkingStatus}
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Icons.Loader className="mr-2 h-4 w-4" />
                    Processing...
                  </span>
                ) : status === 'success' || checkingStatus ? (
                  <span className="flex items-center justify-center">
                    <Icons.RefreshCw className="mr-2 h-4 w-4" />
                    Waiting for M-Pesa...
                  </span>
                ) : (
                  'Pay Now'
                )}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Success Header */}
          <div className="px-6 pt-8 pb-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/50">
                <Icons.CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-green-600 dark:text-green-400">
              Payment Successful
            </h2>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1">
              Your payment has been successfully processed
            </p>
          </div>
          
          {/* Transaction Details */}
          <div className="px-6 space-y-4">
            <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transaction ID</p>
              <p className="font-medium">{checkoutId}</p>
            </div>
            
            <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount Paid</p>
              <p className="font-medium">KES {amount}</p>
            </div>
            
            <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
              <p className="font-medium">{phoneNumber}</p>
            </div>
            
            {propertyTitle && (
              <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment For</p>
                <p className="font-medium">{propertyTitle}</p>
              </div>
            )}
            
            <Alert variant="success" className="mt-6 text-center">
              A receipt has been sent to your email address.
            </Alert>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-6 mt-4">
            <Button onClick={resetForm} className="w-full">
              Make Another Payment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MPesaPayment;