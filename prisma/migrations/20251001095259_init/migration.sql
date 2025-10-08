/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `orders` table. All the data in the column will be lost.
  - Added the required column `deliveryAddress` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "paymentMethod",
ADD COLUMN     "deliveryAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."products" ALTER COLUMN "points" DROP NOT NULL;

-- DropEnum
DROP TYPE "public"."PaymentMethod";
