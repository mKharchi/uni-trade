/*
  Warnings:

  - You are about to drop the column `relatedId` on the `notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."notifications" DROP COLUMN "relatedId",
ADD COLUMN     "concernedId" INTEGER;
