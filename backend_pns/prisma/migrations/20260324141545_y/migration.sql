/*
  Warnings:

  - You are about to drop the column `primeiro_acesso` on the `Admins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admins" DROP COLUMN "primeiro_acesso",
ALTER COLUMN "nome" DROP NOT NULL;
