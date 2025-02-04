/*
  Warnings:

  - You are about to drop the column `codidgo` on the `florestas` table. All the data in the column will be lost.
  - Added the required column `codigo` to the `florestas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "florestas" DROP COLUMN "codidgo",
ADD COLUMN     "codigo" TEXT NOT NULL;
