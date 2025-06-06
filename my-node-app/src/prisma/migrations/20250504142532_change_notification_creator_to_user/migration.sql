/*
  Warnings:

  - You are about to drop the column `created_by` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `max_pr` on the `session_exercises` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_created_by_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "created_by",
ADD COLUMN     "created_by_admin" INTEGER,
ADD COLUMN     "created_by_user" INTEGER;

-- AlterTable
ALTER TABLE "session_exercises" DROP COLUMN "max_pr";

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_created_by_user_fkey" FOREIGN KEY ("created_by_user") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_created_by_admin_fkey" FOREIGN KEY ("created_by_admin") REFERENCES "admins"("admin_id") ON DELETE SET NULL ON UPDATE CASCADE;
