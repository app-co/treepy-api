/*
  Warnings:

  - The `type` column on the `Charges` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "Charges_charge_id_key";

-- DropIndex
DROP INDEX "Charges_order_id_key";

-- AlterTable
ALTER TABLE "Charges" DROP COLUMN "type",
ADD COLUMN     "type" TEXT;
