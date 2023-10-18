/*
  Warnings:

  - Added the required column `staff_id` to the `accessories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accessories` ADD COLUMN `staff_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `accessories` ADD CONSTRAINT `accessories_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staffs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
