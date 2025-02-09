-- CreateEnum
CREATE TYPE "metodo" AS ENUM ('CARTAO', 'PIX', 'BOLETO');

-- CreateTable
CREATE TABLE "Roles" (
    "id" TEXT NOT NULL,
    "tipo_acesso" INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cpfCnpj" TEXT,
    "customerId" TEXT,
    "photUrl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endereco" (
    "id" SERIAL NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "florestas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "qnt_arvores" INTEGER NOT NULL,
    "treepycash_disponivel" INTEGER NOT NULL,
    "projeto" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "long" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "florestas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calculadora" (
    "id" SERIAL NOT NULL,
    "gas" TEXT NOT NULL,
    "eletricidade" TEXT NOT NULL,
    "transporte_individual" TEXT NOT NULL,
    "transporte_coletivo" TEXT NOT NULL,
    "alimentacao" TEXT NOT NULL,
    "residuos" TEXT NOT NULL,
    "total" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calculadora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "precificacao" (
    "id" SERIAL NOT NULL,
    "unid_trepycash" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "precificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treepycaches" (
    "id" SERIAL NOT NULL,
    "qnt" DOUBLE PRECISION NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "florestaId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Treepycaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historico" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Historico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagamentos" (
    "id" SERIAL NOT NULL,
    "metodo" "metodo" NOT NULL,
    "status" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "valo_compra" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cardToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "creditCardNumber" TEXT NOT NULL,
    "creditCardBrand" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cardToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roles_userId_key" ON "Roles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpfCnpj_key" ON "User"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "User_customerId_key" ON "User"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Endereco_userId_key" ON "Endereco"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "florestas_projeto_key" ON "florestas"("projeto");

-- CreateIndex
CREATE UNIQUE INDEX "florestas_codigo_key" ON "florestas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Pagamentos_orderId_key" ON "Pagamentos"("orderId");

-- AddForeignKey
ALTER TABLE "Roles" ADD CONSTRAINT "Roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calculadora" ADD CONSTRAINT "Calculadora_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treepycaches" ADD CONSTRAINT "Treepycaches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treepycaches" ADD CONSTRAINT "Treepycaches_florestaId_fkey" FOREIGN KEY ("florestaId") REFERENCES "florestas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historico" ADD CONSTRAINT "Historico_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamentos" ADD CONSTRAINT "Pagamentos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cardToken" ADD CONSTRAINT "cardToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
