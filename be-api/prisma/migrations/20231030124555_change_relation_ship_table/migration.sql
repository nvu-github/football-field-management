/*
  Warnings:

  - A unique constraint covering the columns `[customer_football_id]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `invoices_customer_football_id_key` ON `invoices`(`customer_football_id`);
