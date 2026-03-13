import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, ShieldCheck, Lock, CheckCircle, Smartphone } from 'lucide-react';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [errors, setErrors] = useState<any>({});
  
  // Get amount from location state
  const amount = location.state?.amount || 50;
  
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });

  const validateCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    return cleaned.length === 16 && /^\d+$/.test(cleaned);
  };

  const validateExpiry = (value: string) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(value)) return false;
    
    const [month, year] = value.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  };

  const validateCVV = (value: string) => {
    return value.length === 3 && /^\d+$/.test(value);
  };

  const validateUPI = (value: string) => {
    const regex = /^[\w.-]+@[\w.-]+$/;
    return regex.test(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      // Allow only numbers and limit to 16 digits
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 16) {
        formattedValue = cleaned.replace(/(\d{4})/g, '$1 ').trim();
      } else {
        return;
      }
    } else if (name === 'expiry') {
      // Format as MM/YY
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 4) {
        if (cleaned.length >= 2) {
          formattedValue = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        } else {
          formattedValue = cleaned;
        }
      } else {
        return;
      }
    } else if (name === 'cvv') {
      // Allow only 3 digits
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 3) {
        formattedValue = cleaned;
      } else {
        return;
      }
    }

    setFormData({ ...formData, [name]: formattedValue });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (paymentMethod === 'card') {
      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
      if (!validateCardNumber(formData.cardNumber)) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      if (!validateExpiry(formData.expiry)) {
        newErrors.expiry = 'Invalid expiry date (MM/YY)';
      }
      if (!validateCVV(formData.cvv)) {
        newErrors.cvv = 'CVV must be 3 digits';
      }
    } else {
      if (!validateUPI(formData.upiId)) {
        newErrors.upiId = 'Invalid UPI ID format';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-in zoom-in-95">
        <div className="bg-emerald-100 p-6 rounded-full mb-6">
          <CheckCircle className="w-16 h-16 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
        <p className="text-slate-500 mb-8 max-w-sm">Your appointment is now confirmed. We've sent the details to your email.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Secure Checkout</h1>
        <p className="text-slate-500">MediFusion uses bank-level encryption to protect your data.</p>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6 flex gap-4">
        <button
          type="button"
          onClick={() => setPaymentMethod('card')}
          className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 ${
            paymentMethod === 'card'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-300'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>Card Payment</span>
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod('upi')}
          className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 ${
            paymentMethod === 'upi'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-300'
          }`}
        >
          <Smartphone className="w-5 h-5" />
          <span>UPI Payment</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {paymentMethod === 'card' ? (
              <CreditCard className="w-6 h-6 text-blue-600" />
            ) : (
              <Smartphone className="w-6 h-6 text-blue-600" />
            )}
            <span className="font-bold text-slate-800">
              {paymentMethod === 'card' ? 'Card Details' : 'UPI Details'}
            </span>
          </div>
          {paymentMethod === 'card' && (
            <div className="flex space-x-2">
              <div className="w-8 h-5 bg-slate-200 rounded"></div>
              <div className="w-8 h-5 bg-slate-200 rounded"></div>
              <div className="w-8 h-5 bg-slate-200 rounded"></div>
            </div>
          )}
        </div>

        <form onSubmit={handlePay} className="p-8 space-y-6">
          {paymentMethod === 'card' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cardholder Name</label>
                <input 
                  type="text" 
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  placeholder="John Doe" 
                  className={`w-full px-4 py-3 bg-slate-50 border ${errors.cardholderName ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900`}
                  required
                />
                {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Card Number (16 digits)</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456" 
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${errors.cardNumber ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900`}
                    required
                  />
                </div>
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Expiry (MM/YY)</label>
                  <input 
                    type="text" 
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="12/25" 
                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.expiry ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900`}
                    required
                  />
                  {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">CVV (3 digits)</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123" 
                      maxLength={3}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.cvv ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900`}
                      required
                    />
                  </div>
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">UPI ID</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleInputChange}
                  placeholder="yourname@paytm" 
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${errors.upiId ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900`}
                  required
                />
              </div>
              {errors.upiId && <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>}
              <p className="text-xs text-slate-400 mt-2">Enter your UPI ID (e.g., yourname@paytm, yourname@gpay)</p>
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 flex flex-col items-center">
            <div className="flex justify-between w-full mb-6">
              <span className="font-semibold text-slate-500">Amount Due</span>
              <span className="text-2xl font-bold text-slate-900">${amount}.00</span>
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-lg disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Pay ${amount}.00 Securely</span>
                </>
              )}
            </button>
            <p className="mt-4 text-[10px] text-slate-400 flex items-center">
              <Lock className="w-3 h-3 mr-1" /> Secure SSL Encryption Enabled
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
