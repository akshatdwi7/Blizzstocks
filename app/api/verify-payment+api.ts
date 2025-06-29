import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      plan_id,
      user_id 
    } = await request.json();

    // Verify the payment signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error('Razorpay secret not configured');
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified
      // In a real implementation, you would:
      // 1. Update user's subscription status in database
      // 2. Send confirmation email
      // 3. Log the transaction
      // 4. Activate premium features

      return Response.json({
        success: true,
        message: 'Payment verified successfully',
        subscription: {
          id: `sub_${Date.now()}`,
          user_id,
          plan_id,
          status: 'active',
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          created_at: new Date().toISOString(),
        },
      });
    } else {
      return Response.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return Response.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}