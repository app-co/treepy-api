/*
  Warnings:

  - Added the required column `lat` to the `florestas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `long` to the `florestas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "florestas" ADD COLUMN     "lat" TEXT NOT NULL,
ADD COLUMN     "long" TEXT NOT NULL;
