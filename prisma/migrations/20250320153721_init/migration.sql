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
CREATE TABLE "user_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_tokens_pkey" PRIMARY KEY ("id")
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
    "treepycash_disponivel" DOUBLE PRECISION NOT NULL,
    "projeto" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "long" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "florestas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prestador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "crea" TEXT NOT NULL,
    "nomeFantasia" TEXT,
    "IE_IM" TEXT,
    "cep" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "rua" TEXT,
    "florestasId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prestador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proprietario" (
    "id" SERIAL NOT NULL,
    "matricula" TEXT NOT NULL,
    "dataExpedicao" TEXT NOT NULL,
    "nomeProprietario" TEXT NOT NULL,
    "nomeBenificiario" TEXT NOT NULL,
    "totalArea" TEXT NOT NULL,
    "areaPlantada" TEXT NOT NULL,
    "florestaId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proprietario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projeto" (
    "id" SERIAL NOT NULL,
    "nomeProjeto" TEXT NOT NULL,
    "nomeResponsavel" TEXT NOT NULL,
    "authorization" TEXT NOT NULL,
    "plant" TEXT,
    "observacoes" TEXT,
    "qntAvarore" DOUBLE PRECISION NOT NULL,
    "valorProjeto" DOUBLE PRECISION NOT NULL,
    "valorMediaArvore" DOUBLE PRECISION NOT NULL,
    "florestaId" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calculadora" (
    "id" SERIAL NOT NULL,
    "gas" DOUBLE PRECISION NOT NULL,
    "eletricidade" DOUBLE PRECISION NOT NULL,
    "transporte_individual" DOUBLE PRECISION NOT NULL,
    "transporte_coletivo" DOUBLE PRECISION NOT NULL,
    "alimentacao" DOUBLE PRECISION NOT NULL,
    "residuos" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
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
CREATE TABLE "transacoesUser" (
    "id" SERIAL NOT NULL,
    "metodo" "metodo" NOT NULL,
    "status" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "valo_compra" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transacoesUser_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "user_tokens_token_key" ON "user_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Endereco_userId_key" ON "Endereco"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "florestas_projeto_key" ON "florestas"("projeto");

-- CreateIndex
CREATE UNIQUE INDEX "florestas_codigo_key" ON "florestas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "transacoesUser_orderId_key" ON "transacoesUser"("orderId");

-- AddForeignKey
ALTER TABLE "Roles" ADD CONSTRAINT "Roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prestador" ADD CONSTRAINT "prestador_florestasId_fkey" FOREIGN KEY ("florestasId") REFERENCES "florestas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calculadora" ADD CONSTRAINT "Calculadora_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treepycaches" ADD CONSTRAINT "Treepycaches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treepycaches" ADD CONSTRAINT "Treepycaches_florestaId_fkey" FOREIGN KEY ("florestaId") REFERENCES "florestas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historico" ADD CONSTRAINT "Historico_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoesUser" ADD CONSTRAINT "transacoesUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cardToken" ADD CONSTRAINT "cardToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
