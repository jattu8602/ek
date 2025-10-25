import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export default razorpay

// Helper function to create Razorpay order
export async function createRazorpayOrder(
  amount,
  currency = 'INR',
  receipt = null
) {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}

// Helper function to verify payment signature
export function verifyPaymentSignature(orderId, paymentId, signature) {
  try {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    return expectedSignature === signature
  } catch (error) {
    console.error('Error verifying payment signature:', error)
    return false
  }
}

// Helper function to create refund
export async function createRefund(
  paymentId,
  amount,
  notes = 'Order rejected by admin'
) {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: Math.round(amount * 100), // Convert to paise
      notes: {
        reason: notes,
      },
    })
    return refund
  } catch (error) {
    console.error('Error creating refund:', error)
    throw error
  }
}

// Helper function to get payment details
export async function getPaymentDetails(paymentId) {
  try {
    const payment = await razorpay.payments.fetch(paymentId)
    return payment
  } catch (error) {
    console.error('Error fetching payment details:', error)
    throw error
  }
}
