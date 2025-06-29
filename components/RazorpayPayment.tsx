import { Platform, Alert } from 'react-native';

// For React Native (mobile)
let RazorpayCheckout: any = null;
if (Platform.OS !== 'web') {
  try {
    RazorpayCheckout = require('react-native-razorpay').default;
  } catch (error) {
    console.warn('Razorpay not available on this platform');
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler?: (response: PaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export class RazorpayPayment {
  private static loadScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (Platform.OS !== 'web') {
        resolve(false);
        return;
      }

      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  static async initializePayment(
    options: RazorpayOptions,
    onSuccess: (response: PaymentResponse) => void,
    onError: (error: any) => void
  ): Promise<boolean> {
    if (Platform.OS === 'web') {
      return this.initializeWebPayment(options, onSuccess, onError);
    } else {
      return this.initializeMobilePayment(options, onSuccess, onError);
    }
  }

  private static async initializeWebPayment(
    options: RazorpayOptions,
    onSuccess: (response: PaymentResponse) => void,
    onError: (error: any) => void
  ): Promise<boolean> {
    const scriptLoaded = await this.loadScript();
    if (!scriptLoaded) {
      onError(new Error('Failed to load Razorpay script'));
      return false;
    }

    try {
      const razorpayOptions = {
        ...options,
        handler: (response: PaymentResponse) => {
          onSuccess(response);
        },
        modal: {
          ondismiss: () => {
            onError(new Error('Payment cancelled by user'));
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
      return true;
    } catch (error) {
      onError(error);
      return false;
    }
  }

  private static async initializeMobilePayment(
    options: RazorpayOptions,
    onSuccess: (response: PaymentResponse) => void,
    onError: (error: any) => void
  ): Promise<boolean> {
    if (!RazorpayCheckout) {
      onError(new Error('Razorpay not available on this platform'));
      return false;
    }

    try {
      const razorpayOptions = {
        description: options.description,
        image: options.image || 'https://i.imgur.com/3g7nmJC.png',
        currency: options.currency,
        key: options.key,
        amount: options.amount,
        name: options.name,
        order_id: options.order_id,
        prefill: options.prefill || {},
        theme: options.theme || { color: '#10B981' },
      };

      const data = await RazorpayCheckout.open(razorpayOptions);
      onSuccess(data);
      return true;
    } catch (error: any) {
      if (error.code === 'payment_cancelled') {
        onError(new Error('Payment cancelled by user'));
      } else {
        onError(error);
      }
      return false;
    }
  }
}

// Utility function for formatting Indian currency
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Subscription plan types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  features: string[];
  popular?: boolean;
  savings?: number;
  razorpayPlanId?: string;
}

// Payment configuration
export const RAZORPAY_CONFIG = {
  // Replace with your actual Razorpay key
  key: Platform.OS === 'web' ? 'rzp_test_your_key_here' : 'rzp_test_your_key_here',
  company: {
    name: 'StockWise',
    logo: 'https://your-domain.com/logo.png',
    description: 'Premium Stock Trading Platform',
  },
  theme: {
    color: '#10B981',
  },
};

// Create order utility (you'll need to implement this on your backend)
export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  try {
    // This should call your backend API to create a Razorpay order
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const order = await response.json();
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Payment handler utility
export const createPaymentHandler = (
  onSuccess: (response: PaymentResponse) => void,
  onError?: (error: any) => void
) => {
  return {
    onSuccess,
    onError: onError || ((error: any) => {
      console.error('Payment error:', error);
      Alert.alert('Payment Failed', error.message || 'Something went wrong');
    }),
  };
};