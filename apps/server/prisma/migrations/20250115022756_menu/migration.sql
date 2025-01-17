/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Menu_path_key";

-- CreateIndex
CREATE UNIQUE INDEX "Menu_name_key" ON "Menu"("name");
