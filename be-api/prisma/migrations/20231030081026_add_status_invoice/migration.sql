-- AlterTable
ALTER TABLE `invoices` MODIFY `status` ENUM('PAID', 'DEPOSIT', 'UNPAID') NOT NULL DEFAULT 'UNPAID';
