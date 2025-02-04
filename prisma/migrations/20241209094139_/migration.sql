/*
  Warnings:

  - A unique constraint covering the columns `[projeto]` on the table `florestas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `florestas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "florestas_projeto_key" ON "florestas"("projeto");

-- CreateIndex
CREATE UNIQUE INDEX "florestas_codigo_key" ON "florestas"("codigo");
