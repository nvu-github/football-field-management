/*
  Warnings:

  - A unique constraint covering the columns `[customer_football_pitch_id]` on the table `invoice_football_pitch_rental` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `invoice_football_pitch_rental_customer_football_pitch_id_key` ON `invoice_football_pitch_rental`(`customer_football_pitch_id`);
