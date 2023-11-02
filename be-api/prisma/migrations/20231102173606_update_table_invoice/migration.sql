-- DropForeignKey
ALTER TABLE `invoices` DROP FOREIGN KEY `invoices_customer_football_id_fkey`;

-- AlterTable
ALTER TABLE `invoices` ADD COLUMN `customer_name` VARCHAR(191) NULL,
    MODIFY `customer_football_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_customer_football_id_fkey` FOREIGN KEY (`customer_football_id`) REFERENCES `customer_football_pitch_rental`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
