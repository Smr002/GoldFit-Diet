import { z } from "zod";

export const NotificationAudienceSchema = z.enum([
  "ALL_USERS",
  "PREMIUM_USERS",
  "SPECIFIC_USERS"
]);

export const NotificationTypeSchema = z.enum([
  "WORKOUT_REMINDER",
  "PROGRESS_UPDATE",
  "ADMIN_MESSAGE",
  "SYSTEM_ALERT",
  "GENERAL"
]);

export const NotificationFrequencySchema = z.enum([
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "ONCE"
]);

export const NotificationSchema = z.object({
  id: z.number().optional(),
  type: NotificationTypeSchema,
  message: z.string().min(1, { message: "Message cannot be empty." }),
  isAutomated: z.boolean(),
  frequency: NotificationFrequencySchema.optional(),
  targetUsers: NotificationAudienceSchema,
  createdBy: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional().nullable(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const WorkoutReminderSchema = z.object({
  userId: z.number(),
  workoutId: z.number(),
  message: z.string().min(1, { message: "Message cannot be empty." })
});

export const ProgressNotificationSchema = z.object({
  userId: z.number(),
  achievement: z.string().min(1, { message: "Achievement cannot be empty." }),
  message: z.string().min(1, { message: "Message cannot be empty." })
});

export const AdminNotificationSchema = z.object({
  targetUsers: NotificationAudienceSchema,
  message: z.string().min(1, { message: "Message cannot be empty." }),
  createdBy: z.number()
});

export type WorkoutReminderNotification = z.infer<typeof WorkoutReminderSchema>;
export type ProgressNotification = z.infer<typeof ProgressNotificationSchema>;
export type AdminNotification = z.infer<typeof AdminNotificationSchema>;

export class NotificationModel {
  private data: Notification;

  constructor(options: Partial<Notification>) {
    this.data = NotificationSchema.parse({
      ...options,
      message: options.message?.trim() || "",
      createdAt: options.createdAt ?? new Date(),
      updatedAt: options.updatedAt ?? new Date(),
    });
  }

  toObject(): Notification {
    return this.data;
  }

  isValid(): boolean {
    try {
      NotificationSchema.parse(this.data);
      return true;
    } catch (error) {
      console.error("Validation failed:", error);
      return false;
    }
  }
}
