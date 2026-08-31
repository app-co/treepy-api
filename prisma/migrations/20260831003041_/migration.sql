/*
  Warnings:

  - The values [Outros] on the enum `CategoriaParceiro` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoriaParceiro_new" AS ENUM ('SERVICOS', 'PRODUTOS', 'TECNOLOGIA', 'ARQUITETURA', 'INSTITUICAO', 'AGRO', 'INVESTIMENTO', 'FINANCEIRO', 'ALIMENTACAO', 'CONSTRUCAO', 'IMOVEIS', 'TURISMO', 'MEIO_AMBIENTE', 'ESPORTES', 'BELEZA', 'EVENTOS', 'SAUDE', 'OUTROS');
ALTER TABLE "Parceiro" ALTER COLUMN "categoria" TYPE "CategoriaParceiro_new" USING ("categoria"::text::"CategoriaParceiro_new");
ALTER TYPE "CategoriaParceiro" RENAME TO "CategoriaParceiro_old";
ALTER TYPE "CategoriaParceiro_new" RENAME TO "CategoriaParceiro";
DROP TYPE "CategoriaParceiro_old";
COMMIT;
