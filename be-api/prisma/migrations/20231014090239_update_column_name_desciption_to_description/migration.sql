/*
  Warnings:

  - You are about to drop the column `desciption` on the `football_pitches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `football_pitches` DROP COLUMN `desciption`,
    ADD COLUMN `description` TEXT NULL;
