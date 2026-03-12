/*
  Warnings:

  - You are about to drop the column `password_hash` on the `admins` table. All the data in the column will be lost.
  - Added the required column `nome` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `admins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "password_hash",
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "senha" TEXT NOT NULL;
