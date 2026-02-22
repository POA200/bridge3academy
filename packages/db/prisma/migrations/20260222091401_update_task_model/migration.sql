-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "link" TEXT;
