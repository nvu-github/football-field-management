/*
  Warnings:

  - Added the required column `moneyPaid` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoices` ADD COLUMN `moneyPaid` DECIMAL(12, 0) NOT NULL;
