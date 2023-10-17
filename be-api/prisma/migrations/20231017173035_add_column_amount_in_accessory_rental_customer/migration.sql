/*
  Warnings:

  - Added the required column `amount` to the `accessory_rental_customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accessory_rental_customer` ADD COLUMN `amount` INTEGER NOT NULL;
