/*
  Warnings:

  - Added the required column `rental_date` to the `customer_football_pitch_rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customer_football_pitch_rental` ADD COLUMN `rental_date` DATETIME(3) NOT NULL;
