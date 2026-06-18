-- CREATE DATABASE IF NOT EXISTS store_ratings CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE store_ratings;


CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  name        VARCHAR(60)      NOT NULL,
  email       VARCHAR(255)     NOT NULL,
  password    VARCHAR(255)     NOT NULL,
  address     VARCHAR(400)     NOT NULL,
  role        ENUM('admin', 'user', 'store_owner') NOT NULL DEFAULT 'user',
  created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS stores (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  name        VARCHAR(60)      NOT NULL,
  email       VARCHAR(255)     NOT NULL,
  address     VARCHAR(400)     NOT NULL,
  owner_id    INT UNSIGNED     NULL DEFAULT NULL,
  created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_stores_email (email),
  INDEX idx_stores_name (name),
  INDEX idx_stores_owner (owner_id),
  CONSTRAINT fk_stores_owner FOREIGN KEY (owner_id)
    REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS ratings (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED     NOT NULL,
  store_id    INT UNSIGNED     NOT NULL,
  rating      TINYINT UNSIGNED NOT NULL,
  created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_user_store_rating (user_id, store_id),
  INDEX idx_ratings_store (store_id),
  CONSTRAINT fk_ratings_user  FOREIGN KEY (user_id)
    REFERENCES users  (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ratings_store FOREIGN KEY (store_id)
    REFERENCES stores (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Default admin account — change the password after first login
-- Password: Admin@1234
INSERT IGNORE INTO users (name, email, password, address, role)
VALUES (
  'System Administrator',
  'admin@store-rating.com',
  '$2b$10$LnviQ2Zj9nkexutwmU8GfeuBiSNqirdv5Y7Udfk8Xy5oyE8uD95KS',
  'Platform Administration, New Delhi, India',
  'admin'
);