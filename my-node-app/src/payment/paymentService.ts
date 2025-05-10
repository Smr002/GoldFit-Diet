import { usersRepository } from "../user/userRepository";
import { sendPaymentConfirmationSMS } from "./smsService";

export class PaymentService {

  async handlePayment(userId: number, phone: string, amount: number) {
    try {
      await usersRepository.updatePremiumStatus(userId);
     const user =  await usersRepository.findById(userId);
      await sendPaymentConfirmationSMS(phone, Number(amount));
      
      return { success: true, amount, userId };
    } catch (error) {
      console.error('Error in handlePayment:', error);
      throw new Error('Payment processing failed');
    }
  }
}

export const paymentService = new PaymentService();