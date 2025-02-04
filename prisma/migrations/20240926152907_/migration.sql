/*
  Warnings:

  - The `eletricidade` column on the `Calculadora` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gas` column on the `Calculadora` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `transporte_individual` column on the `Calculadora` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `transporte_coletivo` column on the `Calculadora` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `alimentacao` column on the `Calculadora` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `residuos` column on the `Calculadora` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `total` column on the `Calculadora` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Calculadora" DROP COLUMN "eletricidade",
ADD COLUMN     "eletricidade" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "gas",
ADD COLUMN     "gas" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "transporte_individual",
ADD COLUMN     "transporte_individual" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "transporte_coletivo",
ADD COLUMN     "transporte_coletivo" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "alimentacao",
ADD COLUMN     "alimentacao" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "residuos",
ADD COLUMN     "residuos" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "total",
ADD COLUMN     "total" INTEGER NOT NULL DEFAULT 0;
