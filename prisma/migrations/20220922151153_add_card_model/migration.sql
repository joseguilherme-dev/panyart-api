-- CreateTable
CREATE TABLE "Card" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "coins" BIGINT NOT NULL,
    "redeemed" BOOLEAN NOT NULL DEFAULT false,
    "redeemedBy" TEXT,
    "redeemedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Card_redeemedBy_fkey" FOREIGN KEY ("redeemedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
