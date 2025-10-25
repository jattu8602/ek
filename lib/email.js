import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email, name, token) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: 'Ekta Krishi Kendra <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify your email address',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #2c5530; margin-bottom: 20px;">Welcome to Ekta Krishi Kendra!</h1>
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${
              name || 'there'
            },</p>
            <p style="font-size: 16px; margin-bottom: 30px;">
              Thank you for signing up! Please verify your email address to complete your registration and start shopping for agricultural products.
            </p>
            <div style="margin: 30px 0;">
              <a href="${verificationUrl}"
                 style="background: #2c5530; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #2c5530; word-break: break-all;">${verificationUrl}</a>
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending verification email:', error)
      throw new Error('Failed to send verification email')
    }

    return data
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error)
    throw error
  }
}

export async function sendPasswordResetEmail(email, name, token) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: 'Ekta Krishi Kendra <onboarding@resend.dev>',
      to: [email],
      subject: 'Reset your password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #2c5530; margin-bottom: 20px;">Password Reset Request</h1>
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${
              name || 'there'
            },</p>
            <p style="font-size: 16px; margin-bottom: 30px;">
              We received a request to reset your password for your Ekta Krishi Kendra account. Click the button below to set a new password.
            </p>
            <div style="margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background: #2c5530; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #2c5530; word-break: break-all;">${resetUrl}</a>
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending password reset email:', error)
      throw new Error('Failed to send password reset email')
    }

    return data
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error)
    throw error
  }
}

export async function sendWelcomeEmail(email, name) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Ekta Krishi Kendra <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to Ekta Krishi Kendra!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #2c5530; margin-bottom: 20px;">Welcome to Ekta Krishi Kendra!</h1>
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${
              name || 'there'
            },</p>
            <p style="font-size: 16px; margin-bottom: 30px;">
              Your email has been verified! You're now ready to explore our wide range of agricultural products including seeds, fertilizers, pesticides, and farming tools.
            </p>
            <div style="margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}"
                 style="background: #2c5530; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Start Shopping
              </a>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              Thank you for choosing Ekta Krishi Kendra for your agricultural needs!
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      // Don't throw error for welcome email as it's not critical
    }

    return data
  } catch (error) {
    console.error('Error in sendWelcomeEmail:', error)
    // Don't throw error for welcome email as it's not critical
  }
}
