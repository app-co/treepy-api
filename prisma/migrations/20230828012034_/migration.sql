-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Country" AS ENUM ('BR');

-- CreateEnum
CREATE TYPE "StatusJangle" AS ENUM ('Incio_plantacao', 'Plantacao_realizada', 'Manutencao_inicial', 'Manutencao_crescimento', 'Manutencao_preservacao', 'Planta_finalizada');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone_area" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "role" "ROLE" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "grupoId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "End" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "home_number" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "region_code" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "End_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "avatar" TEXT,
    "fk_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Charges" (
    "id" TEXT NOT NULL,
    "charge_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "customer" JSONB NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hooks" (
    "id" TEXT NOT NULL,
    "object" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissons" (
    "id" TEXT NOT NULL,
    "termos" BOOLEAN NOT NULL DEFAULT false,
    "notifications" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permissons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jangle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "log" TEXT NOT NULL,
    "tree" INTEGER NOT NULL DEFAULT 0,
    "country" "Country" NOT NULL DEFAULT 'BR',
    "status" "StatusJangle" NOT NULL DEFAULT 'Incio_plantacao',
    "provider_name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "crea" TEXT NOT NULL,
    "work_name" TEXT,
    "IE_IM" TEXT,
    "postal_code" TEXT NOT NULL,
    "home_number" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cell_phone" TEXT NOT NULL,
    "phone" TEXT,
    "street" TEXT,
    "matricula" TEXT NOT NULL,
    "expedition_date" TEXT NOT NULL,
    "proprerty_name" TEXT NOT NULL,
    "beneficiary_planting_name" TEXT NOT NULL,
    "total_area" TEXT NOT NULL,
    "planting_area" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "response_name" TEXT NOT NULL,
    "aprovation_ambiental_name" TEXT NOT NULL,
    "authorization" TEXT NOT NULL,
    "plant" TEXT,
    "observacoes" TEXT,
    "quantity_tree" INTEGER NOT NULL,
    "project_value" INTEGER NOT NULL,
    "tree_media_value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jangle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calculadora" (
    "id" TEXT NOT NULL,
    "eletricidade" JSONB NOT NULL,
    "gas" JSONB NOT NULL,
    "transporte_individual" JSONB NOT NULL,
    "transporte_coletivo" JSONB NOT NULL,
    "alimentacao" JSONB NOT NULL,
    "residuos" JSONB NOT NULL,
    "total" JSONB NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calculadora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cashe_cliente" (
    "id" TEXT NOT NULL,
    "treepycash" INTEGER NOT NULL DEFAULT 0,
    "meta" INTEGER NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "fk_jangle_id" TEXT NOT NULL,
    "cachesId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cashe_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cashe_jangle" (
    "id" TEXT NOT NULL,
    "treepycashe" INTEGER NOT NULL DEFAULT 0,
    "fk_jangle_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cashe_jangle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caches" (
    "id" TEXT NOT NULL,
    "fk_jangle_id" TEXT NOT NULL,
    "treepeycash" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupo" (
    "id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "fk_jangle_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treepycash_pote" (
    "id" TEXT NOT NULL,
    "treepycash" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "treepycash_pote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserTojangle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "End_fk_user_id_key" ON "End"("fk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_fk_user_id_key" ON "Profile"("fk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_tokens_token_key" ON "User_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Permissons_userId_key" ON "Permissons"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Calculadora_fk_user_id_key" ON "Calculadora"("fk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cashe_jangle_fk_jangle_id_key" ON "cashe_jangle"("fk_jangle_id");

-- CreateIndex
CREATE UNIQUE INDEX "caches_fk_jangle_id_key" ON "caches"("fk_jangle_id");

-- CreateIndex
CREATE UNIQUE INDEX "grupo_fk_user_id_key" ON "grupo"("fk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "grupo_fk_jangle_id_key" ON "grupo"("fk_jangle_id");

-- CreateIndex
CREATE UNIQUE INDEX "_UserTojangle_AB_unique" ON "_UserTojangle"("A", "B");

-- CreateIndex
CREATE INDEX "_UserTojangle_B_index" ON "_UserTojangle"("B");

-- AddForeignKey
ALTER TABLE "End" ADD CONSTRAINT "End_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Charges" ADD CONSTRAINT "Charges_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permissons" ADD CONSTRAINT "Permissons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calculadora" ADD CONSTRAINT "Calculadora_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashe_cliente" ADD CONSTRAINT "cashe_cliente_cachesId_fkey" FOREIGN KEY ("cachesId") REFERENCES "caches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashe_cliente" ADD CONSTRAINT "cashe_cliente_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashe_jangle" ADD CONSTRAINT "cashe_jangle_fk_jangle_id_fkey" FOREIGN KEY ("fk_jangle_id") REFERENCES "jangle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caches" ADD CONSTRAINT "caches_fk_jangle_id_fkey" FOREIGN KEY ("fk_jangle_id") REFERENCES "jangle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_fk_jangle_id_fkey" FOREIGN KEY ("fk_jangle_id") REFERENCES "jangle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserTojangle" ADD CONSTRAINT "_UserTojangle_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserTojangle" ADD CONSTRAINT "_UserTojangle_B_fkey" FOREIGN KEY ("B") REFERENCES "jangle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
