/*
  Warnings:

  - You are about to alter the column `status` on the `football_pitches` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `football_pitches` MODIFY `status` ENUM('ACTIVE', 'MAINTENANCE') NOT NULL DEFAULT 'ACTIVE';
