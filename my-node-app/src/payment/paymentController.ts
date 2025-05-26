import { Request, Response } from "express";
import { paymentService } from "./paymentService";  


export const processPayment = async (req: Request, res: Response) => {
  try {
    const { userId, phone, amount } = req.body;
    const payment = await paymentService.handlePayment(userId, phone, amount);
    res.status(200).json({ success: true, payment });
  } catch (err) {
 
    res.status(500).json({ success: false, message: "Payment failed" });
  }
};
