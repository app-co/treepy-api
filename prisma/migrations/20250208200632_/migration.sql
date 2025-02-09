/*
  Warnings:

  - Changed the type of `gas` on the `Calculadora` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `eletricidade` on the `Calculadora` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `transporte_individual` on the `Calculadora` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `transporte_coletivo` on the `Calculadora` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `alimentacao` on the `Calculadora` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `residuos` on the `Calculadora` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `total` on the `Calculadora` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Calculadora" DROP COLUMN "gas",
ADD COLUMN     "gas" DOUBLE PRECISION NOT NULL,
DROP COLUMN "eletricidade",
ADD COLUMN     "eletricidade" DOUBLE PRECISION NOT NULL,
DROP COLUMN "transporte_individual",
ADD COLUMN     "transporte_individual" DOUBLE PRECISION NOT NULL,
DROP COLUMN "transporte_coletivo",
ADD COLUMN     "transporte_coletivo" DOUBLE PRECISION NOT NULL,
DROP COLUMN "alimentacao",
ADD COLUMN     "alimentacao" DOUBLE PRECISION NOT NULL,
DROP COLUMN "residuos",
ADD COLUMN     "residuos" DOUBLE PRECISION NOT NULL,
DROP COLUMN "total",
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;
