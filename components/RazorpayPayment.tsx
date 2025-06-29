import { Platform, Alert } from 'react-native';

// Payment response interface
export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

// Razorpay options interface
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

// Subscription plan interface
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

// Global Razorpay declaration for web
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
      // For mobile platforms in development, show simulation
      Alert.alert(
        'Payment Simulation',
        'In a production app with Expo Dev Client or EAS Build, this would open the native Razorpay payment interface.\n\nFor now, we\'ll simulate the payment flow.',
        [
          {
            text: 'Simulate Success',
            onPress: () => {
              // Simulate successful payment
              setTimeout(() => {
                onSuccess({
                  razorpay_payment_id: 'pay_sim_' + Date.now(),
                  razorpay_order_id: 'order_sim_' + Date.now(),
                  razorpay_signature: 'sig_sim_' + Date.now(),
                });
              }, 1000);
            },
          },
          {
            text: 'Simulate Failure',
            onPress: () => {
              onError(new Error('Payment failed - User cancelled'));
            },
            style: 'destructive',
          },
          {
            text: 'Cancel',
            onPress: () => onError(new Error('Payment cancelled by user')),
            style: 'cancel',
          },
        ]
      );
      return true;
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

// Payment configuration
export const RAZORPAY_CONFIG = {
  // Test key for development - replace with your actual key
  key: Platform.OS === 'web' ? 'rzp_test_demo_key' : 'rzp_test_demo_key',
  company: {
    name: 'StockWise',
    logo: 'https://your-domain.com/logo.png',
    description: 'Premium Stock Trading Platform',
  },
  theme: {
    color: '#10B981',
  },
};

// Create order utility
export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  try {
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