'use client';

import { useState } from 'react';
import StripeTokenCheckout from './stripe';
import MPesaPayment from './Mpesa';
import PayPalTokenCheckout from './Paypal';
import useExchangeRate from '../hooks/useExchangeRate';
import { CreditCard, Phone, HelpCircle, AlertCircle, CheckCircle, Edit2, PlaySquare } from 'lucide-react';

// Custom UI components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-0 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`font-bold text-xl text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-gray-500 dark:text-gray-400 mt-1 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Tabs = ({ children, className = "" }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

const TabsList = ({ children, className = "" }) => (
  <div className={`flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 ${className}`}>
    {children}
  </div>
);

const TabsTrigger = ({ children, value, activeValue, onSelect, className = "" }) => {
  const isActive = activeValue === value;
  return (
    <button 
      className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-colors
                ${isActive 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'} 
                ${className}`}
      onClick={() => onSelect(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, activeValue, className = "" }) => {
  if (value !== activeValue) return null;
  return (
    <div className={className}>
      {children}
    </div>
  );
};

const PaymentSupportPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [amountUSD, setAmountUSD] = useState(20);
  const [customAmount, setCustomAmount] = useState(false);
  const [tempAmount, setTempAmount] = useState('20');
  
  // Use the exchange rate hook
  const { rate, loading: rateLoading } = useExchangeRate();
  const USD_TO_KES_RATE = rate || 133; // Fallback to 133 if rate is null

  const getProcessingAmount = () => {
    if (paymentMethod === 'card') {
      return amountUSD * 100; // Stripe requires cents
    } else if (paymentMethod === 'mpesa') {
      return Math.round(amountUSD * USD_TO_KES_RATE); // Convert to KES
    } else if (paymentMethod === 'paypal') {
      return amountUSD; // PayPal amount
    }
  };

  const handleStripeSuccess = (details) => {
    setPaymentSuccess(true);
    setTransactionId(details.transaction_id);
  };

  const handleMPesaSuccess = (details) => {
    setPaymentSuccess(true);
    setTransactionId(details.transaction_id);
  };

  const handlePaymentCancel = (error) => {
    console.error('Payment cancelled:', error);
  };

  const resetPaymentState = () => {
    setPaymentSuccess(false);
    setTransactionId('');
  };

  const handleTabChange = (value) => {
    setPaymentMethod(value);
  };

  const amountOptions = [5, 10, 20, 50, 100];

  const selectAmount = (amount) => {
    setAmountUSD(amount);
    setCustomAmount(false);
  };

  const toggleCustomAmount = () => {
    setCustomAmount(!customAmount);
    if (!customAmount) {
      setTempAmount(amountUSD.toString());
    }
  };

  const handleCustomAmountChange = (e) => {
    setTempAmount(e.target.value);
  };

  const applyCustomAmount = () => {
    const amount = parseFloat(tempAmount);
    if (!isNaN(amount) && amount > 0) {
      setAmountUSD(amount);
      setCustomAmount(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyCustomAmount();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Payment Portal</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Choose your preferred payment method to continue</p>
        </div>

        {paymentSuccess ? (
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl">Payment Successful</CardTitle>
              <CardDescription>Your transaction has been completed successfully.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                  <span className="font-medium">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium">
                    {paymentMethod === 'card' 
                      ? `$${amountUSD.toFixed(2)} USD`
                      : `KES ${Math.round(amountUSD * USD_TO_KES_RATE)}`}
                  </span>
                </div>
              </div>
              <button
                onClick={resetPaymentState}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Make Another Payment
              </button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Amount Selection Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Payment Amount</CardTitle>
                <CardDescription>
                  {rateLoading ? "Loading exchange rate..." : `Current rate: 1 USD ≈ ${USD_TO_KES_RATE} KES`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {amountOptions.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => selectAmount(amount)}
                        className={`py-2 px-3 rounded-md text-sm font-medium transition-colors 
                                  ${amountUSD === amount && !customAmount
                                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                  }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  {customAmount ? (
                    <div className="flex items-center">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={tempAmount}
                          onChange={handleCustomAmountChange}
                          onKeyPress={handleKeyPress}
                          className="w-full pl-8 pr-20 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter amount"
                          min="1"
                          step="0.01"
                          autoFocus
                        />
                        <span className="absolute right-3 top-2 text-gray-500">USD</span>
                      </div>
                      <button
                        onClick={applyCustomAmount}
                        className="ml-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={toggleCustomAmount}
                      className="flex items-center justify-center w-full py-2 px-3 rounded-md text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Enter Custom Amount
                    </button>
                  )}
                </div>

                <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Selected Amount:</span>
                    <div className="text-right">
                      <div className="font-bold text-lg text-blue-700 dark:text-blue-300">
                        ${amountUSD.toFixed(2)} USD
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ≈ KES {Math.round(amountUSD * USD_TO_KES_RATE)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Tabs */}
            <Tabs value={paymentMethod} onValueChange={handleTabChange} className="mb-8">
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                <TabsTrigger 
                  value="card" 
                  activeValue={paymentMethod}
                  onSelect={handleTabChange}
                  className="flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card Payment</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="mpesa" 
                  activeValue={paymentMethod}
                  onSelect={handleTabChange}
                  className="flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>M-Pesa</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="paypal" 
                  activeValue={paymentMethod}
                  onSelect={handleTabChange}
                  className="flex items-center justify-center gap-2"
                >
                  <PlaySquare className="w-4 h-4" />
                  <span>PayPal</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" activeValue={paymentMethod} className="mt-6">
                <StripeTokenCheckout
                  amount={getProcessingAmount()}
                  currency="usd"
                  description={`Technical Support Payment - $${amountUSD.toFixed(2)} USD`}
                  onSuccess={handleStripeSuccess}
                  onCancel={handlePaymentCancel}
                />
              </TabsContent>

              <TabsContent value="mpesa" activeValue={paymentMethod} className="mt-6">
                <div className="flex justify-center">
                  <MPesaPayment
                    amount={getProcessingAmount()}
                    propertyTitle={`Technical Support Payment - KES ${Math.round(amountUSD * USD_TO_KES_RATE)}`}
                    onSuccess={handleMPesaSuccess}
                    onCancel={handlePaymentCancel}
                    readOnlyAmount={true}
                  />
                </div>
              </TabsContent>

              <TabsContent value="paypal" activeValue={paymentMethod} className="mt-6">
                <div className="flex justify-center">
                  <PayPalTokenCheckout
                    amount={getProcessingAmount()}
                    currency="usd"
                    description={`Technical Support Payment - $${amountUSD.toFixed(2)} USD`}
                    onSuccess={handleMPesaSuccess}
                    onCancel={handlePaymentCancel}
                    clientId={process.env.NEXT_PUBLIC_PAYPAL_PUBLISHABLE_KEY}
                    readOnlyAmount={true}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-lg">Payment Help & FAQ</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Accepted Payment Methods</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    We accept all major credit/debit cards, M-Pesa, and PayPal payments.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Is my payment secure?</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    All payments are processed securely through our PCI-compliant payment processors.
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Having trouble?</h3>
                      <p className="text-yellow-700 dark:text-yellow-200 text-sm mt-1">
                        Contact support at support@example.com or call +254 700 000 000
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSupportPage;