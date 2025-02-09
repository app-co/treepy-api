-- CreateTable
CREATE TABLE "transacoes" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "valorBruto" DOUBLE PRECISION NOT NULL,
    "valorLiquido" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id")
);
