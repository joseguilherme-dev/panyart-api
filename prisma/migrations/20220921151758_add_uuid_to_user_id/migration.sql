/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "coins" BIGINT NOT NULL,
    "instagram" TEXT,
    "discord" TEXT,
    "twitter" TEXT,
    "facebook" TEXT
);
INSERT INTO "new_User" ("coins", "discord", "email", "facebook", "id", "instagram", "nickname", "password", "twitter") SELECT "coins", "discord", "email", "facebook", "id", "instagram", "nickname", "password", "twitter" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
