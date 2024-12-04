/*
  Warnings:

  - A unique constraint covering the columns `[shortUrl]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `url` ADD COLUMN `userId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Url_shortUrl_key` ON `Url`(`shortUrl`);

-- AddForeignKey
ALTER TABLE `Url` ADD CONSTRAINT `Url_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `url` RENAME INDEX `url_fullUrl_key` TO `Url_fullUrl_key`;
