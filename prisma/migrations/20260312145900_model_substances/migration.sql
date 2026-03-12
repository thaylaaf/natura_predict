/*
  Warnings:

  - Made the column `nome_quimico` on table `substances` required. This step will fail if there are existing NULL values in that column.
  - Made the column `formula_molecular` on table `substances` required. This step will fail if there are existing NULL values in that column.
  - Made the column `smile` on table `substances` required. This step will fail if there are existing NULL values in that column.
  - Made the column `propriedades_farmacologicas` on table `substances` required. This step will fail if there are existing NULL values in that column.
  - Made the column `origem` on table `substances` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uso_tradicional` on table `substances` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "substances" ALTER COLUMN "nome_quimico" SET NOT NULL,
ALTER COLUMN "formula_molecular" SET NOT NULL,
ALTER COLUMN "smile" SET NOT NULL,
ALTER COLUMN "propriedades_farmacologicas" SET NOT NULL,
ALTER COLUMN "origem" SET NOT NULL,
ALTER COLUMN "uso_tradicional" SET NOT NULL;
