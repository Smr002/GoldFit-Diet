import { WeeklySummaryRepository } from "./weeklySummaryRepository";
import { WeeklySummary } from "./weeklySummaryModel";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class WeeklySummaryService {
  private repository: WeeklySummaryRepository;

  constructor() {
    this.repository = new WeeklySummaryRepository();
  }

  async getWeeklySummary(userId: number, weekStart?: string): Promise<WeeklySummary> {
    // Calculate the start and end dates for the requested week
    let startDate: Date;
    let endDate: Date;

    if (weekStart) {
      // If a specific week is requested, use that date as the start
      startDate = new Date(weekStart);
    } else {
      // Default to the current week
      startDate = this.getStartOfCurrentWeek();
    }

    // Set end date to 6 days after the start date (for a total of 7 days)
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    // Retrieve and return the weekly summary
    return await this.repository.getWeeklySummary(userId, startDate, endDate);
  }

  private getStartOfCurrentWeek(): Date {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const diff = today.getDate() - day;
    
    // Set to the first day of the current week (Sunday)
    const startOfWeek = new Date(today.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    
    return startOfWeek;
  }

  async cacheWeeklySummary(userId: number, weekStart: Date): Promise<void> {
    // This would be implemented for caching functionality
    // Not implementing full cache logic for the example
    console.log(`Caching weekly summary for user ${userId} for week starting ${weekStart}`);
    // In a real implementation, store the summary data in a cache
  }
}