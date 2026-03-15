-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PROFESSOR', 'ALUNO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ALUNO';
