/*
  Warnings:

  - Added the required column `note` to the `customer_football_pitch_rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customer_football_pitch_rental` ADD COLUMN `note` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('ACCEPT', 'REJECT', 'PENDING') NOT NULL DEFAULT 'PENDING';
