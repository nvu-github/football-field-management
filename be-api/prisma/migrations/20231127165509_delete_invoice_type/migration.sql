/*
  Warnings:

  - You are about to drop the column `customer_name` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `customer_phone` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the `invoice_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `invoices` DROP FOREIGN KEY `invoices_invoice_type_id_fkey`;

-- AlterTable
ALTER TABLE `invoices` DROP COLUMN `customer_name`,
    DROP COLUMN `customer_phone`;

-- DropTable
DROP TABLE `invoice_types`;
