-- Freelancer Now - Database Schema
-- MySQL/TiDB Database Schema

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `openId` VARCHAR(64) NOT NULL UNIQUE,
  `name` TEXT,
  `email` VARCHAR(320),
  `loginMethod` VARCHAR(64),
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `userType` ENUM('freelancer', 'company') NOT NULL DEFAULT 'freelancer',
  `phone` VARCHAR(20),
  `cpfCnpj` VARCHAR(18),
  `bio` TEXT,
  `experience` TEXT,
  `area` VARCHAR(255),
  `location` VARCHAR(255),
  `profileImage` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_userType` (`userType`),
  INDEX `idx_area` (`area`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de vagas
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employerId` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `salary` VARCHAR(100),
  `workDate` VARCHAR(100),
  `requirements` TEXT,
  `status` ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`employerId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_employerId` (`employerId`),
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`),
  INDEX `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de candidaturas
CREATE TABLE IF NOT EXISTS `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `jobId` INT NOT NULL,
  `freelancerId` INT NOT NULL,
  `message` TEXT,
  `status` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`jobId`) REFERENCES `jobs`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`freelancerId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_application` (`jobId`, `freelancerId`),
  INDEX `idx_jobId` (`jobId`),
  INDEX `idx_freelancerId` (`freelancerId`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reviewerId` INT NOT NULL,
  `reviewedId` INT NOT NULL,
  `jobId` INT,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`reviewerId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reviewedId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`jobId`) REFERENCES `jobs`(`id`) ON DELETE SET NULL,
  INDEX `idx_reviewerId` (`reviewerId`),
  INDEX `idx_reviewedId` (`reviewedId`),
  INDEX `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de chats
CREATE TABLE IF NOT EXISTS `chats` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user1Id` INT NOT NULL,
  `user2Id` INT NOT NULL,
  `jobId` INT,
  `lastMessageAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user1Id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user2Id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`jobId`) REFERENCES `jobs`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `unique_chat` (`user1Id`, `user2Id`, `jobId`),
  INDEX `idx_user1Id` (`user1Id`),
  INDEX `idx_user2Id` (`user2Id`),
  INDEX `idx_lastMessageAt` (`lastMessageAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `chatId` INT NOT NULL,
  `senderId` INT NOT NULL,
  `content` TEXT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`chatId`) REFERENCES `chats`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_chatId` (`chatId`),
  INDEX `idx_senderId` (`senderId`),
  INDEX `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
