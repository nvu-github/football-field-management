/*
  Warnings:

  - You are about to drop the column `file` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `status` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `file`,
    DROP COLUMN `type`,
    ADD COLUMN `status` VARCHAR(50) NOT NULL,
    ADD COLUMN `title` VARCHAR(255) NOT NULL;
