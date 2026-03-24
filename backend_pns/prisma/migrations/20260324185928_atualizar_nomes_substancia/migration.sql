/*
  Warnings:

  - You are about to drop the column `propriedades_farmacologicas` on the `substances` table. All the data in the column will be lost.
  - Added the required column `atividade_biologica` to the `substances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propriedades_fisico_quimicas` to the `substances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "substances" DROP COLUMN "propriedades_farmacologicas",
ADD COLUMN     "atividade_biologica" TEXT NOT NULL,
ADD COLUMN     "propriedades_fisico_quimicas" TEXT NOT NULL;
