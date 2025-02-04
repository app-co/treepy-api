/*
  Warnings:

  - A unique constraint covering the columns `[charge_id]` on the table `Charges` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `Charges` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Charges_charge_id_key" ON "Charges"("charge_id");

-- CreateIndex
CREATE UNIQUE INDEX "Charges_order_id_key" ON "Charges"("order_id");
