/*
  Warnings:

  - Added the required column `categoria` to the `Parceiro` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoriaParceiro" AS ENUM ('SERVICOS', 'PRODUTOS', 'TECNOLOGIA', 'ARQUITETURA', 'INSTITUICAO', 'AGRO', 'INVESTIMENTO', 'FINANCEIRO', 'ALIMENTACAO', 'CONSTRUCAO', 'IMOVEIS', 'TURISMO', 'MEIO_AMBIENTE', 'ESPORTES', 'BELEZA', 'EVENTOS', 'SAUDE', 'Outros');

-- AlterTable
ALTER TABLE "Parceiro" ADD COLUMN     "categoria" "CategoriaParceiro" NOT NULL;
