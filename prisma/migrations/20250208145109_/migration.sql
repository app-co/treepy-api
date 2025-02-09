/*
  Warnings:

  - You are about to drop the `Pagamentos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pagamentos" DROP CONSTRAINT "Pagamentos_userId_fkey";

-- DropTable
DROP TABLE "Pagamentos";

-- CreateTable
CREATE TABLE "transacoesUser" (
    "id" SERIAL NOT NULL,
    "metodo" "metodo" NOT NULL,
    "status" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "valo_compra" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "transacoesUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transacoesUser_orderId_key" ON "transacoesUser"("orderId");

-- AddForeignKey
ALTER TABLE "transacoesUser" ADD CONSTRAINT "transacoesUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
