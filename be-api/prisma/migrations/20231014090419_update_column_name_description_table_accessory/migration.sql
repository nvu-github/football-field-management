/*
  Warnings:

  - You are about to drop the column `desciption` on the `accessories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `accessories` DROP COLUMN `desciption`,
    ADD COLUMN `description` TEXT NULL;
