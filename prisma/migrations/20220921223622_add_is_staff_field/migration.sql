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
    "facebook" TEXT,
    "isStaff" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("coins", "discord", "email", "facebook", "id", "instagram", "nickname", "password", "twitter") SELECT "coins", "discord", "email", "facebook", "id", "instagram", "nickname", "password", "twitter" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
