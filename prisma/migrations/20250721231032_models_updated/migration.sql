/*
  Warnings:

  - The primary key for the `post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorId` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `post` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - Added the required column `authorUuid` to the `Post` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `Post` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `content` on table `post` required. This step will fail if there are existing NULL values in that column.
  - The required column `uuid` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropIndex
DROP INDEX `Post_authorId_fkey` ON `post`;

-- AlterTable
ALTER TABLE `post` DROP PRIMARY KEY,
    DROP COLUMN `authorId`,
    DROP COLUMN `id`,
    ADD COLUMN `authorUuid` VARCHAR(191) NOT NULL,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL,
    MODIFY `content` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`uuid`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`uuid`);

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorUuid_fkey` FOREIGN KEY (`authorUuid`) REFERENCES `User`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
