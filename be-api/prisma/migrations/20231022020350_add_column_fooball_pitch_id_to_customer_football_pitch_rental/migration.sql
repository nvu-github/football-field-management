/*
  Warnings:

  - Added the required column `football_pitch_id` to the `customer_football_pitch_rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customer_football_pitch_rental` ADD COLUMN `football_pitch_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `customer_football_pitch_rental` ADD CONSTRAINT `customer_football_pitch_rental_football_pitch_id_fkey` FOREIGN KEY (`football_pitch_id`) REFERENCES `football_pitches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
