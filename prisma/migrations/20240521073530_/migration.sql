/*
  Warnings:

  - The `type` column on the `Charges` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "enumStatus" AS ENUM ('pendente', 'recusado', 'pago');

-- DropForeignKey
ALTER TABLE "Calculadora" DROP CONSTRAINT "Calculadora_fk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Charges" DROP CONSTRAINT "Charges_fk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "End" DROP CONSTRAINT "End_fk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_fk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Permissons" DROP CONSTRAINT "Permissons_userId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_fk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "caches" DROP CONSTRAINT "caches_fk_jangle_id_fkey";

-- DropForeignKey
ALTER TABLE "cashe_cliente" DROP CONSTRAINT "cashe_cliente_cachesId_fkey";

-- DropForeignKey
ALTER TABLE "cashe_cliente" DROP CONSTRAINT "cashe_cliente_fk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "cashe_jangle" DROP CONSTRAINT "cashe_jangle_fk_jangle_id_fkey";

-- DropForeignKey
ALTER TABLE "grupo" DROP CONSTRAINT "grupo_fk_jangle_id_fkey";

-- DropForeignKey
ALTER TABLE "grupo" DROP CONSTRAINT "grupo_fk_user_id_fkey";

-- AlterTable
ALTER TABLE "Charges" DROP COLUMN "type",
ADD COLUMN     "type" "enumStatus" NOT NULL DEFAULT 'pendente';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "customer" TEXT;

-- CreateTable
CREATE TABLE "cardToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cardToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cardToken_userId_key" ON "cardToken"("userId");

-- AddForeignKey
ALTER TABLE "cardToken" ADD CONSTRAINT "cardToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "End" ADD CONSTRAINT "End_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Charges" ADD CONSTRAINT "Charges_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permissons" ADD CONSTRAINT "Permissons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calculadora" ADD CONSTRAINT "Calculadora_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashe_cliente" ADD CONSTRAINT "cashe_cliente_cachesId_fkey" FOREIGN KEY ("cachesId") REFERENCES "caches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashe_cliente" ADD CONSTRAINT "cashe_cliente_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashe_jangle" ADD CONSTRAINT "cashe_jangle_fk_jangle_id_fkey" FOREIGN KEY ("fk_jangle_id") REFERENCES "jangle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caches" ADD CONSTRAINT "caches_fk_jangle_id_fkey" FOREIGN KEY ("fk_jangle_id") REFERENCES "jangle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_fk_jangle_id_fkey" FOREIGN KEY ("fk_jangle_id") REFERENCES "jangle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
