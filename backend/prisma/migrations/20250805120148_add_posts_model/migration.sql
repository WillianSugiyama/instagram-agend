-- CreateEnum
CREATE TYPE "public"."PostType" AS ENUM ('POST', 'STORY');

-- CreateTable
CREATE TABLE "public"."Post" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "type" "public"."PostType" NOT NULL,
    "optionA" JSONB NOT NULL,
    "optionB" JSONB NOT NULL,
    "selectedOption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "public"."Post"("userId");

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
