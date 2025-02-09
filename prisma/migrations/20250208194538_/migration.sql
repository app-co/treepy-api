/*
  Warnings:

  - Changed the type of `valorBruto` on the `transacoes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "transacoes" DROP COLUMN "valorBruto",
ADD COLUMN     "valorBruto" DOUBLE PRECISION NOT NULL;
