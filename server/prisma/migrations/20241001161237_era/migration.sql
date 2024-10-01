/*
  Warnings:

  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventToPerson` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "_EventToPerson" DROP CONSTRAINT "_EventToPerson_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToPerson" DROP CONSTRAINT "_EventToPerson_B_fkey";

-- DropTable
DROP TABLE "Person";

-- DropTable
DROP TABLE "_EventToPerson";

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Figure" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "biography" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "deathDate" TIMESTAMP(3) NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "status" "DataStatus" NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "Figure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Era" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "status" "DataStatus" NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "Era_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventToFigure" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ArtifactToEra" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EraToEvent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EraToFigure" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EraToPlace" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EraToTopic" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EventToFigure_AB_unique" ON "_EventToFigure"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToFigure_B_index" ON "_EventToFigure"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArtifactToEra_AB_unique" ON "_ArtifactToEra"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtifactToEra_B_index" ON "_ArtifactToEra"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EraToEvent_AB_unique" ON "_EraToEvent"("A", "B");

-- CreateIndex
CREATE INDEX "_EraToEvent_B_index" ON "_EraToEvent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EraToFigure_AB_unique" ON "_EraToFigure"("A", "B");

-- CreateIndex
CREATE INDEX "_EraToFigure_B_index" ON "_EraToFigure"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EraToPlace_AB_unique" ON "_EraToPlace"("A", "B");

-- CreateIndex
CREATE INDEX "_EraToPlace_B_index" ON "_EraToPlace"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EraToTopic_AB_unique" ON "_EraToTopic"("A", "B");

-- CreateIndex
CREATE INDEX "_EraToTopic_B_index" ON "_EraToTopic"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Figure" ADD CONSTRAINT "Figure_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Figure" ADD CONSTRAINT "Figure_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Era" ADD CONSTRAINT "Era_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Era" ADD CONSTRAINT "Era_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToFigure" ADD CONSTRAINT "_EventToFigure_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToFigure" ADD CONSTRAINT "_EventToFigure_B_fkey" FOREIGN KEY ("B") REFERENCES "Figure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtifactToEra" ADD CONSTRAINT "_ArtifactToEra_A_fkey" FOREIGN KEY ("A") REFERENCES "Artifact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtifactToEra" ADD CONSTRAINT "_ArtifactToEra_B_fkey" FOREIGN KEY ("B") REFERENCES "Era"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EraToEvent" ADD CONSTRAINT "_EraToEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "Era"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EraToEvent" ADD CONSTRAINT "_EraToEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EraToFigure" ADD CONSTRAINT "_EraToFigure_A_fkey" FOREIGN KEY ("A") REFERENCES "Era"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EraToFigure" ADD CONSTRAINT "_EraToFigure_B_fkey" FOREIGN KEY ("B") REFERENCES "Figure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EraToPlace" ADD CONSTRAINT "_EraToPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "Era"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EraToPlace" ADD CONSTRAINT "_EraToPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EraToTopic" ADD CONSTRAINT "_EraToTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "Era"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EraToTopic" ADD CONSTRAINT "_EraToTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
