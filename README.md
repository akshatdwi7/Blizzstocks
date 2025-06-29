# StockWise Trading App

A premium stock trading and analysis platform built with Expo and React Native.

## Features

- 📊 Real-time stock data and charts
- 🔍 Advanced stock screening tools
- 🤖 AI-powered market insights
- 💰 Premium subscription with Razorpay integration
- 📱 Cross-platform (iOS, Android, Web)

## Development Setup

### Prerequisites

- Node.js 18+ 
- Expo CLI
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd stockwise-trading-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Payment Integration

This app uses Razorpay for payment processing. Here's how it works:

### For Web Platform
- Razorpay Checkout script is loaded dynamically
- Full payment flow works in browser
- Test mode uses demo credentials

### For Mobile Platforms (Development)
- Payment simulation for development/testing
- For production, you need to:
  1. Create an Expo Dev Client build
  2. Add native Razorpay SDK
  3. Configure proper credentials

### Production Setup

To enable real payments on mobile:

1. **Create Development Build:**
```bash
npx expo install expo-dev-client
npx expo run:ios
# or
npx expo run:android
```

2. **Add Razorpay Native SDK:**
```bash
npx expo install react-native-razorpay
```

3. **Configure Credentials:**
   - Add your Razorpay API keys to environment variables
   - Update `RAZORPAY_CONFIG` in `components/RazorpayPayment.tsx`

4. **Build for Production:**
```bash
eas build --platform all
```

## Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
EXPO_PUBLIC_API_URL=your_api_url
```

## Project Structure

```
├── app/                    # App routes (Expo Router)
│   ├── (tabs)/            # Tab navigation
│   ├── api/               # API routes
│   └── premium/           # Premium subscription flows
├── components/            # Reusable components
├── contexts/              # React contexts (Theme, etc.)
├── hooks/                 # Custom hooks
└── data/                  # Mock data and types
```

## Key Components

- **RazorpayPayment**: Handles payment processing across platforms
- **StockCard**: Displays stock information
- **RealTimeChart**: Live stock price charts
- **ThemeContext**: Dark/light theme management

## API Routes

- `POST /api/create-order` - Creates Razorpay order
- `POST /api/verify-payment` - Verifies payment signature

## Deployment

### Web
```bash
npm run build:web
```

### Mobile (EAS Build)
```bash
eas build --platform all
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details