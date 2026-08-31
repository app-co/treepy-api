/*
  Warnings:

  - You are about to drop the `Parceiros` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Parceiros" DROP CONSTRAINT "Parceiros_florestaId_fkey";

-- DropForeignKey
ALTER TABLE "Parceiros" DROP CONSTRAINT "Parceiros_userId_fkey";

-- DropTable
DROP TABLE "Parceiros";

-- CreateTable
CREATE TABLE "Parceiro" (
    "id" TEXT NOT NULL,
    "nomeEmpresa" TEXT NOT NULL,
    "minDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "photoUrl" TEXT,
    "treepyCashe" DOUBLE PRECISION NOT NULL,
    "florestaId" INTEGER NOT NULL,
    "siteUrl" TEXT,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parceiro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parceiro_userId_key" ON "Parceiro"("userId");

-- AddForeignKey
ALTER TABLE "Parceiro" ADD CONSTRAINT "Parceiro_florestaId_fkey" FOREIGN KEY ("florestaId") REFERENCES "florestas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parceiro" ADD CONSTRAINT "Parceiro_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
