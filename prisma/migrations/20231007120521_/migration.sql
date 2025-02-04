/*
  Warnings:

  - You are about to drop the column `cpf` on the `userHotel` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `userHotel` table. All the data in the column will be lost.
  - You are about to drop the column `phone_area` on the `userHotel` table. All the data in the column will be lost.
  - Added the required column `tree` to the `userHotel` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "userHotel_cpf_key";

-- AlterTable
ALTER TABLE "userHotel" DROP COLUMN "cpf",
DROP COLUMN "password",
DROP COLUMN "phone_area",
ADD COLUMN     "tree" INTEGER NOT NULL;
