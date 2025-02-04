/*
  Warnings:

  - The `status` column on the `Charges` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Charges` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "enumTypePayment" AS ENUM ('pix', 'cartao', 'boleto');

-- AlterTable
ALTER TABLE "Charges" DROP COLUMN "status",
ADD COLUMN     "status" "enumStatus" NOT NULL DEFAULT 'pendente',
DROP COLUMN "type",
ADD COLUMN     "type" "enumTypePayment" NOT NULL;
