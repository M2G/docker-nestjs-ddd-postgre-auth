DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  -- https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
  email VARCHAR(254) NOT NULL,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  createdAt timestamp without time zone NOT NULL DEFAULT statement_timestamp(),
  modifiedAt timestamp without time zone NOT NULL DEFAULT statement_timestamp(),
  resetPasswordToken TEXT,
  resetPasswordExpires timestamp without time zone NOT NULL DEFAULT statement_timestamp(),
  deletedAt INTEGER DEFAULT 0,
  lastConnectedAt INTEGER DEFAULT 0,
  UNIQUE (email)
);
