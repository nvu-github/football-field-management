/*
  Warnings:

  - You are about to drop the `invoicefootballpitchrental` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `invoicefootballpitchrental` DROP FOREIGN KEY `InvoiceFootballPitchRental_customer_football_pitch_id_fkey`;

-- DropForeignKey
ALTER TABLE `invoicefootballpitchrental` DROP FOREIGN KEY `InvoiceFootballPitchRental_invoice_id_fkey`;

-- DropTable
DROP TABLE `invoicefootballpitchrental`;

-- CreateTable
CREATE TABLE `invoice_football_pitch_rental` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` INTEGER NOT NULL,
    `customer_football_pitch_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `invoice_football_pitch_rental` ADD CONSTRAINT `invoice_football_pitch_rental_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_football_pitch_rental` ADD CONSTRAINT `invoice_football_pitch_rental_customer_football_pitch_id_fkey` FOREIGN KEY (`customer_football_pitch_id`) REFERENCES `customer_football_pitch_rental`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
