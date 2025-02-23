-- DropForeignKey
ALTER TABLE `token` DROP FOREIGN KEY `Token_userId_fkey`;

-- DropForeignKey
ALTER TABLE `url` DROP FOREIGN KEY `Url_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Url` ADD CONSTRAINT `Url_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
