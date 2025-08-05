-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "aiModel" TEXT,
ADD COLUMN     "responseTime" INTEGER;

-- CreateTable
CREATE TABLE "public"."Analytics" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "selectedOption" TEXT NOT NULL,
    "aiModel" TEXT NOT NULL,
    "promptLength" INTEGER NOT NULL,
    "captionLength" INTEGER NOT NULL,
    "hashtagCount" INTEGER NOT NULL,
    "engagementScore" DOUBLE PRECISION,
    "userSatisfaction" INTEGER,
    "responseTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Analytics_userId_idx" ON "public"."Analytics"("userId");

-- CreateIndex
CREATE INDEX "Analytics_aiModel_idx" ON "public"."Analytics"("aiModel");

-- CreateIndex
CREATE INDEX "Analytics_createdAt_idx" ON "public"."Analytics"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Analytics" ADD CONSTRAINT "Analytics_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Analytics" ADD CONSTRAINT "Analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
