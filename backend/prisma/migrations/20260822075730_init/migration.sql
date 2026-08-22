-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "totalBeds" INTEGER NOT NULL,
    "availableBeds" INTEGER NOT NULL,
    "icuBeds" INTEGER NOT NULL,
    "availableIcu" INTEGER NOT NULL,
    "specialties" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GovernmentScheme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schemeName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eligibility" TEXT NOT NULL,
    "coverageAmount" TEXT NOT NULL,
    "officialLink" TEXT NOT NULL,
    "stateApplicable" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
