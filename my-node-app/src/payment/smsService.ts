import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

// Validate required environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  throw new Error('Missing required Twilio configuration');
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const sendPaymentConfirmationSMS = async (phone: string, amount: number) => {
  try {
    // Validate phone number format
    if (!phone.match(/^\+?[1-9]\d{1,14}$/)) {
      throw new Error('Invalid phone number format');
    }

    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Invalid amount');
    }

    const formattedAmount = amount.toFixed(2);
    const message = `✅ Your payment of $${formattedAmount} was successful. Your account has been upgraded to Premium(GoldFiet Support)!`;
 
    
    const result = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: phone,
    });


    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('SMS sending failed:', errorMessage);
    throw new Error(`SMS confirmation failed: ${errorMessage}`);
  }
};
