/*
  Warnings:

  - You are about to drop the column `customer_football_id` on the `invoices` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `invoices` DROP FOREIGN KEY `invoices_customer_football_id_fkey`;

-- AlterTable
ALTER TABLE `invoices` DROP COLUMN `customer_football_id`;

-- CreateTable
CREATE TABLE `InvoiceFootballPitchRental` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` INTEGER NOT NULL,
    `customer_football_pitch_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InvoiceFootballPitchRental` ADD CONSTRAINT `InvoiceFootballPitchRental_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceFootballPitchRental` ADD CONSTRAINT `InvoiceFootballPitchRental_customer_football_pitch_id_fkey` FOREIGN KEY (`customer_football_pitch_id`) REFERENCES `customer_football_pitch_rental`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
