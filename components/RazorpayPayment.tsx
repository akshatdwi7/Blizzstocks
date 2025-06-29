import { Platform } from 'react-native';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
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

  static async initializePayment(options: RazorpayOptions): Promise<boolean> {
    if (Platform.OS !== 'web') {
      console.warn('Razorpay is only supported on web platform');
      return false;
    }

    const scriptLoaded = await this.loadScript();
    if (!scriptLoaded) {
      console.error('Failed to load Razorpay script');
      return false;
    }

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      return true;
    } catch (error) {
      console.error('Razorpay initialization failed:', error);
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
}

// Payment response type
export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

// Payment handler utility
export const createPaymentHandler = (
  onSuccess: (response: PaymentResponse) => void,
  onError?: (error: any) => void
) => {
  return {
    handler: (response: PaymentResponse) => {
      onSuccess(response);
    },
    modal: {
      ondismiss: () => {
        console.log('Payment modal dismissed');
      },
    },
  };
};