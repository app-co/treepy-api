/*
  Warnings:

  - You are about to drop the `Floresta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Treepycaches" DROP CONSTRAINT "Treepycaches_florestaId_fkey";

-- DropTable
DROP TABLE "Floresta";

-- CreateTable
CREATE TABLE "florestas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "qnt_arvores" INTEGER NOT NULL,
    "treepycash_disponivel" INTEGER NOT NULL,
    "projeto" SERIAL NOT NULL,
    "codidgo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "florestas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Treepycaches" ADD CONSTRAINT "Treepycaches_florestaId_fkey" FOREIGN KEY ("florestaId") REFERENCES "florestas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
