/*
  Warnings:

  - Made the column `nome` on table `Admins` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Admins" ADD COLUMN     "primeiro_acesso" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "nome" SET NOT NULL;
