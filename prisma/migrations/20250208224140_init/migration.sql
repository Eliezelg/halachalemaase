-- AlterTable
ALTER TABLE "rabbis" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "address" DROP DEFAULT,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "city" DROP DEFAULT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "languages" DROP DEFAULT,
ALTER COLUMN "imageUrl" SET DATA TYPE TEXT;
