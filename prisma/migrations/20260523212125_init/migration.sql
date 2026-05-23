-- CreateEnum
CREATE TYPE "IndustriaESG" AS ENUM ('TECNOLOGIA_SAAS', 'AGRONEGOCIO', 'INDUSTRIA', 'FINANCEIRO', 'VAREJO', 'SAUDE', 'EDUCACAO', 'ENERGIA', 'LOGISTICA', 'OUTROS');

-- CreateEnum
CREATE TYPE "TamanhoEmpresa" AS ENUM ('ATE_100', 'DE_101_A_500', 'DE_501_A_2000', 'ACIMA_2000');

-- CreateTable
CREATE TABLE "LeadEsg" (
    "id" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "emailCorporativo" TEXT NOT NULL,
    "cargoFuncao" TEXT NOT NULL,
    "nomeEmpresa" TEXT NOT NULL,
    "industria" "IndustriaESG" NOT NULL,
    "tamanhoEmpresa" "TamanhoEmpresa" NOT NULL,
    "reflorestamentoNativo" BOOLEAN NOT NULL DEFAULT false,
    "neutralizacaoCO2" BOOLEAN NOT NULL DEFAULT false,
    "biodiversidadeAuditada" BOOLEAN NOT NULL DEFAULT false,
    "objetivosEstrategicos" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadEsg_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeadEsg_emailCorporativo_key" ON "LeadEsg"("emailCorporativo");
