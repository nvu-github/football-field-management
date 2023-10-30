/*
  Warnings:

  - You are about to drop the column `moneyPaid` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `invoices` table. All the data in the column will be lost.
  - Added the required column `total_price` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoices` DROP COLUMN `moneyPaid`,
    DROP COLUMN `totalPrice`,
    ADD COLUMN `money_paid` DECIMAL(12, 0) NULL,
    ADD COLUMN `total_price` DECIMAL(12, 0) NOT NULL;
