/*
  Warnings:

  - You are about to drop the column `invoice_type_id` on the `invoices` table. All the data in the column will be lost.
  - Made the column `customer_football_id` on table `invoices` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `invoices` DROP FOREIGN KEY `invoices_customer_football_id_fkey`;

-- DropIndex
DROP INDEX `invoices_invoice_type_id_fkey` ON `invoices`;

-- AlterTable
ALTER TABLE `invoices` DROP COLUMN `invoice_type_id`,
    MODIFY `customer_football_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_customer_football_id_fkey` FOREIGN KEY (`customer_football_id`) REFERENCES `customer_football_pitch_rental`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
