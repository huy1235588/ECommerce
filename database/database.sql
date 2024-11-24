USE hagamespring;

CREATE TABLE IF NOT EXISTS Users (
    userId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    displayName VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL DEFAULT '',
    phoneNumber VARCHAR(15) UNIQUE,
    country CHAR(2),
    dateOfBirth DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isVerified BOOLEAN DEFAULT 0,
    role ENUM('admin', 'user') DEFAULT 'user'
);

-- Đăng nhập bằng nền tảng khác
CREATE TABLE socialAccount (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    providerId VARCHAR(255) NOT NULL COMMENT 'id',
    providerType VARCHAR(20) NOT NULL COMMENT 'tên',
    email VARCHAR(150),
    name VARCHAR(100),
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);

-- Xác thực và quản lý quyền truy cập
CREATE TABLE tokens(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL,
    tokenType VARCHAR(50) NOT NULL,
    expiresAt DATETIME,
    revoked BOOLEAN NOT NULL DEFAULT 0,
    expired BOOLEAN NOT NULL DEFAULT 0,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);

-- Sản phẩm
CREATE TABLE IF NOT EXISTS Product (
    productId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    type VARCHAR(30) NOT NULL COMMENT 'Loai san pham (vd: "game", "dlc", "subscription")',
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    price DECIMAL(8, 2) NOT NULL CHECK(price >= 0),
    discountPercent INT DEFAULT 0,
    discountStart TIMESTAMP NULL COMMENT 'Thoi gian bat dau giam gia',
    discountEnd TIMESTAMP NULL COMMENT 'Thoi gian ket thuc giam gia',
    releaseDate DATE COMMENT 'Ngay phat hanh',
    developer VARCHAR(255) COMMENT 'Nha phat trien',
    publisher VARCHAR(255) COMMENT 'Nha phat hanh',
    platform ENUM('PC', 'Mac', 'Linux', 'Mobile') NOT NULL,
    rating DECIMAL(3, 2) CHECK(
        rating >= 0.00
        AND rating <= 5.00
    ),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isActive BOOLEAN DEFAULT TRUE COMMENT 'Xac dinh san pham co ban hay khong'
);

-- Thể loại game
CREATE TABLE IF NOT EXISTS Genres (
    genreId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS ProductGenres (
    genreId INT,
    productId INT,
    PRIMARY KEY (productId, genreId),
    FOREIGN KEY (genreId) REFERENCES Genres(genreId),
    FOREIGN KEY (productId) REFERENCES Product(productId)
);

-- Từ khóa 
CREATE TABLE Tag (
    tagId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE ProductTag (
    productId INT NOT NULL,
    tagId INT NOT NULL,
    PRIMARY KEY (productId, tagId),
    FOREIGN KEY (tagId) REFERENCES Tag(tagId),
    FOREIGN KEY (productId) REFERENCES Product(productId)
);

-- Tính năng
CREATE TABLE Feature (
    featureId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Ten feature (vd: "HDR Support")'
);

CREATE TABLE ProductFeature (
    productId INT NOT NULL,
    featureId INT NOT NULL,
    PRIMARY KEY (productId, featureId),
    FOREIGN KEY (featureId) REFERENCES Feature(featureId),
    FOREIGN KEY (productId) REFERENCES Product(productId)
);

-- Hóa đơn
CREATE TABLE IF NOT EXISTS Orders (
    orderId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    userId INT,
    orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    totalAmount DECIMAL(10, 2),
    orderStatus VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

CREATE TABLE IF NOT EXISTS OrderDetails (
    orderId INT,
    applicationId INT,
    unitPrice DECIMAL(10, 2) NOT NULL,
    isGift BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (orderId, applicationId),
    FOREIGN KEY (orderId) REFERENCES Orders(orderId),
    FOREIGN KEY (applicationId) REFERENCES Applications(applicationId)
);

CREATE TABLE IF NOT EXISTS Reviews (
    reviewId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    userId INT,
    applicationId INT,
    rating INT CHECK (
        rating BETWEEN 1
        AND 5
    ),
    reviewComment VARCHAR(8000),
    isRecommended BOOLEAN NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId),
    FOREIGN KEY (applicationId) REFERENCES Applications(applicationId)
);

CREATE TABLE IF NOT EXISTS ReviewReactions (
    reactionId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    userId INT,
    reviewId INT,
    reactionType ENUM('like', 'dislike'),
    FOREIGN KEY (userId) REFERENCES Users(userId),
    FOREIGN KEY (reviewId) REFERENCES Reviews(reviewId)
);

CREATE TABLE IF NOT EXISTS Gifts (
    giftId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    senderId INT,
    receiverId INT,
    applicationId INT,
    orderId INT,
    message VARCHAR(255),
    FOREIGN KEY (senderId) REFERENCES Users(userId),
    FOREIGN KEY (receiverId) REFERENCES Users(userId),
    FOREIGN KEY (applicationId) REFERENCES Applications(applicationId),
    FOREIGN KEY (orderId) REFERENCES Orders(orderId)
);

CREATE TABLE IF NOT EXISTS Wishlists (
    userId INT,
    applicationId INT,
    addedDate DATE,
    PRIMARY KEY (userId, applicationId),
    FOREIGN KEY (userId) REFERENCES Users(userId),
    FOREIGN KEY (applicationId) REFERENCES Applications(applicationId)
);

CREATE TABLE IF NOT EXISTS Carts (
    userId INT,
    applicationId INT,
    isGift BOOLEAN,
    PRIMARY KEY (userId, applicationId),
    FOREIGN KEY (userId) REFERENCES Users(userId),
    FOREIGN KEY (applicationId) REFERENCES Applications(applicationId)
);

CREATE TABLE IF NOT EXISTS Libraries (
    userId INT,
    applicationId INT,
    lastPlayedDate DATE,
    totalPlaytime VARCHAR(20),
    PRIMARY KEY (userId, applicationId),
    FOREIGN KEY (userId) REFERENCES Users(userId),
    FOREIGN KEY (applicationId) REFERENCES Applications(applicationId)
);

CREATE TABLE IF NOT EXISTS Achievements (
    achievementId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    applicationId INT,
    achievementTitle VARCHAR(255),
    achievementDescription TEXT,
    FOREIGN KEY (applicationId) REFERENCES Applications(applicationId)
);

CREATE TABLE IF NOT EXISTS UserAchievements (
    userAchievementId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    userId INT,
    achievementId INT,
    achievedAt TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId),
    FOREIGN KEY (achievementId) REFERENCES Achievements(achievementId)
);